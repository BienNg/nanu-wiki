import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Crumb, Topbar } from "@/components/Topbar";
import { Reveal } from "@/components/Reveal";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { KindBadge, VerifiedPill } from "@/components/Badges";
import { BlockRenderer, slugify } from "@/components/BlockRenderer";
import { ChatResponses } from "@/components/ChatResponses";
import { PAGE_SELECT } from "@/components/PageTable";
import { formatDate } from "@/lib/format";
import type { PageWithMeta } from "@/lib/types";

async function load(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("pages").select(PAGE_SELECT).eq("id", id).maybeSingle();
  return data as unknown as PageWithMeta | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const page = await load((await params).id);
  return { title: page?.title_de ?? "Seite" };
}

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { profile } = await requireRole("candidate");
  const { id } = await params;
  const page = await load(id);
  if (!page) notFound(); // also when RLS hides it

  const supabase = await createClient();
  const hasChat = page.body.some((b) => b.type === "chat");
  const [{ data: canEdit }, { data: mine }] = await Promise.all([
    supabase.rpc("can_edit_area", { target: page.area_id }),
    hasChat
      ? supabase.from("chat_responses").select("sim_id").eq("page_id", page.id).eq("profile_id", profile.id)
      : Promise.resolve({ data: [] as { sim_id: string }[] }),
  ]);
  const headings = page.body.filter((b) => b.type === "heading") as { type: "heading"; de: string; vi: string }[];
  const tint = `${page.area?.color ?? "#0B7793"}22`;

  return (
    <div className="flex flex-1 flex-wrap">
      <div className="flex min-w-0 flex-[999_1_520px] flex-col">
        <Topbar>
          {page.area && (
            <>
              <Icon name={page.area.icon} size={14} color={page.area.color} strokeWidth={2} />
              <Link href={`/bereich/${page.area.slug}`} className="text-body hover:text-ink">
                <Label de={page.area.name_de} vi={page.area.name_vi} />
              </Link>
            </>
          )}
          <Crumb>
            <span className="max-w-[320px] truncate">
              <Label de={page.title_de} vi={page.title_vi || page.title_de} />
            </span>
          </Crumb>
        </Topbar>

        <Reveal className="mx-auto flex w-full max-w-[820px] flex-col gap-5 px-8 pb-20 pt-2">
          <div data-reveal aria-hidden="true" className="flex h-[150px] items-center justify-center rounded-xl" style={{ background: tint }}>
            {page.area && <Icon name={page.area.icon} size={64} color={page.area.color} strokeWidth={1.4} />}
          </div>

          <div data-reveal className="flex flex-wrap items-center gap-2.5 text-xs text-muted">
            <VerifiedPill until={page.verified_until} showDate />
            <KindBadge kind={page.kind} />
            {!page.published && <span className="rounded bg-chip px-1.5 py-0.5">Entwurf · Bản nháp</span>}
          </div>

          <header className="-mt-1 flex flex-col gap-2.5">
            <h1 data-reveal className="title-display m-0 text-[40px] leading-[1.12]">
              <Bi de={page.title_de} vi={page.title_vi} />
            </h1>
            <span data-reveal className="text-xs text-muted">
              <Label de={`Aktualisiert ${formatDate(page.updated_at)}`} vi={`Cập nhật ${formatDate(page.updated_at)}`} />
            </span>
          </header>

          <BlockRenderer blocks={page.body} chat={{ pageId: page.id, done: (mine ?? []).map((r) => r.sim_id) }} />
          {canEdit && hasChat && <ChatResponses pageId={page.id} blocks={page.body} />}
        </Reveal>
      </div>

      {headings.length > 1 && (
        <aside aria-label="Inhaltsverzeichnis" className="hidden min-w-0 max-w-[240px] flex-[1_1_220px] flex-col bg-side px-[18px] lg:flex">
          <nav className="sticky top-0 flex max-h-dvh flex-col gap-0.5 overflow-y-auto py-3.5">
            <span className="pb-3 pt-1 text-[13px] text-body">
              <Label de="Inhaltsverzeichnis" vi="Mục lục" />
            </span>
            {headings.map((h, i) => (
              <a
                key={i}
                href={`#${slugify(h.de)}`}
                className="flex items-center gap-2.5 py-1 text-[13px] leading-snug text-muted before:h-px before:w-3.5 before:flex-none before:bg-[#C9CDD3] hover:text-ink"
              >
                <Label de={h.de} vi={h.vi || h.de} />
              </a>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}
