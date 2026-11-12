import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { credentials, enabled, meta, MetaError } from '@/lib/messenger/providers/meta';
export async function GET(req: NextRequest) {
 const session=await getSession();
 if(!session || session.profile.role!=='admin') return NextResponse.json({}, {status:403});
 try {
  const db=createAdminClient();
  const {data:conv}=await db.from('messenger_conversations').select('channel,account_id').eq('id',req.nextUrl.searchParams.get('conversation') || '').single();
  if(!conv) throw new Error('conversation');
  if(!conv.account_id) throw new Error('account_missing');
  const {token}=await credentials(conv.channel,conv.account_id);
  await meta(`${encodeURIComponent(conv.account_id)}?fields=id`,token);
  const state=await db.from('messenger_sync_state').select('last_run_at,last_error').eq('page_id',conv.channel==='whatsapp'?`wa:${conv.account_id}`:conv.account_id).maybeSingle();
  return NextResponse.json({ reachable:true, enabled:enabled(conv.channel), lastSync:state.data?.last_run_at, syncError:!!state.data?.last_error },{headers:{'Cache-Control':'no-store'}});
 } catch (e) {
  // Admin-only: expose a short reason code (never token contents) to make setup diagnosable.
  const reason = e instanceof MetaError ? `meta_${e.code}` : e instanceof Error && e.message ? e.message : 'unknown';
  return NextResponse.json({reachable:false, reason},{headers:{'Cache-Control':'no-store'}});
 }
}
