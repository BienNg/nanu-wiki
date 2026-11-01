"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveDailyTask } from "@/app/actions";
import { AnimatedBar } from "./Reveal";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { PaneLink } from "./PaneLink";

export type DailyItem = {
  id: string;
  label_de: string;
  label_vi: string;
  weekdayOnly: boolean; // only due on this weekday
  href: string | null;
  fullHref: string | null; // set → href opens the side pane
};

type Entry = { done: boolean; note: string };

export function DailyTasksPanel({
  areaSlug,
  day,
  dayLabel,
  items,
  initial,
}: {
  areaSlug: string;
  day: string;
  dayLabel: { de: string; vi: string };
  items: DailyItem[];
  initial: Record<string, Entry>;
}) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, Entry>>(initial);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();

  const doneCount = items.filter((i) => state[i.id]?.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  function save(id: string, next: Entry) {
    setState((prev) => ({ ...prev, [id]: next }));
    setError(false);
    startTransition(async () => {
      try {
        const res = await saveDailyTask(areaSlug, id, day, next.done, next.note);
        if (!res.ok) router.refresh(); // a new day began – load its empty list
      } catch {
        setError(true);
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
        {error && (
          <p role="alert" className="m-0 text-[13px] text-[#B42318]">
            <Label de="Nicht gespeichert – bitte Seite neu laden." vi="Chưa lưu được – vui lòng tải lại trang." />
          </p>
        )}
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
                    {it.href && it.fullHref ? (
                      <PaneLink href={it.href} fullHref={it.fullHref} className="mt-1 flex-none text-xs">
                        <Label de="Handbuch" vi="Sổ tay" /> →
                      </PaneLink>
                    ) : (
                      it.href && (
                        <Link href={it.href} className="mt-1 flex-none text-xs">
                          <Label de="Handbuch" vi="Sổ tay" /> →
                        </Link>
                      )
                    )}
                  </div>
                  {editing ? (
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
