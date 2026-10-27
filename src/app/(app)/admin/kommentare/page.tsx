import Link from "next/link";
import { getEditorAreas, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AREAS, getPageById } from "@/content";
import { Topbar } from "@/components/Topbar";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { CopyButton } from "@/components/CopyButton";
import { CommentActions } from "@/components/admin/CommentActions";
import { COMMENT_STATUSES, COMMENT_TAGS, resolveAnchor, tagInfo } from "@/lib/comments";
import { formatDate } from "@/lib/format";
import type { CommentStatus, PageComment, PageWithMeta } from "@/lib/types";

export const metadata = { title: "Kommentare" };

type Row = PageComment & { author: { full_name: string | null; email: string } | null };
type Search = Promise<{ status?: string; area?: string; tag?: string }>;

/** "offen" = open + in progress, the default view. */
const VIEWS: { id: string; de: string; vi: string; statuses: CommentStatus[] }[] = [
  { id: "offen", de: "Offen", vi: "Đang mở", statuses: ["open", "in_progress"] },
  { id: "erledigt", de: "Erledigt", vi: "Đã xong", statuses: ["resolved"] },
  { id: "abgelehnt", de: "Abgelehnt", vi: "Không làm", statuses: ["declined"] },
];

export default async function CommentsPage({ searchParams }: { searchParams: Search }) {
  const { profile } = await requireRole("editor");
  const sp = await searchParams;
  const view = VIEWS.find((v) => v.id === sp.status) ?? VIEWS[0];
  const myAreas = profile.role === "admin" ? AREAS.map((a) => a.slug) : await getEditorAreas();
  const picked = sp.area && myAreas.includes(sp.area) ? [sp.area] : myAreas;
  const areas = picked.length ? picked : ["-"]; // an editor without areas sees nothing
  const tag = tagInfo((sp.tag ?? null) as PageComment["tag"])?.id;

  const supabase = await createClient();
  let query = supabase
    .from("page_comments")
    .select("*, author:profiles!page_comments_author_id_fkey(full_name, email)")
    .in("area", areas)
    .in("status", view.statuses)
    .order("created_at", { ascending: view.id === "offen" })
    .limit(500);
  if (tag) query = query.eq("tag", tag);
  const [{ data }, { data: openRows }] = await Promise.all([
    query,
    supabase.from("page_comments").select("area").in("area", myAreas).in("status", ["open", "in_progress"]),
  ]);
  const rows = (data ?? []) as Row[];
  const openByArea = new Map<string, number>();
  for (const r of openRows ?? []) openByArea.set(r.area, (openByArea.get(r.area) ?? 0) + 1);

  // Group by page, pages with the most comments first.
  const groups = new Map<string, Row[]>();
  for (const r of rows) groups.set(r.page_id, [...(groups.get(r.page_id) ?? []), r]);
  const pages = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);

  const href = (patch: Partial<{ status: string; area: string; tag: string }>) => {
    const next = { status: view.id, area: sp.area ?? "", tag: tag ?? "", ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([k, v]) => v && !(k === "status" && v === "offen")));
    return `/admin/kommentare${qs.size ? `?${qs}` : ""}`;
  };

  return (
    <>
      <Topbar>
        <Icon name="chat" size={14} />
        <Label de="Kommentare" vi="Bình luận" />
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-8 pb-20 pt-9">
        <header className="flex flex-col gap-2">
          <h1 className="title-display m-0 text-[34px] leading-tight">
            <Bi de="Kommentare" vi="Bình luận" />
          </h1>
          <p className="m-0 max-w-[720px] text-[#4A4F57]">
            <Bi
              de="Hinweise aus dem Team zu den Seiten deiner Bereiche. Inhalt in src/content anpassen, dann auf „Erledigt“ – die Person bekommt ein Danke auf Slack."
              vi="Góp ý của mọi người về các trang trong mục của bạn. Sửa nội dung trong src/content, rồi bấm „Đã xong“ – người góp ý sẽ nhận lời cảm ơn qua Slack."
            />
          </p>
        </header>

        <nav aria-label="Filter" className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {VIEWS.map((v) => (
              <Chip key={v.id} href={href({ status: v.id })} active={v.id === view.id}>
                <Label de={v.de} vi={v.vi} />
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip href={href({ area: "" })} active={!sp.area}>
              <Label de="Alle Bereiche" vi="Tất cả" />
            </Chip>
            {AREAS.filter((a) => myAreas.includes(a.slug)).map((a) => (
              <Chip key={a.slug} href={href({ area: a.slug })} active={sp.area === a.slug}>
                <Label de={a.name_de} vi={a.name_vi} />
                {openByArea.get(a.slug) ? <span className="ml-1 text-faint">{openByArea.get(a.slug)}</span> : null}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip href={href({ tag: "" })} active={!tag}>
              <Label de="Alle Arten" vi="Mọi loại" />
            </Chip>
            {COMMENT_TAGS.map((t) => (
              <Chip key={t.id} href={href({ tag: t.id })} active={tag === t.id}>
                {t.emoji} <Label de={t.de} vi={t.vi} />
              </Chip>
            ))}
          </div>
        </nav>

        {pages.length === 0 && (
          <p className="m-0 rounded-lg bg-side px-4 py-8 text-center text-sm text-muted">
            <Label de="Keine Kommentare in dieser Ansicht. 🎉" vi="Không có bình luận nào. 🎉" />
          </p>
        )}

        {pages.map(([pageId, list]) => {
          const page = getPageById(pageId);
          // A comment's spot is gone when the page itself is gone, or its block and words can't be found any more.
          const isDetached = (c: Row) => !page || Boolean(c.anchor && resolveAnchor(page.body, c.anchor).detached);
          return (
            <section key={pageId} className="overflow-hidden rounded-[10px] border border-line">
              <header className="flex flex-wrap items-center gap-2.5 border-b border-line bg-side px-4 py-2.5">
                {page && <Icon name={page.area.icon} size={14} color={page.area.color} strokeWidth={2} />}
                <Link href={page?.href ?? "#"} className="min-w-0 flex-1 truncate text-sm font-semibold text-ink hover:underline">
                  {page?.title_de ?? pageId}
                </Link>
                <span className="text-xs text-muted">{list.length}</span>
                {view.id === "offen" && page && <CopyButton text={asTask(page, list, isDetached)} />}
              </header>
              <ul className="m-0 list-none p-0">
                {list.map((c) => (
                  <CommentRow key={c.id} c={c} page={page} detached={isDetached(c)} />
                ))}
              </ul>
            </section>
          );
        })}
      </main>
    </>
  );
}

function CommentRow({ c, page, detached }: { c: Row; page?: PageWithMeta; detached: boolean }) {
  const t = tagInfo(c.tag);
  const status = COMMENT_STATUSES.find((s) => s.id === c.status)!;
  return (
    <li className="flex flex-col gap-2 border-t border-line-soft px-4 py-3.5 first:border-t-0">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        {t && (
          <span className="rounded-full bg-chip px-2 py-0.5 font-medium text-ink">
            {t.emoji} <Label de={t.de} vi={t.vi} />
          </span>
        )}
        <span className="font-medium text-body">{c.author?.full_name ?? c.author?.email ?? "?"}</span>
        <span>{formatDate(c.created_at)}</span>
        {c.anchor?.field && <span className="rounded bg-chip px-1.5 py-0.5 uppercase">{c.anchor.field}</span>}
        {!c.anchor && (
          <span>
            <Label de="ganze Seite" vi="cả trang" />
          </span>
        )}
        {detached ? (
          <span className="rounded bg-warn-soft px-1.5 py-0.5 text-[#5C4505]">
            {page ? <Label de="Stelle geändert" vi="Đoạn đã thay đổi" /> : <Label de="Seite gibt es nicht mehr" vi="Trang không còn nữa" />}
          </span>
        ) : (
          page &&
          c.page_version &&
          c.page_version !== page.updated_at && (
            // Comments remember the page's updated_at: a newer version may already have handled this.
            <span className="rounded bg-chip px-1.5 py-0.5" title={`Kommentar zu Version ${formatDate(c.page_version)}`}>
              <Label de={`Seite seit dem Kommentar geändert (${formatDate(page.updated_at)})`} vi={`Trang đã sửa sau bình luận (${formatDate(page.updated_at)})`} />
            </span>
          )
        )}
        {c.status === "in_progress" && (
          <span className="rounded bg-accent-soft px-1.5 py-0.5 text-accent-dark">
            <Label de={status.de} vi={status.vi} />
          </span>
        )}
      </div>

      {c.anchor?.exact ? (
        <blockquote className="m-0 border-l-2 border-accent pl-3 text-[13px] leading-relaxed text-muted">
          …{c.anchor.prefix}
          <mark className="bg-[#fde68a] text-ink">{c.anchor.exact}</mark>
          {c.anchor.suffix}…
        </blockquote>
      ) : c.anchor?.context ? (
        <blockquote className="m-0 line-clamp-2 border-l-2 border-line pl-3 text-[13px] text-muted">{c.anchor.context}</blockquote>
      ) : null}

      {c.body && <p className="m-0 whitespace-pre-line text-sm text-ink">{c.body}</p>}
      {c.resolution_note && (
        <p className="m-0 text-[13px] text-muted">
          ↳ <Label de="Antwort" vi="Trả lời" />: {c.resolution_note}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {page && (
          <Link href={`${page.href}?c=${c.id}`} className="text-[13px] font-medium text-accent hover:underline">
            <Label de="Zur Stelle →" vi="Đến chỗ này →" />
          </Link>
        )}
        <CommentActions id={c.id} status={c.status} />
      </div>
    </li>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="rounded-full border border-line px-3 py-1 text-[13px] text-body hover:border-accent aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-white"
    >
      {children}
    </Link>
  );
}

/** Markdown for one page's open comments – paste into Claude Code (or an issue) to work through them. */
function asTask(page: PageWithMeta, list: Row[], isDetached: (c: Row) => boolean) {
  const lines = [
    `Arbeite diese Kommentare zur Seite „${page.title_de}“ ab.`,
    `Datei: src/content/pages/${page.area.slug}/${page.slug}.ts (danach updated_at erhöhen)`,
    "",
  ];
  list.forEach((c, i) => {
    const t = tagInfo(c.tag);
    const where = !c.anchor
      ? "ganze Seite"
      : `${c.anchor.exact ? "Textstelle" : "Abschnitt"}${c.anchor.field ? ` (${c.anchor.field.toUpperCase()})` : ""}${isDetached(c) ? " – Stelle inzwischen geändert" : ""}`;
    lines.push(`${i + 1}. [${t ? t.de : "Kommentar"}] ${where}`);
    if (c.anchor?.exact) lines.push(`   Text: „${c.anchor.exact}“`);
    else if (c.anchor?.context) lines.push(`   Abschnitt: „${c.anchor.context.slice(0, 200)}“`);
    if (c.body) lines.push(`   Kommentar: ${c.body.replace(/\n+/g, " ")}`);
    lines.push(`   ID: ${c.id}`);
  });
  return lines.join("\n");
}
