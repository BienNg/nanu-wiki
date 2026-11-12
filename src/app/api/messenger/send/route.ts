import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sendMessage, sendSchema } from '@/lib/messenger/send';
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.profile.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (req.headers.get('origin') !== req.nextUrl.origin) return NextResponse.json({ error: 'origin' }, { status: 403 });
  try {
    const parsed = sendSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'payload' }, { status: 400 });
    return NextResponse.json(await sendMessage(parsed.data, { id: session.user.id, name: session.profile.full_name || session.user.email || 'Admin' }));
  } catch(e) {
    const code = e instanceof Error ? e.message : '';
    return NextResponse.json({ error: ['window','disabled','connection','template','conflict','attachment_text','empty','attachment'].includes(code) ? code : 'send_error' }, { status: 400 });
  }
}
