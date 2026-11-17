"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Label } from "@/components/Bi";
import { BubbleTime, MessengerHeader, bubbleClass, bubbleRowClass, messageDay, messageTime } from "@/components/MessengerParts";
import { CopyName } from "@/components/admin/CopyName";

type Attachment = {
  mime_type?: string;
  name?: string;
  image_data?: { url?: string; preview_url?: string };
  video_data?: { url?: string; preview_url?: string };
  file_url?: string;
};

export type ThreadMessage = {
  id: string;
  text: string | null;
  from_page: boolean;
  from_name: string | null;
  attachments: Attachment[] | null;
  created_time: string;
};

/** Image thumbnail; a click opens it large in a modal (Esc or click outside closes it). */
function ImageAttachment({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="block cursor-zoom-in">
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta CDN, expiring signed URLs */}
        <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" className="max-h-64 max-w-[260px] rounded-[14px] border border-line bg-[#F0F0F0] object-cover" />
      </button>
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4"
          >
            <button
              type="button"
              aria-label="Schließen"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl leading-none text-white hover:bg-white/25"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element -- Meta CDN, expiring signed URLs */}
            <img
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>,
          document.body,
        )}
    </>
  );
}

/** Image/video/file of a message. Meta's links expire after a while; then the image shows as broken. */
function AttachmentView({ a, mine }: { a: Attachment; mine: boolean }) {
  if (a.mime_type === "application/x-sent-elsewhere") {
    return (
      <span className={`${bubbleClass(mine)} italic`}>
        <Label
          de="Antwort aus der Meta Business Suite gesendet. Meta gibt den Text nicht weiter. Bitte dort nachlesen."
          vi="Tin trả lời gửi từ Meta Business Suite. Meta không chuyển nội dung sang đây. Hãy xem ở đó."
        />
      </span>
    );
  }
  const img = a.image_data?.url ?? a.image_data?.preview_url;
  if (img) return <ImageAttachment src={img} alt={a.name ?? "Bild"} />;
  const href = a.video_data?.url ?? a.file_url;
  const label = a.mime_type?.startsWith("video/") ? "🎬 Video" : a.mime_type?.startsWith("audio/") ? "🎤 Audio" : `📎 ${a.name ?? "Datei"}`;
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${bubbleClass(mine)} underline`}>
      {label}
    </a>
  ) : (
    <span className={bubbleClass(mine)}>{label}</span>
  );
}

/** One conversation, Messenger style: customer grey on the left, the Page blue on the right. Read-only. */
export function MessengerThread({
  name,
  backHref,
  messages,
  totalCount,
  hasOlder,
  loadingOlder,
  onLoadOlder,
  banner,
  status,
  below,
  composer,
  conversationId,
  actions,
  wallpaper,
  markers = [],
}: {
  name: string;
  backHref: string;
  messages: ThreadMessage[];
  totalCount: number | null;
  /** The database holds messages before the first one shown; `onLoadOlder` fetches the next page of them. */
  hasOlder?: boolean;
  loadingOlder?: boolean;
  onLoadOlder?: () => void;
  banner?: ReactNode;
  status?: ReactNode;
  /** Third line of the header, under the status. */
  below?: ReactNode;
  composer?: ReactNode;
  conversationId?: string;
  /** Shown on the right of the header. */
  actions?: ReactNode;
  /** "whatsapp": beige chat wallpaper with doodles and white bubbles for the customer. */
  wallpaper?: "whatsapp";
  /** Small notes in the timeline at their time (closed follow-ups). Ones before the loaded messages wait for "Ältere laden". */
  markers?: { id: string; time: string; node: ReactNode }[];
}) {
  const wa = wallpaper === "whatsapp";
  // Messages that arrive while the chat is open pop in; the ones already there do not move.
  const initial = useRef<Set<string> | null>(null);
  if (!initial.current) initial.current = new Set(messages.map((m) => m.id));
  // Older pages loaded later are not new messages: only what comes after the newest one at opening pops in.
  const newestAtOpen = useRef(messages.at(-1)?.created_time ?? "");
  const isNew = (m: ThreadMessage) => !initial.current!.has(m.id) && Date.parse(m.created_time) >= (Date.parse(newestAtOpen.current) || 0);
  const [optimistic, setOptimistic] = useState<Array<{ conversation: string; id: string; text: string | null; attachment: string | null; created_time: string }>>([]);
  useEffect(() => {
    const onSent = (e: Event) => setOptimistic((o) => [...o, (e as CustomEvent).detail]);
    window.addEventListener('inbox:sent', onSent);
    return () => window.removeEventListener('inbox:sent', onSent);
  }, []);
  const known = new Set(messages.map((m) => m.id));
  const extra: ThreadMessage[] = optimistic
    .filter((o) => o.conversation === conversationId && !known.has(o.id))
    .map((o) => ({ id: o.id, text: o.text ?? (o.attachment ? `📎 ${o.attachment}` : null), from_page: true, from_name: null, attachments: null, created_time: o.created_time }) as ThreadMessage);
  if (extra.length) messages = [...messages, ...extra];
  // Jump to the newest message; scroll only the chat, not the page.
  const scroller = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const [newMessages, setNewMessages] = useState(false);
  const last = messages.at(-1)?.id;
  useEffect(() => {
    const el = scroller.current;
    if (el && nearBottom.current) el.scrollTop = el.scrollHeight;
    else if (el) setNewMessages(true);
  }, [last]);

  // Older messages go in above: keep the message the reader was looking at where it is.
  const heightBefore = useRef<number | null>(null);
  const first = messages[0]?.id;
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el && heightBefore.current !== null) el.scrollTop += el.scrollHeight - heightBefore.current;
    heightBefore.current = null;
  }, [first]);

  const older = totalCount !== null && totalCount > messages.length ? totalCount - messages.length : 0;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* Above the label bar, so the Status menu opens over it. */}
      <div className="relative z-20 flex items-center">
        <a
          href={backHref}
          data-pane=""
          aria-label="Zurück · Quay lại"
          className="hidden h-full items-center border-b border-line bg-white pl-3 text-[20px] text-accent max-md:flex"
          onClick={(e) => {
            // Only the address changes; the list is still there, so nothing has to load.
            e.preventDefault();
            window.history.pushState(null, "", backHref);
          }}
        >
          ‹
        </a>
        <div className="min-w-0 flex-1">
          <MessengerHeader
            name={name}
            nameActions={<CopyName name={name} />}
            status={status ?? <Label de="Nur lesen · in der Business Suite antworten" vi="Chỉ đọc · trả lời trong Business Suite" />}
            actions={actions}
            below={below}
          />
        </div>
      </div>
      {banner}

      <div onScroll={() => { const el = scroller.current; if (el) { nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100; if (nearBottom.current) setNewMessages(false); } }} ref={scroller} className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 py-4 ${wa ? "bg-[#EFEAE2] bg-[url(/messenger/chat-doodle.svg)] bg-[length:260px_260px]" : "bg-white"}`}>
        {hasOlder && onLoadOlder && (
          <button
            type="button"
            disabled={loadingOlder}
            onClick={() => {
              heightBefore.current = scroller.current?.scrollHeight ?? null;
              onLoadOlder();
            }}
            className={`mb-3 self-center rounded-full px-3 py-1 text-[11.5px] font-medium text-accent transition-colors duration-150 hover:bg-hover disabled:opacity-50 ${wa ? "bg-white/90 shadow-sm" : "bg-chip"}`}
          >
            {loadingOlder ? <Label de="Lädt…" vi="Đang tải…" /> : <Label de="Ältere Nachrichten laden" vi="Tải tin cũ hơn" />}
          </button>
        )}
        {!hasOlder && older > 0 && (
          <p className={`m-0 mb-3 self-center rounded-full px-3 py-1 text-[11.5px] text-muted ${wa ? "bg-white/90 shadow-sm" : "bg-chip"}`}>
            <Label de={`${older} ältere Nachrichten nicht geladen (nur die letzten 14 Tage)`} vi={`${older} tin cũ hơn chưa tải (chỉ 14 ngày gần nhất)`} />
          </p>
        )}
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];
          const newDay = !prev || messageDay(prev.created_time) !== messageDay(m.created_time);
          const lastOfRun = !next || next.from_page !== m.from_page;
          const at = Date.parse(m.created_time);
          const from = prev ? Date.parse(prev.created_time) : hasOlder ? at : -Infinity;
          const here = markers.filter((k) => Date.parse(k.time) > from && Date.parse(k.time) <= at);
          return (
            <div key={m.id} className="contents">
              {here.map((k) => (
                <div key={k.id} className="my-2 flex justify-center">
                  {k.node}
                </div>
              ))}
              {newDay && <p className={`m-0 my-3 self-center text-[11.5px] font-medium ${wa ? "rounded-lg bg-white/90 px-2.5 py-1 text-muted shadow-sm" : "text-faint"}`}>{messageDay(m.created_time)}</p>}
              <div className={`${bubbleRowClass(m.from_page, lastOfRun)} mb-0.5 gap-0.5 ${isNew(m) ? "anim-pop" : ""}`} title={`${m.from_name ?? ""} · ${messageTime(m.created_time)}`}>
                {m.text && (
                  <span className={`${bubbleClass(m.from_page)} relative ${wa && !m.from_page ? "!bg-white shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]" : ""}`}>
                    {m.text}
                    <BubbleTime iso={m.created_time} mine={m.from_page} />
                  </span>
                )}
                {m.attachments?.map((a, k) => <AttachmentView key={k} a={a} mine={m.from_page} />)}
                {!m.text && !m.attachments?.length && (
                  <span className={`${bubbleClass(m.from_page)} italic opacity-70`}>
                    <Label de="Sticker / Inhalt nicht verfügbar" vi="Sticker / nội dung không hiển thị" />
                  </span>
                )}
                {/* A text bubble carries its time inside; images, files and stickers get it underneath. */}
                {!m.text && <span className={`px-1 text-[11px] tabular-nums ${wa ? "text-[#667781]" : "text-faint"}`}>{messageTime(m.created_time)}</span>}
              </div>
            </div>
          );
        })}
        {markers
          .filter((k) => Date.parse(k.time) > (messages.length ? Date.parse(messages.at(-1)!.created_time) : -Infinity))
          .map((k) => (
            <div key={k.id} className="my-2 flex justify-center">
              {k.node}
            </div>
          ))}
      </div>
      {newMessages && <button className="anim-fade bg-chip p-2 text-xs transition-colors hover:bg-hover" onClick={() => { const el=scroller.current; if(el) el.scrollTop=el.scrollHeight; setNewMessages(false); }}>↓ <Label de="Neue Nachrichten" vi="Tin nhắn mới" /></button>}
      {composer}
    </div>
  );
}
