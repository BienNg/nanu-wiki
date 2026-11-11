/** Turns a WhatsApp Cloud API webhook body into inbox rows. No I/O. */

export type WaAttachment = { mime_type?: string; name?: string };

export type WaMessage = {
  id: string;
  phone: string | null;
  userId: string | null;
  fromPage: boolean;
  name: string | null;
  text: string | null;
  attachments: WaAttachment[] | null;
  created_time: string;
};

export type WaEdit = { id: string; text: string | null; attachments: WaAttachment[] | null };

export type WaContact = { phone: string; name: string };

export type WaBatch = {
  phoneNumberId: string | null;
  displayPhone: string | null;
  messages: WaMessage[];
  edits: WaEdit[];
  revokes: string[];
  contacts: WaContact[];
};

type Rec = Record<string, unknown>;

function rec(v: unknown): Rec | null {
  return v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Rec) : null;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** Digits only, or null when this is a BSUID / display name rather than a phone number. */
export function phoneDigits(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  const digits = s.replace(/\D/g, "");
  if (digits.length < 6 || digits.length < s.replace(/[\s+\-().]/g, "").length) return null;
  return digits;
}

function samePhone(a: unknown, b: string | null): boolean {
  const digits = phoneDigits(a);
  return Boolean(digits && b && digits === b);
}

function unixToIso(v: unknown): string {
  const n = typeof v === "string" || typeof v === "number" ? Number(v) : NaN;
  if (!Number.isFinite(n) || n <= 0) return new Date(0).toISOString();
  return new Date(n * 1000).toISOString();
}

const MEDIA: Record<string, { mime: string; name: string }> = {
  image: { mime: "image/jpeg", name: "Bild" },
  video: { mime: "video/mp4", name: "Video" },
  audio: { mime: "audio/ogg", name: "Audio" },
  sticker: { mime: "image/webp", name: "Sticker" },
  document: { mime: "application/octet-stream", name: "Dokument" },
};

function contentOf(msg: Rec): { text: string | null; attachments: WaAttachment[] | null } {
  const type = str(msg.type) ?? "";
  const body = rec(msg[type]) ?? {};

  if (type === "text") return { text: str(body.body), attachments: null };

  const media = MEDIA[type];
  if (media) {
    return {
      text: str(body.caption),
      attachments: [{ mime_type: str(body.mime_type) ?? media.mime, name: str(body.filename) ?? media.name }],
    };
  }

  if (type === "location") {
    const place = [str(body.name), str(body.address)].filter(Boolean).join(", ");
    const coords = [body.latitude, body.longitude].every((n) => typeof n === "number") ? `${body.latitude}, ${body.longitude}` : null;
    return { text: place || coords || "Standort", attachments: null };
  }

  if (type === "contacts" && Array.isArray(msg.contacts)) {
    const names = msg.contacts
      .map((c) => str(rec(rec(c)?.name)?.formatted_name) ?? str(rec(c)?.first_name))
      .filter((n): n is string => Boolean(n));
    return { text: names.length ? names.join(", ") : "Kontakt", attachments: null };
  }

  if (type === "button") return { text: str(body.text) ?? str(body.payload), attachments: null };

  if (type === "interactive") {
    const reply = rec(body.button_reply) ?? rec(body.list_reply);
    return { text: str(reply?.title) ?? str(body.body) ?? "Antwort", attachments: null };
  }

  if (type === "reaction") return { text: str(body.emoji) ?? "Reaktion entfernt", attachments: null };

  if (type === "template") return { text: str(body.name) ? `Vorlage: ${str(body.name)}` : "Vorlage", attachments: null };

  if (type === "system") return { text: str(body.body) ?? "System", attachments: null };

  if (type === "order") return { text: "Bestellung", attachments: null };

  if (type === "unsupported") {
    const err = rec(Array.isArray(msg.errors) ? msg.errors[0] : null);
    return { text: str(err?.title) ?? "Nicht unterstützte Nachricht", attachments: null };
  }

  return { text: type ? type : null, attachments: null };
}

function nameMaps(contacts: unknown) {
  const byPhone = new Map<string, string>();
  const byUser = new Map<string, string>();
  const phoneByUser = new Map<string, string>();
  const userByPhone = new Map<string, string>();
  if (!Array.isArray(contacts)) return { byPhone, byUser, phoneByUser, userByPhone };
  for (const item of contacts) {
    const c = rec(item);
    if (!c) continue;
    const profile = rec(c.profile);
    const name = str(profile?.name) ?? str(profile?.username);
    const phone = phoneDigits(c.wa_id);
    const userId = str(c.user_id);
    if (phone && name) byPhone.set(phone, name);
    if (userId && name) byUser.set(userId, name);
    if (userId && phone) {
      phoneByUser.set(userId, phone);
      userByPhone.set(phone, userId);
    }
  }
  return { byPhone, byUser, phoneByUser, userByPhone };
}

function pushMessage(
  batch: WaBatch,
  msg: Rec,
  who: { phone: string | null; userId: string | null; fromPage: boolean; name: string | null },
) {
  if (msg.group_id) return;
  const id = str(msg.id);
  if (!id) return;
  const type = str(msg.type);

  if (type === "edit") {
    const edit = rec(msg.edit);
    const original = str(edit?.original_message_id);
    const inner = rec(edit?.message);
    if (original && inner) {
      const content = contentOf(inner);
      batch.edits.push({ id: original, text: content.text, attachments: content.attachments });
    }
    return;
  }

  if (type === "revoke") {
    const original = str(rec(msg.revoke)?.original_message_id);
    if (original) batch.revokes.push(original);
    return;
  }

  const content = contentOf(msg);
  batch.messages.push({
    id,
    phone: who.phone,
    userId: who.userId,
    fromPage: who.fromPage,
    name: who.name,
    text: content.text,
    attachments: content.attachments,
    created_time: unixToIso(msg.timestamp),
  });
}

function person(msg: Rec, maps: ReturnType<typeof nameMaps>, businessPhone: string | null, fromPage: boolean) {
  const rawFrom = fromPage ? msg.to : msg.from;
  const rawUser = fromPage ? msg.to_user_id : msg.from_user_id;
  let phone = phoneDigits(rawFrom);
  let userId = str(rawUser);
  if (!phone && userId) phone = maps.phoneByUser.get(userId) ?? null;
  if (!userId && phone) userId = maps.userByPhone.get(phone) ?? null;
  if (!phone && !userId && !fromPage) userId = str(msg.from);
  const name = (userId && maps.byUser.get(userId)) || (phone && maps.byPhone.get(phone)) || null;
  // A customer message whose `from` is the business number is not a customer.
  if (!fromPage && businessPhone && samePhone(msg.from, businessPhone)) return null;
  return { phone, userId, fromPage, name };
}

function readChange(change: Rec, batch: WaBatch) {
  const value = rec(change.value);
  if (!value || value.group_id) return;
  const metadata = rec(value.metadata);
  batch.phoneNumberId = str(metadata?.phone_number_id);
  batch.displayPhone = phoneDigits(metadata?.display_phone_number);
  const businessPhone = phoneDigits(rec(value.metadata)?.display_phone_number);
  const maps = nameMaps(value.contacts);

  if (Array.isArray(value.messages)) {
    for (const item of value.messages) {
      const msg = rec(item);
      if (!msg) continue;
      const who = person(msg, maps, businessPhone, false);
      if (who) pushMessage(batch, msg, who);
    }
  }

  if (Array.isArray(value.message_echoes)) {
    for (const item of value.message_echoes) {
      const msg = rec(item);
      if (!msg) continue;
      const who = person(msg, maps, businessPhone, true);
      if (who) pushMessage(batch, msg, who);
    }
  }

  if (Array.isArray(value.history)) {
    for (const block of value.history) {
      const threads = rec(block)?.threads;
      if (!Array.isArray(threads)) continue;
      for (const thread of threads) {
        const t = rec(thread);
        const threadPhone = phoneDigits(t?.id);
        const messages = t?.messages;
        if (!threadPhone || !Array.isArray(messages)) continue;
        for (const item of messages) {
          const msg = rec(item);
          if (!msg) continue;
          // `from` is the business number on outgoing history, the customer's number on incoming.
          const fromPage = businessPhone ? samePhone(msg.from, businessPhone) : !samePhone(msg.from, threadPhone);
          pushMessage(batch, msg, { phone: threadPhone, userId: null, fromPage, name: maps.byPhone.get(threadPhone) ?? null });
        }
      }
    }
  }

  if (Array.isArray(value.state_sync)) {
    for (const item of value.state_sync) {
      const row = rec(item);
      const contact = rec(row?.contact);
      if (!row || row.type !== "contact" || row.action === "remove" || !contact) continue;
      const phone = phoneDigits(contact.phone_number);
      const name = str(contact.full_name) ?? str(contact.first_name);
      if (phone && name) batch.contacts.push({ phone, name });
    }
  }
}

/** One webhook body. Unknown objects yield an empty list (Meta still gets 200). */
export function parseWhatsAppWebhook(body: unknown): WaBatch[] {
  const root = rec(body);
  const entries = root?.object === "whatsapp_business_account" && Array.isArray(root.entry) ? root.entry : [];
  const batches: WaBatch[] = [];
  for (const entry of entries) {
    const changes = rec(entry)?.changes;
    if (!Array.isArray(changes)) continue;
    for (const change of changes) {
      const node = rec(change);
      if (!node) continue;
      const batch: WaBatch = { phoneNumberId: null, displayPhone: null, messages: [], edits: [], revokes: [], contacts: [] };
      readChange(node, batch);
      if (batch.messages.length || batch.edits.length || batch.revokes.length || batch.contacts.length) batches.push(batch);
    }
  }
  return batches;
}
