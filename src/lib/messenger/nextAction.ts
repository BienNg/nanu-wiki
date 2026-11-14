import { followupIgnored, formatVnDate } from "./classify";
import { STEP_INFO, stepOf, type Step } from "./steps";
import { placeOf, type LabelDraft, type LossReason, type MessengerFact, type Outcome, type StoredLabel } from "./types";

/** Fields a person can lock. The cron must not overwrite these. */
export const PIN_FIELDS = ["stage", "interest", "level", "place", "outcome", "loss_reason", "resume_on"] as const;
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
};

export type ConversationView = {
  state: { de: string; vi: string };
  /** What the inbox row shows next to the action chip; null when the chip already says it all. */
  note: { de: string; vi: string } | null;
  action: NextAction;
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

/** Keep pinned fields when the cron writes a new draft. */
export function mergePinned(draft: LabelDraft, previous: Pick<StoredLabel, "stage" | "interest" | "level" | "place" | "outcome" | "loss_reason" | "pinned"> | undefined): LabelDraft {
  if (!previous?.pinned?.length) return draft;
  const pins = new Set(previous.pinned);
  return {
    ...draft,
    stage: pins.has("stage") ? previous.stage : draft.stage,
    interest: pins.has("interest") ? previous.interest : draft.interest,
    level: pins.has("level") ? previous.level : draft.level,
    place: pins.has("place") ? previous.place : draft.place,
    outcome: pins.has("outcome") ? previous.outcome : draft.outcome,
    loss_reason: pins.has("loss_reason") ? previous.loss_reason : draft.loss_reason,
    source: "human",
  };
}

function lostView(label: ActionLabel, now: number): ConversationView {
  if (label.loss_reason === "spaeter") {
    const when = label.resume_on;
    if (!when) {
      return {
        state: { de: "Später · Datum fehlt", vi: "Để sau · thiếu ngày" },
        note: { de: "Später", vi: "Để sau" },
        action: act("spaeter_date", "Datum eintragen", "Ghi ngày hẹn lại", 75),
      };
    }
    const day = when.slice(0, 10);
    const pretty = `${day.slice(8, 10)}.${day.slice(5, 7)}.`;
    const state = { de: `Später · ${pretty}`, vi: `Để sau · ${pretty}` };
    if (day <= formatVnDate(new Date(now))) {
      return { state, note: state, action: act("spaeter_due", "Wieder schreiben", "Nhắn lại", 65) };
    }
    return { state, note: { de: "Später", vi: "Để sau" }, action: act("spaeter_wait", `Am ${pretty} wieder schreiben`, `Nhắn lại ngày ${pretty}`, 120, false) };
  }
  const text = LOSS_TEXT[label.loss_reason ?? "unklar"] ?? LOSS_TEXT.unklar;
  return { state: text, note: text, action: CLOSED };
}

/** What we do in this step when it is our turn. Without a step (other Interesse, not labeled yet): ask or answer. */
function stepTask(label: ActionLabel | undefined, step: Step | null): { id: string; de: string; vi: string; rank: number } {
  if (step === "anmeldung") return { id: "pay", de: "Anmeldung abschließen: Zahlungsdaten schicken", vi: "Chốt đăng ký: gửi thông tin chuyển khoản", rank: 10 };
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
  return { ...WAIT, de: `Warten · dann ${de}`, vi: `Chờ · sau đó ${task.vi.charAt(0).toLowerCase()}${task.vi.slice(1)}` };
}

function followupAction(step: Step | null): NextAction {
  if (step === "anmeldung") return act("nudge_pay", "Einmal nachfassen: Platz und Zahlung", "Nhắc một lần: giữ chỗ và đóng tiền", 70);
  if (step === "preis") return act("nudge_offer", "Einmal nachfassen, mit einem neuen Hinweis", "Nhắc một lần, kèm thông tin mới", 70);
  return act("nudge", "Einmal nachfassen", "Nhắc một lần", 70);
}

/** State of one chat and the single next action. Timing wins over a saved "whose turn". */
export function conversationView(label: ActionLabel | undefined, timing: ActionTiming, now = Date.now()): ConversationView {
  const stale = wroteAfter(label, timing);
  const ball = ourTurn(timing);
  const nudge = followupDue(timing, now);
  const silent = ignored(timing, now);
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
  if (closed && (label.outcome === "weiter_auf_zalo" || (timing.last_page_has_zalo && timing.last_from_page === true))) {
    return { state: { de: "Weiter auf Zalo", vi: "Chuyển sang Zalo" }, note: null, action: ZALO };
  }
  if (closed && label.outcome === "verloren") return lostView(label, now);

  const student = closed && label.outcome === "bestandskunde";
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
  if (ball) return { state, note, action: replyAction(label, stage) };
  if (silent) return { state, note, action: STOP };
  if (nudge) return { state, note, action: followupAction(stage) };
  return { state, note, action: waitAction(label, stage) };
}
