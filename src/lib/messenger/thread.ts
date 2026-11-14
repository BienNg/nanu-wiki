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
  /** The newest THREAD_PAGE messages, oldest first. */
  messages: ThreadMessageRow[];
  /** True when the database holds messages before the first one here (olderMessages loads them). */
  hasOlder: boolean;
  /** What the chat looked like when it was read (inboxVersion); the pane loads again when the current one differs. */
  version: string;
  label: InboxLabel | null;
  /** The step right now (stepOf), null when the chat has none. */
  step: Step | null;
  view: ConversationView;
  attempts: OutboxRow[];
  lastInbound: string | null;
};

type Db = Awaited<ReturnType<typeof createClient>>;

/** Messages per load. A long chat opens with its newest ones; the rest comes when the reader asks for it. */
export const THREAD_PAGE = 80;
const MESSAGE_COLUMNS = "id, text, from_page, from_name, attachments, created_time";

/** The newest messages of a chat (up to and including `before`), oldest first, and whether there are more before them. */
async function messagePage(supabase: Db, id: string, before?: string) {
  let query = supabase.from("messenger_messages").select(MESSAGE_COLUMNS).eq("conversation_id", id);
  // Up to and including: two messages can share a second. The pane drops the ones it already has.
  if (before) query = query.lte("created_time", before);
  const { data, error } = await query.order("created_time", { ascending: false }).limit(THREAD_PAGE + 1);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as ThreadMessageRow[];
  return { messages: rows.slice(0, THREAD_PAGE).reverse(), hasOlder: rows.length > THREAD_PAGE };
}

/** The page of messages before `before` (the time of the oldest message the pane shows). */
export function olderMessages(supabase: Db, id: string, before: string) {
  return messagePage(supabase, id, before);
}

/**
 * One round trip: the six reads run side by side, each on an index (conversation id).
 * `version` is the chat's version (inboxVersion), read by the caller BEFORE this runs.
 */
export async function loadThread(supabase: Db, id: string, version: string | null, now = Date.now()): Promise<ThreadData | null> {
  const [conv, page, label, fact, outbox, inbound] = await Promise.all([
    supabase.from("messenger_conversations").select("id, customer_name, message_count, channel, account_name").eq("id", id).maybeSingle(),
    messagePage(supabase, id),
    supabase.from("messenger_labels").select(LABEL_COLUMNS).eq("conversation_id", id).maybeSingle(),
    supabase.from("messenger_facts").select(FACT_COLUMNS).eq("id", id).maybeSingle(),
    supabase.from("messenger_outbox").select("*").eq("conversation_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("messenger_messages").select("created_time").eq("conversation_id", id).eq("from_page", false).order("created_time", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const failed = conv.error ?? label.error ?? fact.error;
  if (failed) throw new Error(failed.message);
  if (!conv.data) return null;

  const { messages, hasOlder } = page;
  const labelRow = (label.data as InboxLabel | null) ?? null;
  const timing = toTiming((fact.data as FactRow | null) ?? undefined, messages.at(-1)?.from_page);
  return {
    id: conv.data.id,
    name: conv.data.customer_name,
    channel: conv.data.channel,
    account_name: conv.data.account_name,
    message_count: conv.data.message_count,
    messages,
    hasOlder,
    version: version ?? "",
    label: labelRow,
    step: stepOf(labelRow),
    view: conversationView(labelRow ? toActionLabel(labelRow) : undefined, timing, now),
    attempts: ((outbox.data ?? []) as OutboxRow[]).reverse(),
    lastInbound: inbound.data?.created_time ?? null,
  };
}
