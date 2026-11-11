import { STAGE_INFO, STAGES, type Stage } from "@/lib/assistant/schema";
import { followupIgnored, formatVnDate } from "./classify";
import type { LabelDraft, LossReason, MessengerFact, Outcome, StoredLabel } from "./types";

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

function asStage(stage: string | undefined): Stage | "unklar" | null {
  if (!stage) return null;
  if (stage === "unklar") return "unklar";
  return (STAGES as readonly string[]).includes(stage) ? (stage as Stage) : null;
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
        action: act("spaeter_date", "Datum eintragen", "Ghi ngày hẹn lại", 75),
      };
    }
    const day = when.slice(0, 10);
    const pretty = `${day.slice(8, 10)}.${day.slice(5, 7)}.`;
    const state = { de: `Später · ${pretty}`, vi: `Để sau · ${pretty}` };
    if (day <= formatVnDate(new Date(now))) {
      return { state, action: act("spaeter_due", "Wieder schreiben", "Nhắn lại", 65) };
    }
    return { state, action: act("spaeter_wait", `Am ${pretty} wieder schreiben`, `Nhắn lại ngày ${pretty}`, 120, false) };
  }
  const text = LOSS_TEXT[label.loss_reason ?? "unklar"] ?? LOSS_TEXT.unklar;
  return { state: text, action: CLOSED };
}

function replyAction(label: ActionLabel | undefined, stage: Stage | "unklar" | null): NextAction {
  if (stage === STAGES[3]) return act("pay", "Zahlungsdaten schicken und den Platz bestätigen", "Gửi thông tin chuyển khoản và xác nhận chỗ", 10);
  if (stage === STAGES[2]) return act("offer", "Preis schicken und fragen, ob wir den Platz reservieren", "Báo giá và hỏi giữ chỗ", 20);
  if (stage === STAGES[5]) return act("visa", "Fehlendes Dokument und das Datum nennen", "Nói giấy tờ còn thiếu và hạn nộp", 55);
  if (stage === STAGES[4]) return act("class", "Das Kursproblem lösen", "Giải quyết vấn đề của buổi học", 50);

  const early = !stage || stage === "unklar" || stage === STAGES[0] || stage === STAGES[1];
  if (!early) return act("answer", "Antworten", "Trả lời", 40);
  if (!label) return act("answer", "Antworten", "Trả lời", 40);
  const place = known(label.place);
  const level = known(label.level);
  if (!place && !level) return act("ask_both", "Wohnort und Niveau fragen", "Hỏi nơi ở và trình độ", 40);
  if (!place) return act("ask_place", "Wohnort fragen", "Hỏi nơi ở", 40);
  if (!level) return act("ask_level", "Niveau fragen", "Hỏi trình độ", 40);
  const detail = [label.level, label.place].filter(known).join(", ");
  return act("courses", `Passende Kurse schicken (${detail})`, `Gửi khóa phù hợp (${detail})`, 30);
}

function followupAction(stage: Stage | "unklar" | null): NextAction {
  if (stage === STAGES[3]) return act("nudge_pay", "Einmal nachfassen: Platz und Zahlung", "Nhắc một lần: giữ chỗ và đóng tiền", 70);
  if (stage === STAGES[2]) return act("nudge_offer", "Einmal nachfassen, mit einem neuen Hinweis", "Nhắc một lần, kèm thông tin mới", 70);
  return act("nudge", "Einmal nachfassen", "Nhắc một lần", 70);
}

/** State of one chat and the single next action. Timing wins over a saved "whose turn". */
export function conversationView(label: ActionLabel | undefined, timing: ActionTiming, now = Date.now()): ConversationView {
  const stale = wroteAfter(label, timing);
  const ball = ourTurn(timing);
  const nudge = followupDue(timing, now);
  const silent = ignored(timing, now);
  const stage = asStage(label?.stage);
  const stageDe = stage && stage !== "unklar" ? STAGE_INFO[stage].short_de : "Unklar";
  const stageVi = stage && stage !== "unklar" ? STAGE_INFO[stage].short_vi : "Chưa rõ";
  const turn = ball
    ? { de: "wartet auf uns", vi: "chờ mình" }
    : nudge
      ? { de: "Nachfrage fällig", vi: "đến lúc nhắc" }
      : silent
        ? { de: "keine Antwort", vi: "không trả lời" }
        : { de: "wartet auf die Person", vi: "chờ khách" };

  const closed = !!label && !stale;
  if (closed && label.outcome === "kein_lead") {
    return { state: { de: "Kein Lead", vi: "Không phải khách" }, action: NOT_A_LEAD };
  }
  if (closed && (label.outcome === "weiter_auf_zalo" || (timing.last_page_has_zalo && timing.last_from_page === true))) {
    return { state: { de: "Weiter auf Zalo", vi: "Chuyển sang Zalo" }, action: ZALO };
  }
  if (closed && label.outcome === "verloren") return lostView(label, now);

  const student = closed && label.outcome === "bestandskunde";
  const state = {
    de: `${student ? "Schüler" : label ? stageDe : "Noch nicht eingeordnet"} · ${turn.de}`,
    vi: `${student ? "Học viên" : label ? stageVi : "Chưa phân loại"} · ${turn.vi}`,
  };

  if (student && !ball) return { state, action: CLOSED };
  if (ball) return { state, action: replyAction(label, stage) };
  if (silent) return { state, action: STOP };
  if (nudge) return { state, action: followupAction(stage) };
  return { state, action: WAIT };
}
