import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.profile.role !== 'admin' || req.headers.get('origin') !== req.nextUrl.origin) return NextResponse.json({}, { status: 403 });
  if (Number(req.headers.get('content-length')) > 4_300_000) return NextResponse.json({}, { status: 413 });
  try {
    const file = (await req.formData()).get('file');
    if (!(file instanceof File) || file.size > 4 * 1024 * 1024 || !file.size) throw new Error();
    const bytes = Buffer.from(await file.arrayBuffer());
    const mime = bytes.subarray(0,5).toString() === '%PDF-' ? 'application/pdf' : bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png' : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg' : '';
    if (!mime || mime !== file.type) throw new Error();
    const id = randomUUID(); const path = `${session.user.id}/${id}`;
    const db = createAdminClient();
    const result = await db.storage.from('messenger-attachments').upload(path, bytes, { contentType: mime });
    if (result.error) throw result.error;
    const saved = await db.from('messenger_uploads').insert({ id, owner_id: session.user.id, path, name: file.name.slice(0,120), mime });
    if (saved.error) { await db.storage.from('messenger-attachments').remove([path]); throw saved.error; }
    return NextResponse.json({ id, name: file.name });
  } catch { return NextResponse.json({ error: 'upload' }, { status: 400 }); }
}
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.profile.role !== 'admin') return new NextResponse(null, { status: 403 });
  const db = createAdminClient();
  const { data } = await db.from('messenger_uploads').select('path').eq('id', req.nextUrl.searchParams.get('id') || '').maybeSingle();
  if (!data) return new NextResponse(null, { status: 404 });
  const url = await db.storage.from('messenger-attachments').createSignedUrl(data.path, 60);
  return url.data ? NextResponse.redirect(url.data.signedUrl, { headers: { 'Cache-Control': 'private, no-store' } }) : new NextResponse(null, { status: 404 });
}
