import { NextResponse } from "next/server";
import { upcomingClasses } from "@/lib/notion";

/** Upcoming group classes from Notion for the Messenger class picker. */
export async function GET() {
  try {
    return NextResponse.json(await upcomingClasses());
  } catch (err) {
    console.error("[classes]", err);
    return NextResponse.json({ error: "Kurse konnten nicht aus Notion geladen werden." }, { status: 503 });
  }
}
