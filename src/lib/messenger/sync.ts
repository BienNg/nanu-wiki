import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Copies the Facebook Page's Messenger inbox into Supabase (read-only).
 * WhatsApp Business chats are not in this poll; they arrive at /api/whatsapp/webhook.
 * Runs every minute from /api/cron/messenger-sync. Picks up both directions:
 * messages customers send and replies the Page sends (Business Suite, inbox, automations).
 *
 * Each run: list conversations newest first, stop at the last synced point (high-water),
 * and for each changed conversation page through its messages until one we already have.
 * Everything is an upsert on Meta's ids, so overlapping or repeated runs are harmless.
 */

const GRAPH = "https://graph.facebook.com/v23.0";
const OVERLAP_MS = 2 * 60_000; // re-check conversations updated just before the high-water mark
const MESSAGE_FIELDS =
  "id,message,from,created_time,attachments{mime_type,name,size,image_data{url,preview_url},video_data{url,preview_url},file_url}";

type GraphPage<T> = { data: T[]; paging?: { next?: string } };
type GraphConversation = {
  id: string;
  updated_time: string;
  message_count?: number;
  participants?: { data: { id: string; name?: string }[] };
};
type GraphMessage = {
  id: string;
  message?: string;
  from?: { id: string; name?: string };
  created_time: string;
  attachments?: { data: unknown[] };
};

export type SyncOptions = {
  /** How far back messages are loaded (first run, and customers who write again after a long time). */
  backfillDays?: number;
  maxConversations?: number;
  timeBudgetMs?: number;
};

export type SyncResult = {
  conversations: number;
  messages: number;
  complete: boolean;
  highWater: string | null;
};

async function graph<T>(urlOrPath: string, token: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(urlOrPath.startsWith("http") ? urlOrPath : GRAPH + urlOrPath);
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const json = await res.json();
  if (json.error) throw new Error(`Graph ${url.pathname}: ${json.error.code} ${json.error.message}`);
  return json as T;
}

export async function syncMessenger(opts: SyncOptions = {}): Promise<SyncResult> {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;
  if (!token || !pageId) throw new Error("META_PAGE_ACCESS_TOKEN and META_PAGE_ID must be set");

  const { backfillDays = 14, maxConversations = 300, timeBudgetMs = 45_000 } = opts;
  const deadline = Date.now() + timeBudgetMs;
  const db = createAdminClient();

  const { data: state } = await db.from("messenger_sync_state").select("high_water").eq("page_id", pageId).maybeSingle();
  const highWater = state?.high_water ? new Date(state.high_water) : null;
  const since = highWater
    ? new Date(highWater.getTime() - OVERLAP_MS)
    : new Date(Date.now() - backfillDays * 86_400_000);
  const historyCutoff = new Date(Date.now() - backfillDays * 86_400_000);

  // 1. Conversations changed since the last run, newest first.
  const changed: GraphConversation[] = [];
  let next: string | undefined = `/${pageId}/conversations`;
  let params: Record<string, string> | undefined = {
    platform: "messenger",
    fields: "id,updated_time,message_count,participants",
    limit: "25",
  };
  let reachedOld = false;
  while (next && !reachedOld && changed.length < maxConversations) {
    const page: GraphPage<GraphConversation> = await graph(next, token, params);
    for (const c of page.data) {
      if (new Date(c.updated_time) <= since) { reachedOld = true; break; }
      changed.push(c);
      if (changed.length >= maxConversations) break;
    }
    next = page.paging?.next;
    params = undefined; // `next` already carries the query
  }

  // 2. New messages per conversation. Skip ones already copied up to this updated_time.
  const { data: stored } = changed.length
    ? await db.from("messenger_conversations").select("id,messages_synced_through").in("id", changed.map((c) => c.id))
    : { data: [] };
  const syncedThrough = new Map((stored ?? []).map((s) => [s.id, s.messages_synced_through as string | null]));

  let messageCount = 0;
  let done = 0;
  for (const c of changed) {
    const through = syncedThrough.get(c.id);
    if (through && new Date(through) >= new Date(c.updated_time)) { done++; continue; }
    if (Date.now() > deadline) break;
    const customer = c.participants?.data.find((p) => p.id !== pageId);
    const { error: convErr } = await db.from("messenger_conversations").upsert({
      id: c.id,
      channel: "messenger",
      account_id: pageId,
      customer_psid: customer?.id ?? null,
      customer_name: customer?.name ?? null,
      message_count: c.message_count ?? null,
      updated_time: c.updated_time,
      synced_at: new Date().toISOString(),
    });
    if (convErr) throw convErr;

    let url: string | undefined = `/${c.id}/messages`;
    let mParams: Record<string, string> | undefined = { fields: MESSAGE_FIELDS, limit: "25" };
    let stop = false;
    let cut = false;
    while (url && !stop) {
      const page: GraphPage<GraphMessage> = await graph(url, token, mParams);
      const ids = page.data.map((m) => m.id);
      const { data: known } = ids.length
        ? await db.from("messenger_messages").select("id").in("id", ids)
        : { data: [] };
      const knownIds = new Set((known ?? []).map((k) => k.id));

      // Messages come newest first. Never go further back than the history window,
      // so an old customer writing again doesn't pull years of history.
      const fresh = page.data.filter((m) => !knownIds.has(m.id) && new Date(m.created_time) > historyCutoff);
      if (fresh.length) {
        const { error } = await db.from("messenger_messages").upsert(
          fresh.map((m) => ({
            id: m.id,
            conversation_id: c.id,
            channel: "messenger",
            from_id: m.from?.id ?? null,
            from_name: m.from?.name ?? null,
            from_page: m.from?.id === pageId,
            text: m.message ? m.message : null,
            attachments: m.attachments?.data ?? null,
            created_time: m.created_time,
            synced_at: new Date().toISOString(),
          })),
        );
        if (error) throw error;
        messageCount += fresh.length;
      }

      const reachedOldMessage = page.data.some((m) => new Date(m.created_time) <= historyCutoff);
      stop = knownIds.size > 0 || reachedOldMessage;
      url = page.paging?.next;
      mParams = undefined;
      if (!stop && url && Date.now() > deadline) { cut = true; break; }
    }
    if (cut) break;
    await db.from("messenger_conversations").update({ messages_synced_through: c.updated_time }).eq("id", c.id);
    done++;
  }

  // 3. Move the high-water mark only when every changed conversation was handled,
  //    otherwise the next run would skip the ones we didn't reach.
  const complete = done === changed.length && changed.length < maxConversations;
  const newHighWater = complete && changed.length ? changed[0].updated_time : state?.high_water ?? (complete ? since.toISOString() : null);
  await db.from("messenger_sync_state").upsert({
    page_id: pageId,
    high_water: newHighWater,
    last_run_at: new Date().toISOString(),
    last_error: null,
  });

  return { conversations: done, messages: messageCount, complete, highWater: newHighWater };
}

/** Remember the error on the state row so admins can see why syncing stopped. */
export async function recordSyncError(message: string) {
  const pageId = process.env.META_PAGE_ID;
  if (!pageId) return;
  await createAdminClient()
    .from("messenger_sync_state")
    .upsert({ page_id: pageId, last_run_at: new Date().toISOString(), last_error: message.slice(0, 1000) });
}
