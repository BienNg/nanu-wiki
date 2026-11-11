import { NextResponse, type NextRequest } from "next/server";
import { ingestWhatsappPayload, whatsappSignatureOk } from "@/lib/messenger/whatsapp";

// Meta WhatsApp Cloud API callback.
// Callback URL: https://<site>/api/whatsapp/webhook
// Verify token: WHATSAPP_VERIFY_TOKEN. App secret: META_APP_SECRET (signs the body).
// Subscribe the WABA to: messages, smb_message_echoes, history, smb_app_state_sync.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const token = process.env.WHATSAPP_VERIFY_TOKEN;
  const params = request.nextUrl.searchParams;
  const challenge = params.get("hub.challenge");
  if (!token || params.get("hub.mode") !== "subscribe" || params.get("hub.verify_token") !== token || !challenge) {
    return new NextResponse("forbidden", { status: 403 });
  }
  return new NextResponse(challenge, { status: 200 });
}

export async function POST(request: NextRequest) {
  const secret = process.env.META_APP_SECRET;
  if (!secret) return NextResponse.json({ error: "META_APP_SECRET is not set" }, { status: 500 });

  const raw = await request.text();
  if (!whatsappSignatureOk(raw, request.headers.get("x-hub-signature-256"), secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  try {
    const messages = await ingestWhatsappPayload(body);
    return NextResponse.json({ messages });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
