"use server";

import { INTERESTS } from "@/lib/assistant/schema";
import { requireRole } from "@/lib/auth";
import { isLossReason, isStage } from "@/lib/messenger/classify";
import { conversationView, PIN_FIELDS, type PinField } from "@/lib/messenger/nextAction";
import { inboxPlace, labelChips } from "@/lib/messenger/inboxPlace";
import type { LabelSaveResult } from "@/lib/messenger/labelSave";
import { FUNNEL_INTEREST, isStep, stepFor, stepOf } from "@/lib/messenger/steps";
import { chatFollowups, isDay, NOTE_MAX, type Followup } from "@/lib/messenger/followups";
import type { SavedLabel } from "@/lib/messenger/labelSave";
import { FACT_COLUMNS, LABEL_COLUMNS, toActionLabel, toTiming, type ChatFollowups, type FactRow, type InboxLabel } from "@/lib/messenger/thread";
import { levelOf, placeOf, type LossReason, type Outcome, type StoredLabel } from "@/lib/messenger/types";
import { inboxVersion } from "@/lib/messenger/version";
import { createClient } from "@/lib/supabase/server";

type Db = Awaited<ReturnType<typeof createClient>>;

const JUDGMENTS = ["auto", "kein_lead", "bestandskunde", "weiter_auf_zalo", "verloren"] as const;
type Judgment = (typeof JUDGMENTS)[number];

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

const normLevel = levelOf;

function normInterest(value: string | null | undefined) {
  return value && (INTERESTS as readonly string[]).includes(value) ? value : null;
}

function judgmentOf(outcome: Outcome | undefined): Judgment {
  if (outcome === "kein_lead" || outcome === "bestandskunde" || outcome === "weiter_auf_zalo" || outcome === "verloren") return outcome;
  return "auto";
}

/**
 * Saves a correction. Only fields that differ from the stored label are pinned.
 * Stufe: a step picked here is pinned; "auto" removes the pin. Without a pin the step follows
 * from Interesse, Niveau, Ort, "Kurse geschickt", "Preis geschickt" and "Bezahlt" (stepFor), so choosing Sprachkurs sets it at once.
 * "Bezahlt" moves a Sprachkurs chat to Schüler and sets the status to Schüler. Taking it back returns the chat to Anmeldung.
 *
 * Several people work in the inbox at once. The form sends every field, plus what each field showed
 * when the form was opened (base_…). A field this person did not touch keeps what is stored now,
 * so a colleague's change to another field a moment ago is not put back.
 */
export async function saveMessengerLabel(_prev: LabelSaveResult | null, formData: FormData): Promise<LabelSaveResult> {
  await requireRole("admin");
  const id = field(formData, "conversation_id").slice(0, 200);
  if (!id) return { error: "Gespräch fehlt." };

  let stagePick = field(formData, "stage") || "auto";
  if (stagePick !== "auto" && !isStage(stagePick)) return { error: "Stufe ungültig." };
  let interest = normInterest(field(formData, "interest"));
  let level = normLevel(field(formData, "level"));
  let place = placeOf(field(formData, "place"));
  let priceSent = field(formData, "price_sent") === "ja";
  let coursesPick = field(formData, "courses_sent") === "ja";
  let paid = field(formData, "paid") === "ja";
  let oneOnOne = field(formData, "one_on_one") === "ja";
  const judgmentRaw = field(formData, "judgment") || "auto";
  if (!(JUDGMENTS as readonly string[]).includes(judgmentRaw)) return { error: "Status ungültig." };
  let judgment = judgmentRaw as Judgment;

  let loss: LossReason | null = null;
  let resume: string | null = null;
  if (judgment === "verloren") {
    const reason = field(formData, "loss_reason");
    // "Später" is a follow-up now (a date and a note on an open chat), not a reason to lose someone.
    if (!isLossReason(reason) || reason === "spaeter") return { error: "Grund fehlt." };
    loss = reason;
  }

  const supabase = await createClient();
  const [{ data: conv, error: convErr }, { data: existing, error: labelErr }, { data: fact, error: factErr }, followups] = await Promise.all([
    supabase.from("messenger_conversations").select("id").eq("id", id).maybeSingle(),
    supabase
      .from("messenger_labels")
      .select("conversation_id, stage, interest, level, place, outcome, loss_reason, evidence, labeled_through, source, pinned, resume_on, courses_sent, price_sent, paid, one_on_one")
      .eq("conversation_id", id)
      .maybeSingle(),
    supabase.from("messenger_facts").select(FACT_COLUMNS).eq("id", id).maybeSingle(),
    chatFollowups(supabase, id),
  ]);
  if (convErr || labelErr || factErr) return { error: (convErr ?? labelErr ?? factErr)!.message };
  if (!conv) return { error: "Gespräch nicht gefunden." };

  const row = (existing as StoredLabel | null) ?? null;
  const pins = new Set<PinField>((row?.pinned ?? []).filter((item): item is PinField => (PIN_FIELDS as readonly string[]).includes(item)));
  const prevJudgment = judgmentOf(row?.outcome);
  const prevLoss = prevJudgment === "verloren" ? (row?.loss_reason ?? null) : null;
  const prevResume = prevLoss === "spaeter" ? (row?.resume_on?.slice(0, 10) ?? null) : null;

  const prevStage = stepOf(row) ?? "unklar";

  // Fields this person left as the form showed them take the stored value (see above).
  const base = (key: string) => (formData.has(`base_${key}`) ? field(formData, `base_${key}`) : null);
  if (row) {
    const was = { stage: base("stage"), interest: base("interest"), level: base("level"), place: base("place"), courses: base("courses_sent"), price: base("price_sent"), paid: base("paid"), oneOnOne: base("one_on_one"), judgment: base("judgment") };
    if (was.stage !== null && stagePick === was.stage) stagePick = prevStage;
    if (was.interest !== null && interest === normInterest(was.interest)) interest = normInterest(row.interest);
    if (was.level !== null && level === normLevel(was.level)) level = normLevel(row.level);
    if (was.place !== null && place === placeOf(was.place)) place = placeOf(row.place);
    if (was.courses !== null && coursesPick === (was.courses === "ja")) coursesPick = !!row.courses_sent;
    if (was.price !== null && priceSent === (was.price === "ja")) priceSent = !!row.price_sent;
    if (was.paid !== null && paid === (was.paid === "ja")) paid = !!row.paid;
    if (was.oneOnOne !== null && oneOnOne === (was.oneOnOne === "ja")) oneOnOne = !!row.one_on_one;
    // Status, Grund and Datum belong together.
    if (was.judgment !== null && judgmentRaw === was.judgment && field(formData, "loss_reason") === (base("loss_reason") ?? "") && field(formData, "resume_on") === (base("resume_on") ?? "")) {
      judgment = prevJudgment;
      loss = prevLoss;
      resume = prevResume;
    }
  }
  // Picking Schüler is the close. Another status, or moving back to an earlier step, takes the payment off.
  if (stagePick === "schueler" && stagePick !== prevStage) paid = true;
  if (isStep(stagePick) && stagePick !== "schueler" && stagePick !== prevStage) paid = false;
  if (judgment !== "auto" && judgment !== "bestandskunde") paid = false;
  // Taking Bezahlt back, without picking another status, leaves the sale open again.
  if (row?.paid && !paid && judgment === "bestandskunde" && judgment === prevJudgment) judgment = "auto";
  if (paid && (judgment === "auto" || judgment === "bestandskunde")) judgment = "bestandskunde";
  // A Schüler is a Sprachkurs chat. The Interesse follows the status.
  if (judgment === "bestandskunde" || (row?.outcome === "bestandskunde" && judgment === prevJudgment)) interest = FUNNEL_INTEREST;
  // 1-1 is a Sprachkurs chat only, and it holds the Interesse there: the labeler can't move it away.
  if (interest !== FUNNEL_INTEREST) oneOnOne = false;
  // Paid means the price and the courses went out too.
  priceSent = paid || priceSent;
  const coursesSent = priceSent || coursesPick;
  // A pin on something that is not a step comes from the old stage names: it no longer holds anything.
  if (stagePick === "auto" || (!isStep(row?.stage) && stagePick === prevStage)) pins.delete("stage");
  else if (stagePick !== prevStage) pins.add("stage");
  // Bezahlt decides the step. A Schüler step that is no longer paid follows the fields again.
  if (paid && stagePick !== "schueler") pins.delete("stage");
  if (!paid && stagePick === "schueler") pins.delete("stage");
  if (interest !== normInterest(row?.interest) || oneOnOne) pins.add("interest");
  if (level !== normLevel(row?.level)) pins.add("level");
  if (place !== placeOf(row?.place)) pins.add("place");
  if (coursesSent !== !!row?.courses_sent) pins.add("courses_sent");
  if (priceSent !== !!row?.price_sent) pins.add("price_sent");

  const ball: Outcome = fact?.last_from_page ? "wartet_auf_kunde" : "wartet_auf_uns";
  let outcome: Outcome = row?.outcome ?? ball;

  if (judgment === "auto") {
    if (prevJudgment !== "auto") {
      pins.delete("outcome");
      pins.delete("loss_reason");
      pins.delete("resume_on");
    }
    outcome = ball;
    loss = null;
    resume = null;
  } else if (judgment !== prevJudgment || loss !== prevLoss || resume !== prevResume) {
    outcome = judgment;
    pins.add("outcome");
    if (judgment === "verloren") {
      pins.add("loss_reason");
      if (loss === "spaeter" && resume) pins.add("resume_on");
      else pins.delete("resume_on");
    } else {
      pins.delete("loss_reason");
      pins.delete("resume_on");
      loss = null;
      resume = null;
    }
  } else {
    loss = row?.loss_reason ?? null;
    resume = row?.resume_on?.slice(0, 10) ?? null;
  }

  // Status stays as stored until a person changes it. The step looks at that status.
  const stage = pins.has("stage") ? (stagePick === "auto" ? prevStage : stagePick) : stepFor({ interest, level, place, outcome, courses_sent: coursesSent, price_sent: priceSent, paid });

  const unchanged =
    !!row &&
    stage === row.stage &&
    pins.has("stage") === !!row.pinned?.includes("stage") &&
    interest === normInterest(row.interest) &&
    level === normLevel(row.level) &&
    place === placeOf(row.place) &&
    coursesSent === !!row.courses_sent &&
    priceSent === !!row.price_sent &&
    paid === !!row.paid &&
    oneOnOne === !!row.one_on_one &&
    pins.has("interest") === !!row.pinned?.includes("interest") &&
    judgment === prevJudgment &&
    loss === (row.loss_reason ?? null) &&
    resume === (row.resume_on ?? null);
  if (unchanged) return {};
  if (!row && (stagePick === "auto" || stagePick === prevStage) && !interest && level === "unklar" && place === "unklar" && !coursesSent && !paid && !oneOnOne && judgment === "auto") return {};

  const times = [fact?.last_customer_at, fact?.last_page_at].filter((t): t is string => !!t);
  const labeledThrough = times.reduce((a, b) => (a > b ? a : b), new Date().toISOString());

  const updatedAt = new Date().toISOString();
  const savedRow: InboxLabel = {
    conversation_id: id,
    stage,
    interest,
    level,
    place,
    outcome,
    loss_reason: loss,
    labeled_through: labeledThrough,
    resume_on: resume,
    pinned: [...pins],
    courses_sent: coursesSent,
    price_sent: priceSent,
    paid,
    one_on_one: oneOnOne,
    updated_at: updatedAt,
  };
  const { error } = await supabase.from("messenger_labels").upsert({
    conversation_id: id,
    stage,
    interest,
    level,
    place,
    outcome,
    loss_reason: loss,
    evidence: (row?.evidence ?? "Von Hand korrigiert.").slice(0, 500),
    labeled_through: labeledThrough,
    source: pins.size ? "human" : (row?.source ?? "rule"),
    pinned: [...pins],
    resume_on: resume,
    courses_sent: coursesSent,
    price_sent: priceSent,
    paid,
    one_on_one: oneOnOne,
    updated_at: updatedAt,
  });
  if (error) return { error: error.message };

  const factRow = (fact as FactRow | null) ?? undefined;
  const timing = toTiming(factRow, factRow?.last_from_page);
  const now = Date.now();
  const before = conversationView(row ? { ...row, resume_on: row.resume_on ?? null } : undefined, timing, now, followups.open);
  const view = conversationView(toActionLabel(savedRow), timing, now, followups.open);
  const version = await inboxVersion(supabase, id);
  return {
    saved: {
      conversationId: id,
      chips: labelChips(savedRow),
      view,
      step: stepOf(savedRow),
      label: savedRow,
      prev: inboxPlace(row, before.action.today),
      next: inboxPlace(savedRow, view.action.today),
      inbox: version.inbox,
      thread: version.thread,
    },
  };
}

export type FollowupResult = { error?: string; saved?: SavedLabel; followups?: ChatFollowups };

function who(session: Awaited<ReturnType<typeof requireRole>>) {
  return (session.profile.full_name || session.profile.email || "Admin").slice(0, 120);
}

/** The chat as the list and the open chat show it, with its follow-ups. `prevOpen` is the open follow-up before the change. */
async function followupPatch(supabase: Db, id: string, prevOpen: Followup | null): Promise<FollowupResult> {
  const [{ data: label, error: labelErr }, { data: fact, error: factErr }, followups] = await Promise.all([
    supabase.from("messenger_labels").select(LABEL_COLUMNS).eq("conversation_id", id).maybeSingle(),
    supabase.from("messenger_facts").select(FACT_COLUMNS).eq("id", id).maybeSingle(),
    chatFollowups(supabase, id),
  ]);
  if (labelErr || factErr) return { error: (labelErr ?? factErr)!.message };
  const row = (label as InboxLabel | null) ?? null;
  const factRow = (fact as FactRow | null) ?? undefined;
  const timing = toTiming(factRow, factRow?.last_from_page);
  const now = Date.now();
  const action = row ? toActionLabel(row) : undefined;
  const before = conversationView(action, timing, now, prevOpen);
  const view = conversationView(action, timing, now, followups.open);
  const version = await inboxVersion(supabase, id);
  return {
    followups,
    saved: {
      conversationId: id,
      chips: labelChips(row),
      view,
      step: stepOf(row),
      label: row,
      prev: inboxPlace(row, before.action.today),
      next: inboxPlace(row, view.action.today),
      inbox: version.inbox,
      thread: version.thread,
    },
  };
}

/**
 * Sets the chat's follow-up: a Vietnam date and an optional note. With one open, this moves it
 * (new date and note); otherwise a new one starts. Only one is ever open per chat.
 */
export async function setFollowup(input: { conversationId: string; dueOn: string; note: string }): Promise<FollowupResult> {
  const session = await requireRole("admin");
  const id = String(input.conversationId ?? "").slice(0, 200);
  const dueOn = String(input.dueOn ?? "");
  const note = String(input.note ?? "").trim().slice(0, NOTE_MAX) || null;
  if (!id) return { error: "Gespräch fehlt." };
  if (!isDay(dueOn)) return { error: "Datum ungültig." };
  const supabase = await createClient();
  const [{ data: conv, error: convErr }, current] = await Promise.all([
    supabase.from("messenger_conversations").select("id").eq("id", id).maybeSingle(),
    chatFollowups(supabase, id),
  ]);
  if (convErr) return { error: convErr.message };
  if (!conv) return { error: "Gespräch nicht gefunden." };
  const now = new Date().toISOString();
  const write = current.open
    ? supabase.from("messenger_followups").update({ due_on: dueOn, note, updated_at: now }).eq("id", current.open.id).is("done_at", null)
    : supabase.from("messenger_followups").insert({ conversation_id: id, due_on: dueOn, note, created_by: session.user.id, created_by_name: who(session) });
  const { error } = await write;
  // A colleague started one a moment ago (one open per chat): the list shows theirs.
  if (error) return { error: error.code === "23505" ? "Ein Kollege hat gerade einen Follow-up angelegt. Bitte neu laden." : error.message };
  return followupPatch(supabase, id, current.open);
}

/** "Erledigt": closes the open follow-up. It stays in the chat's history. */
export async function closeFollowup(input: { conversationId: string; id: string }): Promise<FollowupResult> {
  const session = await requireRole("admin");
  const conversationId = String(input.conversationId ?? "").slice(0, 200);
  const followupId = String(input.id ?? "").slice(0, 60);
  if (!conversationId || !followupId) return { error: "Follow-up fehlt." };
  const supabase = await createClient();
  const current = await chatFollowups(supabase, conversationId);
  if (current.open?.id === followupId) {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("messenger_followups")
      .update({ done_at: now, done_by: session.user.id, done_by_name: who(session), updated_at: now })
      .eq("id", followupId)
      .is("done_at", null);
    if (error) return { error: error.message };
  }
  return followupPatch(supabase, conversationId, current.open);
}
