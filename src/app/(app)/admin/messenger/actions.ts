"use server";

import { revalidatePath } from "next/cache";
import { INTERESTS } from "@/lib/assistant/schema";
import { requireRole } from "@/lib/auth";
import { isLossReason, isStage } from "@/lib/messenger/classify";
import { PIN_FIELDS, type PinField } from "@/lib/messenger/nextAction";
import { isStep, stepFor, stepOf } from "@/lib/messenger/steps";
import { levelOf, placeOf, type LossReason, type Outcome, type StoredLabel } from "@/lib/messenger/types";
import { createClient } from "@/lib/supabase/server";

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
 * from Interesse, Niveau, Ort, "Kurse geschickt" and "Preis geschickt" (stepFor), so choosing Sprachkurs sets it at once.
 */
export async function saveMessengerLabel(_prev: { error?: string } | null, formData: FormData): Promise<{ error?: string }> {
  await requireRole("admin");
  const id = field(formData, "conversation_id").slice(0, 200);
  if (!id) return { error: "Gespräch fehlt." };

  const stagePick = field(formData, "stage") || "auto";
  if (stagePick !== "auto" && !isStage(stagePick)) return { error: "Stufe ungültig." };
  const interest = normInterest(field(formData, "interest"));
  const level = normLevel(field(formData, "level"));
  const place = placeOf(field(formData, "place"));
  // Price sent means the courses went out too.
  const priceSent = field(formData, "price_sent") === "ja";
  const coursesSent = priceSent || field(formData, "courses_sent") === "ja";
  const judgmentRaw = field(formData, "judgment") || "auto";
  if (!(JUDGMENTS as readonly string[]).includes(judgmentRaw)) return { error: "Status ungültig." };
  const judgment = judgmentRaw as Judgment;

  let loss: LossReason | null = null;
  let resume: string | null = null;
  if (judgment === "verloren") {
    const reason = field(formData, "loss_reason");
    if (!isLossReason(reason)) return { error: "Grund fehlt." };
    loss = reason;
    if (reason === "spaeter") {
      const date = field(formData, "resume_on");
      if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Datum ungültig." };
      resume = date || null;
    }
  }

  const supabase = await createClient();
  const [{ data: conv, error: convErr }, { data: existing, error: labelErr }, { data: fact, error: factErr }] = await Promise.all([
    supabase.from("messenger_conversations").select("id").eq("id", id).maybeSingle(),
    supabase
      .from("messenger_labels")
      .select("conversation_id, stage, interest, level, place, outcome, loss_reason, evidence, labeled_through, source, pinned, resume_on, courses_sent, price_sent")
      .eq("conversation_id", id)
      .maybeSingle(),
    supabase.from("messenger_facts").select("last_from_page, last_customer_at, last_page_at").eq("id", id).maybeSingle(),
  ]);
  if (convErr || labelErr || factErr) return { error: (convErr ?? labelErr ?? factErr)!.message };
  if (!conv) return { error: "Gespräch nicht gefunden." };

  const row = (existing as StoredLabel | null) ?? null;
  const pins = new Set<PinField>((row?.pinned ?? []).filter((item): item is PinField => (PIN_FIELDS as readonly string[]).includes(item)));
  const prevJudgment = judgmentOf(row?.outcome);
  const prevLoss = prevJudgment === "verloren" ? (row?.loss_reason ?? null) : null;
  const prevResume = prevLoss === "spaeter" ? (row?.resume_on?.slice(0, 10) ?? null) : null;

  const prevStage = stepOf(row) ?? "unklar";
  // A pin on something that is not a step comes from the old stage names: it no longer holds anything.
  if (stagePick === "auto" || (!isStep(row?.stage) && stagePick === prevStage)) pins.delete("stage");
  else if (stagePick !== prevStage) pins.add("stage");
  if (interest !== normInterest(row?.interest)) pins.add("interest");
  if (level !== normLevel(row?.level)) pins.add("level");
  if (place !== placeOf(row?.place)) pins.add("place");

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

  // "Auto" judgment keeps a stored Schüler / Kein Lead until the next labeling, so the step looks at what is saved now.
  const stage = pins.has("stage") ? (stagePick === "auto" ? prevStage : stagePick) : stepFor({ interest, level, place, outcome, courses_sent: coursesSent, price_sent: priceSent });

  const unchanged =
    !!row &&
    stage === row.stage &&
    pins.has("stage") === !!row.pinned?.includes("stage") &&
    interest === normInterest(row.interest) &&
    level === normLevel(row.level) &&
    place === placeOf(row.place) &&
    coursesSent === !!row.courses_sent &&
    priceSent === !!row.price_sent &&
    judgment === prevJudgment &&
    loss === (row.loss_reason ?? null) &&
    resume === (row.resume_on ?? null);
  if (unchanged) return {};
  if (!row && (stagePick === "auto" || stagePick === prevStage) && !interest && level === "unklar" && place === "unklar" && !coursesSent && judgment === "auto") return {};

  const times = [fact?.last_customer_at, fact?.last_page_at].filter((t): t is string => !!t);
  const labeledThrough = times.reduce((a, b) => (a > b ? a : b), new Date().toISOString());

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
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/messenger");
  return {};
}
