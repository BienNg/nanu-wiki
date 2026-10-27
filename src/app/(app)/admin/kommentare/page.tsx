import Link from "next/link";
import { getEditorAreas, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AREAS, getPageById } from "@/content";
import { Topbar } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { CopyButton } from "@/components/CopyButton";
import { CommentActions } from "@/components/admin/CommentActions";
import { FilterChip } from "@/components/admin/FilterChip";
import { COMMENT_STATUSES, COMMENT_TAGS, resolveAnchor, tagInfo } from "@/lib/comments";
import { formatDate } from "@/lib/format";
import type { CommentStatus, PageComment, PageWithMeta } from "@/lib/types";

export const metadata = { title: "Kommentare" };

type Row = PageComment & { author: { full_name: string | null; email: string } | null };
type Params = { status?: string; area?: string; tag?: string; page?: string; sort?: string };

/** Status tabs; "offen" is the default view. */
const VIEWS: { id: string; de: string; vi: string; status: CommentStatus }[] = [
  { id: "offen", de: "Offen", vi: "Đang mở", status: "open" },
  { id: "in-arbeit", de: "In Arbeit", vi: "Đang xử lý", status: "in_progress" },
  { id: "erledigt", de: "Erledigt", vi: "Đã xong", status: "resolved" },
  { id: "abgelehnt", de: "Abgelehnt", vi: "Không làm", status: "declined" },
];

const SORTS = [
  { id: "alt", de: "Älteste zuerst", vi: "Cũ nhất trước" },
  { id: "neu", de: "Neueste zuerst", vi: "Mới nhất trước" },
  { id: "seite", de: "Meiste pro Seite", vi: "Trang nhiều góp ý nhất" },
];

const DEFAULTS: Required<Params> = { status: "offen", area: "", tag: "", page: "", sort: "alt" };

export default async function CommentsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { profile } = await requireRole("editor");
  const sp = await searchParams;
  const myAreas = profile.role === "admin" ? AREAS.map((a) => a.slug) : await getEditorAreas();

  // Everything in the user's areas, filtered here: the tabs and every dropdown show counts for the other filters.
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_comments")
    .select("*, author:profiles!page_comments_author_id_fkey(full_name, email)")
    .in("area", myAreas.length ? myAreas : ["-"]) // an editor without areas sees nothing
    .order("created_at")
    .limit(2000);
  const all = (data ?? []) as Row[];

  const view = VIEWS.find((v) => v.id === sp.status) ?? VIEWS[0];
  const f: Required<Params> = {
    status: view.id,
    area: sp.area && myAreas.includes(sp.area) ? sp.area : "",
    tag: tagInfo((sp.tag ?? null) as PageComment["tag"])?.id ?? "",
    page: sp.page && all.some((c) => c.page_id === sp.page) ? sp.page : "",
    sort: SORTS.some((s) => s.id === sp.sort) ? sp.sort! : "alt",
  };
  const matches = (c: Row, skip?: keyof Params) =>
    (skip === "status" || c.status === view.status) &&
    (skip === "area" || !f.area || c.area === f.area) &&
    (skip === "tag" || !f.tag || c.tag === f.tag) &&
    (skip === "page" || !f.page || c.page_id === f.page);
  const count = (skip: keyof Params, pick: (c: Row) => boolean) => all.filter((c) => matches(c, skip) && pick(c)).length;
  const rows = all.filter((c) => matches(c));

  const href = (patch: Partial<Params>) => {
    const next = { ...f, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([k, v]) => v && v !== DEFAULTS[k as keyof Params]));
    return `/admin/kommentare${qs.size ? `?${qs}` : ""}`;
  };
  const filtered = Boolean(f.area || f.tag || f.page);

  // Group by page; within a page oldest first unless "Neueste zuerst".
  const groups = new Map<string, Row[]>();
  for (const r of rows) groups.set(r.page_id, [...(groups.get(r.page_id) ?? []), r]);
  if (f.sort === "neu") for (const list of groups.values()) list.reverse();
  const pages = [...groups.entries()].sort(([, a], [, b]) =>
    f.sort === "seite" ? b.length - a.length : f.sort === "neu" ? b[0].created_at.localeCompare(a[0].created_at) : a[0].created_at.localeCompare(b[0].created_at),
  );

  const areaList = AREAS.filter((a) => myAreas.includes(a.slug));
  const area = AREAS.find((a) => a.slug === f.area);
  const tag = tagInfo((f.tag || null) as PageComment["tag"]);
  const pageIds = [...new Set(all.filter((c) => matches(c, "page")).map((c) => c.page_id))];
  if (f.page && !pageIds.includes(f.page)) pageIds.push(f.page);
  const pageTitle = (id: string) => getPageById(id)?.title_de ?? id;
  const sort = SORTS.find((s) => s.id === f.sort)!;
  const all_ = { de: "Alle", vi: "Tất cả" };

  return (
    <>
      <Topbar>
        <Icon name="chat" size={14} />
        <Label de="Kommentare" vi="Bình luận" />
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-8 pb-20 pt-9 max-sm:px-4">
        <header className="flex items-center gap-2">
          <h1 className="title-display m-0 text-[34px] leading-tight">
            <Label de="Kommentare" vi="Bình luận" />
          </h1>
          <span
            title={"Inhalt in src/content anpassen, dann auf „Erledigt“ – die Person bekommt ein Danke auf Slack.\nSửa nội dung trong src/content, rồi bấm „Đã xong“ – người góp ý nhận lời cảm ơn qua Slack."}
            className="mt-1 flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-line text-[11px] font-semibold text-muted"
          >
            i
          </span>
        </header>

        <nav aria-label="Status" className="-mb-1 flex gap-1 overflow-x-auto max-sm:gap-0 border-b border-line [scrollbar-width:none]">
          {VIEWS.map((v) => {
            const n = count("status", (c) => c.status === v.status);
            return (
              <Link
                key={v.id}
                href={href({ status: v.id })}
                aria-current={v.id === view.id ? "page" : undefined}
                className="-mb-px flex flex-none items-center gap-1.5 border-b-2 border-transparent px-2.5 pb-2.5 max-sm:gap-1 max-sm:px-1.5 pt-1 text-sm text-muted hover:text-ink aria-[current=page]:border-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
              >
                <Label de={v.de} vi={v.vi} />
                <span className={`rounded-full px-1.5 text-[11px] leading-[18px] ${v.id === view.id && n > 0 ? "bg-ink text-white" : "bg-chip text-muted"}`}>{n}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div aria-label="Filter" className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none]">
            {areaList.length > 1 && (
              <FilterChip
                label={{ de: "Bereich", vi: "Mục" }}
                value={area ? { de: area.name_de, vi: area.name_vi } : all_}
                active={Boolean(area)}
                clearHref={href({ area: "" })}
                options={[
                  { href: href({ area: "" }), ...all_, count: count("area", () => true), selected: !area },
                  ...areaList.map((a) => ({ href: href({ area: a.slug }), de: a.name_de, vi: a.name_vi, count: count("area", (c) => c.area === a.slug), selected: a.slug === f.area })),
                ]}
              />
            )}
            <FilterChip
              label={{ de: "Art", vi: "Loại" }}
              value={tag ? { de: tag.de, vi: tag.vi, prefix: tag.emoji } : all_}
              active={Boolean(tag)}
              clearHref={href({ tag: "" })}
              options={[
                { href: href({ tag: "" }), ...all_, count: count("tag", () => true), selected: !tag },
                ...COMMENT_TAGS.map((t) => ({ href: href({ tag: t.id }), de: t.de, vi: t.vi, prefix: t.emoji, count: count("tag", (c) => c.tag === t.id), selected: t.id === f.tag })),
              ]}
            />
            {(pageIds.length > 1 || f.page) && (
              <FilterChip
                label={{ de: "Seite", vi: "Trang" }}
                value={f.page ? { de: pageTitle(f.page), vi: getPageById(f.page)?.title_vi || pageTitle(f.page) } : all_}
                active={Boolean(f.page)}
                clearHref={href({ page: "" })}
                options={[
                  { href: href({ page: "" }), ...all_, count: count("page", () => true), selected: !f.page },
                  ...pageIds
                    .map((id) => ({ id, n: count("page", (c) => c.page_id === id) }))
                    .sort((a, b) => b.n - a.n)
                    .map(({ id, n }) => ({ href: href({ page: id }), de: pageTitle(id), vi: getPageById(id)?.title_vi || pageTitle(id), count: n, selected: id === f.page })),
                ]}
              />
            )}
            {filtered && (
              <Link href={href({ area: "", tag: "", page: "" })} className="flex-none whitespace-nowrap px-1.5 text-[13px] text-muted hover:text-ink hover:underline">
                <Label de="Zurücksetzen" vi="Bỏ lọc" />
              </Link>
            )}
          </div>
          <FilterChip
            compact
            label={{ de: "Sortierung", vi: "Sắp xếp" }}
            value={{ de: sort.de, vi: sort.vi }}
            active={false}
            clearHref={href({ sort: "" })}
            options={SORTS.map((s) => ({ href: href({ sort: s.id }), de: s.de, vi: s.vi, selected: s.id === f.sort }))}
          />
        </div>

        {pages.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-side px-6 py-12 text-center">
            {filtered ? (
              <>
                <p className="m-0 text-sm text-muted">
                  <Label de="Keine Kommentare für diese Filter." vi="Không có bình luận nào với bộ lọc này." />
                </p>
                <Link href={href({ area: "", tag: "", page: "" })} className="rounded-md border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-hover">
                  <Label de="Filter zurücksetzen" vi="Bỏ bộ lọc" />
                </Link>
              </>
            ) : view.id === "offen" ? (
              <>
                <p className="m-0 text-base font-medium text-ink">
                  <Label de="Alles abgearbeitet 🎉" vi="Đã xử lý hết 🎉" />
                </p>
                <p className="m-0 max-w-[460px] text-[13px] leading-relaxed text-muted">
                  <Label
                    de="Neue Hinweise aus dem Team landen hier. Inhalt in src/content anpassen, dann „Erledigt“ – die Person bekommt ein Danke auf Slack."
                    vi="Góp ý mới sẽ hiện ở đây. Sửa nội dung trong src/content, rồi bấm „Đã xong“ – người góp ý nhận lời cảm ơn qua Slack."
                  />
                </p>
              </>
            ) : (
              <p className="m-0 text-sm text-muted">
                <Label de="Hier ist noch nichts." vi="Chưa có gì ở đây." />
              </p>
            )}
          </div>
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
                {(view.status === "open" || view.status === "in_progress") && page && <CopyButton text={asTask(page, list, isDetached)} />}
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
