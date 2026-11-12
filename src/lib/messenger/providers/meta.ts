import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
export const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || 'v23.0'}`;
export class MetaError extends Error {
  constructor(public code: number, public uncertain = false) { super(`Meta ${code}`); }
}
export async function meta(path: string, token: string, body?: unknown) {
  let res: Response;
  try {
    res = await fetch(`${GRAPH}/${path}`, { method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined, cache: 'no-store', signal: AbortSignal.timeout(20000) });
  } catch { throw new MetaError(0, !!body); }
  let json;
  try { json = await res.json(); } catch { throw new MetaError(res.status, !!body); }
  if (!res.ok || json.error) throw new MetaError(json.error?.code || res.status, !!body && res.status >= 500);
  return json;
}
export async function credentials(channel: string, account: string) {
  if (channel === 'messenger') {
    if (account !== process.env.META_PAGE_ID || !process.env.META_PAGE_ACCESS_TOKEN) throw new Error('connection');
    return { token: process.env.META_PAGE_ACCESS_TOKEN, waba: '' };
  }
  if (channel !== 'whatsapp') throw new Error('channel');
  const { data } = await createAdminClient().from('messenger_accounts').select('access_token').eq('channel', 'whatsapp').eq('external_id', account).maybeSingle();
  const allowed = (process.env.WHATSAPP_PHONE_NUMBER_IDS || process.env.WHATSAPP_PHONE_NUMBER_ID || '').split(',').map(s => s.trim());
  const token = data?.access_token || (allowed.includes(account) ? process.env.WHATSAPP_ACCESS_TOKEN : null);
  if (!token) throw new Error('connection');
  // Resolve the owning WABA from configuration, scoped to the configured number allowlist.
  return { token: token as string, waba: allowed.includes(account) ? process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '' : '' };
}
export function enabled(channel: string) {
  return channel === 'messenger' ? process.env.MESSENGER_SEND_ENABLED === 'true' : channel === 'whatsapp' && process.env.WHATSAPP_SEND_ENABLED === 'true';
}
