import 'server-only';
import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { ingestWhatsappPayload } from './whatsapp';
import { syncMessenger } from './sync';
/** Persist before processing; retries replay safely after any interrupted write. */
export async function processWebhook(channel: 'whatsapp' | 'messenger', body: unknown) {
  const db = createAdminClient();
  const id = createHash('sha256').update(channel + JSON.stringify(body)).digest('hex');
  const stored = await db.from('messenger_webhook_events').upsert({ id, channel, payload: body }, { onConflict: 'id', ignoreDuplicates: true });
  if (stored.error) throw stored.error;
  const prior = await db.from('messenger_webhook_events').select('processed_at').eq('id', id).single();
  if (prior.data?.processed_at) return;
  if (channel === 'whatsapp') await ingestWhatsappPayload(body);
  await applyStatuses(channel, body);
  // Delivery/read/echo callbacks do not need a full conversation sync.
  if (channel === 'messenger' && hasInboundMessage(body)) await syncMessenger({ timeBudgetMs: 20000 });
  const done = await db.from('messenger_webhook_events').update({ processed_at: new Date().toISOString() }).eq('id', id);
  if (done.error) throw done.error;
}
export async function applyStatuses(channel: string, body: unknown) {
  const db = createAdminClient();
  const root = body as { entry?: Array<{ id?: string; changes?: Array<{ value?: { metadata?: { phone_number_id?: string }; statuses?: Array<{id: string; status: string; biz_opaque_callback_data?: string}> } }>; messaging?: Array<{ message?: { mid?: string; is_echo?: boolean; metadata?: string }; delivery?: { mids?: string[] }; read?: { watermark?: number }; sender?: {id?: string}; recipient?: {id?: string} }> }> };
  for (const entry of root?.entry || []) {
    if (channel === 'whatsapp') for (const change of entry.changes || []) {
      const account = change.value?.metadata?.phone_number_id;
      for (const status of change.value?.statuses || []) {
        // Callback correlation is supplied by our own send request, never inferred from text.
        if (status.biz_opaque_callback_data && /^[0-9a-f-]{36}$/.test(status.biz_opaque_callback_data)) {
          const pending = await db.from('messenger_outbox').select('id,conversation_id,status').eq('id', status.biz_opaque_callback_data).maybeSingle();
          if (pending.data) {
            const conv = await db.from('messenger_conversations').select('account_id,channel').eq('id', pending.data.conversation_id).single();
            if (conv.data?.channel === 'whatsapp' && conv.data.account_id === account) {
              const result = await db.from('messenger_outbox').update({ provider_message_id: status.id }).eq('id', pending.data.id).is('provider_message_id', null);
              if (result.error) throw result.error;
            }
          }
        }
        const result = await db.rpc('messenger_delivery', { mid: status.id, new_status: status.status });
        if (result.error) throw result.error;
        if (['sent','delivered','read'].includes(status.status)) await restoreMessage(status.id);
      }
    }
    if (channel === 'messenger' && entry.id === process.env.META_PAGE_ID) for (const event of entry.messaging || []) {
      if (event.message?.is_echo && event.message.mid && event.message.metadata && /^[0-9a-f-]{36}$/.test(event.message.metadata)) {
        const pending = await db.from('messenger_outbox').select('conversation_id').eq('id',event.message.metadata).maybeSingle();
        if (pending.data) {
          const conv = await db.from('messenger_conversations').select('channel,account_id,customer_psid').eq('id',pending.data.conversation_id).single();
          if(conv.data?.channel==='messenger' && conv.data.account_id===entry.id && conv.data.customer_psid===event.recipient?.id) {
            const linked=await db.from('messenger_outbox').update({provider_message_id:event.message.mid}).eq('id',event.message.metadata).is('provider_message_id',null);
            if(linked.error) throw linked.error;
            const sent=await db.rpc('messenger_delivery',{mid:event.message.mid,new_status:'sent'});
            if(sent.error) throw sent.error;
            await restoreMessage(event.message.mid);
          }
        }
      }
      for (const mid of event.delivery?.mids || []) { const result = await db.rpc('messenger_delivery', { mid, new_status: 'delivered' }); if (result.error) throw result.error; }
      if (event.read?.watermark && event.sender?.id) {
        const conversations = await db.from('messenger_conversations').select('id').eq('channel','messenger').eq('account_id',entry.id).eq('customer_psid',event.sender.id);
        for (const conv of conversations.data || []) {
          const result = await db.from('messenger_outbox').update({ status: 'read', updated_at: new Date().toISOString() }).eq('conversation_id',conv.id).not('provider_message_id','is',null).neq('status','failed').lte('created_at',new Date(event.read.watermark).toISOString());
          if (result.error) throw result.error;
        }
      }
    }
  }
}

async function restoreMessage(mid: string) {
 const db=createAdminClient();
 const {data: out}=await db.from('messenger_outbox').select('*').eq('provider_message_id',mid).maybeSingle();
 if(!out) return;
 const {data: conv}=await db.from('messenger_conversations').select('*').eq('id',out.conversation_id).single();
 if(!conv) return;
 const saved=await db.from('messenger_messages').upsert({ id:mid,conversation_id:conv.id,channel:conv.channel,from_page:true,from_id:conv.account_id,from_name:conv.account_name,text:out.payload.displayText || null,attachments:out.payload.attachments || null,created_time:out.created_at }, {onConflict:'id',ignoreDuplicates:true});
 if(saved.error) throw saved.error;
 const updated=await db.from('messenger_conversations').update({updated_time:out.created_at}).eq('id',conv.id).lt('updated_time',out.created_at);
 if(updated.error) throw updated.error;
}

function hasInboundMessage(body: unknown) {
  const entries = (body as { entry?: Array<{ messaging?: Array<{ message?: { is_echo?: boolean } }> }> })?.entry || [];
  return entries.some(e => (e.messaging || []).some(m => m.message && !m.message.is_echo));
}
