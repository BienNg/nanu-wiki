import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/Topbar";
import { Reveal } from "@/components/Reveal";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { KIND, KindBadge, VerifiedPill } from "@/components/Badges";
import { PAGE_SELECT } from "@/components/PageTable";
import { formatDate, isVerified } from "@/lib/format";
import type { Area, Block, KnowledgeKind, PageWithMeta } from "@/lib/types";

export const metadata = { title: "Suche" };

type Params = { q?: string; type?: string | string[]; role?: string | string[]; verified?: string };
const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

/** Flattens German + Vietnamese text of all blocks (for snippets). */
function blockTexts(blocks: Block[]): { de: string; vi: string }[] {
  return blocks.flatMap((b): { de: string; vi: string }[] => {
    switch (b.type) {
      case "heading":
      case "paragraph":
      case "callout":
        return [{ de: b.de, vi: b.vi }];
      case "list":
      case "steps":
        return b.items.map((i) => ({ de: `${i.de} ${"body_de" in i ? (i.body_de ?? "") : ""}`, vi: i.vi }));
      case "template":
        return [{ de: b.translation_de ?? b.text, vi: b.text }];
      case "video":
        return [{ de: b.caption_de ?? "", vi: b.caption_vi ?? "" }];
      case "chat":
        return [{ de: b.intro_de ?? "", vi: b.intro_vi ?? "" }, ...b.messages.map((m) => ({ de: m.translation_de ?? m.text, vi: m.text }))];
    }
  });
}

function snippet(page: PageWithMeta, q: string) {
  const texts = blockTexts(page.body);
  const needle = q.toLowerCase();
  const hit = texts.find((t) => t.de.toLowerCase().includes(needle) || t.vi.toLowerCase().includes(needle)) ?? texts[0];
  if (!hit) return null;
  const src = hit.de.toLowerCase().includes(needle) || !q ? hit.de : hit.vi;
  const at = q ? src.toLowerCase().indexOf(needle) : -1;
  if (at < 0) return { pre: src.slice(0, 160), hit: "", post: src.length > 160 ? " …" : "", vi: hit.vi.slice(0, 140) };
  const start = Math.max(0, at - 60);
  return {
    pre: (start > 0 ? "… " : "") + src.slice(start, at),
    hit: src.slice(at, at + q.length),
    post: src.slice(at + q.length, at + q.length + 90) + " …",
    vi: hit.vi.slice(0, 140),
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireRole("staff");
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const types = list(sp.type) as KnowledgeKind[];
  const roles = list(sp.role);
  const verifiedOnly = sp.verified === "1";

  const supabase = await createClient();
  const { data: areas } = await supabase.from("areas").select("*").order("sort");
  let query = supabase.from("pages").select(PAGE_SELECT).eq("published", true).order("updated_at", { ascending: false }).limit(200);
  if (q) query = query.ilike("search_text", `%${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`);
  const { data } = await query;
  const all = (data ?? []) as unknown as PageWithMeta[];

  const okType = (p: PageWithMeta) => !types.length || types.includes(p.kind);
  const okRole = (p: PageWithMeta) => !roles.length || roles.includes(p.area?.slug ?? "");
  const okVer = (p: PageWithMeta) => !verifiedOnly || isVerified(p.verified_until);
  const results = all.filter((p) => okType(p) && okRole(p) && okVer(p));

  // Builds a URL that toggles one filter value while keeping the others.
  const href = (change: { type?: string; role?: string; verified?: boolean; clear?: boolean }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (change.clear) return `/suche?${p}`;
    const t = change.type ? (types.includes(change.type as KnowledgeKind) ? types.filter((x) => x !== change.type) : [...types, change.type]) : types;
    const r = change.role ? (roles.includes(change.role) ? roles.filter((x) => x !== change.role) : [...roles, change.role]) : roles;
    t.forEach((x) => p.append("type", x));
    r.forEach((x) => p.append("role", x));
    if (change.verified !== undefined ? change.verified : verifiedOnly) p.set("verified", "1");
    return `/suche?${p}`;
  };

  const chip = "inline-flex h-8 items-center gap-1.5 rounded-[5px] px-2.5 text-xs font-medium text-[#4A4F57] hover:bg-chip aria-pressed:bg-accent-soft aria-pressed:text-accent-dark";

  return (
    <div className="flex flex-1 flex-col bg-[#ECEEF1]">
      <Topbar>
        <Icon name="search" size={14} strokeWidth={2} />
        <Label de="Suche" vi="Tìm kiếm" />
      </Topbar>

      <Reveal className="mx-auto flex w-full max-w-[800px] flex-col gap-2.5 px-6 pb-20 pt-3">
        <div data-reveal className="rounded-[10px] bg-white shadow-[0_8px_28px_rgba(16,24,40,.12)]">
          <form action="/suche" className="flex min-h-[52px] items-center gap-2.5 px-4 text-[#4A4F57]">
            <Icon name="search" size={17} strokeWidth={2} />
            <label className="sr-only" htmlFor="q">
              Suche
            </label>
            <input id="q" name="q" type="search" defaultValue={q} autoFocus placeholder="Suchen … · Tìm kiếm …" className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none" />
            {types.map((t) => (
              <input key={t} type="hidden" name="type" value={t} />
            ))}
            {roles.map((r) => (
              <input key={r} type="hidden" name="role" value={r} />
            ))}
            {verifiedOnly && <input type="hidden" name="verified" value="1" />}
          </form>
          <div className="flex flex-col gap-0.5 border-t border-line-soft px-2.5 pb-2 pt-1.5">
            <div role="group" aria-label="Wissenstyp" className="flex flex-wrap items-center gap-0.5">
              {(Object.keys(KIND) as KnowledgeKind[]).map((k) => (
                <Link key={k} href={href({ type: k })} aria-pressed={types.includes(k)} className={chip}>
                  <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: KIND[k].dot }} />
                  <Label de={KIND[k].de} vi={KIND[k].vi} />
                  <span className="text-[11px] opacity-75">{all.filter((p) => p.kind === k && okRole(p) && okVer(p)).length}</span>
                </Link>
              ))}
              <span aria-hidden="true" className="mx-1 h-4 w-px bg-line" />
              <Link href={href({ verified: !verifiedOnly })} aria-pressed={verifiedOnly} className={chip}>
                <Icon name="check" size={12} strokeWidth={2.4} />
                <Label de="Nur geprüfte" vi="Chỉ đã duyệt" />
              </Link>
            </div>
            <div role="group" aria-label="Rolle" className="flex flex-wrap items-center gap-0.5">
              {((areas ?? []) as Area[]).map((a) => (
                <Link key={a.id} href={href({ role: a.slug })} aria-pressed={roles.includes(a.slug)} className={chip}>
                  <Icon name={a.icon} size={12} color={a.color} strokeWidth={2.4} />
                  <Label de={a.name_de} vi={a.name_vi} />
                  <span className="text-[11px] opacity-75">{all.filter((p) => p.area?.slug === a.slug && okType(p) && okVer(p)).length}</span>
                </Link>
              ))}
              {(types.length > 0 || roles.length > 0 || verifiedOnly) && (
                <Link href={href({ clear: true })} className="inline-flex h-8 items-center px-2.5 text-xs text-muted">
                  <Label de="Filter löschen" vi="Xóa lọc" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div data-reveal className="rounded-[10px] bg-white px-2 pb-2 pt-3 shadow-[0_8px_28px_rgba(16,24,40,.12)]">
          <div className="px-3 pb-1.5">
            <h1 className="cap m-0">
              <Label de="Suchergebnisse" vi="Kết quả tìm kiếm" /> · {results.length}
            </h1>
          </div>
          {results.length === 0 && (
            <p className="px-3 py-10 text-center text-[13px] text-[#4A4F57]">
              <Bi de="Keine Treffer. Probiere ein anderes Wort oder weniger Filter." vi="Không có kết quả. Hãy thử từ khác hoặc bớt bộ lọc." />
            </p>
          )}
          {results.map((p) => {
            const s = snippet(p, q);
            return (
              <Link key={p.id} href={`/seite/${p.id}`} className="flex items-start gap-3 rounded-md px-3 py-2.5 text-ink hover:bg-[#F2F5FA] hover:text-ink">
                <Icon name="doc" size={15} color={p.area?.color ?? "#6B7079"} strokeWidth={2} className="mt-[3px] flex-none" />
                <span className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="flex flex-wrap items-center gap-2 text-sm font-semibold leading-snug">
                    <span className="de">{p.title_de}</span>
                    <KindBadge kind={p.kind} />
                    {isVerified(p.verified_until) && <VerifiedPill until={p.verified_until} />}
                  </span>
                  <span className="vi mt-0 text-xs">{p.title_vi}</span>
                  <span className="text-xs text-[#4A4F57]">
                    {p.area?.name_de} · {p.owner?.full_name ?? "–"} · {formatDate(p.updated_at)}
                  </span>
                  {s && (
                    <span className="text-[13px] leading-normal text-muted">
                      <span className="de">
                        {s.pre}
                        {s.hit && <strong className="font-semibold text-ink">{s.hit}</strong>}
                        {s.post}
                      </span>
                      {s.vi ? <span className="vi mt-0">{s.vi}</span> : null}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
