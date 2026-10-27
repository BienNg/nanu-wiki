import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { dmByEmail, siteUrl } from "@/lib/slack";

/** Daily (Vercel Cron, see vercel.json): DM page owners on Slack when the
 *  "Geprüft bis" date of one of their pages has passed or ends within 7 days. */
export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const soon = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);

  const { data: pages, error } = await supabase
    .from("pages")
    .select("id, title_de, verified_until, owner:profiles!pages_owner_id_fkey(email, full_name)")
    .eq("published", true)
    .not("verified_until", "is", null)
    .lte("verified_until", soon);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by owner so everyone gets one message.
  const byOwner = new Map<string, { name: string; pages: { id: string; title: string; until: string }[] }>();
  for (const p of pages ?? []) {
    const owner = p.owner as unknown as { email: string; full_name: string | null } | null;
    if (!owner?.email) continue;
    const entry = byOwner.get(owner.email) ?? { name: owner.full_name ?? owner.email, pages: [] };
    entry.pages.push({ id: p.id, title: p.title_de, until: p.verified_until! });
    byOwner.set(owner.email, entry);
  }

  let sent = 0;
  for (const [email, { name, pages: list }] of byOwner) {
    const lines = list.map((p) => `• <${siteUrl(`/seite/${p.id}`)}|${p.title}> – geprüft bis ${p.until}`).join("\n");
    const ok = await dmByEmail(
      email,
      `Hallo ${name}! Diese Wiki-Seiten müssen bald neu geprüft werden · Các trang này cần được duyệt lại:\n${lines}`,
    );
    if (ok) sent++;
  }

  return NextResponse.json({ owners: byOwner.size, sent });
}
