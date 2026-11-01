"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveDailyTask } from "@/app/actions";
import { AnimatedBar } from "./Reveal";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { ARRIVE, showSection, store } from "./DocLink";
import { PANE_QUERY, PaneLink } from "./PaneLink";
import { toast } from "./Toaster";

export type DailyItem = {
  id: string;
  label_de: string;
  label_vi: string;
  weekdayOnly: boolean; // only due on this weekday
  href: string | null;
  fullHref: string | null; // set → href opens the side pane
  anchor: string | null; // the section of the page to jump to
};

type Entry = { done: boolean; note: string };

/** Ticks and notes saved in this tab ("area|day|task" → entry). The list next to the side pane and the
 *  full list are two panels (see PaneLayout): the one that shows up later starts from these, not from
 *  what the server sent before the change. */
const saved = new Map<string, Entry>();

/** Opening a task's page at its section: flash the section once it is on screen (see SectionArrival).
 *  When the pane already shows that page, jump there right away. */
function goToSection(e: React.MouseEvent<HTMLAnchorElement>, it: DailyItem) {
  if (!it.anchor || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const inPane = !!it.fullHref && window.matchMedia(PANE_QUERY).matches;
  const to = new URL(inPane || !it.fullHref ? it.href! : it.fullHref, location.href);
  if (inPane && to.search === location.search && document.getElementById(it.anchor)?.closest(".doc-pane")) {
    e.preventDefault();
    window.history.pushState(null, "", to.hash);
    showSection(it.anchor, true);
    return;
  }
  store(ARRIVE, to.pathname + to.search + to.hash);
}

/** The small book button next to a task: opens the Handbuch page it comes from. */
const BOOK_LINK = {
  title: "Im Handbuch öffnen · Mở trong Sổ tay",
  "aria-label": "Im Handbuch öffnen · Mở trong Sổ tay",
  className: "flex h-7 w-7 flex-none items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink",
};

export function DailyTasksPanel({
  areaSlug,
  day,
  dayLabel,
  items,
  initial,
  narrow,
}: {
  narrow: boolean; // a Handbuch page is open in the side pane: ticks only, no notes
  areaSlug: string;
  day: string;
  dayLabel: { de: string; vi: string };
  items: DailyItem[];
  initial: Record<string, Entry>;
}) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, Entry>>(() => {
    const merged = { ...initial };
    for (const it of items) {
      const s = saved.get(`${areaSlug}|${day}|${it.id}`);
      if (s) merged[it.id] = s;
    }
    return merged;
  });
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const doneCount = items.filter((i) => state[i.id]?.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  function save(id: string, next: Entry) {
    const before = state[id] ?? { done: false, note: "" };
    const key = `${areaSlug}|${day}|${id}`;
    saved.set(key, next);
    setState((prev) => ({ ...prev, [id]: next }));
    startTransition(async () => {
      try {
        const res = await saveDailyTask(areaSlug, id, day, next.done, next.note);
        if (!res.ok) {
          toast("Neuer Tag – die Liste wurde zurückgesetzt · Ngày mới – danh sách đã được làm mới");
          router.refresh();
        }
      } catch {
        saved.set(key, before);
        setState((prev) => ({ ...prev, [id]: before }));
        toast("Nicht gespeichert – bitte noch einmal · Chưa lưu được – vui lòng thử lại");
      }
    });
  }

  const groups = [
    { de: "Jeden Tag", vi: "Mỗi ngày", list: items.filter((i) => !i.weekdayOnly) },
    { de: `Nur ${dayLabel.de}s`, vi: `Chỉ ${dayLabel.vi}`, list: items.filter((i) => i.weekdayOnly) },
  ].filter((g) => g.list.length);

  return (
    <div role="tabpanel" className="flex max-w-[760px] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="cap">
          <Label de={`Heute · ${dayLabel.de}, ${day.slice(8, 10)}.${day.slice(5, 7)}.`} vi={`Hôm nay · ${dayLabel.vi}, ${day.slice(8, 10)}/${day.slice(5, 7)}`} />
        </span>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <strong className="text-[22px] font-semibold text-ink">
            {doneCount}/{items.length}
          </strong>
          <span className="text-[13px] text-muted">
            <Label de="erledigt · die Liste beginnt jeden Tag um 0 Uhr (Vietnam) neu" vi="đã xong · danh sách làm mới lúc 0h mỗi ngày (giờ Việt Nam)" />
          </span>
        </div>
        <AnimatedBar value={pct} />
      </div>

      {groups.map((g) => (
        <section key={g.de} className="rounded-lg bg-side p-1.5">
          <h3 className="m-0 px-2 pb-2 pt-1.5 text-[13px] font-semibold text-ink">
            <Bi de={g.de} vi={g.vi} inline />
          </h3>
          <div className="rounded-md bg-white px-1.5 py-1 shadow-[0_1px_2px_rgba(16,24,40,.06)]">
            {g.list.map((it) => {
              const entry = state[it.id] ?? { done: false, note: "" };
              const editing = openNote === it.id;
              return (
                <div key={it.id} className="border-b border-[#F0F1F3] px-1.5 py-2.5 text-[13px] last:border-b-0">
                  <div className="flex items-start gap-2.5">
                    <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={entry.done}
                        onChange={(e) => save(it.id, { ...entry, done: e.target.checked })}
                        className="mt-0.5 h-[15px] w-[15px] flex-none accent-accent"
                      />
                      <span className={entry.done ? "text-faint line-through" : "text-ink"}>
                        <Bi de={it.label_de} vi={it.label_vi} />
                      </span>
                    </label>
                    {!narrow && (
                      <button
                        type="button"
                        onClick={() => setOpenNote(editing ? null : it.id)}
                        aria-expanded={editing}
                        title="Notiz · Ghi chú"
                        className={`flex h-7 flex-none items-center gap-1 rounded-md px-1.5 text-xs hover:bg-hover ${entry.note ? "text-accent-dark" : "text-muted"}`}
                      >
                        <Icon name="edit" size={13} />
                        <Label de="Notiz" vi="Ghi chú" />
                      </button>
                    )}
                    {it.href && it.fullHref ? (
                      <PaneLink href={it.href} fullHref={it.fullHref} onClick={(e) => goToSection(e, it)} {...BOOK_LINK}>
                        <Icon name="book" size={14} />
                      </PaneLink>
                    ) : (
                      it.href && (
                        <Link href={it.href} onClick={(e) => goToSection(e, it)} {...BOOK_LINK}>
                          <Icon name="book" size={14} />
                        </Link>
                      )
                    )}
                  </div>
                  {narrow ? null : editing ? (
                    <NoteEditor
                      initial={entry.note}
                      onSave={(note) => {
                        setOpenNote(null);
                        if (note.trim() !== entry.note) save(it.id, { ...entry, note: note.trim() });
                      }}
                      onCancel={() => setOpenNote(null)}
                    />
                  ) : (
                    entry.note && <p className="m-0 mt-1.5 whitespace-pre-wrap pl-[25px] text-xs text-muted">{entry.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function NoteEditor({ initial, onSave, onCancel }: { initial: string; onSave: (note: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState(initial);
  return (
    <div className="mt-2 flex flex-col gap-1.5 pl-[25px]">
      <textarea
        autoFocus
        value={value}
        maxLength={1000}
        rows={2}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSave(value);
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Z. B. warum es heute nicht geklappt hat · Ví dụ: vì sao hôm nay chưa làm được"
        className="w-full resize-y rounded-md border border-line px-2.5 py-1.5 text-[13px] text-ink outline-none focus:border-accent"
      />
      <div className="flex gap-1.5">
        <button type="button" onClick={() => onSave(value)} className="inline-flex h-7 items-center rounded-md bg-accent px-2.5 text-xs font-medium text-white hover:bg-[#1F5DB5]">
          <Label de="Speichern" vi="Lưu" />
        </button>
        <button type="button" onClick={onCancel} className="inline-flex h-7 items-center rounded-md px-2.5 text-xs text-muted hover:bg-hover hover:text-ink">
          <Label de="Abbrechen" vi="Huỷ" />
        </button>
      </div>
    </div>
  );
}
