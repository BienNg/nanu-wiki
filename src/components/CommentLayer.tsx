"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { addComment } from "@/app/actions";
import { COMMENT_TAGS } from "@/lib/comments";
import type { CommentAnchor, CommentTag } from "@/lib/types";
import { Label } from "./Bi";
import { anchorFromRange, rangeForAnchor, revealAnchor } from "./commentDom";
import { CommentView, type PanelComment } from "./CommentView";

export type { PanelComment };

type Spot = { anchor: CommentAnchor; top: number; left: number };

/**
 * Wraps a page's blocks so staff can comment on them:
 * select words → "Kommentieren" bubble; hover a block → 💬 in the margin; feedback box at the end of the page.
 * `focus` (from `?c=<id>`) scrolls to a comment's spot and highlights the quoted words.
 * `comments` are shown in the comment view (see CommentView); `canManage` = editor of this area or admin.
 */
export function CommentLayer({
  pageId,
  focus,
  comments,
  canManage,
  children,
}: {
  pageId: string;
  focus?: CommentAnchor | "missing";
  comments: PanelComment[];
  canManage: boolean;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ block: string; top: number } | null>(null);
  const [bubble, setBubble] = useState<Spot | null>(null);
  const [composer, setComposer] = useState<Spot | null>(null);
  const [moved, setMoved] = useState(false);

  const offset = useCallback((rect: DOMRect) => {
    const box = root.current!.getBoundingClientRect();
    return { top: rect.top - box.top, left: rect.left - box.left, bottom: rect.bottom - box.top, width: box.width };
  }, []);

  // Text selection → bubble under the selection.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function onChange() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const sel = window.getSelection();
        if (!root.current || !sel || sel.isCollapsed || sel.rangeCount === 0) return setBubble(null);
        const range = sel.getRangeAt(0);
        const anchor = anchorFromRange(range, root.current);
        if (!anchor) return setBubble(null);
        const o = offset(range.getBoundingClientRect());
        setBubble({ anchor, top: o.bottom + 8, left: Math.max(0, Math.min(o.left, o.width - 150)) });
      }, 180);
    }
    document.addEventListener("selectionchange", onChange);
    return () => {
      document.removeEventListener("selectionchange", onChange);
      clearTimeout(timer);
    };
  }, [offset]);

  // Link from the inbox or Slack: scroll there and highlight the words.
  // Only the server decides that a spot is gone ("missing", see resolveAnchor); if the browser can't
  // place the exact words it still shows the block. `?c=` is dropped afterwards, so a reload is a normal visit.
  useEffect(() => {
    if (focus === undefined) return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("c")) {
      url.searchParams.delete("c");
      window.history.replaceState(window.history.state, "", url);
    }
    if (focus === "missing") return setMoved(true);
    if (!focus || !root.current) return;
    const block = root.current.querySelector<HTMLElement>(`[data-block="${CSS.escape(focus.block)}"]`);
    if (!block) return;
    block.scrollIntoView({ block: "center" });
    block.classList.add("comment-flash");
    const highlights = typeof CSS !== "undefined" && "highlights" in CSS ? CSS.highlights : null;
    // On another tab: switch to it, and mark the words once it has rendered.
    const mark = () => {
      const range = rangeForAnchor(block, focus);
      if (range && highlights) highlights.set("comment-focus", new Highlight(range));
    };
    const shown = revealAnchor(block, focus) ? setTimeout(mark, 80) : (mark(), undefined);
    const t = setTimeout(() => block.classList.remove("comment-flash"), 2400);
    return () => {
      clearTimeout(shown);
      clearTimeout(t);
      highlights?.delete("comment-focus");
    };
  }, [focus]);

  function onMouseMove(e: React.MouseEvent) {
    const target = e.target as Element;
    if (target.closest("[data-comment-ui]")) return;
    const block = target.closest<HTMLElement>("[data-block]");
    if (block && root.current?.contains(block)) {
      const id = block.dataset.block!;
      if (hover?.block !== id) setHover({ block: id, top: offset(block.getBoundingClientRect()).top });
      return;
    }
    // The button sits in the left margin, outside the section. Keep it up while the
    // pointer travels through that gutter, otherwise it vanishes before it can be clicked.
    if (hover && root.current) {
      const el = root.current.querySelector<HTMLElement>(`[data-block="${CSS.escape(hover.block)}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        if (e.clientX <= r.left + 12 && e.clientY >= r.top - 12 && e.clientY <= r.bottom + 12) return;
      }
    }
    setHover(null);
  }

  function openFor(spot: Spot) {
    setComposer(spot);
    setBubble(null);
    setHover(null);
  }

  function close() {
    setComposer(null);
    window.getSelection()?.removeAllRanges();
  }

  return (
    <div ref={root} className="relative" onMouseMove={onMouseMove} onMouseLeave={() => setHover(null)}>
      {moved && (
        <p className="m-0 mb-4 rounded-lg bg-warn-soft px-4 py-2.5 text-[13px] text-[#5C4505]">
          <Label
            de="Die kommentierte Stelle wurde inzwischen geändert – der Kommentar zeigt den alten Text."
            vi="Đoạn được bình luận đã thay đổi – bình luận hiển thị nội dung cũ."
          />
        </p>
      )}

      {children}

      <CommentView root={root} comments={comments} canManage={canManage} />

      {hover && !composer && (
        <button
          type="button"
          data-comment-ui
          title="Kommentieren · Bình luận"
          aria-label="Diesen Abschnitt kommentieren · Bình luận phần này"
          onClick={() => openFor({ anchor: { block: hover.block }, top: hover.top + 30, left: 0 })}
          className="absolute -left-8 z-20 flex h-7 w-7 items-center justify-center rounded-md text-faint before:absolute before:-inset-y-2 before:left-0 before:w-12 before:content-[''] hover:bg-hover hover:text-accent"
          style={{ top: hover.top }}
        >
          <ChatIcon />
        </button>
      )}

      {bubble && !composer && (
        <button
          type="button"
          data-comment-ui
          onMouseDown={(e) => e.preventDefault()} // keep the selection
          onClick={() => openFor({ ...bubble, top: bubble.top })}
          className="toast-in absolute z-30 flex items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[13px] font-medium text-white shadow-lg hover:bg-[#1F2125]"
          style={{ top: bubble.top, left: bubble.left }}
        >
          <ChatIcon />
          <Label de="Kommentieren" vi="Bình luận" />
        </button>
      )}

      {composer && (
        <div data-comment-ui className="absolute inset-x-0 z-30 flex justify-start max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:!top-auto" style={{ top: composer.top }}>
          <Composer
            pageId={pageId}
            anchor={composer.anchor}
            onClose={close}
            className="max-sm:rounded-b-none max-sm:w-full"
            style={{ marginLeft: Math.max(0, composer.left) }}
          />
        </div>
      )}

      <PageFeedback pageId={pageId} />
    </div>
  );
}

/** "Was this page helpful?" at the end of every page – the easiest place to leave a note. */
function PageFeedback({ pageId }: { pageId: string }) {
  const [open, setOpen] = useState<CommentTag | null | false>(false);
  return (
    <section data-comment-ui className="mt-12 rounded-xl border border-line bg-side px-5 py-4">
      {open === false ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
          <p className="m-0 flex-1 basis-[220px] text-sm font-medium text-ink">
            <Label de="War diese Seite hilfreich? Was fehlt?" vi="Trang này có hữu ích không? Còn thiếu gì?" />
          </p>
          <div className="flex flex-wrap gap-1.5">
            {COMMENT_TAGS.map((t) => (
              <button key={t.id} type="button" onClick={() => setOpen(t.id)} className="rounded-full border border-line bg-white px-2.5 py-1 text-[13px] text-body hover:border-accent hover:text-accent">
                {t.emoji} <Label de={t.de} vi={t.vi} />
              </button>
            ))}
          </div>
          <p className="m-0 basis-full text-xs text-muted">
            <Label
              de="Tipp: Markiere einfach Wörter im Text, um genau dazu etwas zu sagen."
              vi="Mẹo: Bôi đen chữ trong bài để góp ý đúng chỗ đó."
            />
          </p>
        </div>
      ) : (
        <Composer pageId={pageId} anchor={null} initialTag={open} onClose={() => setOpen(false)} className="!w-full !max-w-none border-0 !p-0 !shadow-none bg-transparent" />
      )}
    </section>
  );
}

function Composer({
  pageId,
  anchor,
  initialTag = null,
  onClose,
  className = "",
  style,
}: {
  pageId: string;
  anchor: CommentAnchor;
  initialTag?: CommentTag | null;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [tag, setTag] = useState<CommentTag | null>(initialTag);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();
  const text = useRef<HTMLTextAreaElement>(null);

  useEffect(() => text.current?.focus({ preventScroll: true }), []);

  function send() {
    if (!tag && !body.trim()) return setError("Wähle einen Tag oder schreib ein paar Worte · Chọn nhãn hoặc viết vài chữ");
    setError(null);
    start(async () => {
      const res = await addComment({ pageId, anchor, tag, body });
      if (!res.ok) return setError(res.message);
      setSent(true);
      setTimeout(onClose, 1800);
    });
  }

  return (
    <div
      role="dialog"
      aria-label="Kommentar · Bình luận"
      className={`toast-in w-[360px] max-w-full rounded-xl border border-line bg-white p-3.5 shadow-xl ${className}`}
      style={style}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
      }}
    >
      {sent ? (
        <p className="m-0 py-3 text-center text-sm font-medium text-ok">
          🙏 <Label de="Danke! Das Team kümmert sich darum." vi="Cảm ơn bạn! Nhóm sẽ xem góp ý này." />
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {anchor?.exact ? (
            <blockquote className="m-0 line-clamp-3 border-l-2 border-accent pl-2.5 text-[13px] italic text-muted">{anchor.exact}</blockquote>
          ) : (
            <span className="cap">{anchor ? <Label de="Zu diesem Abschnitt" vi="Về phần này" /> : <Label de="Zu dieser Seite" vi="Về trang này" />}</span>
          )}
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Art · Loại">
            {COMMENT_TAGS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={tag === t.id}
                onClick={() => setTag(tag === t.id ? null : t.id)}
                className="rounded-full border border-line px-2.5 py-1 text-[13px] text-body hover:border-accent aria-checked:border-accent aria-checked:bg-accent-soft aria-checked:text-accent-dark"
              >
                {t.emoji} <Label de={t.de} vi={t.vi} />
              </button>
            ))}
          </div>
          <textarea
            ref={text}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Was ist unklar? Was fehlt? (optional) · Điều gì chưa rõ? (không bắt buộc)"
            className="w-full resize-y rounded-lg border border-line px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-faint focus:border-accent"
          />
          {error && <p className="m-0 text-[13px] text-bad">{error}</p>}
          <div className="flex items-center justify-end gap-2">
            <span className="mr-auto hidden text-xs text-faint sm:inline">⌘/Ctrl + Enter</span>
            <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-[13px] text-body hover:bg-hover">
              <Label de="Abbrechen" vi="Hủy" />
            </button>
            <button
              type="button"
              onClick={send}
              disabled={pending}
              className="rounded-md bg-accent px-3.5 py-1.5 text-[13px] font-medium text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {pending ? "…" : <Label de="Senden" vi="Gửi" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
    </svg>
  );
}
