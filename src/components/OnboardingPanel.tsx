"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleChecklistItem } from "@/app/actions";
import { AnimatedBar } from "./Reveal";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";

export type WeekData = {
  id: string;
  week: number;
  title_de: string;
  title_vi: string;
  quizId: string | null;
  quizPassed: boolean;
  bestScore: string | null;
  items: { id: string; label_de: string; label_vi: string; href: string | null }[];
};

export function OnboardingPanel({ weeks, initialDone, areaSlug }: { weeks: WeekData[]; initialDone: string[]; areaSlug: string }) {
  const [done, setDone] = useState(() => new Set(initialDone));
  const [, startTransition] = useTransition();

  const total = weeks.reduce((n, w) => n + w.items.length, 0);
  const doneCount = weeks.reduce((n, w) => n + w.items.filter((i) => done.has(i.id)).length, 0);
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const quizzesPassed = weeks.filter((w) => w.quizPassed).length;

  function toggle(itemId: string, value: boolean) {
    setDone((prev) => {
      const next = new Set(prev);
      if (value) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
    startTransition(() => toggleChecklistItem(itemId, value, areaSlug));
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
          <Stat value={`${quizzesPassed}/${weeks.filter((w) => w.quizId).length}`} cls="bg-warn-soft text-[#7F5F05]" de="Quiz bestanden" vi="Quiz đã qua" />
          <Stat value={`${pct} %`} cls="bg-[#E3EEF9] text-[#2D5F92]" de="Gesamt" vi="Tổng" />
        </div>
        <AnimatedBar value={pct} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="cap">
          <Label de={`Lernpfad · ${weeks.length} Wochen`} vi={`Lộ trình · ${weeks.length} tuần`} />
        </span>
        {weeks.map((w) => {
          const wDone = w.items.filter((i) => done.has(i.id)).length;
          const complete = wDone === w.items.length;
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
                  <Bi de={`Woche ${w.week} · ${w.title_de}`} vi={`Tuần ${w.week} · ${w.title_vi}`} />
                </h3>
                <span className="flex items-center gap-2 text-xs text-muted">
                  <span className={`inline-flex h-[22px] items-center rounded-full px-2 font-medium ${status.cls}`}>
                    <Label de={status.de} vi={status.vi} />
                  </span>
                  {wDone}/{w.items.length}
                </span>
              </div>
              <div className="rounded-md bg-white px-1.5 py-1 shadow-[0_1px_2px_rgba(16,24,40,.06)]">
                {w.items.map((it) => {
                  const checked = done.has(it.id);
                  return (
                    <label key={it.id} className="flex cursor-pointer items-start gap-2.5 border-b border-[#F0F1F3] px-1.5 py-2.5 text-[13px] last:border-b-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggle(it.id, e.target.checked)}
                        className="mt-0.5 h-[15px] w-[15px] flex-none accent-accent"
                      />
                      <span className={checked ? "text-faint line-through" : "text-ink"}>
                        <Bi de={it.label_de} vi={it.label_vi} />
                      </span>
                      {it.href && (
                        <Link href={it.href} className="ml-auto flex-none text-xs" onClick={(e) => e.stopPropagation()}>
                          <Label de="Öffnen" vi="Mở" /> →
                        </Link>
                      )}
                    </label>
                  );
                })}
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
