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
  const backfillDays = Number.isFinite(days) && days > 0 ? Math.min(days, 90) : undefined;

  let messenger: Awaited<ReturnType<typeof syncMessenger>> | null = null;
  let messengerError: string | null = null;
  try {
    messenger = await syncMessenger({ backfillDays });
  } catch (e) {
    messengerError = e instanceof Error ? e.message : String(e);
    await recordSyncError(messengerError).catch(() => {});
  }

  return NextResponse.json(
    { ...messenger, messengerError },
    { status: messengerError ? 500 : 200 },
  );
}

export const GET = handle;
export const POST = handle;
