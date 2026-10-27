"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Area, KnowledgeKind, PageWithMeta } from "@/lib/types";
import { searchWiki } from "@/app/actions";
import { formatDate, isVerified } from "@/lib/format";
import { snippet } from "@/lib/snippet";
import { KIND, KindBadge, VerifiedPill } from "./Badges";
import { Icon } from "./Icon";
import { Label } from "./Bi";

const chip =
  "inline-flex h-8 items-center gap-1.5 rounded-[5px] px-2.5 text-xs font-medium text-[#4A4F57] hover:bg-chip aria-pressed:bg-accent-soft aria-pressed:text-accent-dark";

export function SearchOverlay({
  open,
  onClose,
  areas,
  left,
}: {
  open: boolean;
  onClose: () => void;
  areas: Area[];
  left: number;
}) {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PageWithMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [settled, setSettled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [types, setTypes] = useState<KnowledgeKind[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [active, setActive] = useState(0);
  const queryRef = useRef(query);
  queryRef.current = query;

  useEffect(() => {
    if (pathRef.current === pathname) return;
    pathRef.current = pathname;
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setTypes([]);
      setRoles([]);
      setVerifiedOnly(false);
      setResults([]);
      setSettled(false);
      setFailed(false);
      return;
    }
    const prev = document.activeElement as HTMLElement | null;
    const focusInput = () => inputRef.current?.focus();
    const frame = requestAnimationFrame(focusInput);
    const timer = window.setTimeout(focusInput, 0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (queryRef.current) setQuery("");
      else onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      prev?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const term = query.trim().slice(0, 80);
    let ignore = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      const broad = term.length > 0 || types.length > 0 || roles.length > 0 || verifiedOnly;
      let data: PageWithMeta[];
      try {
        data = await searchWiki(term, broad ? 40 : 8);
      } catch {
        if (ignore) return;
        setLoading(false);
        setSettled(true);
        setFailed(true);
        setResults([]);
        return;
      }
      if (ignore) return;
      setLoading(false);
      setSettled(true);
      setFailed(false);
      setResults(data);
    }, 140);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [open, query, types.length, roles.length, verifiedOnly]);

  const shown = useMemo(
    () =>
      results.filter((page) => {
        if (types.length && !types.includes(page.kind)) return false;
        if (roles.length && !roles.includes(page.area.slug)) return false;
        if (verifiedOnly && !isVerified(page.verified_until)) return false;
        return true;
      }),
    [results, types, roles, verifiedOnly],
  );

  useEffect(() => setActive(0), [query, shown.length]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(`search-result-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  function toggleType(kind: KnowledgeKind) {
    setTypes((current) => (current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind]));
  }

  function toggleRole(slug: string) {
    setRoles((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" && shown.length) {
      e.preventDefault();
      setActive((index) => Math.min(shown.length - 1, index + 1));
    }
    if (e.key === "ArrowUp" && shown.length) {
      e.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    }
    if (e.key === "Enter" && shown[active]) {
      e.preventDefault();
      document.getElementById(`search-result-${active}`)?.querySelector("a")?.click();
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], input, [tabindex]:not([tabindex='-1'])")].filter(
      (el) => !el.hasAttribute("disabled"),
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const filtersOn = types.length > 0 || roles.length > 0 || verifiedOnly;
  const term = query.trim();

  return (
    <div className="fixed bottom-0 right-0 top-0 z-40" style={{ left }}>
      <button type="button" aria-label="Suche schließen" className="absolute inset-0 bg-[#2B2D31]/25" onClick={onClose} />
      <div className="relative mx-auto mt-4 w-full max-w-[760px] px-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onKeyDown={onKeyDown}
          className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_8px_28px_rgba(16,24,40,.18)]"
        >
          <h2 id={titleId} className="sr-only">
            <Label de="Suche" vi="Tìm kiếm" />
          </h2>
          <div className="flex min-h-[52px] items-center gap-2.5 px-4 text-[#4A4F57]">
            <Icon name="search" size={17} strokeWidth={2} />
            <label className="sr-only" htmlFor="page-search">
              Suche
            </label>
            <input
              ref={inputRef}
              id="page-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suchen … · Tìm kiếm …"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none"
            />
            <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-xs text-muted hover:bg-hover hover:text-ink">
              Esc
            </button>
          </div>

          <div className={`min-h-0 flex-1 overflow-y-auto ${loading ? "opacity-70" : ""}`}>
            <div className="flex flex-col gap-0.5 border-t border-line-soft px-2.5 pb-2 pt-1.5">
              <div role="group" aria-label="Wissenstyp" className="flex flex-wrap items-center gap-0.5">
                {(Object.keys(KIND) as KnowledgeKind[]).map((kind) => (
                  <button key={kind} type="button" aria-pressed={types.includes(kind)} onClick={() => toggleType(kind)} className={chip}>
                    <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: KIND[kind].dot }} />
                    <Label de={KIND[kind].de} vi={KIND[kind].vi} />
                  </button>
                ))}
                <span aria-hidden="true" className="mx-1 h-4 w-px bg-line" />
                <button type="button" aria-pressed={verifiedOnly} onClick={() => setVerifiedOnly((value) => !value)} className={chip}>
                  <Icon name="check" size={12} strokeWidth={2.4} />
                  <Label de="Nur geprüfte" vi="Chỉ đã duyệt" />
                </button>
              </div>
              <div role="group" aria-label="Rolle" className="flex flex-wrap items-center gap-0.5">
                {areas.map((area) => (
                  <button key={area.slug} type="button" aria-pressed={roles.includes(area.slug)} onClick={() => toggleRole(area.slug)} className={chip}>
                    <Icon name={area.icon} size={12} color={area.color} strokeWidth={2.4} />
                    <Label de={area.name_de} vi={area.name_vi} />
                  </button>
                ))}
                {filtersOn && (
                  <button
                    type="button"
                    onClick={() => {
                      setTypes([]);
                      setRoles([]);
                      setVerifiedOnly(false);
                    }}
                    className="inline-flex h-8 items-center px-2.5 text-xs text-muted"
                  >
                    <Label de="Filter löschen" vi="Xóa lọc" />
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-line-soft px-2 pb-2 pt-3">
              <div className="px-3 pb-1.5">
                <p className="cap m-0">
                  {term ? <Label de="Suchergebnisse" vi="Kết quả tìm kiếm" /> : <Label de="Zuletzt aktualisiert" vi="Mới cập nhật" />}
                  {" · "}
                  {shown.length}
                </p>
              </div>
              {failed && (
                <p className="px-3 py-8 text-center text-[13px] text-[#4A4F57]">
                  <Label de="Suche fehlgeschlagen." vi="Tìm kiếm không thành công." />
                </p>
              )}
              {(loading || !settled) && shown.length === 0 && !failed && (
                <p className="px-3 py-8 text-center text-[13px] text-[#4A4F57]">
                  <Label de="Suche …" vi="Đang tìm …" />
                </p>
              )}
              {settled && !failed && shown.length === 0 && !loading && (
                <p className="px-3 py-8 text-center text-[13px] text-[#4A4F57]">
                  <span className="de">Keine Treffer. Probiere ein anderes Wort oder weniger Filter.</span>
                  <span className="vi">Không có kết quả. Hãy thử từ khác hoặc bớt bộ lọc.</span>
                </p>
              )}
              {shown.map((page, index) => {
                const match = snippet(page, term);
                return (
                  <div
                    id={`search-result-${index}`}
                    key={page.id}
                    className={index === active ? "rounded-md bg-[#F2F5FA]" : undefined}
                  >
                    <Link
                      href={page.href}
                      onClick={onClose}
                      className="flex items-start gap-3 rounded-md px-3 py-2.5 text-ink hover:bg-[#F2F5FA] hover:text-ink"
                    >
                      <Icon name="doc" size={15} color={page.area.color} strokeWidth={2} className="mt-[3px] flex-none" />
                      <span className="flex min-w-0 flex-1 flex-col gap-px">
                        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold leading-snug">
                          <span className="de">{page.title_de}</span>
                          <KindBadge kind={page.kind} />
                          {isVerified(page.verified_until) && <VerifiedPill until={page.verified_until} />}
                        </span>
                        <span className="vi mt-0 text-xs">{page.title_vi}</span>
                        <span className="text-xs text-[#4A4F57]">
                          {page.area.name_de} · {formatDate(page.updated_at)}
                        </span>
                        {match && term && (
                          <span className="text-[13px] leading-normal text-muted">
                            <span className="de">
                              {match.pre}
                              {match.hit && <strong className="font-semibold text-ink">{match.hit}</strong>}
                              {match.post}
                            </span>
                            {match.vi ? <span className="vi mt-0">{match.vi}</span> : null}
                          </span>
                        )}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
