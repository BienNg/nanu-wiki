import { NextResponse, type NextRequest } from "next/server";
import { labelMessenger } from "@/lib/messenger/label";

// Every 15 minutes from Supabase pg_cron. Labels threads that changed since the last label.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await labelMessenger();
  return NextResponse.json(result, { status: result.error ? 500 : 200 });
}

export const POST = GET;
