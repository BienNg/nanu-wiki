import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type InboxChannel = "messenger" | "whatsapp" | "zalo";

export type InboundMessage = {
  id: string;
  fromPage: boolean;
  fromId: string | null;
  fromName: string | null;
  text: string | null;
  attachments: unknown[] | null;
  createdTime: string;
};

/** One customer thread. Messages from the same id in one batch are merged by the writer. */
export type InboundThread = {
  id: string;
  channel: InboxChannel;
  accountId: string;
  accountName: string | null;
  customerId: string | null;
  customerName: string | null;
  messages: InboundMessage[];
};

const CHUNK = 150;

function mergeThreads(threads: InboundThread[]): InboundThread[] {
  const byId = new Map<string, InboundThread>();
  for (const thread of threads) {
    const prev = byId.get(thread.id);
    if (!prev) {
      byId.set(thread.id, { ...thread, messages: [...thread.messages] });
      continue;
    }
    const seen = new Set(prev.messages.map((m) => m.id));
    for (const message of thread.messages) {
      if (!seen.has(message.id)) prev.messages.push(message);
    }
    if (!prev.customerName && thread.customerName) prev.customerName = thread.customerName;
    if (!prev.accountName && thread.accountName) prev.accountName = thread.accountName;
  }
  return [...byId.values()];
}

/** Insert conversations and messages. Existing rows keep an older updated_time only when the new batch is newer. */
export async function upsertThreads(db: SupabaseClient, threads: InboundThread[]): Promise<number> {
  const merged = mergeThreads(threads).filter((t) => t.messages.length);
  if (!merged.length) return 0;

  const ids = merged.map((t) => t.id);
  const { data: existing, error: existingErr } = await db
    .from("messenger_conversations")
    .select("id, updated_time, customer_name")
    .in("id", ids);
  if (existingErr) throw existingErr;
  const prior = new Map((existing ?? []).map((row) => [row.id as string, row as { updated_time: string; customer_name: string | null }]));

  const now = new Date().toISOString();
  const { error: convErr } = await db.from("messenger_conversations").upsert(
    merged.map((thread) => {
      const latest = thread.messages.reduce((max, m) => (m.createdTime > max ? m.createdTime : max), thread.messages[0].createdTime);
      const prev = prior.get(thread.id);
      const updatedTime = prev && prev.updated_time > latest ? prev.updated_time : latest;
      return {
        id: thread.id,
        channel: thread.channel,
        account_id: thread.accountId,
        account_name: thread.accountName,
        customer_psid: thread.customerId,
        customer_name: thread.customerName ?? prev?.customer_name ?? null,
        updated_time: updatedTime,
        synced_at: now,
      };
    }),
  );
  if (convErr) throw convErr;

  const rows = merged.flatMap((thread) =>
    thread.messages.map((m) => ({
      id: m.id,
      conversation_id: thread.id,
      channel: thread.channel,
      from_id: m.fromId,
      from_name: m.fromName,
      from_page: m.fromPage,
      text: m.text,
      attachments: m.attachments,
      created_time: m.createdTime,
      synced_at: now,
    })),
  );

  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await db.from("messenger_messages").upsert(rows.slice(i, i + CHUNK));
    if (error) throw error;
  }
  return rows.length;
}
