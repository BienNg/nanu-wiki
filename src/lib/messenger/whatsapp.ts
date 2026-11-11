import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertThreads, type InboundThread } from "@/lib/messenger/inbound";
import { parseWhatsAppWebhook, type WaBatch, type WaContact } from "./whatsapp-parse";

/**
 * WhatsApp Business → the shared inbox. Meta posts to /api/whatsapp/webhook.
 * `messages` is the customer. `smb_message_echoes` is a reply typed in the
 * WhatsApp Business app. `history` is the one-time coexistence backfill.
 * `smb_app_state_sync` is the name saved on that phone.
 */

const CHUNK = 100;

type Admin = ReturnType<typeof createAdminClient>;
type Existing = { id: string; account_id: string | null; customer_name: string | null; customer_user_id: string | null };

export function whatsappSignatureOk(raw: string, header: string | null, secret: string) {
  if (!header?.startsWith("sha256=")) return false;
  const got = header.slice("sha256=".length);
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  if (got.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

function allowedNumbers() {
  return (process.env.WHATSAPP_PHONE_NUMBER_IDS ?? process.env.WHATSAPP_PHONE_NUMBER_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function relevant(body: unknown): WaBatch[] {
  const allowed = allowedNumbers();
  return parseWhatsAppWebhook(body).filter((batch) => batch.phoneNumberId && (!allowed.length || allowed.includes(batch.phoneNumberId)));
}

async function note(db: Admin, phoneNumberId: string, error: string | null) {
  const { error: dbError } = await db.from("messenger_sync_state").upsert({
    page_id: `wa:${phoneNumberId}`,
    last_run_at: new Date().toISOString(),
    last_error: error ? error.slice(0, 1000) : null,
  });
  if (dbError) throw new Error(dbError.message);
}

/** How many messages were saved. Status-only webhooks return 0. */
export async function ingestWhatsappPayload(body: unknown): Promise<number> {
  const batches = relevant(body);
  if (!batches.length) return 0;
  const db = createAdminClient();
  try {
    const count = await writeBatches(db, batches);
    for (const batch of batches) await note(db, batch.phoneNumberId!, null);
    return count;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await Promise.all(batches.map((batch) => note(db, batch.phoneNumberId!, message).catch(() => {})));
    throw e;
  }
}

async function loadExisting(db: Admin, batches: WaBatch[]) {
  const ids = new Set<string>();
  const userIds = new Set<string>();
  for (const batch of batches) {
    const accountId = batch.phoneNumberId!;
    for (const message of batch.messages) {
      if (message.phone) ids.add(`wa:${accountId}:${message.phone}`);
      if (message.userId) userIds.add(message.userId);
    }
    for (const contact of batch.contacts) ids.add(`wa:${accountId}:${contact.phone}`);
  }

  const rows: Existing[] = [];
  const select = "id, account_id, customer_name, customer_user_id";
  for (let i = 0; i < [...ids].length; i += CHUNK) {
    const part = [...ids].slice(i, i + CHUNK);
    const { data, error } = await db.from("messenger_conversations").select(select).in("id", part);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as Existing[]));
  }
  for (let i = 0; i < [...userIds].length; i += CHUNK) {
    const part = [...userIds].slice(i, i + CHUNK);
    const { data, error } = await db.from("messenger_conversations").select(select).eq("channel", "whatsapp").in("customer_user_id", part);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as Existing[]));
  }
  return new Map(rows.map((row) => [row.id, row]));
}

function threadsFrom(batches: WaBatch[], existing: Map<string, Existing>): {
  threads: InboundThread[];
  byPhone: Map<string, InboundThread>;
  userIds: { id: string; userId: string }[];
} {
  const idByUser = new Map<string, string>();
  for (const row of existing.values()) {
    if (row.customer_user_id && row.account_id) idByUser.set(`${row.account_id}:${row.customer_user_id}`, row.id);
  }

  const threads = new Map<string, InboundThread>();
  const byPhone = new Map<string, InboundThread>();
  const userIds: { id: string; userId: string }[] = [];

  for (const batch of batches) {
    const accountId = batch.phoneNumberId!;
    const ordered = [...batch.messages].sort((a, b) => a.created_time.localeCompare(b.created_time));
    for (const message of ordered) {
      if (!message.phone && !message.userId) continue;
      const id =
        (message.userId && idByUser.get(`${accountId}:${message.userId}`)) ||
        (message.phone ? `wa:${accountId}:${message.phone}` : `wa:${accountId}:${message.userId}`);
      if (message.userId) idByUser.set(`${accountId}:${message.userId}`, id);
      const prior = existing.get(id);
      const thread = threads.get(id) ?? {
        id,
        channel: "whatsapp" as const,
        accountId,
        accountName: batch.displayPhone,
        customerId: message.phone ?? message.userId,
        customerName: message.name ?? prior?.customer_name ?? message.phone ?? message.userId,
        messages: [],
      };
      if (message.phone) thread.customerId = message.phone;
      if (message.name) thread.customerName = message.name;
      else if (!thread.customerName) thread.customerName = prior?.customer_name ?? message.phone ?? message.userId;
      thread.messages.push({
        id: message.id,
        fromPage: message.fromPage,
        fromId: message.fromPage ? accountId : message.userId ?? message.phone,
        fromName: message.fromPage ? batch.displayPhone : message.name,
        text: message.text,
        attachments: message.attachments,
        createdTime: message.created_time,
      });
      threads.set(id, thread);
      if (message.phone) byPhone.set(`${accountId}:${message.phone}`, thread);
      if (message.userId) userIds.push({ id, userId: message.userId });
    }
  }
  return { threads: [...threads.values()], byPhone, userIds };
}

function applyContactNames(batches: WaBatch[], byPhone: Map<string, InboundThread>) {
  const pending: { accountId: string; contact: WaContact }[] = [];
  for (const batch of batches) {
    for (const contact of batch.contacts) {
      const thread = byPhone.get(`${batch.phoneNumberId}:${contact.phone}`);
      if (thread) {
        if (!thread.customerName || thread.customerName === contact.phone) thread.customerName = contact.name;
      } else pending.push({ accountId: batch.phoneNumberId!, contact });
    }
  }
  return pending;
}

async function writeBatches(db: Admin, batches: WaBatch[]): Promise<number> {
  const existing = await loadExisting(db, batches);
  const { threads, byPhone, userIds } = threadsFrom(batches, existing);
  const pendingContacts = applyContactNames(batches, byPhone);

  let count = 0;
  for (let i = 0; i < threads.length; i += CHUNK) count += await upsertThreads(db, threads.slice(i, i + CHUNK));

  const seenUsers = new Set<string>();
  for (const row of userIds) {
    const key = `${row.id}:${row.userId}`;
    if (seenUsers.has(key)) continue;
    seenUsers.add(key);
    const { error } = await db.from("messenger_conversations").update({ customer_user_id: row.userId }).eq("id", row.id).is("customer_user_id", null);
    if (error) throw new Error(error.message);
  }

  for (const batch of batches) {
    for (const edit of batch.edits) {
      const { error } = await db.from("messenger_messages").update({ text: edit.text, attachments: edit.attachments }).eq("id", edit.id);
      if (error) throw new Error(error.message);
    }
    for (let i = 0; i < batch.revokes.length; i += CHUNK) {
      const { error } = await db
        .from("messenger_messages")
        .update({ text: "Nachricht gelöscht", attachments: null })
        .in("id", batch.revokes.slice(i, i + CHUNK));
      if (error) throw new Error(error.message);
    }
  }

  for (const { accountId, contact } of pendingContacts) {
    const { error } = await db
      .from("messenger_conversations")
      .update({ customer_name: contact.name })
      .eq("channel", "whatsapp")
      .eq("account_id", accountId)
      .eq("customer_psid", contact.phone);
    if (error) throw new Error(error.message);
  }
  return count;
}
