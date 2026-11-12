import { NextRequest, NextResponse } from 'next/server';
import { whatsappSignatureOk } from '@/lib/messenger/whatsapp';
import { processWebhook } from '@/lib/messenger/webhook-events';
export const maxDuration = 60;
export async function GET(req: NextRequest) {
 const p=req.nextUrl.searchParams;
 if (!process.env.MESSENGER_VERIFY_TOKEN || p.get('hub.verify_token')!==process.env.MESSENGER_VERIFY_TOKEN || p.get('hub.mode')!=='subscribe') return new NextResponse(null,{status:403});
 return new NextResponse(p.get('hub.challenge'));
}
export async function POST(req: NextRequest) {
 const raw=await req.text();
 if(!process.env.META_APP_SECRET || !whatsappSignatureOk(raw,req.headers.get('x-hub-signature-256'),process.env.META_APP_SECRET)) return new NextResponse(null,{status:403});
 try { const body=JSON.parse(raw); if(body.object!=='page') return new NextResponse(null,{status:400}); await processWebhook('messenger',body); return NextResponse.json({ok:true}); }
 catch { return new NextResponse(null,{status:500}); }
}
