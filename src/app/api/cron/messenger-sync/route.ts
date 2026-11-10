import { NextResponse, type NextRequest } from "next/server";
import { recordSyncError, syncMessenger } from "@/lib/messenger/sync";

// Called every minute by Supabase pg_cron (pg_net) with `Authorization: Bearer <CRON_SECRET>`.
// Optional `?backfillDays=30` widens how far back messages are loaded.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const days = Number(request.nextUrl.searchParams.get("backfillDays"));
  try {
    const result = await syncMessenger({
      backfillDays: Number.isFinite(days) && days > 0 ? Math.min(days, 90) : undefined,
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await recordSyncError(message).catch(() => {});
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
