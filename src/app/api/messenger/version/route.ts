import { NextRequest, NextResponse } from "next/server";
import { inboxVersion } from "@/lib/messenger/version";
import { createClient } from "@/lib/supabase/server";

const noStore = { "Cache-Control": "no-store" };

/**
 * "Has anything changed?" Every open inbox tab asks this every few seconds, so it is kept to one
 * database request. No role check here: the tables' RLS answers with empty values for anyone who is not an admin.
 */
export async function GET(req: NextRequest) {
  const id = (req.nextUrl.searchParams.get("c") ?? "").slice(0, 200);
  try {
    return NextResponse.json(await inboxVersion(await createClient(), id), { headers: noStore });
  } catch {
    return NextResponse.json({}, { status: 500, headers: noStore });
  }
}
