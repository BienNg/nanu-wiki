"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Label } from "@/components/Bi";
import { MessengerHeader, bubbleClass, bubbleRowClass } from "@/components/MessengerParts";

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

const TZ = "Asia/Ho_Chi_Minh";
const dayFmt = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });

/** Image/video/file of a message. Meta's links expire after a while; then the image shows as broken. */
function AttachmentView({ a, mine }: { a: Attachment; mine: boolean }) {
  const img = a.image_data?.url ?? a.image_data?.preview_url;
  if (img) {
    return (
      <a href={img} target="_blank" rel="noopener noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta CDN, expiring signed URLs */}
        <img src={img} alt={a.name ?? "Bild"} loading="lazy" referrerPolicy="no-referrer" className="max-h-64 max-w-[260px] rounded-[14px] border border-line bg-[#F0F0F0] object-cover" />
      </a>
    );
  }
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
  banner,
  status,
  below,
  composer,
  conversationId,
  actions,
  wallpaper,
}: {
  name: string;
  backHref: string;
  messages: ThreadMessage[];
  totalCount: number | null;
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
}) {
  const wa = wallpaper === "whatsapp";
  // Messages that arrive while the chat is open pop in; the ones already there do not move.
  const initial = useRef<Set<string> | null>(null);
  if (!initial.current) initial.current = new Set(messages.map((m) => m.id));
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
            status={status ?? <Label de="Nur lesen · in der Business Suite antworten" vi="Chỉ đọc · trả lời trong Business Suite" />}
            actions={actions}
            below={below}
          />
        </div>
      </div>
      {banner}

      <div onScroll={() => { const el = scroller.current; if (el) { nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100; if (nearBottom.current) setNewMessages(false); } }} ref={scroller} className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 ${wa ? "bg-[#EFEAE2] bg-[url(/messenger/chat-doodle.svg)] bg-[length:260px_260px]" : "bg-white"}`}>
        {older > 0 && (
          <p className={`m-0 mb-3 self-center rounded-full px-3 py-1 text-[11.5px] text-muted ${wa ? "bg-white/90 shadow-sm" : "bg-chip"}`}>
            <Label de={`${older} ältere Nachrichten nicht geladen (nur die letzten 14 Tage)`} vi={`${older} tin cũ hơn chưa tải (chỉ 14 ngày gần nhất)`} />
          </p>
        )}
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];
          const newDay = !prev || dayFmt.format(new Date(prev.created_time)) !== dayFmt.format(new Date(m.created_time));
          const lastOfRun = !next || next.from_page !== m.from_page;
          return (
            <div key={m.id} className="contents">
              {newDay && <p className={`m-0 my-3 self-center text-[11.5px] font-medium ${wa ? "rounded-lg bg-white/90 px-2.5 py-1 text-muted shadow-sm" : "text-faint"}`}>{dayFmt.format(new Date(m.created_time))}</p>}
              <div className={`${bubbleRowClass(m.from_page, lastOfRun)} mb-0.5 gap-0.5 ${initial.current!.has(m.id) ? "" : "anim-pop"}`} title={`${m.from_name ?? ""} · ${timeFmt.format(new Date(m.created_time))}`}>
                {m.text && <span className={`${bubbleClass(m.from_page)} ${wa && !m.from_page ? "!bg-white shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]" : ""}`}>{m.text}</span>}
                {m.attachments?.map((a, k) => <AttachmentView key={k} a={a} mine={m.from_page} />)}
                {!m.text && !m.attachments?.length && (
                  <span className={`${bubbleClass(m.from_page)} italic opacity-70`}>
                    <Label de="Sticker / Inhalt nicht verfügbar" vi="Sticker / nội dung không hiển thị" />
                  </span>
                )}
                {lastOfRun && <span className={`px-1 text-[11px] ${wa ? "text-[#667781]" : "text-faint"}`}>{timeFmt.format(new Date(m.created_time))}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {newMessages && <button className="anim-fade bg-chip p-2 text-xs transition-colors hover:bg-hover" onClick={() => { const el=scroller.current; if(el) el.scrollTop=el.scrollHeight; setNewMessages(false); }}>↓ <Label de="Neue Nachrichten" vi="Tin nhắn mới" /></button>}
      {composer}
    </div>
  );
}
