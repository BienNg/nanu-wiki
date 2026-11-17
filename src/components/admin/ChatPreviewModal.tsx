"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Label, tip } from "@/components/Bi";
import { CopyName } from "@/components/admin/CopyName";
import { Icon } from "@/components/Icon";
import { bubbleClass, bubbleRowClass } from "@/components/MessengerParts";
import type { ThreadMessageRow } from "@/lib/messenger/thread";

/** What the preview needs to know about a chat. */
export type PreviewChat = { id: string; name: string; channel: string | null };

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

type PreviewState = { messages: ThreadMessageRow[]; hasOlder: boolean } | { error: true } | null;

/** The newest messages of one chat, read-only, with the name to copy and a jump into the inbox. */
export function ChatPreviewModal({ chat: item, onClose }: { chat: PreviewChat; onClose: () => void }) {
  const [data, setData] = useState<PreviewState>(null);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/messenger/thread?c=${encodeURIComponent(item.id)}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((t: { messages: ThreadMessageRow[]; hasOlder: boolean }) => setData({ messages: t.messages, hasOlder: t.hasOlder }))
      .catch((e) => {
        if (!(e instanceof DOMException && e.name === "AbortError")) setData({ error: true });
      });
    return () => ctrl.abort();
  }, [item.id]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [data]);

  // Portal to <body>: a sticky or transformed parent would otherwise trap the dialog under sticky headings.
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={item.name} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="anim-fade relative flex h-[min(640px,85dvh)] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex flex-none items-center gap-2.5 border-b border-line px-4 py-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#EEF0F3] text-[12.5px] font-semibold text-[#3A3F47]">{initials(item.name)}</span>
          <div className="min-w-0 flex-1">
            <p className="m-0 flex items-center gap-1 text-[14.5px] font-semibold">
              <span className="truncate">{item.name}</span>
              <CopyName name={item.name} />
            </p>
            <p className="m-0 text-[12px] text-muted">{item.channel === "whatsapp" ? "WhatsApp" : "Messenger"}</p>
          </div>
          <Link
            href={`/admin/messenger?c=${encodeURIComponent(item.id)}`}
            className="flex h-8 flex-none items-center gap-1 rounded-full bg-accent px-3 text-[12.5px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <Label de="Im Posteingang öffnen" vi="Mở trong hộp thư" />
            <Icon name="external" size={13} strokeWidth={2.2} />
          </Link>
          <button type="button" onClick={onClose} aria-label="Schließen" {...tip("Schließen", "Đóng")} className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-muted hover:bg-hover">
            <Icon name="close" size={15} />
          </button>
        </header>
        <div ref={scroller} className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#F6F7F9] px-4 py-3">
          {!data && (
            <div className="mt-auto flex flex-col gap-2" aria-hidden="true">
              {["w-2/3", "ml-auto w-1/2", "w-3/5", "ml-auto w-2/5"].map((w, i) => (
                <span key={i} className={`h-9 animate-pulse rounded-2xl bg-[#E6E8EC] ${w}`} />
              ))}
            </div>
          )}
          {data && "error" in data && (
            <p className="m-0 rounded-lg bg-white px-3 py-2.5 text-[13px] text-muted">
              <Label de="Das Gespräch konnte nicht geladen werden." vi="Không tải được cuộc trò chuyện." />
            </p>
          )}
          {data && !("error" in data) && (
            <>
              {data.hasOlder && (
                <p className="m-0 mb-2 text-center text-[11.5px] text-faint">
                  <Label de="Ältere Nachrichten im Posteingang" vi="Tin cũ hơn trong hộp thư" />
                </p>
              )}
              {data.messages.map((m, i) => {
                const mine = m.from_page;
                const last = data.messages[i + 1]?.from_page !== mine;
                return (
                  <div key={m.id} className={`${bubbleRowClass(mine, last)} mt-0.5`}>
                    {!!m.text && <span className={bubbleClass(mine)}>{m.text}</span>}
                    {!m.text && <span className={`${bubbleClass(mine)} italic`}>📎 Anhang</span>}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
