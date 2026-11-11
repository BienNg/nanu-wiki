import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertThreads, type InboundMessage, type InboundThread } from "@/lib/messenger/inbound";

/**
 * Pulls 1:1 chats from every Zalo Official Account listed in ZALO_OAS.
 * Each OA has its own access token (25h) and a rotating refresh token, stored in
 * messenger_accounts so a later run does not reuse a token Zalo already replaced.
 * listrecentchat returns the newest messages across customers, 10 per call.
 */

const RECENT = "https://openapi.zalo.me/v2.0/oa/listrecentchat";
const TOKEN_URL = "https://oauth.zaloapp.com/v4/oa/access_token";
const PAGE = 10;
const MAX_PAGES = 30;

type OaConfig = { oa_id: string; name?: string; refresh_token: string };
type ZaloChat = {
  message_id?: string | number;
  src?: number;
  time?: number;
  type?: string;
  message?: string;
  from_id?: string | number;
  to_id?: string | number;
  from_display_name?: string;
  to_display_name?: string;
  url?: string;
  thumb?: string;
  description?: string;
  links?: string[];
};

export type ZaloSyncResult = {
  accounts: number;
  messages: number;
  skipped: boolean;
  errors: { oaId: string; error: string }[];
};

export function parseZaloAccounts(raw: string | undefined): OaConfig[] {
  if (!raw?.trim()) return [];
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) throw new Error("ZALO_OAS must be a JSON array");
  return parsed.map((item, index) => {
    const row = item as Partial<OaConfig>;
    if (!row.oa_id || !row.refresh_token) throw new Error(`ZALO_OAS[${index}] needs oa_id and refresh_token`);
    return { oa_id: String(row.oa_id), name: row.name, refresh_token: row.refresh_token };
  });
}

function isoFromZalo(time: number | undefined): string | null {
  if (!time || !Number.isFinite(time)) return null;
  const ms = time > 1e12 ? time : time * 1000;
  return new Date(ms).toISOString();
}

/** One recent-chat row becomes a thread with a single message. src 0 = sent by the OA. */
export function threadFromZaloChat(oa: { oa_id: string; name?: string }, chat: ZaloChat): InboundThread | null {
  const createdTime = isoFromZalo(chat.time);
  if (!chat.message_id || !createdTime) return null;
  const fromOa = chat.src === 0;
  const customerId = String(fromOa ? chat.to_id ?? "" : chat.from_id ?? "");
  if (!customerId) return null;
  const customerName = (fromOa ? chat.to_display_name : chat.from_display_name)?.trim() || null;
  const attachments = attachmentOf(chat);
  const message: InboundMessage = {
    id: `zalo:${oa.oa_id}:${chat.message_id}`,
    fromPage: fromOa,
    fromId: String(chat.from_id ?? "") || null,
    fromName: fromOa ? oa.name ?? null : customerName,
    text: chat.message?.trim() ? chat.message : null,
    attachments,
    createdTime,
  };
  return {
    id: `zalo:${oa.oa_id}:${customerId}`,
    channel: "zalo",
    accountId: oa.oa_id,
    accountName: oa.name ?? null,
    customerId,
    customerName,
    messages: [message],
  };
}

function attachmentOf(chat: ZaloChat): unknown[] | null {
  const href = chat.url || chat.thumb;
  if (!href && chat.type !== "photo" && chat.type !== "GIF" && chat.type !== "voice" && chat.type !== "sticker") return chat.links?.length ? [{ name: "Link", file_url: chat.links[0] }] : null;
  if (!href) return [{ name: chat.type ?? "Anhang" }];
  const image = chat.type === "photo" || chat.type === "GIF" || chat.type === "sticker";
  return [
    {
      mime_type: chat.type === "voice" ? "audio/mpeg" : image ? "image/jpeg" : undefined,
      name: chat.description || chat.type || "Anhang",
      image_data: image ? { url: href } : undefined,
      file_url: image ? undefined : href,
    },
  ];
}

async function refreshAccessToken(oa: OaConfig, refreshToken: string, appId: string, secret: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", secret_key: secret },
    body: new URLSearchParams({ refresh_token: refreshToken, app_id: appId, grant_type: "refresh_token" }),
    cache: "no-store",
  });
  const json = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: string | number; error?: number; error_name?: string; message?: string };
  if (!json.access_token || !json.refresh_token) {
    throw new Error(`Zalo ${oa.oa_id}: ${json.error_name ?? json.message ?? json.error ?? res.status}`);
  }
  const expiresIn = Number(json.expires_in ?? 90_000);
  const tokenExpiresAt = new Date(Date.now() + (Number.isFinite(expiresIn) ? expiresIn : 90_000) * 1000).toISOString();
  const db = createAdminClient();
  const { error } = await db.from("messenger_accounts").upsert({
    id: `zalo:${oa.oa_id}`,
    channel: "zalo",
    external_id: oa.oa_id,
    name: oa.name ?? null,
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    token_expires_at: tokenExpiresAt,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  return json.access_token;
}

async function accessTokenFor(oa: OaConfig, appId: string, secret: string): Promise<string> {
  const db = createAdminClient();
  const { data: row, error } = await db
    .from("messenger_accounts")
    .select("access_token, refresh_token, token_expires_at")
    .eq("id", `zalo:${oa.oa_id}`)
    .maybeSingle();
  if (error) throw error;
  const expires = row?.token_expires_at ? new Date(row.token_expires_at).getTime() : 0;
  if (row?.access_token && expires > Date.now() + 3_600_000) return row.access_token;

  const stored = row?.refresh_token as string | undefined;
  try {
    return await refreshAccessToken(oa, stored || oa.refresh_token, appId, secret);
  } catch (e) {
    if (stored && stored !== oa.refresh_token) return refreshAccessToken(oa, oa.refresh_token, appId, secret);
    throw e;
  }
}

async function recentPage(token: string, offset: number): Promise<ZaloChat[]> {
  const url = `${RECENT}?data=${encodeURIComponent(JSON.stringify({ offset, count: PAGE }))}`;
  const res = await fetch(url, { headers: { access_token: token }, cache: "no-store" });
  const json = (await res.json()) as { error?: number; message?: string; data?: ZaloChat[] };
  if (json.error) throw new Error(`Zalo listrecentchat: ${json.error} ${json.message ?? ""}`.trim());
  return Array.isArray(json.data) ? json.data : [];
}

async function syncOne(oa: OaConfig, token: string, deadline: number, historyCutoff: Date): Promise<number> {
  const db = createAdminClient();
  const threads: InboundThread[] = [];
  let offset = 0;
  for (let page = 0; page < MAX_PAGES && Date.now() < deadline; page++) {
    const chats = await recentPage(token, offset);
    if (!chats.length) break;
    const mapped = chats.map((chat) => threadFromZaloChat(oa, chat)).filter((t): t is InboundThread => t !== null);
    const ids = mapped.flatMap((t) => t.messages.map((m) => m.id));
    const { data: known, error } = ids.length
      ? await db.from("messenger_messages").select("id").in("id", ids)
      : { data: [], error: null };
    if (error) throw error;
    const knownIds = new Set((known ?? []).map((row) => row.id as string));
    let reachedOld = false;
    for (const thread of mapped) {
      const message = thread.messages[0];
      if (knownIds.has(message.id) || new Date(message.createdTime) <= historyCutoff) {
        reachedOld = true;
        continue;
      }
      threads.push(thread);
    }
    offset += chats.length;
    if (reachedOld || chats.length < PAGE) break;
  }
  const count = await upsertThreads(db, threads);
  await db.from("messenger_sync_state").upsert({
    page_id: `zalo:${oa.oa_id}`,
    last_run_at: new Date().toISOString(),
    last_error: null,
  });
  return count;
}

export async function syncZalo(opts: { timeBudgetMs?: number; backfillDays?: number } = {}): Promise<ZaloSyncResult> {
  let accounts: OaConfig[];
  try {
    accounts = parseZaloAccounts(process.env.ZALO_OAS);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await createAdminClient()
      .from("messenger_sync_state")
      .upsert({ page_id: "zalo", last_run_at: new Date().toISOString(), last_error: message.slice(0, 1000) });
    return { accounts: 0, messages: 0, skipped: false, errors: [{ oaId: "-", error: message }] };
  }
  if (!accounts.length) return { accounts: 0, messages: 0, skipped: true, errors: [] };
  const appId = process.env.ZALO_APP_ID;
  const secret = process.env.ZALO_APP_SECRET;
  if (!appId || !secret) throw new Error("ZALO_APP_ID and ZALO_APP_SECRET must be set when ZALO_OAS is set");

  const { timeBudgetMs = 20_000, backfillDays = 14 } = opts;
  const deadline = Date.now() + timeBudgetMs;
  const historyCutoff = new Date(Date.now() - backfillDays * 86_400_000);
  const db = createAdminClient();
  const errors: { oaId: string; error: string }[] = [];
  let messages = 0;

  for (const oa of accounts) {
    if (Date.now() > deadline) {
      errors.push({ oaId: oa.oa_id, error: "time budget" });
      break;
    }
    try {
      const token = await accessTokenFor(oa, appId, secret);
      messages += await syncOne(oa, token, deadline, historyCutoff);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errors.push({ oaId: oa.oa_id, error: message });
      await db
        .from("messenger_sync_state")
        .upsert({ page_id: `zalo:${oa.oa_id}`, last_run_at: new Date().toISOString(), last_error: message.slice(0, 1000) });
    }
  }

  return { accounts: accounts.length, messages, skipped: false, errors };
}
