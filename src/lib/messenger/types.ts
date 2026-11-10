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
  source: "rule" | "model";
};

export type LabelDraft = {
  stage: string;
  interest: string | null;
  level: string | null;
  place: string | null;
  outcome: Outcome;
  loss_reason: LossReason | null;
  evidence: string;
  source: "rule" | "model";
};

export type ChatLineRow = {
  conversation_id: string;
  from_page: boolean;
  text: string | null;
  created_time: string;
};
