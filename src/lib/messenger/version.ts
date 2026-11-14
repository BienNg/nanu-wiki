import type { createClient } from "@/lib/supabase/server";

type Db = Awaited<ReturnType<typeof createClient>>;
type SyncState = { page_id: string; last_run_at: string | null; last_error: string | null };

/**
 * What the inbox looks like right now, as short strings that change when the data changes.
 * The page and the chat carry the version they were loaded with; the browser asks for the current
 * one every few seconds and loads again only when they differ.
 */
export type InboxVersion = {
  /** Changes when any chat gets a message or any label is saved. */
  inbox: string;
  /** Changes when the given chat gets a message, a label change or a send status. Null without a chat. */
  thread: string | null;
  syncAt: string | null;
  syncError: string | null;
};

function syncOf(states: SyncState[]) {
  const page = states.find((s) => s.page_id === process.env.META_PAGE_ID) ?? states.find((s) => !s.page_id.startsWith("wa:")) ?? null;
  return { syncAt: page?.last_run_at ?? null, syncError: page?.last_error ?? states.find((s) => s.last_error)?.last_error ?? null };
}

/** While the database function is missing, it is not asked for until this time. */
let skipFunctionUntil = 0;

/**
 * One request (migration 20261114150000_messenger_inbox_version). Read it BEFORE the data it stands
 * for: then a change that lands in between gives an older version and one extra load, never a missed one.
 *
 * Until the migration is applied the same answer is put together from a few small reads.
 */
export async function inboxVersion(supabase: Db, conversation?: string | null): Promise<InboxVersion> {
  if (Date.now() > skipFunctionUntil) {
    const { data, error } = await supabase.rpc("messenger_inbox_version", { p_conversation: conversation || null });
    const found = data as { inbox?: string; thread?: string | null; sync?: SyncState[] } | null;
    if (!error && found && typeof found.inbox === "string") {
      return { inbox: found.inbox, thread: conversation ? (found.thread ?? "") : null, ...syncOf(Array.isArray(found.sync) ? found.sync : []) };
    }
    // Asking for a function that is not there is slow (the API looks through its schema again each time),
    // and this runs every few seconds: ask again only after a while.
    skipFunctionUntil = Date.now() + 10 * 60_000;
  }

  const newest = (table: string, column: string) => supabase.from(table).select(column).order(column, { ascending: false }).limit(1).maybeSingle();
  const none = Promise.resolve(null);
  const [chatTime, chatSync, labelTime, states, messages, label, outbox] = await Promise.all([
    newest("messenger_conversations", "updated_time"),
    newest("messenger_conversations", "synced_at"),
    newest("messenger_labels", "updated_at"),
    supabase.from("messenger_sync_state").select("page_id, last_run_at, last_error"),
    conversation ? supabase.from("messenger_messages").select("created_time", { count: "exact" }).eq("conversation_id", conversation).order("created_time", { ascending: false }).limit(1) : none,
    conversation ? supabase.from("messenger_labels").select("updated_at").eq("conversation_id", conversation).maybeSingle() : none,
    conversation ? supabase.from("messenger_outbox").select("updated_at", { count: "exact" }).eq("conversation_id", conversation).order("updated_at", { ascending: false }).limit(1) : none,
  ]);
  const thread = conversation ? JSON.stringify([messages?.count, messages?.data?.[0], label?.data, outbox?.count, outbox?.data?.[0]]) : null;
  return { inbox: JSON.stringify([chatTime.data, chatSync.data, labelTime.data]), thread, ...syncOf((states.data ?? []) as SyncState[]) };
}
