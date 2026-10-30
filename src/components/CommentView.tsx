"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { setCommentView, useCommentView } from "@/lib/commentViewStore";
import { pinTopEdge } from "./AppShell";
import { COMMENT_STATUSES, tagInfo } from "@/lib/comments";
import { formatDate } from "@/lib/format";
import type { PageComment } from "@/lib/types";
import { Label } from "./Bi";
import { CommentActions } from "./admin/CommentActions";
import { caretAt, rangeForAnchor } from "./commentDom";

/** `anchor.block` is already the block's key on the current page (see resolveAnchor); `detached` = its spot is gone. */
export type PanelComment = Pick<PageComment, "id" | "anchor" | "tag" | "body" | "status" | "resolution_note" | "created_at"> & {
  author: string;
  detached?: boolean;
};

type Placed = {
  groups: { block: string; top: number; ids: string[] }[];
  ranges: Map<string, Range>;
  order: Map<string, number>; // block index on the page
  detached: Set<string>;      // the block or the quoted words are gone
};
const EMPTY: Placed = { groups: [], ranges: new Map(), order: new Map(), detached: new Set() };

type Box = { top: number; left: number; width: number; height: number };

/** Runs `fn` once a smooth scroll has settled (scrollend, with a timeout for browsers without it). */
function afterScroll(moved: boolean, fn: () => void) {
  if (!moved) return void requestAnimationFrame(fn);
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    window.removeEventListener("scrollend", go);
    fn();
  };
  window.addEventListener("scrollend", go);
  setTimeout(go, 900);
}

const highlights = () => (typeof CSS !== "undefined" && "highlights" in CSS ? CSS.highlights : null);

/** Comment view: highlights every commented passage, puts a count next to each commented block
 *  and lists all comments in a panel on the right (bottom sheet on phones). Off = normal reading view. */
export function CommentView({
  root,
  comments,
  canManage,
}: {
  root: React.RefObject<HTMLDivElement | null>;
  comments: PanelComment[];
  canManage: boolean;
}) {
  const on = useCommentView();
  const [showDone, setShowDone] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed>(EMPTY);
  const [tip, setTip] = useState<{ ids: string[]; top: number; left: number } | null>(null);
  const [pulse, setPulse] = useState<{ key: number; rects: Box[] } | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  // Below the breadcrumb bar when this page is open in the side pane. Null on the full page and on phones.
  const [paneTop, setPaneTop] = useState<number | null>(null);
  useEffect(() => {
    const found = root.current?.closest<HTMLElement>(".doc-pane");
    if (!found) return;
    const pane: HTMLElement = found;
    const wide = window.matchMedia("(min-width: 1024px)");
    function update() {
      setPaneTop(wide.matches ? pane.getBoundingClientRect().top : null);
    }
    update();
    window.addEventListener("resize", update);
    wide.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      wide.removeEventListener("change", update);
    };
  }, [on, root]);

  const doneCount = comments.filter((c) => c.status === "resolved").length;
  const list = useMemo(() => comments.filter((c) => showDone || c.status !== "resolved"), [comments, showDone]);

  useEffect(() => {
    document.documentElement.dataset.commentView = on ? "on" : "off";
  }, [on]);

  // Find every comment's spot; again whenever the layout changes (language toggle, resize, new comments).
  useEffect(() => {
    const el = root.current;
    if (!on || !el) return;
    function place() {
      const box = el!.getBoundingClientRect();
      const blocks = [...el!.querySelectorAll<HTMLElement>("[data-block]")];
      const next: Placed = { groups: [], ranges: new Map(), order: new Map(blocks.map((b, i) => [b.dataset.block!, i])), detached: new Set() };
      const groups = new Map<string, Placed["groups"][number]>();
      for (const c of list) {
        if (!c.anchor) continue;
        if (c.detached) {
          next.detached.add(c.id);
          continue;
        }
        const block = blocks.find((b) => b.dataset.block === c.anchor!.block);
        if (!block) {
          next.detached.add(c.id);
          continue;
        }
        // Only the server decides that a spot is gone. Words it still found may not be on screen right now
        // (another tab, pronoun or class picked in a Messenger example): then the comment marks the block only.
        const range = c.anchor.exact ? rangeForAnchor(block, c.anchor) : null;
        if (range) next.ranges.set(c.id, range);
        const g = groups.get(c.anchor.block) ?? { block: c.anchor.block, top: block.getBoundingClientRect().top - box.top, ids: [] };
        g.ids.push(c.id);
        groups.set(c.anchor.block, g);
      }
      next.groups = [...groups.values()];
      setPlaced(next);

      const hl = highlights();
      if (hl) {
        const done = new Set(list.filter((c) => c.status === "resolved").map((c) => c.id));
        const ranges = [...next.ranges.entries()];
        hl.set("comments", new Highlight(...ranges.filter(([id]) => !done.has(id)).map(([, r]) => r)));
        hl.set("comments-done", new Highlight(...ranges.filter(([id]) => done.has(id)).map(([, r]) => r)));
      }
    }
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => {
      ro.disconnect();
      highlights()?.delete("comments");
      highlights()?.delete("comments-done");
      setPlaced(EMPTY);
    };
  }, [on, list, root]);

  // The comment being looked at: stronger highlight on its words.
  useEffect(() => {
    const range = active ? placed.ranges.get(active) : undefined;
    if (on && range) {
      const hl = new Highlight(range);
      hl.priority = 1; // above the other comment highlights
      highlights()?.set("comment-active", hl);
    }
    return () => void highlights()?.delete("comment-active");
  }, [on, active, placed]);

  // Clicking highlighted words shows their comment(s) in a tooltip and picks them in the panel.
  useEffect(() => {
    const el = root.current;
    if (!on || !el) return;
    function onClick(e: MouseEvent) {
      if ((e.target as Element).closest("[data-comment-ui]")) return;
      if (!window.getSelection()?.isCollapsed) return; // selecting text to write a comment
      const caret = caretAt(e.clientX, e.clientY);
      const hits = caret ? [...placed.ranges].filter(([, r]) => r.isPointInRange(caret.startContainer, caret.startOffset)) : [];
      if (!hits.length) return setTip(null);
      showTip(hits.map(([id]) => id), firstLine(hits[0][1]));
      focusCard(hits[0][0]);
    }
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [on, placed, root]);

  // The tooltip closes on Escape, a click elsewhere, or when the view is switched off.
  useEffect(() => {
    if (!on) return setTip(null);
    if (!tip) return;
    function onPointer(e: PointerEvent) {
      if (!tipRef.current?.contains(e.target as Node)) setTip(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setTip(null);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [on, tip]);

  /** A viewport rect → coordinates inside the layer (everything here is positioned in it). */
  function rel(r: DOMRect | Box): Box {
    const box = root.current!.getBoundingClientRect();
    return { top: r.top - box.top, left: r.left - box.left, width: r.width, height: r.height };
  }

  /** Under the first line of the words (or the block's first line). */
  function firstLine(target: Range | HTMLElement): Box {
    const r = target instanceof Range ? target.getClientRects()[0] ?? target.getBoundingClientRect() : target.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: Math.min(r.height, 28) };
  }

  function showTip(ids: string[], at: Box) {
    const o = rel(at);
    const width = root.current!.clientWidth;
    setTip({ ids, top: o.top + o.height + 8, left: Math.max(0, Math.min(o.left, width - 320)) });
  }

  function focusCard(id: string) {
    setActive(id);
    document.getElementById(`cmt-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  /** Panel → page: smooth-scroll to the spot, open its tooltip and pulse the words once the scroll has settled. */
  function focusSpot(c: PanelComment) {
    setActive(c.id);
    setTip(null);
    if (!c.anchor || placed.detached.has(c.id)) return;
    const block = root.current?.querySelector<HTMLElement>(`[data-block="${CSS.escape(c.anchor.block)}"]`);
    if (!block) return;
    const range = placed.ranges.get(c.id);
    const target = range ?? block;

    const r = target.getBoundingClientRect();
    const mobile = window.matchMedia("(max-width: 1023px)").matches; // panel covers the lower half
    const y = window.scrollY + r.top - (mobile ? window.innerHeight * 0.2 : window.innerHeight / 2 - Math.min(r.height, 200) / 2);
    const moved = Math.abs(y - window.scrollY) > 4;
    if (moved) window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });

    // Wait for the tooltip's pointerdown-to-close of this very click to pass before opening the new one.
    requestAnimationFrame(() => showTip(ids(c), firstLine(target)));
    afterScroll(moved, () => {
      const rects = range ? [...range.getClientRects()] : [block.getBoundingClientRect()];
      setPulse({ key: Date.now(), rects: rects.map(rel) });
    });
  }

  /** All comments at the same spot as `c` (same words, or the same block for block comments). */
  function ids(c: PanelComment) {
    const same = list.filter((o) =>
      o.anchor?.block === c.anchor?.block && (c.anchor?.exact ? o.anchor?.exact === c.anchor.exact && o.anchor?.prefix === c.anchor.prefix : !o.anchor?.exact),
    );
    return [c.id, ...same.map((o) => o.id).filter((id) => id !== c.id)];
  }

  useEffect(() => {
    if (!pulse) return;
    const t = setTimeout(() => setPulse(null), 1400);
    return () => clearTimeout(t);
  }, [pulse]);

  if (!on) return null;

  // Page order: commented spots top to bottom, then whole-page comments, then ones whose text changed.
  const rank = (c: PanelComment) =>
    !c.anchor ? 1e6 : placed.detached.has(c.id) ? 2e6 : (placed.order.get(c.anchor.block) ?? 0) * 1000;
  const sorted = [...list].sort((a, b) => rank(a) - rank(b) || a.created_at.localeCompare(b.created_at));

  return (
    <>
      {placed.groups.map((g) => (
        <button
          key={g.block}
          type="button"
          data-comment-ui
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            showTip(g.ids, { top: r.top, left: r.left - 320 + r.width, width: r.width, height: r.height });
            focusCard(g.ids[0]);
          }}
          title={`${g.ids.length} Kommentar(e)`}
          className={`absolute -right-8 flex h-6 min-w-6 items-center justify-center gap-0.5 rounded-full px-1.5 text-[11px] font-semibold ${
            g.ids.includes(active ?? "") ? "bg-accent text-white" : "bg-accent-soft text-accent-dark hover:bg-accent hover:text-white"
          }`}
          style={{ top: g.top }}
        >
          {g.ids.length}
        </button>
      ))}

      {pulse?.rects.map((b, i) => (
        <span
          key={`${pulse.key}-${i}`}
          aria-hidden="true"
          className="comment-pulse pointer-events-none absolute z-20 rounded"
          style={{ top: b.top - 2, left: b.left - 3, width: b.width + 6, height: b.height + 4 }}
        />
      ))}

      {tip && (
        <div
          ref={tipRef}
          data-comment-ui
          role="dialog"
          aria-label="Kommentar · Bình luận"
          className="toast-in absolute z-30 flex max-h-[360px] w-[320px] max-w-full flex-col divide-y divide-line-soft overflow-y-auto rounded-xl border border-line bg-white p-1.5 shadow-xl"
          style={{ top: tip.top, left: tip.left }}
        >
          {tip.ids.flatMap((id) => {
            const c = list.find((x) => x.id === id);
            return c ? [<Card key={id} c={c} active={false} detached={false} canManage={canManage} inTip />] : [];
          })}
        </div>
      )}

      <aside
        data-comment-ui
        aria-label="Kommentare"
        className="fixed bottom-0 right-0 top-0 z-40 flex w-[360px] flex-col border-l border-line bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.04)] max-lg:top-auto max-lg:h-[55dvh] max-lg:w-full max-lg:rounded-t-xl max-lg:border-l-0 max-lg:border-t"
        style={paneTop != null ? { top: paneTop } : undefined}
      >
        <header className="flex items-center gap-2 border-b border-line px-4 py-3">
          <h2 className="m-0 flex-1 text-sm font-semibold text-ink">
            <Label de="Kommentare" vi="Bình luận" /> <span className="font-normal text-muted">{list.length}</span>
          </h2>
          {doneCount > 0 && (
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted">
              <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} className="accent-[var(--color-accent)]" />
              <Label de={`Erledigte (${doneCount})`} vi={`Đã xong (${doneCount})`} />
            </label>
          )}
          <button
            type="button"
            onClick={() => setCommentView(false)}
            aria-label="Kommentare ausblenden · Ẩn bình luận"
            title="Normale Ansicht · Chế độ đọc"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink"
          >
            ✕
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain p-3">
          {sorted.length === 0 && (
            <p className="m-0 px-2 py-8 text-center text-[13px] leading-relaxed text-muted">
              <Label
                de="Noch keine Kommentare. Markiere Wörter im Text oder nutze 💬 neben einem Abschnitt."
                vi="Chưa có bình luận. Bôi đen chữ trong bài hoặc bấm 💬 cạnh một đoạn."
              />
            </p>
          )}
          {sorted.map((c) => (
            <Card
              key={c.id}
              c={c}
              active={active === c.id}
              detached={placed.detached.has(c.id)}
              canManage={canManage}
              onSelect={() => focusSpot(c)}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

function Card({
  c,
  active,
  detached,
  canManage,
  onSelect,
  inTip = false,
}: {
  c: PanelComment;
  active: boolean;
  detached: boolean;
  canManage: boolean;
  onSelect?: () => void;
  inTip?: boolean; // shown in the tooltip next to the words: no quote, no id
}) {
  const t = tagInfo(c.tag);
  const status = COMMENT_STATUSES.find((s) => s.id === c.status);
  return (
    <article
      id={inTip ? undefined : `cmt-${c.id}`}
      onClick={onSelect}
      className={`flex flex-col gap-1.5 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
        inTip ? "" : `cursor-pointer border ${active ? "border-accent bg-accent-soft/40" : "border-line hover:border-[#C9CDD3]"}`
      } ${c.status === "resolved" ? "opacity-70" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {t && (
          <span className="rounded-full bg-chip px-2 py-0.5 font-medium text-ink">
            {t.emoji} <Label de={t.de} vi={t.vi} />
          </span>
        )}
        <span className="font-medium text-body">{c.author}</span>
        <span>{formatDate(c.created_at)}</span>
        {c.status !== "open" && status && (
          <span className={`rounded px-1.5 py-0.5 ${c.status === "resolved" ? "bg-ok-soft text-ok" : "bg-accent-soft text-accent-dark"}`}>
            <Label de={status.de} vi={status.vi} />
          </span>
        )}
      </div>

      {inTip ? null : c.anchor?.exact ? (
        <blockquote className={`m-0 line-clamp-2 border-l-2 pl-2 italic text-muted ${detached ? "border-warn" : "border-[#F2C94C]"}`}>
          {c.anchor.exact}
        </blockquote>
      ) : (
        <span className="text-xs text-faint">
          {c.anchor ? <Label de="Abschnitt" vi="Cả đoạn" /> : <Label de="Ganze Seite" vi="Cả trang" />}
        </span>
      )}
      {detached && (
        <span className="text-xs text-warn">
          <Label de="Stelle wurde inzwischen geändert" vi="Đoạn này đã được sửa" />
        </span>
      )}

      {c.body && <p className="m-0 whitespace-pre-line text-ink">{c.body}</p>}
      {c.resolution_note && (
        <p className="m-0 text-muted">
          ↳ <Label de="Antwort" vi="Trả lời" />: {c.resolution_note}
        </p>
      )}

      {canManage && (
        <div onClick={(e) => e.stopPropagation()} className="flex">
          <CommentActions id={c.id} status={c.status} />
        </div>
      )}
    </article>
  );
}

/** Top-bar switch between the normal reading view and the comment view, with the number of open comments.
 *  Like the language toggle it pins to the top once the bar scrolls away – just left of the pinned
 *  language toggle – and collapses to the icon and the count. */
export function CommentToggle({ open }: { open: number }) {
  const on = useCommentView();
  const slotRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [pinRight, setPinRight] = useState<number | null>(null);
  const [pinTop, setPinTop] = useState(8);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const el: HTMLDivElement = slot;
    // In the side pane the pane scrolls, not the window: pin to the top of the pane instead.
    const pane = el.closest<HTMLElement>(".doc-pane");
    // The language toggle's pinned panel (see LangToggle); its slot keeps the full width in the bar.
    const lang = (pane ?? document).querySelector<HTMLElement>('[role="group"][aria-label^="Sprache"]');

    let frame = 0;
    function update() {
      const rect = el.getBoundingClientRect();
      const top = pinTopEdge(pane) + 8;
      const next = rect.top < top;
      setStuck(next);
      if (!next) return;
      setPinTop(top);
      const langSlot = lang?.parentElement?.getBoundingClientRect();
      const right = lang && langSlot ? window.innerWidth - langSlot.right + lang.offsetWidth + 6 : window.innerWidth - rect.right;
      setPinRight((prev) => (prev !== null && Math.abs(prev - right) < 0.5 ? prev : right));
    }
    function onChange() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    const scroller = pane ?? window;
    scroller.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    const ro = lang ? new ResizeObserver(onChange) : null; // follows the language toggle collapsing
    if (lang) ro!.observe(lang);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      ro?.disconnect();
    };
  }, []);

  const content = (expanded: boolean) => (
    <>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
      </svg>
      <span
        className={`grid min-w-0 overflow-hidden transition-[grid-template-columns,opacity] duration-200 ease-out motion-reduce:transition-none ${
          expanded ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
        }`}
      >
        <span className="min-w-0 overflow-hidden whitespace-nowrap">
          <Label de="Kommentare" vi="Bình luận" />
        </span>
      </span>
      <span className={`flex-none rounded-full px-1.5 text-[11px] leading-[16px] ${open > 0 ? "bg-accent text-white" : "bg-chip text-muted"}`}>{open}</span>
    </>
  );
  const look = `flex h-8 items-center gap-1.5 rounded-[7px] border px-2 text-xs font-medium ${
    on ? "border-accent bg-accent-soft text-accent-dark" : "border-line bg-white text-body hover:bg-hover"
  }`;

  return (
    <div ref={slotRef} className="relative h-8">
      <div aria-hidden="true" className={`invisible ${look}`}>
        {content(true)}
      </div>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setCommentView(!on)}
        title={on ? "Normale Ansicht · Chế độ đọc" : "Kommentare anzeigen · Hiện bình luận"}
        className={`${look} transition-shadow duration-200 ease-out motion-reduce:transition-none ${
          stuck ? "fixed z-30 shadow-[0_1px_2px_rgba(20,24,32,0.06),0_8px_20px_rgba(20,24,32,0.1)]" : "absolute inset-y-0 right-0"
        }`}
        style={stuck && pinRight !== null ? { right: pinRight, top: pinTop } : undefined}
      >
        {content(!stuck)}
      </button>
    </div>
  );
}
