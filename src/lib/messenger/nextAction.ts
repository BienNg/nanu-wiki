import { followupIgnored, formatVnDate } from "./classify";
import { daysBetween, shortDay, type OpenFollowup } from "./followups";
import { STEP_INFO, stepOf, type Step } from "./steps";
import { placeOf, type LabelDraft, type LossReason, type MessengerFact, type Outcome, type StoredLabel } from "./types";

/** Fields a person can lock. The cron must not overwrite these. Status is never written by the cron, pin or not. */
export const PIN_FIELDS = ["stage", "interest", "level", "place", "outcome", "loss_reason", "resume_on", "courses_sent", "price_sent"] as const;
export type PinField = (typeof PIN_FIELDS)[number];

const DAY_MS = 24 * 60 * 60 * 1000;

const LOSS_TEXT: Record<LossReason, { de: string; vi: string }> = {
  preis: { de: "Verloren · Preis", vi: "Mất · học phí" },
  zeit_passt_nicht: { de: "Verloren · Zeit", vi: "Mất · lịch" },
  spaeter: { de: "Später", vi: "Để sau" },
  andere_schule: { de: "Verloren · andere Schule", vi: "Mất · trường khác" },
  keine_antwort: { de: "Verloren · keine Antwort", vi: "Mất · không trả lời" },
  kein_naechster_schritt: { de: "Verloren · kein nächster Schritt", vi: "Mất · không bước tiếp" },
  unklar: { de: "Verloren", vi: "Mất khách" },
};

export type ActionLabel = {
  stage: string;
  interest: string | null;
  level: string | null;
  place: string | null;
  outcome: Outcome;
  loss_reason: LossReason | null;
  labeled_through: string;
  resume_on: string | null;
  pinned?: string[] | null;
  courses_sent?: boolean | null;
  price_sent?: boolean | null;
  paid?: boolean | null;
};

export type ActionTiming = {
  last_from_page: boolean | null;
  last_page_at: string | null;
  last_customer_at: string | null;
  followup_sent: boolean;
  last_page_has_zalo: boolean;
};

export type NextAction = {
  id: string;
  de: string;
  vi: string;
  /** Lower means do this before the others. `today` is false when nobody needs to act. */
  rank: number;
  today: boolean;
  /** For "wait": the task we do once the person answers (a stepTask id), so short views can name it. */
  next?: string;
};

export type ConversationView = {
  state: { de: string; vi: string };
  /** What the inbox row shows next to the action chip; null when the chip already says it all. */
  note: { de: string; vi: string } | null;
  action: NextAction;
  /** The open manual follow-up, if any. `due` from the start of its day (Vietnam time). */
  followup?: (OpenFollowup & { due: boolean }) | null;
  /** Since when this has been waiting for us (oldest first in "Zu tun"); null when nothing waits. */
  since?: string | null;
};

const CLOSED: NextAction = { id: "none", de: "Nichts tun", vi: "Không cần làm gì", rank: 200, today: false };
const WAIT: NextAction = { id: "wait", de: "Warten", vi: "Chờ", rank: 100, today: false };
const STOP: NextAction = { id: "stop", de: "Nicht noch einmal schreiben", vi: "Không nhắn lại", rank: 200, today: false };
const ZALO: NextAction = { id: "zalo", de: "Auf Zalo weitermachen", vi: "Tiếp tục trên Zalo", rank: 110, today: false };
const NOT_A_LEAD: NextAction = { id: "kein_lead", de: "Nicht anbieten", vi: "Không chào khóa", rank: 200, today: false };

function act(id: string, de: string, vi: string, rank: number, today = true): NextAction {
  return { id, de, vi, rank, today };
}

function known(value: string | null | undefined) {
  return !!value && value !== "unklar" && value !== "keins";
}

function ourTurn(timing: ActionTiming) {
  return timing.last_from_page === false;
}

/** The person wrote after this label was saved, so a closed outcome is out of date. */
function wroteAfter(label: ActionLabel | undefined, timing: ActionTiming) {
  if (!label || !timing.last_customer_at) return false;
  return new Date(timing.last_customer_at).getTime() > new Date(label.labeled_through).getTime();
}

function followupDue(timing: ActionTiming, now: number) {
  if (timing.last_from_page !== true || timing.followup_sent || timing.last_page_has_zalo || !timing.last_page_at) return false;
  return now - new Date(timing.last_page_at).getTime() >= DAY_MS;
}

function ignored(timing: ActionTiming, now: number) {
  const fact = {
    followup_sent: timing.followup_sent,
    last_from_page: timing.last_from_page,
    last_page_at: timing.last_page_at,
    last_page_has_zalo: timing.last_page_has_zalo,
  } as MessengerFact;
  return followupIgnored(fact, now);
}

/** Keep a person's fields when the cron writes a new draft. Status always stays as stored. */
export function mergePinned(
  draft: LabelDraft,
  previous: Pick<StoredLabel, "stage" | "interest" | "level" | "place" | "outcome" | "loss_reason" | "pinned" | "courses_sent" | "price_sent"> | undefined,
): LabelDraft {
  const pins = new Set(previous?.pinned ?? []);
  const priceSent = pins.has("price_sent") ? !!previous?.price_sent : !!draft.price_sent;
  const coursesSent = pins.has("courses_sent") ? !!previous?.courses_sent : priceSent || !!draft.courses_sent;
  return {
    ...draft,
    stage: pins.has("stage") ? (previous?.stage ?? draft.stage) : draft.stage,
    interest: pins.has("interest") ? (previous?.interest ?? null) : draft.interest,
    level: pins.has("level") ? (previous?.level ?? null) : draft.level,
    place: pins.has("place") ? (previous?.place ?? null) : draft.place,
    outcome: pins.has("outcome") ? (previous?.outcome ?? "offen") : "offen",
    loss_reason: pins.has("outcome") ? (previous?.loss_reason ?? null) : null,
    courses_sent: coursesSent,
    price_sent: priceSent,
    source: pins.size ? "human" : draft.source,
  };
}

function lostView(label: ActionLabel): ConversationView {
  const text = LOSS_TEXT[label.loss_reason ?? "unklar"] ?? LOSS_TEXT.unklar;
  return { state: text, note: text, action: CLOSED };
}

/** What we do in this step when it is our turn. Without a step (other Interesse, not labeled yet): ask or answer. */
function stepTask(label: ActionLabel | undefined, step: Step | null): { id: string; de: string; vi: string; rank: number } {
  if (step === "schueler") return { id: "class", de: "Das Kursproblem lösen", vi: "Giải quyết vấn đề của buổi học", rank: 50 };
  if (step === "anmeldung") return { id: "pay", de: "Chốt: Anmeldung abschließen", vi: "Chốt đăng ký", rank: 10 };
  if (step === "preis") return { id: "offer", de: "Preis und Pakete schicken", vi: "Gửi học phí và các gói", rank: 20 };
  if (step === "kurse") {
    const detail = [label!.level, placeOf(label!.place)].join(", ");
    return { id: "courses", de: `Passende Kurse schicken (${detail})`, vi: `Gửi khóa phù hợp (${detail})`, rank: 30 };
  }
  if (step === "bedarf") {
    if (!known(label?.level)) return { id: "ask_level", de: "Niveau fragen", vi: "Hỏi trình độ", rank: 40 };
    return { id: "ask_place", de: "Ort fragen", vi: "Hỏi nơi học", rank: 40 };
  }
  if (step === "qualifizieren" || !known(label?.interest)) return { id: "ask_interest", de: "Interesse fragen", vi: "Hỏi nhu cầu", rank: 40 };
  return { id: "answer", de: "Antworten", vi: "Trả lời", rank: 40 };
}

function replyAction(label: ActionLabel | undefined, step: Step | null): NextAction {
  const task = stepTask(label, step);
  return act(task.id, task.de, task.vi, task.rank);
}

/** While the person has the turn, still say what we do next once they answer. */
function waitAction(label: ActionLabel | undefined, step: Step | null): NextAction {
  const task = stepTask(label, step);
  if (task.id === "answer" || task.id === "pay") return WAIT;
  const de = task.id === "courses" ? task.de.replace(/^Passende/, "passende") : task.de;
  return { ...WAIT, next: task.id, de: `Warten · dann ${de}`, vi: `Chờ · sau đó ${task.vi.charAt(0).toLowerCase()}${task.vi.slice(1)}` };
}

function followupAction(step: Step | null): NextAction {
  if (step === "schueler") return CLOSED;
  if (step === "anmeldung") return act("nudge_pay", "Einmal nachfassen: Platz und Zahlung", "Nhắc một lần: giữ chỗ và đóng tiền", 70);
  if (step === "preis") return act("nudge_offer", "Einmal nachfassen, mit einem neuen Hinweis", "Nhắc một lần, kèm thông tin mới", 70);
  return act("nudge", "Einmal nachfassen", "Nhắc một lần", 70);
}

/**
 * State of one chat and the single next action. Timing wins over a saved "whose turn".
 *
 * An open manual follow-up turns the automatic one (24h nudge, "Nicht noch einmal schreiben") off.
 * When the person wrote, answering comes first; otherwise a due follow-up is the action, in every
 * status (Verloren, Kein Lead, Zalo too). Before its day, an open chat waits for that day.
 */
export function conversationView(label: ActionLabel | undefined, timing: ActionTiming, now = Date.now(), followup: OpenFollowup | null = null): ConversationView {
  const base = baseView(label, timing, now, !!followup);
  if (!followup) return { ...base, followup: null };
  const today = formatVnDate(new Date(now));
  const due = followup.due_on <= today;
  const fu = { due_on: followup.due_on, note: followup.note, due };
  if (base.action.today) return { ...base, followup: fu };
  if (due) {
    const late = daysBetween(followup.due_on, today);
    const when = late === 0 ? { de: "heute", vi: "hôm nay" } : { de: `überfällig ${late} T.`, vi: `quá ${late} ngày` };
    return {
      ...base,
      action: { id: "followup_due", de: `Follow-up · ${when.de}`, vi: `Nhắc lại · ${when.vi}`, rank: 60, today: true },
      followup: fu,
      since: `${followup.due_on}T00:00:00+07:00`,
    };
  }
  // A closed chat keeps its state; the row shows the date beside it.
  if (base.action.id !== "wait") return { ...base, followup: fu };
  const day = shortDay(followup.due_on);
  return { ...base, action: { id: "followup_wait", de: `Follow-up am ${day}`, vi: `Nhắc lại ngày ${day}`, rank: 115, today: false }, followup: fu };
}

function baseView(label: ActionLabel | undefined, timing: ActionTiming, now: number, manual: boolean): ConversationView {
  const view = innerView(label, timing, now, manual);
  if (!view.action.today) return { ...view, since: null };
  return { ...view, since: view.action.id.startsWith("nudge") ? timing.last_page_at : (timing.last_customer_at ?? timing.last_page_at) };
}

function innerView(label: ActionLabel | undefined, timing: ActionTiming, now: number, manual: boolean): ConversationView {
  const stale = wroteAfter(label, timing);
  const ball = ourTurn(timing);
  const nudge = !manual && followupDue(timing, now);
  const silent = !manual && ignored(timing, now);
  const stage = stepOf(label);
  const stageDe = stage ? STEP_INFO[stage].short_de : "Unklar";
  const stageVi = stage ? STEP_INFO[stage].short_vi : "Chưa rõ";
  const turn = ball
    ? { de: "wartet auf uns", vi: "chờ mình" }
    : nudge
      ? { de: "Nachfrage fällig", vi: "đến lúc nhắc" }
      : silent
        ? { de: "keine Antwort", vi: "không trả lời" }
        : { de: "wartet auf die Person", vi: "chờ khách" };

  const closed = !!label && !stale;
  if (closed && label.outcome === "kein_lead") {
    const state = { de: "Kein Lead", vi: "Không phải khách" };
    return { state, note: state, action: NOT_A_LEAD };
  }
  if (closed && label.outcome === "weiter_auf_zalo") {
    return { state: { de: "Weiter auf Zalo", vi: "Chuyển sang Zalo" }, note: null, action: ZALO };
  }
  if (closed && label.outcome === "verloren") return lostView(label);

  // A paid close stays Schüler after a new message. Kein Lead and Verloren can reopen.
  const student = !!label && (label.outcome === "bestandskunde" || stage === "schueler");
  const state = {
    de: `${student ? "Schüler" : label ? stageDe : "Noch nicht eingeordnet"} · ${turn.de}`,
    vi: `${student ? "Học viên" : label ? stageVi : "Chưa phân loại"} · ${turn.vi}`,
  };

  // Whose turn it is already shows in the chip, so the row only adds the step.
  const note = student
    ? { de: "Schüler", vi: "Học viên" }
    : label && stage
      ? { de: stageDe, vi: stageVi }
      : null;

  if (student && !ball) return { state, note, action: CLOSED };
  if (student) return { state, note, action: act("class", "Das Kursproblem lösen", "Giải quyết vấn đề của buổi học", 50) };
  if (closed && timing.last_page_has_zalo && timing.last_from_page === true) {
    return { state: { de: "Weiter auf Zalo", vi: "Chuyển sang Zalo" }, note: null, action: ZALO };
  }
  if (ball) return { state, note, action: replyAction(label, stage) };
  if (silent) return { state, note, action: STOP };
  if (nudge) return { state, note, action: followupAction(stage) };
  return { state, note, action: waitAction(label, stage) };
}
