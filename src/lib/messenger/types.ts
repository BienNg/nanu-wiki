/** Shared types for the Messenger sales stats. Stages match the reply assistant. */

export const OUTCOMES = [
  "offen",
  "wartet_auf_uns",
  "wartet_auf_kunde",
  "weiter_auf_zalo",
  "bestandskunde",
  "kein_lead",
  "verloren",
] as const;
export type Outcome = (typeof OUTCOMES)[number];

export const LOSS_REASONS = [
  "preis",
  "zeit_passt_nicht",
  "spaeter",
  "andere_schule",
  "keine_antwort",
  "kein_naechster_schritt",
  "unklar",
] as const;
export type LossReason = (typeof LOSS_REASONS)[number];

export const LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1", "unklar"] as const;

/** Where the lead would learn: in class in Saigon or Hanoi, or online from Vietnam or from Germany. */
export const PLACES = ["Saigon", "Hanoi", "Online VN", "Online DE", "unklar"] as const;
export type MessengerPlace = (typeof PLACES)[number];

/** One of PLACES. Also reads the free text stored before Ort became a fixed list ("Hà Nội", "TP.HCM", "Đức"). */
export function placeOf(value: string | null | undefined): MessengerPlace {
  const v = (value ?? "").trim();
  const exact = PLACES.find((p) => p.toLowerCase() === v.toLowerCase());
  if (exact) return exact;
  const plain = v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase();
  if (/ha\s*noi/.test(plain)) return "Hanoi";
  if (/sai\s*gon|hcm|ho chi minh/.test(plain)) return "Saigon";
  if (/\b(duc|deutschland|germany)\b/.test(plain)) return "Online DE";
  return "unklar";
}

export type MessengerFact = {
  id: string;
  customer_name: string | null;
  customer_psid: string | null;
  updated_time: string;
  first_customer_at: string | null;
  first_reply_at: string | null;
  last_customer_at: string | null;
  last_page_at: string | null;
  customer_msgs: number;
  page_msgs: number;
  zalo_offered: boolean;
  last_page_has_zalo: boolean;
  reply_seconds: number | null;
  last_from_page: boolean | null;
  followup_sent: boolean;
  channel: string;
};

export type StoredLabel = {
  conversation_id: string;
  stage: string;
  interest: string | null;
  level: string | null;
  place: string | null;
  outcome: Outcome;
  loss_reason: LossReason | null;
  evidence: string | null;
  labeled_through: string;
  source: "rule" | "model" | "human";
  /** Fields a person set. The cron keeps these and may refill the others. */
  pinned?: string[];
  /** Vietnam date (YYYY-MM-DD) when loss_reason is spaeter. */
  resume_on?: string | null;
};

export type LabelDraft = {
  stage: string;
  interest: string | null;
  level: string | null;
  place: string | null;
  outcome: Outcome;
  loss_reason: LossReason | null;
  evidence: string;
  source: "rule" | "model" | "human";
};

export type ChatLineRow = {
  conversation_id: string;
  from_page: boolean;
  text: string | null;
  created_time: string;
};
