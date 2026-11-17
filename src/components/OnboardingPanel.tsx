"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { toggleChecklistItem } from "@/app/actions";
import { AnimatedBar } from "./Reveal";
import { Bi, Label, tip, type TipText } from "./Bi";
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

type Status = "done" | "active" | "locked";

/** What the progress card offers as the next thing to do. */
type Next =
  | {
      kind: "item";
      week: WeekData;
      item: RowItem;
      child: OnboardingCheck | null;
    }
  | { kind: "quiz"; week: WeekData }
  | { kind: "finished" };

function leaves(items: RowItem[]): { id: string }[] {
  return items.flatMap((i) => (i.children?.length ? i.children : [i]));
}

/** Ticks changed in this tab (item → done): the list next to the side pane and the full list are two
 *  panels (see PaneLayout), and the one that shows up later starts from these. */
const changed = new Map<string, boolean>();

export function OnboardingPanel({
  weeks,
  initialDone,
  areaSlug,
  narrow = false,
}: {
  weeks: WeekData[];
  initialDone: string[];
  areaSlug: string;
  narrow?: boolean;
}) {
  const [done, setDone] = useState(() => {
    const set = new Set(initialDone);
    for (const [id, value] of changed) {
      if (value) set.add(id);
      else set.delete(id);
    }
    return set;
  });
  const [, startTransition] = useTransition();

  // A week is active when it is open and the week before it is complete; open weeks after an open one are locked (their quiz can't start yet).
  let previousComplete = true;
  const rows = weeks.map((w) => {
    const steps = leaves(w.items);
    const wDone = steps.filter((i) => done.has(i.id)).length;
    const complete = wDone === steps.length;
    const status: Status = complete ? "done" : previousComplete ? "active" : "locked";
    previousComplete = complete;
    const minutesLeft = w.items.reduce((n, it) => n + (!it.children?.length && !done.has(it.id) ? (it.minutes ?? 0) : 0), 0);
    return { week: w, steps: steps.length, wDone, status, minutesLeft };
  });

  const total = rows.reduce((n, r) => n + r.steps, 0);
  const doneCount = rows.reduce((n, r) => n + r.wDone, 0);
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const quizzesPassed = weeks.filter((w) => w.quizPassed).length;
  const weekQuizzes = weeks.filter((w) => w.quizId).length;
  const timedCount = weeks.filter((w) => w.timed).length;
  const minutesLeft = rows.reduce((n, r) => n + r.minutesLeft, 0);

  const next = nextStep(rows, done);

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

  return (
    <div className={`flex flex-col ${narrow ? "gap-5" : "gap-7"}`}>
      {/* Progress + next step */}
      <section data-reveal aria-label="Mein Fortschritt" className="overflow-hidden rounded-xl border border-line bg-white">
        <div className={narrow ? "flex flex-col gap-3 p-4" : "flex flex-col gap-3.5 px-6 pb-5 pt-5"}>
          <span className="cap">
            <Label de="Mein Fortschritt" vi="Tiến độ của tôi" />
          </span>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1.5">
            <strong className={`font-semibold leading-none tracking-tight text-ink ${narrow ? "text-[30px]" : "text-[40px]"}`}>
              {pct}
              <span className="ml-0.5 text-[0.55em] text-muted">%</span>
            </strong>
            <span className="pb-0.5 text-[14px] text-body">
              <Label de={`${doneCount} von ${total} Schritten erledigt`} vi={`Đã xong ${doneCount}/${total} bước`} />
            </span>
          </div>
          <AnimatedBar value={pct} color={pct === 100 ? "#23794A" : "#2C6ECB"} height={8} />
          <div className="flex flex-wrap gap-1.5">
            {weekQuizzes > 0 && (
              <Chip cls="bg-ask-soft text-ask" icon="spark">
                <Label de={`Quiz ${quizzesPassed}/${weekQuizzes} bestanden`} vi={`Qua ${quizzesPassed}/${weekQuizzes} quiz`} />
              </Chip>
            )}
            {minutesLeft > 0 && (
              <Chip cls="bg-chip text-[#4A4F57]" icon="clock">
                <Label de={`~${minutesLeft} Min. Lesezeit übrig`} vi={`Còn ~${minutesLeft} phút đọc`} />
              </Chip>
            )}
          </div>
        </div>
        <NextStep next={next} narrow={narrow} />
      </section>

      {/* Learning path */}
      <div className="flex flex-col gap-3">
        <span className="cap">
          <Label
            de={timedCount ? `Lernpfad · ${timedCount} ${timedCount === 1 ? "Woche" : "Wochen"}` : "Lernpfad"}
            vi={timedCount ? `Lộ trình · ${timedCount} tuần` : "Lộ trình"}
          />
        </span>
        <ol className="m-0 flex list-none flex-col p-0">
          {rows.map((r, idx) => (
            <WeekBlock key={r.week.id} row={r} step={idx + 1} last={idx === rows.length - 1} done={done} onToggle={toggle} narrow={narrow} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function nextStep(rows: { week: WeekData; status: Status }[], done: Set<string>): Next {
  const active = rows.find((r) => r.status === "active");
  if (active) {
    for (const item of active.week.items) {
      if (item.children?.length) {
        const child = item.children.find((c) => !done.has(c.id));
        if (child) return { kind: "item", week: active.week, item, child };
      } else if (!done.has(item.id)) {
        return { kind: "item", week: active.week, item, child: null };
      }
    }
  }
  const quiz = rows.find((r) => r.status === "done" && r.week.quizId && !r.week.quizPassed);
  if (quiz) return { kind: "quiz", week: quiz.week };
  return { kind: "finished" };
}

function weekName(w: WeekData) {
  return w.timed
    ? {
        de: `Woche ${w.week} · ${w.title_de}`,
        vi: `Tuần ${w.week} · ${w.title_vi}`,
      }
    : { de: w.title_de, vi: w.title_vi };
}

const primaryBtn =
  "inline-flex h-9 flex-none items-center gap-1.5 rounded-lg bg-accent px-3.5 text-[13px] font-medium text-white hover:bg-[#1F5DB5] hover:text-white";
const secondaryBtn =
  "inline-flex h-9 flex-none items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 text-[13px] font-medium text-ink hover:bg-hover hover:text-ink";

function NextStep({ next, narrow }: { next: Next; narrow: boolean }) {
  const pad = narrow ? "px-4 py-3.5" : "px-6 py-4";

  if (next.kind === "finished") {
    return (
      <div className={`flex items-center gap-3 border-t border-[#CFE8D8] bg-ok-soft ${pad}`}>
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ok text-white">
          <Icon name="tick" size={18} strokeWidth={2.4} />
        </span>
        <span className="flex flex-col">
          <strong className="text-[14px] font-semibold text-ok">
            <Label de="Lernpfad abgeschlossen" vi="Đã hoàn thành lộ trình" />
          </strong>
          <span className="text-xs text-[#3F6B52]">
            <Label de="Alle Schritte und Quizze sind erledigt." vi="Tất cả các bước và quiz đã xong." />
          </span>
        </span>
      </div>
    );
  }

  const name = weekName(next.week);
  let title: { de: string; vi: string };
  let hint: { de: string; vi: string } | null = null;
  let actions: React.ReactNode = null;

  if (next.kind === "quiz") {
    title = { de: "Wochen-Quiz", vi: "Quiz của tuần" };
    hint = {
      de: "Alle Schritte sind erledigt – jetzt fehlt nur noch das Quiz.",
      vi: "Đã xong các bước – chỉ còn quiz.",
    };
    actions = (
      <Link href={`/quiz/${next.week.quizId}`} className={primaryBtn}>
        <Icon name="spark" size={14} />
        <Label de="Quiz starten" vi="Làm quiz" />
      </Link>
    );
  } else {
    const { item, child } = next;
    title = child
      ? {
          de: `${item.label_de} · ${child.label_de}`,
          vi: `${item.label_vi} · ${child.label_vi}`,
        }
      : { de: item.label_de, vi: item.label_vi };
    if (child)
      hint = {
        de: "Unten im Lernpfad abhaken, wenn erledigt.",
        vi: "Đánh dấu ở lộ trình bên dưới khi xong.",
      };
    else if (item.quiz)
      hint = {
        de: "Wird abgehakt, sobald du das Quiz bestehst.",
        vi: "Tự đánh dấu khi bạn qua quiz.",
      };
    actions = (
      <>
        {item.quiz && (
          <Link href={item.quiz.href} className={item.href ? secondaryBtn : primaryBtn}>
            <Icon name="spark" size={14} />
            {item.quiz.state === "open" ? <Label de="Quiz starten" vi="Làm quiz" /> : <Label de="Quiz wiederholen" vi="Làm lại quiz" />}
          </Link>
        )}
        {!child && <OpenLink item={item} className={primaryBtn} big />}
      </>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[#D5E2F5] bg-[#F3F7FD] ${pad}`}>
      <div className="flex min-w-0 flex-1 basis-[220px] items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent text-white">
          <Icon name="arrow" size={16} strokeWidth={2.2} />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-accent-dark">
            <Label de={`Weiter mit · ${name.de}`} vi={`Tiếp tục · ${name.vi}`} />
          </span>
          <strong className="text-[15px] font-semibold leading-snug text-ink">
            <Bi de={title.de} vi={title.vi} />
          </strong>
          {hint && (
            <span className="text-xs text-muted">
              <Label de={hint.de} vi={hint.vi} />
            </span>
          )}
        </span>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** "Öffnen": pages of this area open in the side pane (PaneLink), others go to the full page. */
function OpenLink({ item, className, big = false, iconOnly = false }: { item: RowItem; className: string; big?: boolean; iconOnly?: boolean }) {
  if (!item.href) return null;
  const content = iconOnly ? (
    <Icon name="arrow" size={14} strokeWidth={2} />
  ) : (
    <>
      <Label de="Öffnen" vi="Mở" />
      <Icon name="arrow" size={big ? 14 : 13} strokeWidth={2} />
    </>
  );
  const label = iconOnly ? { ...tip({ de: "Öffnen", vi: "Mở" }), "aria-label": "Öffnen" } : {};
  return item.fullHref ? (
    <PaneLink {...label} href={item.href} fullHref={item.fullHref} className={className} onClick={(e) => e.stopPropagation()}>
      {content}
    </PaneLink>
  ) : (
    <Link {...label} href={item.href} className={className} onClick={(e) => e.stopPropagation()}>
      {content}
    </Link>
  );
}

const STATUS: Record<Status, { de: string; vi: string; cls: string }> = {
  done: { de: "Abgeschlossen", vi: "Hoàn thành", cls: "bg-ok-soft text-ok" },
  active: {
    de: "Aktiv",
    vi: "Đang học",
    cls: "bg-accent-soft text-accent-dark",
  },
  locked: {
    de: "Als Nächstes",
    vi: "Tiếp theo",
    cls: "bg-chip text-[#4A4F57]",
  },
};

function WeekBlock({
  row,
  step,
  last,
  done,
  onToggle,
  narrow,
}: {
  row: {
    week: WeekData;
    steps: number;
    wDone: number;
    status: Status;
    minutesLeft: number;
  };
  step: number;
  last: boolean;
  done: Set<string>;
  onToggle: (ids: string[], value: boolean) => void;
  narrow: boolean;
}) {
  const { week: w, steps, wDone, status, minutesLeft } = row;
  const st = STATUS[status];
  const pct = steps ? Math.round((wDone / steps) * 100) : 0;
  const pad = narrow ? "px-3" : "px-4";

  const size = narrow ? "h-6 w-6 text-xs" : "h-7 w-7 text-[13px]";
  const node =
    status === "done" ? (
      <span className={`flex flex-none items-center justify-center rounded-full bg-ok text-white ${size}`}>
        <Icon name="tick" size={narrow ? 13 : 15} strokeWidth={2.6} />
      </span>
    ) : status === "active" ? (
      <span className={`flex flex-none items-center justify-center rounded-full bg-accent font-semibold text-white shadow-[0_0_0_4px_#DCE8FB] ${size}`}>
        {step}
      </span>
    ) : (
      <span className={`flex flex-none items-center justify-center rounded-full border border-line bg-white font-semibold text-faint ${size}`}>{step}</span>
    );

  return (
    <li data-reveal className={narrow ? "flex flex-col" : "flex flex-col md:grid md:grid-cols-[28px_1fr] md:gap-4"}>
      {/* Timeline rail (wide only; next to the side pane and on phones the number sits in the card header) */}
      {!narrow && (
        <div className="flex flex-col items-center pt-3.5 max-md:hidden">
          {node}
          {!last && <span className={`mt-1.5 w-0.5 flex-1 rounded-full ${status === "done" ? "bg-[#B9DCC6]" : "bg-line"}`} />}
        </div>
      )}

      <section
        className={`${narrow ? "mb-3" : "mb-4"} min-w-0 overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-[0_2px_8px_rgba(16,24,40,.06)] ${
          status === "active" ? "border-accent/45 shadow-[0_0_0_3px_rgba(44,110,203,.07)]" : "border-line"
        }`}
      >
        <header className={`flex flex-col gap-2 border-b border-line-soft py-3 ${pad} ${status === "locked" ? "bg-[#FAFBFC]" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
            <div className="flex min-w-0 items-start gap-2.5">
              {narrow ? node : <span className="md:hidden">{node}</span>}
              <div className="flex min-w-0 flex-col gap-0.5">
                {w.timed && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    <Label de={`Woche ${w.week}`} vi={`Tuần ${w.week}`} />
                  </span>
                )}
                <h3 className={`m-0 text-[15px] font-semibold leading-snug ${status === "locked" ? "text-[#4A4F57]" : "text-ink"}`}>
                  <Bi de={w.title_de} vi={w.title_vi} />
                </h3>
              </div>
            </div>
            <span className={`inline-flex h-[22px] flex-none items-center gap-1 rounded-full px-2 text-xs font-medium ${st.cls}`}>
              {status === "done" && <Icon name="tick" size={12} strokeWidth={2.6} />}
              <Label de={st.de} vi={st.vi} />
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EDEEF0]">
              <span
                className={`block h-full rounded-full transition-[width] duration-500 ease-out ${status === "done" ? "bg-ok" : "bg-accent"}`}
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="flex-none tabular-nums">
              <strong className="font-semibold text-ink">{wDone}</strong>/{steps}
            </span>
            {minutesLeft > 0 && !narrow && (
              <span className="flex flex-none items-center gap-1">
                <Icon name="clock" size={12} />
                <Label de={`~${minutesLeft} Min.`} vi={`~${minutesLeft} phút`} />
              </span>
            )}
          </div>
        </header>

        <div>
          {w.items.map((it) =>
            it.children?.length ? (
              <GroupRow key={it.id} item={it} done={done} onToggle={onToggle} pad={pad} />
            ) : (
              <LeafRow key={it.id} item={it} checked={done.has(it.id)} onToggle={onToggle} pad={pad} compact={narrow} />
            ),
          )}
        </div>

        {w.quizId && <WeekQuiz week={w} status={status} pad={pad} />}
      </section>
    </li>
  );
}

function WeekQuiz({ week: w, status, pad }: { week: WeekData; status: Status; pad: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line bg-[#F6F7F9] py-3 ${pad}`}>
      <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${w.quizPassed ? "bg-ok-soft text-ok" : "bg-ask-soft text-ask"}`}>
        <Icon name={w.quizPassed ? "tick" : "spark"} size={15} strokeWidth={w.quizPassed ? 2.4 : 1.9} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <strong className="text-[13px] font-semibold text-ink">
          <Label de="Wochen-Quiz" vi="Quiz của tuần" />
        </strong>
        <span className="text-xs text-muted">
          {w.quizPassed ? (
            <Label de={`Bestanden · ${w.bestScore}`} vi={`Đã qua · ${w.bestScore}`} />
          ) : status === "locked" ? (
            <Label de="Öffnet, wenn die Woche davor erledigt ist" vi="Mở khi xong tuần trước" />
          ) : (
            <Label de="Prüft, was du diese Woche gelernt hast" vi="Kiểm tra những gì bạn học tuần này" />
          )}
        </span>
      </span>
      {status === "locked" ? (
        <span className="inline-flex h-8 flex-none items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-faint">
          <Icon name="lock" size={13} strokeWidth={2} />
          <Label de="Gesperrt" vi="Chưa mở" />
        </span>
      ) : (
        <Link
          href={`/quiz/${w.quizId}`}
          className={`inline-flex h-8 flex-none items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium ${
            w.quizPassed ? "border border-line bg-white text-ink hover:bg-hover hover:text-ink" : "bg-accent text-white hover:bg-[#1F5DB5] hover:text-white"
          }`}
        >
          <Label de={w.quizPassed ? "Wiederholen" : "Quiz starten"} vi={w.quizPassed ? "Làm lại" : "Làm quiz"} />
        </Link>
      )}
    </div>
  );
}

const rowIconAction =
  "inline-flex h-7 w-7 flex-none items-center justify-center rounded-md border border-line bg-white text-ink hover:border-[#D5D8DD] hover:bg-hover hover:text-ink";
const rowAction =
  "inline-flex h-7 flex-none items-center gap-1 rounded-md border border-line bg-white px-2.5 text-xs font-medium text-ink hover:border-[#D5D8DD] hover:bg-hover hover:text-ink";

function LeafRow({
  item,
  checked,
  onToggle,
  pad,
  compact,
}: {
  item: RowItem;
  checked: boolean;
  onToggle: (ids: string[], value: boolean) => void;
  pad: string;
  compact: boolean;
}) {
  const Row = item.quiz ? "div" : "label";
  const facts = !checked && (item.minutes || item.quiz);
  return (
    <Row
      className={`flex items-start gap-3 border-b border-line-soft py-3 text-[14px] last:border-b-0 hover:bg-[#FAFBFC] ${pad} ${item.quiz ? "" : "cursor-pointer"}`}
    >
      <Box
        checked={checked}
        disabled={!!item.quiz}
        title={
          item.quiz
            ? {
                de: "Wird abgehakt, sobald das Quiz bestanden ist",
                vi: "Tự đánh dấu khi qua quiz",
              }
            : undefined
        }
        onChange={(value) => onToggle([item.id], value)}
      />
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <span className={`leading-snug ${checked ? "text-faint line-through" : "text-ink"}`}>
          <Bi de={item.label_de} vi={item.label_vi} />
        </span>
        {facts && (
          <span className="flex flex-wrap items-center gap-1.5">
            {item.minutes && (
              <Chip cls="bg-chip text-[#4A4F57]" icon="clock">
                <Label de={`~${item.minutes} Min.`} vi={`~${item.minutes} phút`} />
              </Chip>
            )}
            {item.quiz &&
              (item.quiz.state === "outdated" ? (
                <Chip cls="bg-warn-soft text-[#7F5F05]" icon="bell">
                  <Label de="Neue Inhalte – Quiz wiederholen, um abzuhaken" vi="Có nội dung mới – làm lại quiz để hoàn thành" />
                </Chip>
              ) : (
                <Chip
                  cls="bg-ask-soft text-ask"
                  icon="spark"
                  title={{
                    de: "Wird abgehakt, sobald das Quiz bestanden ist",
                    vi: "Tự đánh dấu khi qua quiz",
                  }}
                >
                  <Label de="Per Quiz abhaken" vi="Hoàn thành qua quiz" />
                </Chip>
              ))}
            {item.quiz && (
              <Link
                href={item.quiz.href}
                className="inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-accent hover:bg-accent-soft hover:text-accent-dark"
              >
                {item.quiz.state === "open" ? <Label de="Quiz starten" vi="Làm quiz" /> : <Label de="Quiz wiederholen" vi="Làm lại quiz" />}
                <Icon name="arrow" size={12} strokeWidth={2} />
              </Link>
            )}
          </span>
        )}
      </span>
      {compact ? (
        <OpenLink item={item} className={rowIconAction} iconOnly />
      ) : (
        <>
          <OpenLink item={item} className={`${rowIconAction} md:hidden`} iconOnly />
          <OpenLink item={item} className={`${rowAction} max-md:hidden`} />
        </>
      )}
    </Row>
  );
}

/** Parent box follows the children: checked only when every one is ticked. Clicking it ticks or clears them all. */
function GroupRow({ item, done, onToggle, pad }: { item: RowItem; done: Set<string>; onToggle: (ids: string[], value: boolean) => void; pad: string }) {
  const kids = item.children ?? [];
  const doneKids = kids.filter((c) => done.has(c.id)).length;
  const all = doneKids === kids.length && kids.length > 0;
  return (
    <div className={`border-b border-line-soft py-3 last:border-b-0 ${pad}`}>
      <label className="flex cursor-pointer items-start gap-3 text-[14px]">
        <Box
          checked={all}
          indeterminate={doneKids > 0 && !all}
          onChange={() =>
            onToggle(
              kids.map((c) => c.id),
              !all,
            )
          }
        />
        <span className={`min-w-0 flex-1 leading-snug ${all ? "text-faint line-through" : "text-ink"}`}>
          <Bi de={item.label_de} vi={item.label_vi} />
        </span>
        <span
          className={`inline-flex h-[22px] flex-none items-center rounded-full px-2 text-xs font-medium tabular-nums ${all ? "bg-ok-soft text-ok" : "bg-chip text-[#4A4F57]"}`}
        >
          {doneKids}/{kids.length}
        </span>
      </label>
      <div className="ml-[8px] mt-2 flex flex-col border-l-2 border-line-soft pl-[19px]">
        {kids.map((c) => {
          const checked = done.has(c.id);
          return (
            <label key={c.id} className="-mx-1.5 flex cursor-pointer items-start gap-3 rounded-md px-1.5 py-1.5 text-[13px] hover:bg-[#F6F7F9]">
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
  title?: TipText;
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
      {...tip(title)}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-[1px] h-[17px] w-[17px] flex-none cursor-pointer accent-accent disabled:cursor-default"
    />
  );
}

function Chip({ cls, icon, title, children }: { cls: string; icon?: "tick" | "spark" | "clock" | "bell"; title?: TipText; children: React.ReactNode }) {
  return (
    <span {...tip(title)} className={`inline-flex min-h-[22px] items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-tight ${cls}`}>
      {icon && <Icon name={icon} size={12} strokeWidth={icon === "tick" ? 2.6 : 2} className="flex-none" />}
      {children}
    </span>
  );
}
