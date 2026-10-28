import Link from "next/link";
import { getEditorAreas, hasRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { canEditArea } from "@/content";
import { Crumb, Topbar } from "./Topbar";
import { Reveal } from "./Reveal";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { KindBadge, VerifiedPill } from "./Badges";
import { BlockRenderer, slugify } from "./BlockRenderer";
import { ChatResponses } from "./ChatResponses";
import { CommentLayer, type PanelComment } from "./CommentLayer";
import { CommentToggle } from "./CommentView";
import { PaneClose } from "./DocPane";
import type { CommentAnchor, PageWithMeta, Profile } from "@/lib/types";
import { resolveAnchor } from "@/lib/comments";
import { formatDate } from "@/lib/format";

/**
 * One handbook page: the full page at /bereich/<area>/<page>, or (`pane`) the inside of the side pane
 * next to an area's page list (see PaneFrame). `c` = comment id to scroll to (full page only).
 */
export async function DocView({
  page,
  profile,
  c,
  pane = false,
}: {
  page: PageWithMeta;
  profile: Profile;
  c?: string;
  pane?: boolean;
}) {
  const canEdit = canEditArea(profile, await getEditorAreas(), page.area.slug);
  const hasChat = page.body.some((b) => b.type === "chat");
  const supabase = await createClient();
  const { data: mine } = hasChat
    ? await supabase.from("chat_responses").select("sim_id").eq("page_id", page.id).eq("profile_id", profile.id)
    : { data: [] as { sim_id: string }[] };
  const canComment = hasRole(profile.role, "staff");
  // `?c=<comment id>` (links from the inbox and Slack) → scroll to that comment's spot.
  let focus: CommentAnchor | "missing" | undefined;
  if (canComment && c && /^[0-9a-f-]{36}$/.test(c)) {
    const { data } = await supabase.from("page_comments").select("anchor").eq("id", c).eq("page_id", page.id).maybeSingle();
    const anchor = data?.anchor as CommentAnchor | undefined;
    const where = anchor ? resolveAnchor(page.body, anchor) : null;
    focus = !data ? "missing" : !anchor ? undefined : where!.detached ? "missing" : { ...anchor, block: where!.block };
  }
  // All comments on this page except declined ones, for the comment view.
  let comments: PanelComment[] = [];
  if (canComment) {
    const { data } = await supabase
      .from("page_comments")
      .select("id, anchor, tag, body, status, resolution_note, created_at, author:profiles!page_comments_author_id_fkey(full_name, email)")
      .eq("page_id", page.id)
      .neq("status", "declined")
      .order("created_at");
    comments = (data ?? []).map(({ author, ...c }) => {
      const a = author as unknown as { full_name: string | null; email: string } | null;
      const comment = { ...(c as Omit<PanelComment, "author">), author: a?.full_name ?? a?.email ?? "?" };
      // Point it at its block on the current version of the page (it may have been edited since).
      if (!comment.anchor) return comment;
      const where = resolveAnchor(page.body, comment.anchor);
      return where.detached ? { ...comment, detached: true } : { ...comment, anchor: { ...comment.anchor, block: where.block } };
    });
  }
  const openComments = comments.filter((c) => c.status !== "resolved").length;
  const headings = page.body.filter((b) => b.type === "heading") as { type: "heading"; de: string; vi: string }[];
  const tint = `${page.area.color}22`;
  const toggle = canComment ? <CommentToggle open={openComments} /> : undefined;

  const body = (
    <>
      <div data-reveal className="flex flex-wrap items-center gap-2.5 text-xs text-muted">
        <VerifiedPill until={page.verified_until} showDate />
        <KindBadge kind={page.kind} />
        {!page.published && <span className="rounded bg-chip px-1.5 py-0.5">Entwurf · Bản nháp</span>}
      </div>

      <header className="-mt-1 flex flex-col gap-2.5">
        <h1 data-reveal className={`title-display m-0 leading-[1.12] ${pane ? "text-[32px]" : "text-[40px]"}`}>
          <Bi de={page.title_de} vi={page.title_vi} />
        </h1>
        <span data-reveal className="text-xs text-muted">
          <Label de={`Aktualisiert ${formatDate(page.updated_at)}`} vi={`Cập nhật ${formatDate(page.updated_at)}`} />
        </span>
      </header>

      {canComment ? (
        <CommentLayer pageId={page.id} focus={focus} comments={comments} canManage={canEdit}>
          <BlockRenderer blocks={page.body} chat={{ pageId: page.id, done: (mine ?? []).map((r) => r.sim_id) }} />
        </CommentLayer>
      ) : (
        <BlockRenderer blocks={page.body} chat={{ pageId: page.id, done: (mine ?? []).map((r) => r.sim_id) }} />
      )}
      {canEdit && hasChat && <ChatResponses pageId={page.id} blocks={page.body} />}
    </>
  );

  if (pane) {
    return (
      <div className="flex min-w-0 flex-col">
        <div className="flex min-h-12 flex-wrap items-center gap-1.5 px-4 text-[13px] text-muted">
          <PaneClose className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink" />
          <Link
            href={page.href}
            className="inline-flex h-8 items-center gap-1.5 rounded-[7px] border border-line bg-white px-2.5 text-xs font-medium text-body hover:bg-hover hover:text-ink"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            <Label de="Als ganze Seite öffnen" vi="Mở toàn trang" />
          </Link>
          {headings.length > 1 && (
            <details className="relative">
              <summary className="inline-flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-[7px] px-2.5 text-xs font-medium text-body hover:bg-hover hover:text-ink [&::-webkit-details-marker]:hidden">
                <Label de="Inhalt" vi="Mục lục" /> ▾
              </summary>
              <nav
                aria-label="Inhaltsverzeichnis"
                className="absolute left-0 top-9 z-30 flex max-h-[60vh] w-[280px] flex-col gap-0.5 overflow-y-auto rounded-xl border border-line bg-white p-2 shadow-xl"
              >
                {headings.map((h, i) => (
                  <a key={i} href={`#${slugify(h.de)}`} className="rounded-md px-2 py-1.5 text-[13px] leading-snug text-body hover:bg-side hover:text-ink">
                    <Label de={h.de} vi={h.vi || h.de} />
                  </a>
                ))}
              </nav>
            </details>
          )}
          <div className="ml-auto flex items-center gap-1.5">{toggle}</div>
        </div>
        <Reveal className="mx-auto flex w-full max-w-[760px] flex-col gap-5 px-8 pb-20 pt-2">
          {body}
        </Reveal>
      </div>
    );
  }

  return (
    <div className="doc-page flex flex-1 flex-wrap">
      <div className="flex min-w-0 flex-[999_1_520px] flex-col">
        <Topbar actions={toggle}>
          <Icon name={page.area.icon} size={14} color={page.area.color} strokeWidth={2} />
          <Link href={`/bereich/${page.area.slug}`} className="text-body hover:text-ink">
            <Label de={page.area.name_de} vi={page.area.name_vi} />
          </Link>
          <Crumb>
            <span className="max-w-[320px] truncate">
              <Label de={page.title_de} vi={page.title_vi || page.title_de} />
            </span>
          </Crumb>
        </Topbar>

        <Reveal className="mx-auto flex w-full max-w-[820px] flex-col gap-5 px-8 pb-20 pt-2">
          <div data-reveal aria-hidden="true" className="flex h-[150px] items-center justify-center rounded-xl" style={{ background: tint }}>
            <Icon name={page.area.icon} size={64} color={page.area.color} strokeWidth={1.4} />
          </div>
          {body}
        </Reveal>
      </div>

      {headings.length > 1 && (
        <aside aria-label="Inhaltsverzeichnis" className="doc-toc hidden min-w-0 max-w-[240px] flex-[1_1_220px] flex-col bg-side px-[18px] lg:flex">
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
