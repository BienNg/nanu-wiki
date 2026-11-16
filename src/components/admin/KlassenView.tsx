"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/Bi";
import { ClassInfoModal } from "@/components/admin/ClassInfoModal";
import { CopyName } from "@/components/admin/CopyName";
import { bubbleClass, bubbleRowClass } from "@/components/MessengerParts";
import { MODE_SHORT, shortDate } from "@/lib/classes";
import { hasStarted, type AssignableClass } from "@/lib/messenger/classes";
import type { ThreadMessageRow } from "@/lib/messenger/thread";

/** Client pieces of /admin/messenger/klassen: the searchable class list and the prospect list with its preview. */

function Badge({ tone, children }: { tone: "muted" | "warn"; children: React.ReactNode }) {
  const cls = tone === "warn" ? "bg-[#FDF1E2] text-[#9A5B13]" : "bg-[#F1F2F4] text-muted";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{children}</span>;
}

function matchesQuery(c: AssignableClass, q: string) {
  if (!q) return true;
  const hay = [c.name, c.level ?? "", c.mode ? MODE_SHORT[c.mode] : "", c.time ?? "", c.begin ?? ""].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((part) => hay.includes(part));
}

export type KlassenItem = { c: AssignableClass; count: number };

/** The left column: every class with its prospect count, filtered by the search box. */
export function KlassenList({ items, selectedId }: { items: KlassenItem[]; selectedId: string | null }) {
  const [query, setQuery] = useState("");
  const shown = items.filter(({ c }) => matchesQuery(c, query));
  return (
    <div className="flex flex-col gap-2.5">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Kurs suchen · Tìm lớp"
        className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-[13px] outline-none placeholder:text-faint focus:border-accent"
      />
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {shown.map(({ c, count }) => {
          const current = selectedId === c.id;
          const when = c.begin ? shortDate(c.begin) : null;
          return (
            <li key={c.id} style={{ viewTransitionName: `k${c.id.replace(/-/g, "")}` }}>
              <Link
                href={current ? "/admin/messenger/klassen" : `/admin/messenger/klassen?k=${c.id}`}
                aria-current={current ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors ${current ? "border-accent bg-accent-soft" : "border-line bg-white hover:bg-hover"}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-[13.5px] font-medium" title={c.name}>
                    {c.name}
                  </p>
                  <p className="m-0 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-muted">
                    {c.mode && <span>{MODE_SHORT[c.mode]}</span>}
                    {when ? (
                      <span>
                        <Label de={`ab ${when.de}`} vi={`từ ${when.vi}`} />
                        {c.time ? ` · ${c.time}` : ""}
                      </span>
                    ) : (
                      <Badge tone="muted">
                        <Label de="Start offen" vi="Chưa có ngày" />
                      </Badge>
                    )}
                    {c.full && (
                      <Badge tone="warn">
                        <Label de="Voll" vi="Đã đầy" />
                      </Badge>
                    )}
                    {hasStarted(c) && (
                      <Badge tone="muted">
                        <Label de="Läuft" vi="Đang học" />
                      </Badge>
                    )}
                  </p>
                </div>
                <span className={`flex-none rounded-full px-2 py-0.5 text-[12px] font-medium ${count ? "bg-accent-soft text-accent" : "bg-[#F1F2F4] text-faint"}`}>{count}</span>
              </Link>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className="rounded-xl border border-line bg-white px-4 py-3 text-[13px] text-muted">
            {query ? <Label de="Keine Kurse gefunden." vi="Không tìm thấy lớp nào." /> : <Label de="Keine kommenden Klassen in Notion gefunden." vi="Không tìm thấy lớp sắp mở trong Notion." />}
          </li>
        )}
      </ul>
    </div>
  );
}

/** "Infos" in the header of the selected class: opens the class info (image, dates, students, Notion link). */
export function ClassInfoButton({ c }: { c: AssignableClass }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex-none rounded-full border border-line px-2.5 py-1 text-[12px] font-medium text-accent transition-colors hover:bg-accent-soft"
      >
        <Label de="Infos" vi="Thông tin" />
      </button>
      {open && <ClassInfoModal c={c} onClose={() => setOpen(false)} />}
    </>
  );
}

export type ProspectItem ={ id: string; name: string; channel: string | null; chipDe: string; chipVi: string; time: string };

type PreviewState = { messages: ThreadMessageRow[]; hasOlder: boolean } | { error: true } | null;

/** The newest messages of one chat, read-only, with the name to copy and a jump into the inbox. */
function PreviewModal({ item, onClose }: { item: ProspectItem; onClose: () => void }) {
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

  return (
    <div role="dialog" aria-modal="true" aria-label={item.name} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="anim-fade relative flex h-[min(640px,85dvh)] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex flex-none items-center gap-2 border-b border-line px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="m-0 flex items-center gap-1 text-[14.5px] font-semibold">
              <span className="truncate">{item.name}</span>
              <CopyName name={item.name} />
            </p>
            <p className="m-0 text-[12px] text-muted">{item.channel === "whatsapp" ? "WhatsApp" : "Messenger"}</p>
          </div>
          <Link href={`/admin/messenger?c=${encodeURIComponent(item.id)}`} className="flex-none rounded-full px-2.5 py-1 text-[12.5px] font-medium text-accent hover:bg-accent-soft">
            <Label de="Im Posteingang öffnen" vi="Mở trong hộp thư" />
          </Link>
          <button type="button" onClick={onClose} aria-label="Schließen" className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-[16px] text-muted hover:bg-hover">
            ×
          </button>
        </header>
        <div ref={scroller} className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
          {!data && <p className="m-0 text-[12.5px] text-faint">…</p>}
          {data && "error" in data && (
            <p className="m-0 text-[13px] text-muted">
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
    </div>
  );
}

/** The right column: the chats assigned to the selected class. A click opens the read-only preview. */
export function ProspectList({ items }: { items: ProspectItem[] }) {
  const [open, setOpen] = useState<ProspectItem | null>(null);
  return (
    <>
      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <li key={item.id} className="border-b border-line last:border-b-0">
            <button type="button" onClick={() => setOpen(item)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover">
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[13.5px] font-medium">{item.name}</p>
                <p className="m-0 mt-0.5 text-[12px] text-muted">{item.channel === "whatsapp" ? "WhatsApp" : "Messenger"}</p>
              </div>
              <span className="flex-none rounded-full bg-[#F1F2F4] px-2 py-0.5 text-[11.5px] font-medium text-muted">
                <Label de={item.chipDe} vi={item.chipVi} />
              </span>
              <span className="flex-none text-[12px] text-faint">{item.time}</span>
            </button>
          </li>
        ))}
      </ul>
      {open && <PreviewModal item={open} onClose={() => setOpen(null)} />}
    </>
  );
}
