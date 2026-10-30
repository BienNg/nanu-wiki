"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { initials } from "@/lib/format";
import type { Conversation } from "@/lib/types";
import {
  LEVELS,
  PLACES,
  PLACE_LABEL,
  PRONOUNS,
  PRONOUN_LABEL,
  defaultSelection,
  placeholders,
  resolveConversation,
  selectorsFor,
  type Selection,
} from "@/lib/dialogue";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { ImageModal, copyImageToClipboard } from "./ImageModal";
import { ClassPicker, useUpcomingClasses } from "./ClassPicker";
import { fits, withClasses } from "@/lib/classes";

type Note = { at: number; de: string; vi?: string | null };
type Box = { x: number; y: number; w: number; h: number };
type Placed = Box & { arrow?: { sx: number; sy: number; ex: number; ey: number } };

const GAP = 14; // kept free between notes and the edge of the page
const REACH = 30; // between a note and the message it points at: room for a short arrow
const MIN_W = 140; // narrower than this, a note is unreadable
const MAX_W = 250;

/** Static Messenger example: a finished conversation between a customer and NaNu NaNa ("me"), nothing to type.
 *  Explanations are handwritten notes in the empty space just left of their message (running out of the chat box
 *  if needed), with a short curved arrow pointing at it. They never move the messages.
 *  Where there is no room (phones), the bubbles get small numbers and the notes are listed under the chat.
 *  The goal of the last message sits in a green box under the chat.
 *  Selectors above the messages switch how we address the customer (bạn, em, chị …), and – where the text
 *  depends on them – the course level and where the customer lives. Our messages have a copy button. */
export function MessengerMockup({ block }: { block: Conversation }) {
  return block.messages.some((m) => m.classes) ? <ClassesMockup block={block} /> : <PlainMockup block={block} />;
}

function PlainMockup({ block }: { block: Conversation }) {
  const [sel, setSel] = useState<Selection>(() => defaultSelection(block));
  const shown = useMemo(() => selectorsFor(block), [block]);
  const resolved = useMemo(() => resolveConversation(block, sel), [block, sel]);
  return (
    <ChatView
      block={resolved}
      sel={sel}
      shown={shown}
      toolbar={<Selectors sel={sel} shown={shown} onChange={(next) => setSel({ ...sel, ...next })} />}
    />
  );
}

/** A Messenger example whose reply is built from upcoming classes in Notion: the classes that fit the chosen level and
 *  place are ticked whenever those change, and staff can tick or untick any class. */
function ClassesMockup({ block }: { block: Conversation }) {
  const [sel, setSel] = useState<Selection>(() => defaultSelection(block));
  const shown = useMemo(() => selectorsFor(block), [block]);
  const state = useUpcomingClasses();
  const classes = useMemo(() => (state && "classes" in state ? state.classes : []), [state]);
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => {
    setPicked(classes.filter((c) => fits(c, sel.level, sel.place)).map((c) => c.id));
  }, [classes, sel.level, sel.place]);
  const resolved = useMemo(
    () => resolveConversation(withClasses(block, classes.filter((c) => picked.includes(c.id))), sel),
    [block, classes, picked, sel],
  );
  return (
    <ChatView
      block={resolved}
      sel={sel}
      shown={shown}
      toolbar={
        <>
          <Selectors sel={sel} shown={shown} onChange={(next) => setSel({ ...sel, ...next })} />
          <ClassPicker state={state} sel={sel} picked={picked} onChange={setPicked} />
        </>
      }
    />
  );
}

function ChatView({
  block,
  sel,
  shown,
  toolbar,
}: {
  block: Conversation;
  sel: Selection;
  shown: { level: boolean; place: boolean };
  toolbar: React.ReactNode;
}) {
  const messages = block.messages.filter((m) => m.text.trim() || m.image);
  const notes = collectNotes(block, messages);

  const wrapRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const bubbleRefs = useRef<(HTMLElement | null)[]>([]);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [placed, setPlaced] = useState<(Placed | null)[] | null>(null);

  const layout = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const W = wrap.getBoundingClientRect();
    const bounds = scrollBounds(wrap);
    // Room beyond the chat box a note may run into.
    const room = { left: W.left - bounds.left - GAP, right: bounds.right - W.right - GAP };
    const rel = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - W.left, y: r.top - W.top, w: r.width, h: r.height };
    };
    const rows = rowRefs.current.map((el) => (el ? rel(el) : null));
    // Inside the box, notes stay in the message area (above the goal).
    const log = logRef.current ? rel(logRef.current) : null;
    const chatBottom = log ? log.y + log.h : W.height;
    const taken: Box[] = [];

    const height = (i: number, w: number) => {
      const m = measureRefs.current[i];
      if (!m) return 0;
      m.style.width = `${w}px`;
      return m.offsetHeight;
    };

    const result = notes.map((n, i): Placed | null => {
      const bubbleEl = bubbleRefs.current[n.at];
      if (!bubbleEl) return null;
      const B = rel(bubbleEl);
      const own = rows[n.at] ?? B;
      const mid = B.y + Math.min(B.h / 2, 28);

      // A note sits just left of its message (where the chat is emptiest), so the arrow stays short.
      // It may start inside the chat box and run out of it. Only if the left is full: just right of the message.
      const leftEdge = Math.min(B.x, own.x); // the translation can be wider than the bubble
      const rightEdge = Math.max(B.x + B.w, own.x + own.w);
      const candidates = [
        { left: true, space: leftEdge - REACH + room.left },
        { left: false, space: W.width - rightEdge - REACH + room.right },
      ];

      for (const c of candidates) {
        if (c.space < MIN_W) continue;
        const w = Math.min(MAX_W, c.space);
        const h = height(i, w);
        const x = c.left ? leftEdge - REACH - w : rightEdge + REACH;
        const inBox = x < W.width && x + w > 0;
        // Start level with the message; step down past messages and notes it would cover, but not past the message.
        let y = Math.max(0, mid - 18);
        for (let tries = 0; tries < 6; tries++) {
          const box = { x, y, w, h };
          const hit = [...rows.filter((r): r is Box => !!r), ...taken].find((r) => intersects(r, box, 6));
          if (!hit) break;
          y = hit.y + hit.h + 8;
        }
        const box = { x, y, w, h };
        const blocked =
          y > B.y + B.h ||
          (inBox && y + h > chatBottom) ||
          [...rows.filter((r): r is Box => !!r), ...taken].some((r) => intersects(r, box, 6));
        if (blocked) continue;
        taken.push(box);
        return {
          ...box,
          arrow: c.left ? { sx: x + w + 4, sy: y + 12, ex: B.x - 6, ey: mid } : { sx: x - 4, sy: y + 12, ex: B.x + B.w + 6, ey: mid },
        };
      }
      return null;
    });
    setPlaced(result);
    // `notes` and `messages` are derived from `block`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block]);

  useLayoutEffect(() => {
    layout();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    const scroller = scrollParent(wrap);
    if (scroller) ro.observe(scroller);
    // The DE+VI / DE / VI toggle changes the notes' height.
    const mo = new MutationObserver(layout);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", layout);
    };
  }, [layout]);

  const listed = placed ? notes.map((n, i) => ({ n, i })).filter(({ i }) => !placed[i]) : [];
  const number = (msgIndex: number) => {
    const k = listed.findIndex(({ n }) => n.at === msgIndex);
    return k < 0 ? null : k + 1;
  };

  return (
    <div data-reveal className="flex flex-col gap-3">
      <div ref={wrapRef} className="relative">
        <figure className="m-0 overflow-hidden rounded-[14px] border border-line shadow-[0_6px_20px_rgba(16,24,40,.06)]">
          <div className="flex items-center gap-2.5 border-b border-line bg-white px-3.5 py-2.5">
            <span className="relative flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#E4E6EB] text-[13px] font-semibold text-ink">
              {initials(block.customer)}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#31A24C]" />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <strong className="truncate text-sm font-semibold text-ink">{block.customer || "Kunde"}</strong>
              <span className="text-xs text-muted">Messenger</span>
            </span>
            <span className="cap ml-auto rounded-full bg-chip px-2.5 py-1">
              <Label de={block.label_de ?? "Beispiel"} vi={block.label_vi ?? "Ví dụ"} />
            </span>
          </div>
          {toolbar}

          <div ref={logRef} role="log" aria-label="Beispielchat" className="flex flex-col gap-1.5 bg-white px-3.5 py-4">
            {messages.map((m, i) => {
              const mine = m.from === "me";
              const next = messages[i + 1];
              const nextSame = next?.from === m.from && !next.stamp_de;
              const num = number(i);
              return (
                <div key={i} className="contents">
                  {m.stamp_de && (
                    <span className="my-2 self-center text-center text-[11px] font-medium text-faint">
                      <Label de={m.stamp_de} vi={m.stamp_vi ?? m.stamp_de} />
                    </span>
                  )}
                  <div
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    className={`flex max-w-[78%] flex-col ${mine ? "items-end self-end" : "items-start self-start"} ${nextSame ? "" : "mb-2"}`}
                  >
                    <span
                      ref={(el) => {
                        bubbleRefs.current[i] = el;
                      }}
                      className="relative block"
                    >
                      {m.image ? (
                        <ImageModal src={m.image.src} alt={m.image.alt_de} className="block cursor-zoom-in">
                          <img src={m.image.src} alt={m.image.alt_de} className="block w-[220px] max-w-full rounded-[18px] border border-line" />
                        </ImageModal>
                      ) : (
                        <span
                          className={`block whitespace-pre-line rounded-[18px] px-3.5 py-2 text-[14px] leading-snug ${
                            mine ? "bg-accent text-white" : "bg-[#F0F0F0] text-ink"
                          }`}
                        >
                          {m.text}
                        </span>
                      )}
                      {mine && m.image && <CopyImage src={m.image.src} />}
                      {mine && !m.image && <CopyMessage text={m.text} sel={sel} shown={shown} />}
                      {num && (
                        <span
                          className={`font-hand absolute -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c2410c] text-[12px] text-white ${
                            mine ? "-left-2" : "-right-2"
                          }`}
                        >
                          {num}
                        </span>
                      )}
                    </span>
                    {m.translation_de && <span className={`de mt-1 px-1 text-xs italic text-muted ${mine ? "text-right" : ""}`}>{m.translation_de}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          {block.goal_de && (
            <figcaption className="flex gap-2.5 border-t border-line bg-ok-soft px-3.5 py-2.5 text-[13px] leading-relaxed text-ok">
              <Icon name="compass" size={16} strokeWidth={2} className="mt-[3px] flex-none" />
              <span>
                <strong className="cap mb-0.5 block text-ok">
                  <Label de="Ziel der nächsten Nachricht" vi="Mục tiêu của tin nhắn tiếp theo" />
                </strong>
                <Bi de={block.goal_de} vi={block.goal_vi} />
              </span>
            </figcaption>
          )}
        </figure>

        {/* Hidden copies of the notes, used to measure their height at a given width. */}
        {notes.map((n, i) => (
          <div
            key={i}
            ref={(el) => {
              measureRefs.current[i] = el;
            }}
            aria-hidden
            className="pointer-events-none invisible absolute left-0 top-0"
          >
            <NoteText note={n} />
          </div>
        ))}

        {placed && (
          <>
            {notes.map((n, i) => {
              const p = placed[i];
              if (!p) return null;
              return (
                <div key={i} className="absolute" style={{ left: p.x, top: p.y, width: p.w }}>
                  <NoteText note={n} />
                </div>
              );
            })}
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-[#c2410c]">
              {placed.map((p, i) => (p?.arrow ? <Arrow key={i} {...p.arrow} /> : null))}
            </svg>
          </>
        )}
      </div>

      {listed.length > 0 && (
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {listed.map(({ n, i }, k) => (
            <li key={i} className="flex gap-2">
              <span className="font-hand mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#c2410c] text-[12px] text-white">
                {k + 1}
              </span>
              <NoteText note={n} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function NoteText({ note }: { note: Note }) {
  return (
    <p className="font-hand m-0 -rotate-[0.6deg] text-[16px] leading-[1.3] text-[#c2410c]">
      <Bi de={note.de} vi={note.vi} />
    </p>
  );
}

/** A hand-drawn curve from the note to the bubble, with an open arrowhead at the bubble. */
function Arrow({ sx, sy, ex, ey }: { sx: number; sy: number; ex: number; ey: number }) {
  const lift = Math.min(40, Math.abs(ex - sx) * 0.35 + 12);
  const c1x = sx + (ex - sx) * 0.35;
  const c2x = sx + (ex - sx) * 0.75;
  const c1y = Math.min(sy, ey) - lift;
  const c2y = ey - lift * 0.4;
  const angle = Math.atan2(ey - c2y, ex - c2x);
  const head = (a: number) => `${ex - 9 * Math.cos(angle + a)} ${ey - 9 * Math.sin(angle + a)}`;
  return (
    <g fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`} />
      <path d={`M ${head(0.45)} L ${ex} ${ey} L ${head(-0.45)}`} />
    </g>
  );
}

/** Notes on the messages; without any, the conversation's note explains our first reply. */
function collectNotes(block: Conversation, messages: Conversation["messages"]): Note[] {
  const notes: Note[] = [];
  const own = messages.some((m) => m.note_de);
  messages.forEach((m, i) => {
    if (m.note_de) notes.push({ at: i, de: m.note_de, vi: m.note_vi });
  });
  const firstReply = messages.findIndex((m) => m.from === "me");
  if (!own && block.note_de && firstReply >= 0) notes.push({ at: firstReply, de: block.note_de, vi: block.note_vi });
  return notes;
}

function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const s = getComputedStyle(p);
    if (/(auto|scroll)/.test(s.overflowX + s.overflowY)) return p;
  }
  return null;
}

/** The visible horizontal area notes may use: the scrolling pane the page sits in (or the window),
 *  minus the table of contents beside the text. */
function scrollBounds(el: HTMLElement) {
  const p = scrollParent(el);
  const r = p?.getBoundingClientRect();
  const bounds = r ? { left: r.left, right: r.left + p!.clientWidth } : { left: 0, right: document.documentElement.clientWidth };
  const own = el.getBoundingClientRect();
  const toc = document.querySelector('nav[aria-label="Inhaltsverzeichnis"]')?.getBoundingClientRect();
  if (toc && toc.width > 0 && toc.left >= own.right) bounds.right = Math.min(bounds.right, toc.left);
  return bounds;
}

function intersects(a: Box, b: Box, pad: number) {
  return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;
}

type Shown = { level: boolean; place: boolean };

/** The row of selectors between the chat header and the messages. */
function Selectors({ sel, shown, onChange }: { sel: Selection; shown: Shown; onChange: (next: Partial<Selection>) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-side px-3.5 py-2 text-[12px]">
      <Choice label={<Label de="Anrede" vi="Xưng hô" />} options={PRONOUNS.map((p) => ({ value: p, label: PRONOUN_LABEL[p] }))} value={sel.pronoun} onChange={(pronoun) => onChange({ pronoun })} />
      {shown.level && (
        <Choice label={<Label de="Niveau" vi="Trình độ" />} options={LEVELS.map((l) => ({ value: l, label: l }))} value={sel.level} onChange={(level) => onChange({ level })} />
      )}
      {shown.place && (
        <Choice
          label={<Label de="Wohnort" vi="Nơi ở" />}
          options={PLACES.map((p) => ({ value: p, label: <Label de={PLACE_LABEL[p].de} vi={PLACE_LABEL[p].vi} /> }))}
          value={sel.place}
          onChange={(place) => onChange({ place })}
        />
      )}
    </div>
  );
}

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: React.ReactNode;
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap items-center gap-1">
      <span className="mr-1 font-semibold text-muted">{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={`rounded-full border px-2 py-0.5 font-medium transition-colors ${
            o.value === value ? "border-accent bg-accent text-white" : "border-line bg-white text-body hover:bg-chip"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** One click copies the photo so it can be pasted into a real chat. */
function CopyImage({ src }: { src: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyImageToClipboard(src);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Bild kopieren"
      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-muted shadow-sm hover:text-accent"
    >
      {copied ? (
        <span className="text-[11px] font-semibold text-accent">✓</span>
      ) : (
        <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h8" />
        </svg>
      )}
    </button>
  );
}

/** Copy button on one of our messages. It first shows the current selections (and placeholders still to fill in)
 *  so staff can check them, then copies the Vietnamese text. */
function CopyMessage({ text, sel, shown }: { text: string; sel: Selection; shown: Shown }) {
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<{ top: number; right: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const todo = placeholders(text);

  useEffect(() => {
    if (!at) return;
    const close = () => setAt(null);
    const outside = (e: MouseEvent) => {
      if (!pop.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) close();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", esc);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [at]);

  function open() {
    if (at) return setAt(null);
    const r = btn.current!.getBoundingClientRect();
    setCopied(false);
    setAt({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) });
  }

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setAt(null), 900);
  }

  const rows: [React.ReactNode, React.ReactNode][] = [[<Label key="a" de="Anrede" vi="Xưng hô" />, PRONOUN_LABEL[sel.pronoun]]];
  if (shown.level) rows.push([<Label key="n" de="Niveau" vi="Trình độ" />, sel.level]);
  if (shown.place) rows.push([<Label key="w" de="Wohnort" vi="Nơi ở" />, <Label key="p" de={PLACE_LABEL[sel.place].de} vi={PLACE_LABEL[sel.place].vi} />]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={open}
        aria-label="Nachricht kopieren"
        aria-expanded={!!at}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-muted shadow-sm hover:text-accent"
      >
        <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h8" />
        </svg>
      </button>
      {at && (
        <div
          ref={pop}
          role="dialog"
          aria-label="Auswahl prüfen und kopieren"
          className="fixed z-50 w-64 rounded-lg border border-line bg-white p-3 text-[13px] text-ink shadow-[0_12px_32px_rgba(16,24,40,.18)]"
          style={{ top: at.top, right: at.right }}
        >
          <strong className="cap mb-1.5 block text-muted">
            <Label de="Bitte prüfen" vi="Kiểm tra lại" />
          </strong>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            {rows.map(([k, v], i) => (
              <div key={i} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="m-0 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          {todo.length > 0 && (
            <p className="m-0 mt-2 rounded bg-warn-soft px-2 py-1 text-[12px] text-warn">
              <Label de="Noch ausfüllen:" vi="Cần điền:" /> {todo.join(", ")}
            </p>
          )}
          <button
            type="button"
            onClick={copy}
            className="mt-2.5 w-full rounded-full bg-accent px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-accent-dark"
          >
            {copied ? <Label de="Kopiert ✓" vi="Đã sao chép ✓" /> : <Label de="Text kopieren" vi="Sao chép tin nhắn" />}
          </button>
        </div>
      )}
    </>
  );
}
