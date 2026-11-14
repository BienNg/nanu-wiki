import type { createClient } from "@/lib/supabase/server";
import { conversationView, type ActionLabel, type ActionTiming, type ConversationView } from "./nextAction";
import { stepOf, type Step } from "./steps";
import type { LossReason, Outcome } from "./types";

/** Rows and helpers shared by the inbox list (page) and the single chat (api/messenger/thread). */

export type InboxLabel = {
  conversation_id: string;
  stage: string;
  interest: string | null;
  level: string | null;
  place: string | null;
  outcome: Outcome;
  loss_reason: LossReason | null;
  labeled_through: string;
  resume_on: string | null;
  pinned: string[] | null;
  courses_sent: boolean | null;
  price_sent: boolean | null;
  updated_at: string | null;
};

export type FactRow = {
  id: string;
  customer_name: string | null;
  last_from_page: boolean | null;
  last_page_at: string | null;
  last_customer_at: string | null;
  followup_sent: boolean | null;
  last_page_has_zalo: boolean | null;
  channel: string | null;
};

export const LABEL_COLUMNS = "conversation_id, stage, interest, level, place, outcome, loss_reason, labeled_through, resume_on, pinned, courses_sent, price_sent, updated_at";
export const FACT_COLUMNS = "id, customer_name, last_from_page, last_page_at, last_customer_at, followup_sent, last_page_has_zalo, channel";

export function toActionLabel(row: InboxLabel): ActionLabel {
  return {
    stage: row.stage,
    interest: row.interest,
    level: row.level,
    place: row.place,
    outcome: row.outcome,
    loss_reason: row.loss_reason,
    labeled_through: row.labeled_through,
    resume_on: row.resume_on,
    pinned: row.pinned,
    courses_sent: row.courses_sent,
    price_sent: row.price_sent,
  };
}

/** `lastFromPage` is the newest message's side, used when the facts view has no row yet. */
export function toTiming(row: FactRow | undefined, lastFromPage: boolean | null | undefined): ActionTiming {
  return {
    last_from_page: row?.last_from_page ?? lastFromPage ?? null,
    last_page_at: row?.last_page_at ?? null,
    last_customer_at: row?.last_customer_at ?? null,
    followup_sent: !!row?.followup_sent,
    last_page_has_zalo: !!row?.last_page_has_zalo,
  };
}

export type ThreadMessageRow = {
  id: string;
  text: string | null;
  from_page: boolean;
  from_name: string | null;
  attachments: unknown[] | null;
  created_time: string;
};

export type OutboxRow = {
  id: string;
  status: string;
  sender_name: string;
  provider_message_id: string | null;
  created_at: string;
  error: string | null;
  payload: { text?: string; displayText?: string };
};

/** Everything the chat pane shows for one conversation. */
export type ThreadData = {
  id: string;
  name: string | null;
  channel: string | null;
  account_name: string | null;
  message_count: number | null;
  messages: ThreadMessageRow[];
  label: InboxLabel | null;
  /** The step right now (stepOf), null when the chat has none. */
  step: Step | null;
  view: ConversationView;
  attempts: OutboxRow[];
  lastInbound: string | null;
};

type Db = Awaited<ReturnType<typeof createClient>>;

/** One round trip: the six reads run side by side, each on an index (conversation id). */
export async function loadThread(supabase: Db, id: string, now = Date.now()): Promise<ThreadData | null> {
  const [conv, msgs, label, fact, outbox, inbound] = await Promise.all([
    supabase.from("messenger_conversations").select("id, customer_name, message_count, channel, account_name").eq("id", id).maybeSingle(),
    supabase
      .from("messenger_messages")
      .select("id, text, from_page, from_name, attachments, created_time")
      .eq("conversation_id", id)
      .order("created_time", { ascending: false })
      .limit(1000),
    supabase.from("messenger_labels").select(LABEL_COLUMNS).eq("conversation_id", id).maybeSingle(),
    supabase.from("messenger_facts").select(FACT_COLUMNS).eq("id", id).maybeSingle(),
    supabase.from("messenger_outbox").select("*").eq("conversation_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("messenger_messages").select("created_time").eq("conversation_id", id).eq("from_page", false).order("created_time", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const failed = conv.error ?? msgs.error ?? label.error ?? fact.error;
  if (failed) throw new Error(failed.message);
  if (!conv.data) return null;

  const messages = ((msgs.data ?? []) as ThreadMessageRow[]).reverse();
  const labelRow = (label.data as InboxLabel | null) ?? null;
  const timing = toTiming((fact.data as FactRow | null) ?? undefined, messages.at(-1)?.from_page);
  return {
    id: conv.data.id,
    name: conv.data.customer_name,
    channel: conv.data.channel,
    account_name: conv.data.account_name,
    message_count: conv.data.message_count,
    messages,
    label: labelRow,
    step: stepOf(labelRow),
    view: conversationView(labelRow ? toActionLabel(labelRow) : undefined, timing, now),
    attempts: ((outbox.data ?? []) as OutboxRow[]).reverse(),
    lastInbound: inbound.data?.created_time ?? null,
  };
}
