import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { enabled } from "@/lib/messenger/providers/meta";
import { loadThread } from "@/lib/messenger/thread";
import { createClient } from "@/lib/supabase/server";

const noStore = { "Cache-Control": "no-store" };

/** One chat for the inbox's right pane, so opening a chat does not reload the whole list. Admins only. */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.profile.role !== "admin") return NextResponse.json({}, { status: 403, headers: noStore });
  const id = (req.nextUrl.searchParams.get("c") ?? "").slice(0, 200);
  if (!id) return NextResponse.json({}, { status: 400, headers: noStore });
  try {
    const thread = await loadThread(await createClient(), id);
    if (!thread) return NextResponse.json({}, { status: 404, headers: noStore });
    return NextResponse.json({ ...thread, sendEnabled: enabled(thread.channel || "messenger") }, { headers: noStore });
  } catch {
    return NextResponse.json({}, { status: 500, headers: noStore });
  }
}
