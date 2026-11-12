import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { credentials } from '@/lib/messenger/providers/meta';
import { templates } from '@/lib/messenger/templates';
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.profile.role !== 'admin') return NextResponse.json({}, { status: 403 });
  try {
    const { data } = await createAdminClient().from('messenger_conversations').select('channel,account_id').eq('id', req.nextUrl.searchParams.get('conversation') || '').single();
    if (!data || data.channel !== 'whatsapp') throw new Error();
    const { token, waba } = await credentials(data.channel, data.account_id);
    return NextResponse.json({ templates: await templates(token, waba) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'templates' }, { status: 400 }); }
}
