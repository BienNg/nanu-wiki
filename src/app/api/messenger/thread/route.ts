import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { enabled } from "@/lib/messenger/providers/meta";
import { loadThread, olderMessages } from "@/lib/messenger/thread";
import { inboxVersion } from "@/lib/messenger/version";
import { createClient } from "@/lib/supabase/server";

const noStore = { "Cache-Control": "no-store" };

/** One chat for the inbox's right pane, so opening a chat does not reload the whole list. Admins only. */
export async function GET(req: NextRequest) {
  const id = (req.nextUrl.searchParams.get("c") ?? "").slice(0, 200);
  if (!id) return NextResponse.json({}, { status: 400, headers: noStore });
  const before = req.nextUrl.searchParams.get("before");
  const supabase = await createClient();
  // The version is read while the session is checked, and so before the chat itself (see inboxVersion).
  const [session, version] = await Promise.all([getSession(), before ? null : inboxVersion(supabase, id).catch(() => null)]);
  if (!session || session.profile.role !== "admin") return NextResponse.json({}, { status: 403, headers: noStore });
  try {
    // Only the page of older messages, for "Ältere laden".
    if (before) {
      if (Number.isNaN(Date.parse(before))) return NextResponse.json({}, { status: 400, headers: noStore });
      return NextResponse.json(await olderMessages(supabase, id, before), { headers: noStore });
    }
    const thread = await loadThread(supabase, id, version?.thread ?? null);
    if (!thread) return NextResponse.json({}, { status: 404, headers: noStore });
    return NextResponse.json({ ...thread, sendEnabled: enabled(thread.channel || "messenger") }, { headers: noStore });
  } catch {
    return NextResponse.json({}, { status: 500, headers: noStore });
  }
}
