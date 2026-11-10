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
  weekdayOnly?: boolean; // only due on this weekday (parents and standalone tasks)
  href: string | null;
  fullHref: string | null; // set → href opens the side pane
  anchor: string | null; // the section of the page to jump to
  subtasks?: DailyItem[];
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

/** The button next to a task: opens its step-by-step guide (which links on to the Handbuch). */
const GUIDE_LINK = {
  title: "Schritt für Schritt · Hướng dẫn từng bước",
  "aria-label": "Schritt für Schritt · Hướng dẫn từng bước",
  className: "flex h-7 flex-none items-center gap-1 rounded-md px-1.5 text-xs text-muted hover:bg-hover hover:text-ink",
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
    for (const it of items.flatMap((i) => [i, ...(i.subtasks ?? [])])) {
      const s = saved.get(`${areaSlug}|${day}|${it.id}`);
      if (s) merged[it.id] = s;
    }
    return merged;
  });
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const leaves = items.flatMap((i) => (i.subtasks?.length ? i.subtasks : [i]));
  const doneCount = leaves.filter((i) => state[i.id]?.done).length;
  const pct = leaves.length ? Math.round((doneCount / leaves.length) * 100) : 0;

  function saveMany(updates: { id: string; next: Entry }[]) {
    const before: Record<string, Entry> = {};
    for (const u of updates) {
      before[u.id] = state[u.id] ?? { done: false, note: "" };
      saved.set(`${areaSlug}|${day}|${u.id}`, u.next);
    }
    setState((prev) => {
      const copy = { ...prev };
      for (const u of updates) copy[u.id] = u.next;
      return copy;
    });
    startTransition(async () => {
      try {
        const results = await Promise.all(updates.map((u) => saveDailyTask(areaSlug, u.id, day, u.next.done, u.next.note)));
        if (results.some((res) => !res.ok)) {
          toast("Neuer Tag – die Liste wurde zurückgesetzt · Ngày mới – danh sách đã được làm mới");
          router.refresh();
        }
      } catch {
        for (const u of updates) saved.set(`${areaSlug}|${day}|${u.id}`, before[u.id]);
        setState((prev) => ({ ...prev, ...before }));
        toast("Nicht gespeichert – bitte noch einmal · Chưa lưu được – vui lòng thử lại");
      }
    });
  }

  function save(id: string, next: Entry) {
    saveMany([{ id, next }]);
  }

  /** A grouped task is done exactly when every part is done. Ticking the parent ticks every part. */
  function toggleParent(it: DailyItem, done: boolean) {
    const parts = it.subtasks ?? [];
    saveMany([
      ...parts.map((s) => ({ id: s.id, next: { ...(state[s.id] ?? { done: false, note: "" }), done } })),
      { id: it.id, next: { ...(state[it.id] ?? { done: false, note: "" }), done } },
    ]);
  }

  function togglePart(it: DailyItem, partId: string, done: boolean) {
    const parts = it.subtasks ?? [];
    const parentDone = parts.every((s) => (s.id === partId ? done : state[s.id]?.done));
    saveMany([
      { id: partId, next: { ...(state[partId] ?? { done: false, note: "" }), done } },
      { id: it.id, next: { ...(state[it.id] ?? { done: false, note: "" }), done: parentDone } },
    ]);
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
            {doneCount}/{leaves.length}
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
              const parts = it.subtasks ?? [];
              const partDone = parts.filter((s) => state[s.id]?.done).length;
              const done = parts.length ? partDone === parts.length : !!state[it.id]?.done;
              const mixed = parts.length > 0 && partDone > 0 && partDone < parts.length;
              return (
                <div key={it.id} className="border-b border-[#F0F1F3] px-1.5 py-2.5 text-[13px] last:border-b-0">
                  <TaskLine
                    it={it}
                    done={done}
                    mixed={mixed}
                    entry={state[it.id] ?? { done: false, note: "" }}
                    narrow={narrow}
                    editing={openNote === it.id}
                    onToggle={(checked) => (parts.length ? toggleParent(it, checked) : save(it.id, { ...(state[it.id] ?? { done: false, note: "" }), done: checked }))}
                    onNote={() => setOpenNote(openNote === it.id ? null : it.id)}
                    onSaveNote={(note) => {
                      setOpenNote(null);
                      const entry = state[it.id] ?? { done: false, note: "" };
                      if (note.trim() !== entry.note) save(it.id, { done, note: note.trim() });
                    }}
                    onCancelNote={() => setOpenNote(null)}
                  />
                  {parts.length > 0 && (
                    <div className="mt-1 ml-[25px] border-l border-[#F0F1F3] pl-2.5">
                      {parts.map((sub) => (
                        <TaskLine
                          key={sub.id}
                          it={sub}
                          done={!!state[sub.id]?.done}
                          mixed={false}
                          entry={state[sub.id] ?? { done: false, note: "" }}
                          narrow={narrow}
                          editing={openNote === sub.id}
                          guide={sub.anchor !== it.anchor}
                          onToggle={(checked) => togglePart(it, sub.id, checked)}
                          onNote={() => setOpenNote(openNote === sub.id ? null : sub.id)}
                          onSaveNote={(note) => {
                            setOpenNote(null);
                            const entry = state[sub.id] ?? { done: false, note: "" };
                            if (note.trim() !== entry.note) save(sub.id, { ...entry, note: note.trim() });
                          }}
                          onCancelNote={() => setOpenNote(null)}
                        />
                      ))}
                    </div>
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

function TaskLine({
  it,
  done,
  mixed,
  entry,
  narrow,
  editing,
  guide = true,
  onToggle,
  onNote,
  onSaveNote,
  onCancelNote,
}: {
  it: DailyItem;
  done: boolean;
  mixed: boolean;
  entry: Entry;
  narrow: boolean;
  editing: boolean;
  guide?: boolean;
  onToggle: (checked: boolean) => void;
  onNote: () => void;
  onSaveNote: (note: string) => void;
  onCancelNote: () => void;
}) {
  return (
    <div className="py-1 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2.5">
        <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5">
          <input
            ref={(el) => {
              if (el) el.indeterminate = mixed;
            }}
            type="checkbox"
            checked={done}
            onChange={(e) => onToggle(e.target.checked)}
            className="mt-0.5 h-[15px] w-[15px] flex-none accent-accent"
          />
          <span className={done ? "text-faint line-through" : "text-ink"}>
            <Bi de={it.label_de} vi={it.label_vi} />
          </span>
        </label>
        {!narrow && (
          <button
            type="button"
            onClick={onNote}
            aria-expanded={editing}
            title="Notiz · Ghi chú"
            className={`flex h-7 flex-none items-center gap-1 rounded-md px-1.5 text-xs hover:bg-hover ${entry.note ? "text-accent-dark" : "text-muted"}`}
          >
            <Icon name="edit" size={13} />
            <Label de="Notiz" vi="Ghi chú" />
          </button>
        )}
        {guide && it.href && it.fullHref ? (
          <PaneLink href={it.href} fullHref={it.fullHref} onClick={(e) => goToSection(e, it)} {...GUIDE_LINK}>
            <GuideLabel narrow={narrow} />
          </PaneLink>
        ) : (
          guide &&
          it.href && (
            <Link href={it.href} onClick={(e) => goToSection(e, it)} {...GUIDE_LINK}>
              <GuideLabel narrow={narrow} />
            </Link>
          )
        )}
      </div>
      {narrow ? null : editing ? (
        <NoteEditor initial={entry.note} onSave={onSaveNote} onCancel={onCancelNote} />
      ) : (
        entry.note && <p className="m-0 mt-1.5 whitespace-pre-wrap pl-[25px] text-xs text-muted">{entry.note}</p>
      )}
    </div>
  );
}

/** Icon plus „Anleitung“ – the word only when there is room (no side pane open). */
function GuideLabel({ narrow }: { narrow: boolean }) {
  return (
    <>
      <Icon name="doc" size={14} />
      {!narrow && <Label de="Anleitung" vi="Hướng dẫn" />}
    </>
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
