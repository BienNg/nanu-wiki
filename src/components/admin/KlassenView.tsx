"use client";

import Link from "next/link";
import { useState } from "react";
import { Label, tip } from "@/components/Bi";
import { ChatPreviewModal } from "@/components/admin/ChatPreviewModal";
import { ClassInfoModal } from "@/components/admin/ClassInfoModal";
import { Chip, ClassWhen, Fact, SectionHead } from "@/components/admin/classParts";
import { Icon } from "@/components/Icon";
import { MODE_SHORT } from "@/lib/classes";
import { classCode, hasStarted, MODE_TONE, type AssignableClass } from "@/lib/messenger/classes";

/** Client pieces of /admin/messenger/klassen: the searchable class list, the selected class with its prospects, and the chat preview. */

function matchesQuery(c: AssignableClass, q: string) {
  if (!q) return true;
  const hay = [c.name, c.level ?? "", c.mode ? MODE_SHORT[c.mode] : "", c.time ?? "", c.begin ?? ""].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((part) => hay.includes(part));
}

/** Level and place chips, the same as on the Kurse panel cards. */
function ClassChips({ c }: { c: AssignableClass }) {
  return (
    <>
      {c.level && <Chip className="bg-[#EEF0F3] text-[#3A3F47]">{c.level}</Chip>}
      {c.mode && <Chip className={MODE_TONE[c.mode]}>{MODE_SHORT[c.mode]}</Chip>}
    </>
  );
}

/** Start, time and signed-up students in one line. */
function ClassFacts({ c }: { c: AssignableClass }) {
  return (
    <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#3A3F47]">
      <Fact icon="calendar" title={{ de: "Start", vi: "Khai giảng" }}>
        <ClassWhen c={c} />
      </Fact>
      {c.time && (
        <Fact icon="clock" title={{ de: "Uhrzeit", vi: "Giờ học" }}>
          {c.time}
        </Fact>
      )}
      {c.students != null && (
        <Fact icon="cap" title={{ de: "Angemeldete Schüler", vi: "Học viên đã đăng ký" }}>
          <span>
            {c.students} <Label de="Schüler" vi="học viên" />
          </span>
        </Fact>
      )}
    </span>
  );
}

function FullChip() {
  return (
    <Chip className="bg-[#FDECEC] text-[#B3362B]">
      <Label de="Kurs ist voll" vi="Lớp đã đầy" />
    </Chip>
  );
}

export type KlassenItem = { c: AssignableClass; count: number };

/** One class in the left list: code and chips, then start/time/students; the prospect count sits on the right. */
function ClassRow({ c, count, current }: KlassenItem & { current: boolean }) {
  return (
    <li style={{ viewTransitionName: `k${c.id.replace(/-/g, "")}` }}>
      <Link
        href={current ? "/admin/messenger/klassen" : `/admin/messenger/klassen?k=${c.id}`}
        aria-current={current ? "page" : undefined}
        title={c.name}
        className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 transition-[border-color,box-shadow,background-color] ${
          current
            ? "border-accent bg-accent-soft/60 ring-[3px] ring-accent/10"
            : "border-line bg-white hover:border-[#CBD0D8] hover:shadow-[0_1px_3px_rgba(16,24,40,0.06)]"
        }`}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="truncate text-[14px] font-semibold leading-6 text-ink">{classCode(c.name)}</span>
            <ClassChips c={c} />
          </span>
          <ClassFacts c={c} />
          {c.full && (
            <span className="flex">
              <FullChip />
            </span>
          )}
        </span>
        <span
          {...tip(`${count} Interessenten`, `${count} khách quan tâm`)}
          className={`mt-0.5 inline-flex flex-none items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold ${
            count ? "bg-accent text-white" : "bg-[#F1F2F4] text-faint"
          }`}
        >
          <Icon name="users" size={12} strokeWidth={2.2} />
          {count}
        </span>
      </Link>
    </li>
  );
}

/** The left column: every class with its prospect count, grouped into running, upcoming and undated, filtered by the search box. */
export function KlassenList({ items, selectedId }: { items: KlassenItem[]; selectedId: string | null }) {
  const [query, setQuery] = useState("");
  const shown = items.filter(({ c }) => matchesQuery(c, query));
  const groups = [
    { key: "running", de: "Läuft (erste Woche)", vi: "Đang học (tuần đầu)", items: shown.filter(({ c }) => hasStarted(c)) },
    { key: "upcoming", de: "Kommend", vi: "Sắp khai giảng", items: shown.filter(({ c }) => !!c.begin && !hasStarted(c)) },
    { key: "open", de: "Start noch offen", vi: "Chưa có ngày", items: shown.filter(({ c }) => !c.begin) },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 transition-colors focus-within:border-accent">
        <Icon name="search" size={15} className="flex-none text-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kurs suchen · Tìm lớp"
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
        />
      </label>
      {groups.map((g) => (
        <section key={g.key}>
          <SectionHead count={g.items.length} bg="bg-white/95">
            <Label de={g.de} vi={g.vi} />
          </SectionHead>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {g.items.map((it) => (
              <ClassRow key={it.c.id} {...it} current={selectedId === it.c.id} />
            ))}
          </ul>
        </section>
      ))}
      {shown.length === 0 && (
        <p className="m-0 mt-2 rounded-xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-muted">
          {query ? <Label de="Keine Kurse gefunden." vi="Không tìm thấy lớp nào." /> : <Label de="Keine kommenden Klassen in Notion gefunden." vi="Không tìm thấy lớp sắp mở trong Notion." />}
        </p>
      )}
    </div>
  );
}

/** "Infos" in the header of the selected class: opens the class info (image, dates, students, Notion link). */
function ClassInfoButton({ c }: { c: AssignableClass }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 flex-none items-center gap-1.5 rounded-full border border-line bg-white px-3 text-[12.5px] font-medium text-accent transition-colors hover:border-accent/40 hover:bg-accent-soft"
      >
        <Icon name="doc" size={14} />
        <Label de="Infos" vi="Thông tin" />
      </button>
      {open && <ClassInfoModal c={c} onClose={() => setOpen(false)} />}
    </>
  );
}

export type ProspectTone = "open" | "student" | "zalo" | "closed";
export type ProspectItem = { id: string; name: string; channel: string | null; chipDe: string; chipVi: string; tone: ProspectTone; time: string };

const TONE: Record<ProspectTone, string> = {
  open: "bg-[#FDF1E2] text-[#94560F]",
  student: "bg-[#E2F4EF] text-[#1B6E5D]",
  zalo: "bg-[#E6EEFB] text-[#2558A3]",
  closed: "bg-[#F1F2F4] text-faint",
};

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** A large centred hint card for the empty states of the right column. */
function EmptyCard({ tone, icon, title, hint }: { tone: "neutral" | "warn"; icon: "cap" | "users"; title: React.ReactNode; hint: React.ReactNode }) {
  const warn = tone === "warn";
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center ${
        warn ? "border-[#E8B96A] bg-[#FDF6E9]" : "border-line bg-[#F6F7F9]"
      }`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08)] ${warn ? "text-[#94560F]" : "text-muted"}`}>
        <Icon name={icon} size={20} />
      </span>
      <p className={`m-0 text-[14px] font-semibold ${warn ? "text-[#7A4A0E]" : "text-ink"}`}>{title}</p>
      <p className={`m-0 max-w-[300px] text-[12.5px] leading-snug ${warn ? "text-[#94560F]" : "text-muted"}`}>{hint}</p>
    </div>
  );
}

/** The right column: the selected class and the chats assigned to it. A click on a chat opens the read-only preview. */
export function KlassenDetail({ c, items }: { c: AssignableClass | null; items: ProspectItem[] }) {
  const [open, setOpen] = useState<ProspectItem | null>(null);

  if (!c) {
    return (
      <EmptyCard
        tone="neutral"
        icon="cap"
        title={<Label de="Klasse wählen" vi="Chọn một lớp" />}
        hint={<Label de="Links eine Klasse anklicken, um ihre Interessenten zu sehen und anzuschreiben." vi="Bấm vào một lớp bên trái để xem và nhắn cho khách quan tâm." />}
      />
    );
  }

  return (
    <div className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] max-md:max-h-none">
      <header className="flex flex-none items-start gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <h2 className="m-0 truncate text-[20px] font-semibold leading-7 text-ink">{classCode(c.name)}</h2>
            <ClassChips c={c} />
            {c.full && <FullChip />}
          </div>
          {classCode(c.name) !== c.name && <p className="m-0 truncate text-[12px] text-muted">{c.name}</p>}
          <ClassFacts c={c} />
        </div>
        <ClassInfoButton c={c} />
      </header>
      <div className="flex flex-none items-center gap-1.5 border-b border-line bg-[#F6F7F9] px-5 py-2 text-[11.5px] font-semibold text-muted">
        <Icon name="users" size={13} />
        <Label de="Interessenten" vi="Khách quan tâm" />
        <span className={`rounded-full px-1.5 text-[10.5px] leading-4 ${items.length ? "bg-accent text-white" : "bg-[#E6E8EC] text-muted"}`}>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="p-4">
          <EmptyCard
            tone="warn"
            icon="users"
            title={<Label de="Noch keine Interessenten" vi="Chưa có khách quan tâm" />}
            hint={<Label de="Im Posteingang im Kurse-Panel eines Chats diese Klasse mit (+) zuordnen." vi="Trong hộp thư, mở bảng Lớp học của một cuộc trò chuyện và bấm (+) để gán lớp này." />}
          />
        </div>
      ) : (
        <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-0">
          {items.map((item) => (
            <li key={item.id} className="border-b border-line last:border-b-0">
              <button type="button" onClick={() => setOpen(item)} className="group flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-hover">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#EEF0F3] text-[12.5px] font-semibold text-[#3A3F47]">{initials(item.name)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-ink">{item.name}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
                    <Icon name="chat" size={12} className="text-faint" />
                    {item.channel === "whatsapp" ? "WhatsApp" : "Messenger"}
                    <span className="text-faint">· {item.time}</span>
                  </span>
                </span>
                <Chip className={TONE[item.tone]}>
                  <Label de={item.chipDe} vi={item.chipVi} />
                </Chip>
                <Icon name="chevron" size={14} className="flex-none text-faint opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && <ChatPreviewModal chat={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
