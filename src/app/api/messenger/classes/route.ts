import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { AssignableClass } from "@/lib/messenger/classes";
import { assignableClassById, assignableClasses } from "@/lib/notion";
import { createClient } from "@/lib/supabase/server";

const noStore = { "Cache-Control": "no-store" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function admin() {
  const session = await getSession();
  return !!session && session.profile.role === "admin";
}

/**
 * The class panel of one chat: the assignable classes from Notion plus which of them this chat is
 * assigned to. An assigned class that is not in the pool any more (e.g. its Begin just passed
 * between cache refreshes) is fetched live by id and listed too, until its End date passes.
 */
export async function GET(req: NextRequest) {
  const id = (req.nextUrl.searchParams.get("c") ?? "").slice(0, 200);
  if (!id) return NextResponse.json({}, { status: 400, headers: noStore });
  if (!(await admin())) return NextResponse.json({}, { status: 403, headers: noStore });
  try {
    const supabase = await createClient();
    const [classes, { data: rows, error }] = await Promise.all([
      assignableClasses(),
      supabase.from("messenger_class_assignments").select("class_id").eq("conversation_id", id),
    ]);
    if (error) throw new Error(error.message);
    const assigned = (rows ?? []).map((r) => r.class_id as string);
    const known = new Set(classes.map((c) => c.id));
    const extra = (await Promise.all(assigned.filter((k) => !known.has(k)).map(assignableClassById))).filter((c): c is AssignableClass => !!c);
    return NextResponse.json({ classes: [...classes, ...extra], assigned }, { headers: noStore });
  } catch (err) {
    console.error("[messenger/classes]", err);
    return NextResponse.json({ error: "Kurse konnten nicht geladen werden." }, { status: 503, headers: noStore });
  }
}

/** Assign a chat to a class, or take the assignment back ({ remove: true }). */
export async function POST(req: NextRequest) {
  if (!(await admin())) return NextResponse.json({}, { status: 403, headers: noStore });
  let body: { c?: unknown; k?: unknown; remove?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({}, { status: 400, headers: noStore });
  }
  const conversation = typeof body.c === "string" ? body.c.slice(0, 200) : "";
  const classId = typeof body.k === "string" ? body.k.toLowerCase() : "";
  if (!conversation || !UUID.test(classId)) return NextResponse.json({}, { status: 400, headers: noStore });
  const supabase = await createClient();
  try {
    if (body.remove === true) {
      const { error } = await supabase.from("messenger_class_assignments").delete().eq("conversation_id", conversation).eq("class_id", classId);
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true }, { headers: noStore });
    }
    // Only classes of the pool (or still readable and not ended) can be assigned.
    const pool = await assignableClasses();
    const cls = pool.find((c) => c.id === classId) ?? (await assignableClassById(classId));
    if (!cls) return NextResponse.json({ error: "Kurs nicht gefunden." }, { status: 404, headers: noStore });
    const session = await getSession();
    const { error } = await supabase
      .from("messenger_class_assignments")
      .upsert({ conversation_id: conversation, class_id: classId, created_by: session?.user.id ?? null }, { onConflict: "conversation_id,class_id", ignoreDuplicates: true });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch (err) {
    console.error("[messenger/classes]", err);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500, headers: noStore });
  }
}
