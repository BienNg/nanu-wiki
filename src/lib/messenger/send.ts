import 'server-only';
import { createHash } from 'crypto';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { replyWindow } from './policy';
import { credentials, enabled, meta, MetaError } from './providers/meta';
import { templates } from './templates';
export const sendSchema = z.object({ id: z.string().uuid(), conversation: z.string().min(1).max(200), text: z.string().trim().max(2000).default(''), upload: z.string().uuid().optional(), template: z.object({ name: z.string().max(512), language: z.string().max(30), values: z.array(z.string().trim().min(1).max(500)).max(30), consent: z.literal(true) }).optional() }).strict();
export async function sendMessage(input: z.infer<typeof sendSchema>, user: { id: string; name: string }) {
  const db = createAdminClient();
  const hash = createHash('sha256').update(JSON.stringify(input)).digest('hex');
  const prior = await db.from('messenger_outbox').select('*').eq('id', input.id).maybeSingle();
  if (prior.error) throw new Error('database');
  if (prior.data) {
    if (prior.data.sent_by !== user.id || prior.data.payload_hash !== hash) throw new Error('conflict');
    return { status: prior.data.status, id: input.id };
  }
  const recent = await db.from('messenger_outbox').select('id', { count: 'exact', head: true }).eq('sent_by', user.id).gte('created_at', new Date(Date.now()-60000).toISOString());
  if (recent.error || (recent.count || 0) >= 30) throw new Error('rate_limit');
  const { data: conv, error } = await db.from('messenger_conversations').select('*').eq('id', input.conversation).single();
  if (error || !conv || !conv.customer_psid || !conv.account_id) throw new Error('conversation');
  if (!enabled(conv.channel)) throw new Error('disabled');
  if (input.template && (input.text || input.upload)) throw new Error('payload');
  if (!input.template && !input.text && !input.upload) throw new Error('empty');
  // Send one provider message per attempt; attachment captions differ by provider.
  if (input.upload && input.text) throw new Error('attachment_text');
  const { token, waba } = await credentials(conv.channel, conv.account_id);
  let body: Record<string, unknown>;
  let displayText = input.text;
  let attachments = null;
  if (input.template) {
    if (conv.channel !== 'whatsapp') throw new Error('template');
    const chosen = (await templates(token, waba)).find(t => t.name === input.template!.name && t.language === input.template!.language);
    if (!chosen || chosen.variables.length !== input.template.values.length) throw new Error('template');
    displayText = chosen.body.replace(/\{\{(\d+)\}\}/g, (_, n) => input.template!.values[chosen.variables.indexOf(n)]);
    body = { messaging_product: 'whatsapp', to: conv.customer_psid, type: 'template', template: { name: chosen.name, language: { code: chosen.language }, ...(chosen.variables.length ? { components: [{ type: 'body', parameters: input.template.values.map(text => ({ type: 'text', text })) }] } : {}) } };
  } else {
    const { data: last, error: lastError } = await db.from('messenger_messages').select('created_time').eq('conversation_id', conv.id).eq('from_page', false).order('created_time', { ascending: false }).limit(1).maybeSingle();
    if (lastError) throw new Error('database');
    if (!replyWindow(last?.created_time || null).open) throw new Error('window');
    let media: { url: string; name: string; mime: string } | null = null;
    if (input.upload) {
      const { data: file } = await db.from('messenger_uploads').select('*').eq('id', input.upload).eq('owner_id', user.id).single();
      if (!file) throw new Error('attachment');
      const signed = await db.storage.from('messenger-attachments').createSignedUrl(file.path, 86400);
      if (signed.error) throw new Error('attachment');
      media = { url: signed.data.signedUrl, name: file.name, mime: file.mime };
      attachments = [{ mime_type: file.mime, name: file.name, ...(file.mime.startsWith('image/') ? { image_data: { url: `/api/messenger/upload?id=${file.id}` } } : { file_url: `/api/messenger/upload?id=${file.id}` }) }];
    }
    body = conv.channel === 'messenger'
      ? { recipient: { id: conv.customer_psid }, messaging_type: 'RESPONSE', message: media ? { attachment: { type: media.mime.startsWith('image/') ? 'image' : 'file', payload: { url: media.url, is_reusable: true } } } : { text: input.text } }
      : { messaging_product: 'whatsapp', to: conv.customer_psid, type: media ? (media.mime.startsWith('image/') ? 'image' : 'document') : 'text', ...(media ? (media.mime.startsWith('image/') ? { image: { link: media.url } } : { document: { link: media.url, filename: media.name } }) : { text: { body: input.text } }) };
  }
  if (conv.channel === 'whatsapp') body.biz_opaque_callback_data = input.id;
  else (body.message as Record<string, unknown>).metadata = input.id;
  const { error: insertError } = await db.from('messenger_outbox').insert({ id: input.id, conversation_id: conv.id, sent_by: user.id, sender_name: user.name, payload: { ...input, displayText, attachments }, payload_hash: hash });
  if (insertError) {
    if (insertError.code === '23505') return sendMessage(input, user);
    throw new Error('database');
  }
  let providerId: string;
  try {
    const result = await meta(`${encodeURIComponent(conv.account_id)}/messages`, token, body);
    providerId = conv.channel === 'messenger' ? result.message_id : result.messages?.[0]?.id;
    if (!providerId) throw new MetaError(0, true);
  } catch (e) {
    const uncertain = !(e instanceof MetaError) || e.uncertain;
    const status = uncertain ? 'unknown' : 'failed';
    await db.from('messenger_outbox').update({ status, error: e instanceof MetaError ? `Meta ${e.code}` : 'Connection error', updated_at: new Date().toISOString() }).eq('id', input.id).in('status', ['sending','unknown']);
    const current = await db.from('messenger_outbox').select('status').eq('id', input.id).single();
    return { id: input.id, status: current.data?.status || status };
  }
  const saved = await db.from('messenger_outbox').update({ provider_message_id: providerId, updated_at: new Date().toISOString() }).eq('id', input.id);
  if (saved.error) return { id: input.id, status: 'unknown' };
  // A callback may already have advanced the status; the RPC never regresses it.
  const marked = await db.rpc('messenger_delivery', { mid: providerId, new_status: 'sent' });
  if (marked.error) return { id: input.id, status: 'unknown' };
  const now = new Date().toISOString();
  await db.from('messenger_messages').upsert({ id: providerId, conversation_id: conv.id, channel: conv.channel, from_page: true, from_id: conv.account_id, from_name: conv.account_name, text: displayText || null, attachments, created_time: now });
  await db.from('messenger_conversations').update({ updated_time: now }).eq('id', conv.id).lt('updated_time', now);
  const latest = await db.from('messenger_outbox').select('status').eq('id', input.id).single();
  return { id: input.id, status: latest.data?.status || 'sent', messageId: providerId };
}
