"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label, tip } from "@/components/Bi";
import { ChatPreviewModal } from "@/components/admin/ChatPreviewModal";
import { ClassInfoModal } from "@/components/admin/ClassInfoModal";
import { Chip, ClassWhen, Fact, OfferSwitch, saveOffer, SectionHead } from "@/components/admin/classParts";
import { Icon, type AnyIcon } from "@/components/Icon";
import { toast } from "@/components/Toaster";
import { MODE_SHORT } from "@/lib/classes";
import { classCode, hasStarted, MODE_TONE, OFFER_INFO, OFFER_STATES, type AssignableClass, type OfferState } from "@/lib/messenger/classes";

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

/** `open`: assigned chats whose special offer is still Offen. */
export type KlassenItem = { c: AssignableClass; count: number; open: number };

/** Prospects of a class on the right of its card: "12 offen · 45" while offers are open, a green tick once none is left. */
function OfferBadge({ count, open }: { count: number; open: number }) {
  const base = "mt-0.5 inline-flex flex-none items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold";
  if (!count) {
    return (
      <span {...tip("Keine Interessenten", "Chưa có khách quan tâm")} className={`${base} bg-[#F1F2F4] text-faint`}>
        <Icon name="users" size={12} strokeWidth={2.2} />0
      </span>
    );
  }
  if (!open) {
    return (
      <span {...tip(`Alle ${count} Interessenten erledigt`, `Đã xử lý cả ${count} khách quan tâm`)} className={`${base} bg-[#E2F4EF] text-[#1B6E5D]`}>
        <Icon name="check" size={12} strokeWidth={2.6} />
        {count}
      </span>
    );
  }
  return (
    <span {...tip(`Sonderangebot: ${open} von ${count} noch offen`, `Ưu đãi: ${open}/${count} khách chưa gửi`)} className={`${base} bg-accent text-white`}>
      <Icon name="users" size={12} strokeWidth={2.2} />
      <Label de={`${open} offen`} vi={`${open} chưa gửi`} />
      <span className="font-medium opacity-70">· {count}</span>
    </span>
  );
}

/** One class in the left list: code and chips, then start/time/students; the open offers and prospect count sit on the right. */
function ClassRow({ c, count, open, current }: KlassenItem & { current: boolean }) {
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
        <OfferBadge count={count} open={open} />
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
export type ProspectItem = {
  id: string;
  name: string;
  channel: string | null;
  chipDe: string;
  chipVi: string;
  tone: ProspectTone;
  time: string;
  /** Special-offer status for this class, and the day it was set (dd.mm.yy, null while Offen). */
  offer: OfferState;
  offerAt: string | null;
};

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
function EmptyCard({ tone, icon, title, hint }: { tone: "neutral" | "warn" | "done"; icon: AnyIcon; title: React.ReactNode; hint: React.ReactNode }) {
  const look = {
    neutral: { box: "border-line bg-[#F6F7F9]", icon: "text-muted", title: "text-ink", hint: "text-muted" },
    warn: { box: "border-[#E8B96A] bg-[#FDF6E9]", icon: "text-[#94560F]", title: "text-[#7A4A0E]", hint: "text-[#94560F]" },
    done: { box: "border-[#9FD6C6] bg-[#EEF8F5]", icon: "text-[#1B6E5D]", title: "text-[#155447]", hint: "text-[#1B6E5D]" },
  }[tone];
  return (
    <div className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center ${look.box}`}>
      <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08)] ${look.icon}`}>
        <Icon name={icon} size={20} />
      </span>
      <p className={`m-0 text-[14px] font-semibold ${look.title}`}>{title}</p>
      <p className={`m-0 max-w-[340px] text-[12.5px] leading-snug ${look.hint}`}>{hint}</p>
    </div>
  );
}

/** What each tab shows when it is empty. */
const TAB_EMPTY: Record<OfferState, { tone: "neutral" | "done"; icon: AnyIcon; de: string; vi: string; hintDe: string; hintVi: string }> = {
  offen: {
    tone: "done",
    icon: "check",
    de: "Alle angeschrieben",
    vi: "Đã nhắn hết",
    hintDe: "Jeder Interessent dieser Klasse hat das Sonderangebot bekommen oder wurde übersprungen.",
    hintVi: "Mọi khách quan tâm lớp này đã nhận ưu đãi hoặc đã được bỏ qua.",
  },
  geschickt: {
    tone: "neutral",
    icon: "megaphone",
    de: "Noch kein Angebot geschickt",
    vi: "Chưa gửi ưu đãi nào",
    hintDe: "Unter Offen nach dem Anschreiben auf „Geschickt“ klicken.",
    hintVi: "Sau khi nhắn, bấm „Đã gửi“ ở tab Chưa gửi.",
  },
  uebersprungen: {
    tone: "neutral",
    icon: "users",
    de: "Niemand übersprungen",
    vi: "Chưa bỏ qua ai",
    hintDe: "Wer kein Angebot bekommen soll (schon Schüler, kein Lead …), unter Offen überspringen.",
    hintVi: "Ai không cần nhận ưu đãi (đã là học viên, không phải khách …) thì bỏ qua ở tab Chưa gửi.",
  },
};

/**
 * The right column: the selected class and the chats assigned to it, as a to-do list for the special
 * offer before the class starts. Tabs split the chats into Offen / Geschickt / Übersprungen; a row is
 * moved with its buttons (or in the preview) and can be undone from the toast. A click on a chat
 * opens the read-only preview.
 */
export function KlassenDetail({ c, items }: { c: AssignableClass | null; items: ProspectItem[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<OfferState>("offen");
  // Status changes made here, shown at once; the server copy catches up after router.refresh().
  const [overrides, setOverrides] = useState<ReadonlyMap<string, OfferState>>(new Map());
  const [busy, setBusy] = useState<ReadonlySet<string>>(new Set());

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

  const offerOf = (it: ProspectItem) => overrides.get(it.id) ?? it.offer;
  const counts = Object.fromEntries(OFFER_STATES.map((s) => [s, items.filter((it) => offerOf(it) === s).length])) as Record<OfferState, number>;
  const shown = items.filter((it) => offerOf(it) === tab);
  const openItem = openId ? (items.find((it) => it.id === openId) ?? null) : null;

  // `undoOf`: this call undoes a change to that status. The toast holds an old closure, so the status before is passed in, not read.
  const setOffer = (it: ProspectItem, next: OfferState, undoOf?: OfferState) => {
    const undoable = !undoOf;
    const prev = undoOf ?? offerOf(it);
    if (prev === next) return;
    setOverrides((m) => new Map(m).set(it.id, next));
    setBusy((b) => new Set(b).add(it.id));
    saveOffer(it.id, c.id, next)
      .then(() => {
        router.refresh();
        if (undoable) {
          toast(`${it.name}: ${OFFER_INFO[next].de} · ${OFFER_INFO[next].vi}`, { label: "Rückgängig · Hoàn tác", onClick: () => setOffer(it, prev, next) });
        }
      })
      .catch(() => {
        setOverrides((m) => new Map(m).set(it.id, prev));
        toast("Speichern fehlgeschlagen · Lưu không thành công");
      })
      .finally(() =>
        setBusy((b) => {
          const n = new Set(b);
          n.delete(it.id);
          return n;
        }),
      );
  };

  const empty = TAB_EMPTY[tab];

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
      <div className="flex flex-none flex-wrap items-center gap-x-4 gap-y-1 border-b border-line bg-[#F6F7F9] px-5">
        <span className="flex items-center gap-1.5 py-2.5 text-[11.5px] font-semibold text-muted">
          <Icon name="megaphone" size={13} />
          <Label de="Sonderangebot" vi="Ưu đãi" />
        </span>
        <div role="tablist" className="flex items-stretch gap-1">
          {OFFER_STATES.map((state) => {
            const active = tab === state;
            return (
              <button
                key={state}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(state)}
                className={`-mb-px flex items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-[12.5px] font-semibold transition-colors ${
                  active ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <Label de={OFFER_INFO[state].de} vi={OFFER_INFO[state].vi} />
                <span
                  className={`rounded-full px-1.5 text-[10.5px] leading-4 ${
                    !counts[state] ? "bg-[#E6E8EC] text-muted" : state === "offen" ? "bg-accent text-white" : state === "geschickt" ? "bg-[#E2F4EF] text-[#1B6E5D]" : "bg-[#E6E8EC] text-[#3A3F47]"
                  }`}
                >
                  {counts[state]}
                </span>
              </button>
            );
          })}
        </div>
        <span className="ml-auto flex items-center gap-1 py-2.5 text-[11.5px] text-muted">
          <Icon name="users" size={12} />
          <Label de={`${items.length} Interessenten`} vi={`${items.length} khách quan tâm`} />
        </span>
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
      ) : shown.length === 0 ? (
        <div className="p-4">
          <EmptyCard tone={empty.tone} icon={empty.icon} title={<Label de={empty.de} vi={empty.vi} />} hint={<Label de={empty.hintDe} vi={empty.hintVi} />} />
        </div>
      ) : (
        <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-0">
          {shown.map((item) => {
            const isBusy = busy.has(item.id);
            // The saved day is only known for the status the server sent; a change made here shows none until the refresh.
            const at = item.offer === tab ? item.offerAt : null;
            return (
              <li key={item.id} className={`flex items-center gap-2 border-b border-line pr-4 last:border-b-0 hover:bg-hover ${isBusy ? "opacity-60" : ""}`}>
                <button type="button" onClick={() => setOpenId(item.id)} className="group flex min-w-0 flex-1 items-center gap-3 py-2.5 pl-5 text-left">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#EEF0F3] text-[12.5px] font-semibold text-[#3A3F47]">{initials(item.name)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-[13.5px] font-semibold text-ink">{item.name}</span>
                      <Icon name="chevron" size={13} className="flex-none text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
                      <Icon name="chat" size={12} className="text-faint" />
                      {item.channel === "whatsapp" ? "WhatsApp" : "Messenger"}
                      <span className="text-faint">· {item.time}</span>
                    </span>
                  </span>
                  <Chip className={TONE[item.tone]}>
                    <Label de={item.chipDe} vi={item.chipVi} />
                  </Chip>
                </button>
                {tab === "offen" ? (
                  <span className="flex flex-none items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setOffer(item, "uebersprungen")}
                      {...tip("Kein Angebot an diese Person", "Không gửi ưu đãi cho người này")}
                      className="h-8 rounded-full px-3 text-[12.5px] font-medium text-muted transition-colors hover:bg-[#E6E8EC] hover:text-ink disabled:cursor-wait"
                    >
                      <Label de="Überspringen" vi="Bỏ qua" />
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setOffer(item, "geschickt")}
                      {...tip("Sonderangebot ist geschickt", "Đã gửi ưu đãi")}
                      className="flex h-8 items-center gap-1 rounded-full border border-[#1B8A6B]/40 bg-white px-3 text-[12.5px] font-semibold text-[#1B6E5D] transition-colors hover:border-[#1B8A6B] hover:bg-[#1B8A6B] hover:text-white disabled:cursor-wait"
                    >
                      <Icon name="check" size={13} strokeWidth={2.6} />
                      <Label de="Geschickt" vi="Đã gửi" />
                    </button>
                  </span>
                ) : (
                  <span className="flex flex-none items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[12px] font-medium ${tab === "geschickt" ? "text-[#1B6E5D]" : "text-muted"}`}>
                      {tab === "geschickt" && <Icon name="check" size={12} strokeWidth={2.6} />}
                      <Label de={OFFER_INFO[tab].de} vi={OFFER_INFO[tab].vi} />
                      {at && <span className="font-normal text-faint">· {at}</span>}
                    </span>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setOffer(item, "offen")}
                      {...tip("Wieder auf Offen setzen", "Đưa về chưa gửi")}
                      className="h-8 rounded-full px-3 text-[12.5px] font-medium text-accent transition-colors hover:bg-accent-soft disabled:cursor-wait"
                    >
                      <Label de="Auf Offen" vi="Về chưa gửi" />
                    </button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {openItem && (
        <ChatPreviewModal
          chat={openItem}
          onClose={() => setOpenId(null)}
          footer={
            <div className="flex items-center gap-2">
              <span className="flex flex-1 items-center gap-1.5 text-[12px] font-semibold text-muted">
                <Icon name="megaphone" size={13} />
                <Label de={`Sonderangebot ${classCode(c.name)}`} vi={`Ưu đãi ${classCode(c.name)}`} />
              </span>
              <OfferSwitch value={offerOf(openItem)} busy={busy.has(openItem.id)} onChange={(next) => setOffer(openItem, next)} />
            </div>
          }
        />
      )}
    </div>
  );
}
