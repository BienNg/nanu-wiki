import { NextResponse, type NextRequest } from "next/server";
import { recordSyncError, syncMessenger } from "@/lib/messenger/sync";
import { syncZalo } from "@/lib/messenger/zalo";

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

  // Zalo is independent: a token error on one OA must not skip the Facebook sync.
  let zalo: Awaited<ReturnType<typeof syncZalo>> | null = null;
  let zaloError: string | null = null;
  try {
    zalo = await syncZalo({ backfillDays });
  } catch (e) {
    zaloError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(
    { ...messenger, messengerError, zalo, zaloError },
    { status: messengerError ? 500 : 200 },
  );
}

export const GET = handle;
export const POST = handle;
