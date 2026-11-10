"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { toggleChecklistItem } from "@/app/actions";
import { AnimatedBar } from "./Reveal";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { PaneLink } from "./PaneLink";
import type { OnboardingCheck } from "@/lib/types";
import type { QuizState } from "@/lib/pageQuiz";

type RowItem = {
  id: string;
  label_de: string;
  label_vi: string;
  href: string | null;
  fullHref: string | null;
  minutes: number | null;
  quiz: { href: string; state: QuizState } | null;
  children?: OnboardingCheck[];
};

export type WeekData = {
  id: string;
  week: number;
  /** False: the heading is the title only. These tasks are not a calendar week. */
  timed: boolean;
  title_de: string;
  title_vi: string;
  quizId: string | null;
  quizPassed: boolean;
  bestScore: string | null;
  // minutes = time for the linked page, quiz included. fullHref set → href opens the side pane. quiz set → ticked by passing that page's quiz, not by hand.
  items: RowItem[];
};

function leaves(items: RowItem[]): { id: string }[] {
  return items.flatMap((i) => (i.children?.length ? i.children : [i]));
}

/** Ticks changed in this tab (item → done): the list next to the side pane and the full list are two
 *  panels (see PaneLayout), and the one that shows up later starts from these. */
const changed = new Map<string, boolean>();

export function OnboardingPanel({ weeks, initialDone, areaSlug }: { weeks: WeekData[]; initialDone: string[]; areaSlug: string }) {
  const [done, setDone] = useState(() => {
    const set = new Set(initialDone);
    for (const [id, value] of changed) {
      if (value) set.add(id);
      else set.delete(id);
    }
    return set;
  });
  const [, startTransition] = useTransition();

  const total = weeks.reduce((n, w) => n + leaves(w.items).length, 0);
  const doneCount = weeks.reduce((n, w) => n + leaves(w.items).filter((i) => done.has(i.id)).length, 0);
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const quizzesPassed = weeks.filter((w) => w.quizPassed).length;
  const weekQuizzes = weeks.filter((w) => w.quizId).length;
  const timedCount = weeks.filter((w) => w.timed).length;

  function toggle(ids: string[], value: boolean) {
    for (const id of ids) changed.set(id, value);
    setDone((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (value) next.add(id);
        else next.delete(id);
      }
      return next;
    });
    startTransition(() => toggleChecklistItem(ids, value, areaSlug));
  }

  let previousComplete = true;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="cap">
          <Label de="Mein Fortschritt" vi="Tiến độ của tôi" />
        </span>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2.5">
          <Stat value={doneCount} cls="bg-ok-soft text-ok" de="Erledigt" vi="Đã xong" />
          <Stat value={total - doneCount} cls="bg-[#EEEFF1] text-[#4A4F57]" de="Offen" vi="Còn lại" />
          {weekQuizzes > 0 && <Stat value={`${quizzesPassed}/${weekQuizzes}`} cls="bg-warn-soft text-[#7F5F05]" de="Quiz bestanden" vi="Quiz đã qua" />}
          <Stat value={`${pct} %`} cls="bg-[#E3EEF9] text-[#2D5F92]" de="Gesamt" vi="Tổng" />
        </div>
        <AnimatedBar value={pct} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="cap">
          <Label
            de={timedCount ? `Lernpfad · ${timedCount} ${timedCount === 1 ? "Woche" : "Wochen"}` : "Lernpfad"}
            vi={timedCount ? `Lộ trình · ${timedCount} tuần` : "Lộ trình"}
          />
        </span>
        {weeks.map((w) => {
          const steps = leaves(w.items);
          const wDone = steps.filter((i) => done.has(i.id)).length;
          const complete = wDone === steps.length;
          const active = !complete && previousComplete;
          const locked = !complete && !previousComplete;
          previousComplete = complete;
          const status = complete
            ? { de: "✓ Abgeschlossen", vi: "✓ Hoàn thành", cls: "bg-ok-soft text-ok" }
            : active
              ? { de: "Aktiv", vi: "Đang học", cls: "bg-accent-soft text-accent-dark" }
              : { de: "Als Nächstes", vi: "Tiếp theo", cls: "bg-[#E9EBEE] text-[#4A4F57]" };

          return (
            <section key={w.id} data-reveal className="rounded-lg bg-side p-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2.5 px-2 pb-2 pt-1.5">
                <h3 className="m-0 text-[13px] font-semibold leading-snug text-ink">
                  <Bi de={w.timed ? `Woche ${w.week} · ${w.title_de}` : w.title_de} vi={w.timed ? `Tuần ${w.week} · ${w.title_vi}` : w.title_vi} />
                </h3>
                <span className="flex items-center gap-2 text-xs text-muted">
                  <span className={`inline-flex h-[22px] items-center rounded-full px-2 font-medium ${status.cls}`}>
                    <Label de={status.de} vi={status.vi} />
                  </span>
                  {wDone}/{steps.length}
                </span>
              </div>
              <div className="rounded-md bg-white px-1.5 py-1 shadow-[0_1px_2px_rgba(16,24,40,.06)]">
                {w.items.map((it) =>
                  it.children?.length ? (
                    <GroupRow key={it.id} item={it} done={done} onToggle={toggle} />
                  ) : (
                    <LeafRow key={it.id} item={it} checked={done.has(it.id)} onToggle={toggle} />
                  ),
                )}
                {w.quizId && (
                  <div className="flex flex-wrap items-center justify-between gap-2.5 px-1.5 pb-1.5 pt-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Icon name="spark" size={13} />
                      {w.quizPassed ? (
                        <Label de={`Quiz bestanden: ${w.bestScore}`} vi={`Đã qua quiz: ${w.bestScore}`} />
                      ) : (
                        <Label de="Wochen-Quiz" vi="Quiz của tuần" />
                      )}
                    </span>
                    {locked ? (
                      <span className="flex items-center gap-1.5 text-xs text-muted">
                        <Icon name="lock" size={12} strokeWidth={2} />
                        <Label de="Gesperrt" vi="Chưa mở" />
                      </span>
                    ) : (
                      <Link
                        href={`/quiz/${w.quizId}`}
                        className={`inline-flex h-8 items-center rounded-md px-3 text-[13px] font-medium ${
                          active ? "bg-accent text-white hover:bg-[#1F5DB5] hover:text-white" : "bg-chip text-ink hover:bg-line hover:text-ink"
                        }`}
                      >
                        <Label de={w.quizPassed ? "Wiederholen" : "Quiz starten"} vi={w.quizPassed ? "Làm lại" : "Làm quiz"} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LeafRow({ item, checked, onToggle }: { item: RowItem; checked: boolean; onToggle: (ids: string[], value: boolean) => void }) {
  const Row = item.quiz ? "div" : "label";
  return (
    <Row className={`flex items-start gap-2.5 border-b border-[#F0F1F3] px-1.5 py-2.5 text-[13px] last:border-b-0 ${item.quiz ? "" : "cursor-pointer"}`}>
      <Box
        checked={checked}
        disabled={!!item.quiz}
        title={item.quiz ? "Wird abgehakt, sobald das Quiz bestanden ist · Tự đánh dấu khi qua quiz" : undefined}
        onChange={(value) => onToggle([item.id], value)}
      />
      <span className="flex min-w-0 flex-col items-start gap-1">
        <span className={checked ? "text-faint line-through" : "text-ink"}>
          <Bi de={item.label_de} vi={item.label_vi} />
        </span>
        {item.minutes && !checked && (
          <span className="text-xs text-muted">
            <Label de={`~${item.minutes} Min.`} vi={`~${item.minutes} phút`} />
          </span>
        )}
        {item.quiz && !checked && (
          <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Icon name="spark" size={12} />
            {item.quiz.state === "outdated" ? (
              <Label de="Neue Inhalte – Quiz wiederholen, um abzuhaken" vi="Có nội dung mới – làm lại quiz để hoàn thành" />
            ) : (
              <Label de="Erledigt, sobald das Quiz bestanden ist" vi="Hoàn thành khi qua quiz" />
            )}
            <Link href={item.quiz.href} className="font-medium text-accent">
              {item.quiz.state === "open" ? <Label de="Quiz starten" vi="Làm quiz" /> : <Label de="Quiz wiederholen" vi="Làm lại quiz" />} →
            </Link>
          </span>
        )}
      </span>
      {item.href && item.fullHref ? (
        <PaneLink href={item.href} fullHref={item.fullHref} className="ml-auto flex-none text-xs" onClick={(e) => e.stopPropagation()}>
          <Label de="Öffnen" vi="Mở" /> →
        </PaneLink>
      ) : (
        item.href && (
          <Link href={item.href} className="ml-auto flex-none text-xs" onClick={(e) => e.stopPropagation()}>
            <Label de="Öffnen" vi="Mở" /> →
          </Link>
        )
      )}
    </Row>
  );
}

/** Parent box follows the children: checked only when every one is ticked. Clicking it ticks or clears them all. */
function GroupRow({ item, done, onToggle }: { item: RowItem; done: Set<string>; onToggle: (ids: string[], value: boolean) => void }) {
  const kids = item.children ?? [];
  const doneKids = kids.filter((c) => done.has(c.id)).length;
  const all = doneKids === kids.length && kids.length > 0;
  return (
    <div className="border-b border-[#F0F1F3] last:border-b-0">
      <label className="flex cursor-pointer items-start gap-2.5 px-1.5 py-2.5 text-[13px]">
        <Box checked={all} indeterminate={doneKids > 0 && !all} onChange={() => onToggle(kids.map((c) => c.id), !all)} />
        <span className={all ? "text-faint line-through" : "text-ink"}>
          <Bi de={item.label_de} vi={item.label_vi} />
        </span>
      </label>
      <div className="flex flex-col pb-1 pl-6">
        {kids.map((c) => {
          const checked = done.has(c.id);
          return (
            <label key={c.id} className="flex cursor-pointer items-start gap-2.5 border-t border-[#F0F1F3] px-1.5 py-2 text-[13px]">
              <Box checked={checked} onChange={(value) => onToggle([c.id], value)} />
              <span className={checked ? "text-faint line-through" : "text-ink"}>
                <Bi de={c.label_de} vi={c.label_vi} />
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function Box({
  checked,
  indeterminate = false,
  disabled,
  title,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  title?: string;
  onChange: (value: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      title={title}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 h-[15px] w-[15px] flex-none accent-accent"
    />
  );
}

function Stat({ value, cls, de, vi }: { value: number | string; cls: string; de: string; vi: string }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-lg p-3.5 ${cls}`}>
      <strong className="text-[22px] font-semibold">{value}</strong>
      <span className="text-[13px]">
        <Label de={de} vi={vi} />
      </span>
    </div>
  );
}
