"use client";

import { useEffect, useMemo, useState } from "react";
import { setCommentView, useCommentView } from "@/lib/commentViewStore";
import { COMMENT_STATUSES, tagInfo } from "@/lib/comments";
import { formatDate } from "@/lib/format";
import type { PageComment } from "@/lib/types";
import { Label } from "./Bi";
import { CommentActions } from "./admin/CommentActions";
import { caretAt, rangeForAnchor } from "./commentDom";

export type PanelComment = Pick<PageComment, "id" | "anchor" | "tag" | "body" | "status" | "resolution_note" | "created_at"> & { author: string };

type Placed = {
  groups: { block: string; top: number; ids: string[] }[];
  ranges: Map<string, Range>;
  order: Map<string, number>; // block index on the page
  detached: Set<string>;      // the block or the quoted words are gone
};
const EMPTY: Placed = { groups: [], ranges: new Map(), order: new Map(), detached: new Set() };

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
        const block = blocks.find((b) => b.dataset.block === c.anchor!.block);
        const range = block && c.anchor.exact ? rangeForAnchor(block, c.anchor) : null;
        if (!block || (c.anchor.exact && !range)) {
          next.detached.add(c.id);
          continue;
        }
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

  // Clicking highlighted words opens their comment in the panel.
  useEffect(() => {
    const el = root.current;
    if (!on || !el) return;
    function onClick(e: MouseEvent) {
      if (!window.getSelection()?.isCollapsed) return; // selecting text to write a comment
      const caret = caretAt(e.clientX, e.clientY);
      if (!caret) return;
      for (const [id, r] of placed.ranges) {
        if (r.isPointInRange(caret.startContainer, caret.startOffset)) return focusCard(id);
      }
    }
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [on, placed, root]);

  function focusCard(id: string) {
    setActive(id);
    document.getElementById(`cmt-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function focusSpot(c: PanelComment) {
    setActive(c.id);
    if (!c.anchor || placed.detached.has(c.id)) return;
    const block = root.current?.querySelector<HTMLElement>(`[data-block="${CSS.escape(c.anchor.block)}"]`);
    if (!block) return;
    block.scrollIntoView({ block: "center", behavior: "smooth" });
    if (!c.anchor.exact) {
      block.classList.add("comment-flash");
      setTimeout(() => block.classList.remove("comment-flash"), 1600);
    }
  }

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
          onClick={() => focusCard(g.ids[0])}
          title={`${g.ids.length} Kommentar(e)`}
          className={`absolute -right-8 flex h-6 min-w-6 items-center justify-center gap-0.5 rounded-full px-1.5 text-[11px] font-semibold ${
            g.ids.includes(active ?? "") ? "bg-accent text-white" : "bg-accent-soft text-accent-dark hover:bg-accent hover:text-white"
          }`}
          style={{ top: g.top }}
        >
          {g.ids.length}
        </button>
      ))}

      <aside
        data-comment-ui
        aria-label="Kommentare"
        className="fixed bottom-0 right-0 top-0 z-40 flex w-[360px] flex-col border-l border-line bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.04)] max-lg:top-auto max-lg:h-[55dvh] max-lg:w-full max-lg:rounded-t-xl max-lg:border-l-0 max-lg:border-t"
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
}: {
  c: PanelComment;
  active: boolean;
  detached: boolean;
  canManage: boolean;
  onSelect: () => void;
}) {
  const t = tagInfo(c.tag);
  const status = COMMENT_STATUSES.find((s) => s.id === c.status);
  return (
    <article
      id={`cmt-${c.id}`}
      onClick={onSelect}
      className={`flex cursor-pointer flex-col gap-1.5 rounded-lg border px-3 py-2.5 text-[13px] transition-colors ${
        active ? "border-accent bg-accent-soft/40" : "border-line hover:border-[#C9CDD3]"
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

      {c.anchor?.exact ? (
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

/** Top-bar switch between the normal reading view and the comment view, with the number of open comments. */
export function CommentToggle({ open }: { open: number }) {
  const on = useCommentView();
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setCommentView(!on)}
      title={on ? "Normale Ansicht · Chế độ đọc" : "Kommentare anzeigen · Hiện bình luận"}
      className={`flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-medium ${
        on ? "border-accent bg-accent-soft text-accent-dark" : "border-line bg-white text-body hover:bg-hover"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
      </svg>
      <Label de="Kommentare" vi="Bình luận" />
      <span className={`rounded-full px-1.5 text-[11px] leading-[16px] ${open > 0 ? "bg-accent text-white" : "bg-chip text-muted"}`}>{open}</span>
    </button>
  );
}
