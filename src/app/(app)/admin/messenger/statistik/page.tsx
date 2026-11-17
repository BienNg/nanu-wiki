import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { INTERESTS } from "@/lib/assistant/schema";
import { Topbar } from "@/components/Topbar";
import { MessengerCrumb } from "@/components/admin/MessengerTabs";
import { Label } from "@/components/Bi";
import { Icon, type AnyIcon } from "@/components/Icon";
import { FilterDetails } from "@/components/admin/FilterDetails";
import { StatsTodo, type TodoGroup, type TodoRow } from "@/components/admin/StatsTodo";
import { LABEL_BUDGET_EUR, addDays, formatVnDate, parseWeekStart } from "@/lib/messenger/classify";
import { formatDuration, formatWhen, loadMessengerStats, type PersonRow, type StatsSnapshot } from "@/lib/messenger/stats";

export const metadata = { title: "Messenger-Statistik" };
export const dynamic = "force-dynamic";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const TZ = "Asia/Ho_Chi_Minh";
/** The lists in stats.ts stop at this many rows. */
const LIST_CAP = 30;
/** Weeks offered in the calendar dropdown, the current one included. */
const CALENDAR_WEEKS = 12;

function href(stats: StatsSnapshot, patch: { w?: string; interesse?: string; niveau?: string }) {
  const interest = patch.interesse !== undefined ? patch.interesse : stats.interest;
  const level = patch.niveau !== undefined ? patch.niveau : stats.level;
  const q = new URLSearchParams();
  q.set("w", patch.w ?? stats.weekStart);
  if (interest) q.set("interesse", interest);
  if (level) q.set("niveau", level);
  return `/admin/messenger/statistik?${q}`;
}

/** ISO calendar week of a yyyy-mm-dd Monday. */
function isoWeek(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - yearStart) / 86_400_000 + 1) / 7);
}

function dayNum(isoDate: string) {
  return Number(isoDate.slice(8, 10));
}

const monthFmt = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, month: "short" });
const monthFmtVi = new Intl.DateTimeFormat("vi-VN", { timeZone: TZ, month: "short" });

/** "seit 3 T." – how long ago, short. */
function age(iso: string, now: number) {
  const min = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (min < 60) return { de: `${min} Min.`, vi: `${min} phút`, hours: min / 60 };
  const h = Math.round(min / 60);
  if (h < 24) return { de: `${h} Std.`, vi: `${h} giờ`, hours: h };
  const d = Math.round(h / 24);
  return { de: `${d} T.`, vi: `${d} ngày`, hours: h };
}

function todoRows(rows: PersonRow[], now: number, tone: (hours: number) => TodoRow["tone"]): TodoRow[] {
  return rows.map((row) => {
    const a = age(row.at, now);
    return {
      id: row.id,
      name: row.name,
      href: `/admin/messenger?c=${encodeURIComponent(row.id)}`,
      detailDe: row.detailDe,
      detailVi: row.detailVi,
      when: formatWhen(row.at),
      ageDe: a.de,
      ageVi: a.vi,
      tone: tone(a.hours),
    };
  });
}

/* ───────────────────────────── small building blocks ───────────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-line bg-white ${className}`}>{children}</section>;
}

function CardHead({ icon, de, vi, noteDe, noteVi, right }: { icon: AnyIcon; de: string; vi: string; noteDe?: string; noteVi?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 px-4 pt-3.5">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-chip text-muted">
        <Icon name={icon} size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="m-0 text-[14.5px] font-semibold leading-tight text-ink">
          <Label de={de} vi={vi} />
        </h2>
        {noteDe && noteVi && (
          <p className="m-0 mt-0.5 text-[12px] text-faint">
            <Label de={noteDe} vi={noteVi} />
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

/** Change against the week before. `better` says which direction is good. Hidden without a comparison value. */
function Delta({ now, before, better, unit = "", partial = false }: { now: number | null; before: number | null; better: "up" | "down"; unit?: string; partial?: boolean }) {
  const vs = partial ? <Label de="ggü. gleichen Tagen Vorwoche" vi="so với cùng ngày tuần trước" /> : <Label de="ggü. Vorwoche" vi="so với tuần trước" />;
  if (now == null || before == null || before === 0) return null;
  const diff = Math.round((now - before) * 10) / 10;
  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-chip px-1.5 py-0.5 text-[11px] font-medium text-muted">
        ± 0 {vs}
      </span>
    );
  }
  const good = (diff > 0) === (better === "up");
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${good ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"}`}>
      <span className={diff > 0 ? "-rotate-90" : "rotate-90"}>
        <Icon name="chevron" size={10} strokeWidth={2.6} />
      </span>
      {diff > 0 ? "+" : "−"}
      {Math.abs(diff)}
      {unit} {vs}
    </span>
  );
}

function Kpi({
  icon,
  de,
  vi,
  value,
  noteDe,
  noteVi,
  delta,
  tone = "plain",
}: {
  icon: AnyIcon;
  de: string;
  vi: string;
  value: { de: string; vi: string };
  noteDe: string;
  noteVi: string;
  delta?: React.ReactNode;
  tone?: "plain" | "accent";
}) {
  return (
    <Card className="flex flex-col gap-2 px-4 py-3.5 transition-shadow duration-150 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted">
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${tone === "accent" ? "bg-accent-soft text-accent" : "bg-chip text-muted"}`}>
          <Icon name={icon} size={13} />
        </span>
        <Label de={de} vi={vi} />
      </div>
      <p className="title-display m-0 text-[30px] leading-none tracking-tight text-ink tabular-nums">
        <Label de={value.de} vi={value.vi} />
      </p>
      <div className="flex min-h-[20px] flex-wrap items-center gap-1.5">{delta}</div>
      <p className="m-0 border-t border-line-soft pt-2 text-[11.5px] leading-snug text-faint">
        <Label de={noteDe} vi={noteVi} />
      </p>
    </Card>
  );
}

/** A dropdown pill for a filter (Interesse, Niveau), like the inbox filters. Shows the chosen value with × to clear it. */
function FilterPill({ label, current, options, clearHref }: { label: { de: string; vi: string }; current: string; options: { id: string; text: string; href: string }[]; clearHref: string }) {
  const chosen = current ? options.find((o) => o.id === current) : undefined;
  return (
    <div className="flex items-center">
      <FilterDetails className="group relative">
        <summary
          className={`flex h-8 cursor-pointer list-none items-center gap-1.5 border px-3 text-[12.5px] font-medium transition-colors duration-150 [&::-webkit-details-marker]:hidden ${
            chosen ? "rounded-l-full border-accent-soft bg-accent-soft text-accent-dark" : "rounded-full border-line bg-white text-ink hover:border-[#d5d8dd] hover:bg-hover"
          }`}
        >
          {chosen ? (
            <>
              <span className="font-normal text-accent-dark/65">
                <Label de={label.de} vi={label.vi} />
              </span>
              {chosen.text}
            </>
          ) : (
            <Label de={label.de} vi={label.vi} />
          )}
          <span className="rotate-90 transition-transform duration-200 group-open:-rotate-90">
            <Icon name="chevron" size={11} />
          </span>
        </summary>
        <div className="menu-pop absolute right-0 z-30 mt-1.5 w-52 origin-top-right rounded-xl border border-black/[0.06] bg-white/90 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)] backdrop-blur-xl max-md:left-0 max-md:right-auto max-md:origin-top-left">
          {options.map((o) => (
            <Link
              key={o.id}
              href={o.href}
              aria-current={o.id === current ? "page" : undefined}
              className="flex items-center gap-1.5 rounded-[7px] px-1.5 py-[5px] text-[13px] text-ink hover:bg-accent hover:text-white"
            >
              <svg aria-hidden="true" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={`flex-none ${o.id === current ? "" : "invisible"}`}>
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {o.text}
            </Link>
          ))}
        </div>
      </FilterDetails>
      {chosen && (
        <Link
          href={clearHref}
          aria-label={`${label.de} zurücksetzen`}
          className="flex h-8 items-center rounded-r-full border border-l-0 border-accent-soft bg-accent-soft pl-1.5 pr-2.5 text-accent-dark/70 transition-colors duration-150 hover:bg-[#cddcf7] hover:text-accent-dark"
        >
          <Icon name="close" size={12} strokeWidth={2.2} />
        </Link>
      )}
    </div>
  );
}

/** ‹ [📅 KW 47 · 16.11.–22.11. ▾] ›  – the dropdown is a small calendar of the last weeks; a click on a row opens that week. */
function WeekPicker({ stats, currentWeek }: { stats: StatsSnapshot; currentWeek: string }) {
  const weeks = Array.from({ length: CALENDAR_WEEKS }, (_, i) => formatVnDate(addDays(parseWeekStart(currentWeek), -7 * i)));
  const isCurrent = stats.weekStart === currentWeek;
  const arrow = "flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors duration-150 hover:bg-hover";
  return (
    <div className="flex items-center gap-1.5">
      <Link href={href(stats, { w: stats.prevWeek })} aria-label="Woche davor" title="Woche davor · Tuần trước" className={arrow}>
        <span className="rotate-180">
          <Icon name="chevron" size={13} />
        </span>
      </Link>
      <FilterDetails className="group relative">
        <summary className="flex h-8 cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-white px-3 text-[13px] font-medium text-ink transition-colors duration-150 hover:bg-hover [&::-webkit-details-marker]:hidden">
          <Icon name="calendar" size={14} className="text-accent" />
          <span className="text-muted">KW {isoWeek(stats.weekStart)}</span>
          <span className="tabular-nums">
            <Label de={stats.rangeDe} vi={stats.rangeVi} />
          </span>
          {isCurrent && (
            <span className="rounded-full bg-accent-soft px-1.5 py-px text-[10.5px] font-semibold text-accent-dark">
              <Label de="Diese Woche" vi="Tuần này" />
            </span>
          )}
          <span className="rotate-90 transition-transform duration-200 group-open:-rotate-90">
            <Icon name="chevron" size={11} />
          </span>
        </summary>
        <div className="menu-pop absolute right-0 z-30 mt-1.5 w-[318px] origin-top-right rounded-xl border border-black/[0.06] bg-white/95 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)] backdrop-blur-xl max-md:left-0 max-md:right-auto max-md:origin-top-left">
          <div className="grid grid-cols-[52px_repeat(7,1fr)] px-1 pb-1 text-center text-[10.5px] font-semibold uppercase tracking-wide text-faint">
            <span className="text-left">KW</span>
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          {weeks.map((w, i) => {
            const on = w === stats.weekStart;
            const monday = parseWeekStart(w);
            const month = w.slice(0, 7);
            const newMonth = i === 0 || weeks[i - 1].slice(0, 7) !== month;
            return (
              <div key={w}>
                {newMonth && (
                  <p className="m-0 px-1.5 pb-0.5 pt-1.5 text-[11px] font-semibold text-muted">
                    <Label de={monthFmt.format(monday)} vi={monthFmtVi.format(monday)} />
                  </p>
                )}
                <Link
                  href={href(stats, { w })}
                  aria-current={on ? "page" : undefined}
                  className={`grid grid-cols-[52px_repeat(7,1fr)] items-center rounded-lg px-1 py-1 text-center text-[12.5px] tabular-nums transition-colors duration-100 ${
                    on ? "bg-accent text-white" : "text-ink hover:bg-accent-soft"
                  }`}
                >
                  <span className={`text-left text-[11.5px] font-semibold ${on ? "text-white/80" : "text-faint"}`}>{isoWeek(w)}</span>
                  {Array.from({ length: 7 }, (_, d) => {
                    const day = formatVnDate(addDays(monday, d));
                    return (
                      <span key={day} className={on ? undefined : day.slice(0, 7) !== month ? "text-[#C3C8D0]" : d >= 5 ? "text-faint" : undefined}>
                        {dayNum(day)}
                      </span>
                    );
                  })}
                </Link>
              </div>
            );
          })}
          {!isCurrent && (
            <Link href={href(stats, { w: currentWeek })} className="mt-1.5 flex h-8 items-center justify-center rounded-lg bg-chip text-[12.5px] font-medium text-accent hover:bg-accent-soft">
              <Label de="Zur aktuellen Woche" vi="Về tuần này" />
            </Link>
          )}
        </div>
      </FilterDetails>
      {stats.nextWeek ? (
        <Link href={href(stats, { w: stats.nextWeek })} aria-label="Nächste Woche" title="Nächste Woche · Tuần sau" className={arrow}>
          <Icon name="chevron" size={13} />
        </Link>
      ) : (
        <span aria-disabled="true" className="flex h-8 w-8 items-center justify-center rounded-full border border-line-soft text-[#C9CDD3]">
          <Icon name="chevron" size={13} />
        </span>
      )}
    </div>
  );
}

/** Seven columns: chats per day, the leads among them in solid blue. Days still to come stay empty. */
function DayChart({ stats, today }: { stats: StatsSnapshot; today: string }) {
  const max = Math.max(1, ...stats.days.map((d) => d.threads));
  const best = stats.days.reduce((a, b) => (b.threads > a.threads ? b : a), stats.days[0]);
  return (
    <Card className="flex flex-col">
      <CardHead
        icon="calendar"
        de="Neue Gespräche pro Tag"
        vi="Cuộc mới mỗi ngày"
        noteDe={best && best.threads ? `Stärkster Tag: ${best.de} mit ${best.threads}` : "Diese Woche noch keine neuen Gespräche"}
        noteVi={best && best.threads ? `Ngày đông nhất: ${best.vi} với ${best.threads}` : "Tuần này chưa có cuộc mới"}
        right={
          <div className="flex flex-none items-center gap-3 text-[11.5px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
              Leads
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-accent-soft" />
              <Label de="Andere" vi="Khác" />
            </span>
          </div>
        }
      />
      <div className="grid flex-1 grid-cols-7 gap-2 px-4 pb-3.5 pt-4">
        {stats.days.map((day) => {
          const future = day.date > today;
          const isToday = day.date === today;
          const other = Math.max(0, day.threads - day.leads);
          return (
            <div key={day.date} className="flex min-w-0 flex-col items-center gap-1.5" title={future ? undefined : `${day.de}: ${day.threads} Gespräche, ${day.leads} Leads`}>
              <span className={`text-[12.5px] font-semibold tabular-nums ${future ? "text-transparent" : day.threads ? "text-ink" : "text-faint"}`}>{future ? "·" : day.threads}</span>
              <div className={`relative flex h-36 w-full max-w-[52px] flex-col justify-end overflow-hidden rounded-lg ${future ? "border border-dashed border-line bg-[repeating-linear-gradient(135deg,#F6F7F9_0_6px,#fff_6px_12px)]" : "border-b-2 border-line"}`}>
                {!future && day.threads > 0 && (
                  <div className="flex w-full flex-col overflow-hidden rounded-t-md" style={{ height: `${(day.threads / max) * 100}%` }}>
                    {other > 0 && <div className="w-full bg-accent-soft" style={{ flexGrow: other }} />}
                    {day.leads > 0 && <div className="w-full bg-accent" style={{ flexGrow: day.leads }} />}
                  </div>
                )}
              </div>
              <span className={`flex items-center gap-1 whitespace-nowrap text-[11.5px] ${isToday ? "font-semibold text-accent" : future ? "text-faint" : "text-muted"}`}>
                {isToday && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                <Label de={day.de} vi={day.vi} />
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

const BUCKET_COLOR: Record<string, string> = { "5": "#23794A", "15": "#6DBB86", "60": "#E2B33C", slow: "#E58A5A", none: "#B9382A" };

/** First reply: the median big, and one bar split into how fast each lead got an answer. */
function ReplyCard({ stats, median, within15, before }: { stats: StatsSnapshot; median: { de: string; vi: string } | null; within15: number | null; before: StatsSnapshot | null }) {
  const total = stats.workHourLeads;
  return (
    <Card className="flex flex-col">
      <CardHead icon="clock" de="Erste Antwort" vi="Tin trả lời đầu" noteDe="Leads, die zwischen 9 und 18 Uhr geschrieben haben" noteVi="Khách mới nhắn trong 9–18 giờ" />
      <div className="flex items-end gap-3 px-4 pt-3">
        <p className="title-display m-0 text-[30px] leading-none tracking-tight text-ink">
          <Label de={median?.de ?? "–"} vi={median?.vi ?? "–"} />
        </p>
        <span className="pb-0.5 text-[12px] text-muted">
          <Label de="Median" vi="trung vị" />
        </span>
        <span className="ml-auto pb-0.5">
          <Delta now={stats.medianReplySeconds == null ? null : Math.round(stats.medianReplySeconds / 60)} before={before?.medianReplySeconds == null ? null : Math.round(before.medianReplySeconds / 60)} better="down" unit=" Min." />
        </span>
      </div>
      {total === 0 ? (
        <p className="m-3 mx-4 rounded-lg bg-chip px-3 py-4 text-center text-[12.5px] text-muted">
          <Label de="Keine neuen Leads in der Arbeitszeit." vi="Không có khách mới trong giờ làm." />
        </p>
      ) : (
        <>
          <div className="mx-4 mt-3 flex h-3 overflow-hidden rounded-full bg-[#F0F2F5]">
            {stats.buckets.map((b) =>
              b.count ? <span key={b.id} title={`${b.de}: ${b.count}`} className="h-full border-r-2 border-white last:border-r-0" style={{ width: `${(b.count / total) * 100}%`, background: BUCKET_COLOR[b.id] }} /> : null,
            )}
          </div>
          <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-1 px-4 pb-3.5 text-[12.5px]">
            {stats.buckets.map((b) => (
              <li key={b.id} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: BUCKET_COLOR[b.id] }} />
                <span className="flex-1 text-body">
                  <Label de={b.de} vi={b.vi} />
                </span>
                <span className="w-9 text-right text-faint tabular-nums">{Math.round((b.count / total) * 100)} %</span>
                <span className="w-6 text-right font-semibold text-ink tabular-nums">{b.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {within15 != null && (
        <p className="m-0 mt-auto border-t border-line-soft px-4 py-2.5 text-[12px] text-muted">
          <Label de={`${stats.answeredWithin15} von ${total} unter 15 Minuten beantwortet`} vi={`${stats.answeredWithin15} / ${total} được trả lời dưới 15 phút`} />
        </p>
      )}
    </Card>
  );
}

/** The funnel steps as numbered bars (like the inbox step bar). Chats without a label are a separate callout, so they don't drown the steps. */
function FunnelCard({ stats }: { stats: StatsSnapshot }) {
  const steps = stats.funnel.filter((r) => r.id !== "unlabeled" && r.id !== "unklar");
  const unklar = stats.funnel.find((r) => r.id === "unklar")?.count ?? 0;
  const max = Math.max(1, ...steps.map((r) => r.count));
  const labeled = steps.reduce((s, r) => s + r.count, 0) + unklar;
  const share = stats.leads ? Math.round((stats.unlabeled / stats.leads) * 100) : 0;
  return (
    <Card className="flex flex-col">
      <CardHead icon="layers" de="Wie weit die Leads kamen" vi="Khách mới đi đến đâu" noteDe="Jeder Chat steht auf genau einer Stufe" noteVi="Mỗi cuộc chỉ ở một bước" />
      {stats.unlabeled > 0 && (
        <div className={`mx-4 mt-3 flex items-center gap-3 rounded-lg px-3 py-2.5 ${share >= 50 ? "bg-warn-soft" : "bg-chip"}`}>
          <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white ${share >= 50 ? "text-warn" : "text-muted"}`}>
            <Icon name="spark" size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`m-0 text-[13px] font-semibold ${share >= 50 ? "text-[#7A5400]" : "text-ink"}`}>
              <Label de={`${stats.unlabeled} von ${stats.leads} Leads noch ohne Einordnung`} vi={`${stats.unlabeled} / ${stats.leads} khách chưa gắn nhãn`} />
            </p>
            <p className="m-0 text-[11.5px] text-muted">
              <Label de="Die KI ordnet alle 15 Minuten ein, wenn ein Chat neue Nachrichten hat." vi="AI gắn nhãn mỗi 15 phút khi cuộc có tin mới." />
            </p>
          </div>
          <span className={`text-[20px] font-semibold tabular-nums ${share >= 50 ? "text-warn" : "text-muted"}`}>{share} %</span>
        </div>
      )}
      <ol className="m-0 mt-3 flex list-none flex-col gap-2 px-4 pb-3.5">
        {steps.map((row, i) => (
          <li key={row.id} className="grid grid-cols-[22px_112px_1fr_60px] items-center gap-2.5 text-[12.5px]">
            <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-semibold ${row.count ? "bg-accent-soft text-accent-dark" : "bg-chip text-faint"}`}>{i + 1}</span>
            <span className={`truncate ${row.count ? "font-medium text-ink" : "text-muted"}`}>
              <Label de={row.de} vi={row.vi} />
            </span>
            <span className="h-2.5 overflow-hidden rounded-full bg-[#F0F2F5]">
              <span className="block h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(row.count / max) * 100}%` }} />
            </span>
            <span className="flex items-baseline justify-end gap-1.5 tabular-nums">
              <span className={`font-semibold ${row.count ? "text-ink" : "text-faint"}`}>{row.count}</span>
              {labeled > 0 && row.count > 0 && <span className="text-[11px] text-faint">{Math.round((row.count / labeled) * 100)}%</span>}
            </span>
          </li>
        ))}
      </ol>
      {unklar > 0 && (
        <p className="m-0 border-t border-line-soft px-4 py-2.5 text-[12px] text-muted">
          <Label de={`${unklar} eingeordnet, aber Stufe unklar`} vi={`${unklar} đã gắn nhãn nhưng chưa rõ bước`} />
        </p>
      )}
    </Card>
  );
}

const OUTCOME_COLOR: Record<string, string> = {
  offen: "#8A94A6",
  wartet_auf_uns: "#E2B33C",
  wartet_auf_kunde: "#5B8FDB",
  weiter_auf_zalo: "#0B7793",
  bestandskunde: "#7E62CF",
  kein_lead: "#C3C8D0",
  verloren: "#B9382A",
};

/** Where the week's chats stand now, as a ring with a legend. */
function OutcomeCard({ stats }: { stats: StatsSnapshot }) {
  const total = stats.outcomes.reduce((s, r) => s + r.count, 0);
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <Card className="flex flex-col">
      <CardHead icon="check" de="Stand" vi="Trạng thái" noteDe="Nur eingeordnete Chats dieser Woche" noteVi="Chỉ các cuộc đã gắn nhãn tuần này" />
      {total === 0 ? (
        <p className="m-4 rounded-lg bg-chip px-3 py-6 text-center text-[12.5px] text-muted">
          <Label de="Noch keine Einordnung in dieser Woche." vi="Tuần này chưa có cuộc nào được gắn nhãn." />
        </p>
      ) : (
        <div className="flex items-center gap-5 px-4 pb-4 pt-3">
          <div className="relative h-[112px] w-[112px] flex-none">
            <svg viewBox="0 0 112 112" className="-rotate-90">
              <circle cx="56" cy="56" r={R} fill="none" stroke="#F0F2F5" strokeWidth="14" />
              {stats.outcomes.map((row) => {
                const len = (row.count / total) * C;
                const el = <circle key={row.id} cx="56" cy="56" r={R} fill="none" stroke={OUTCOME_COLOR[row.id] ?? "#8A94A6"} strokeWidth="14" strokeDasharray={`${Math.max(0, len - 1.5)} ${C}`} strokeDashoffset={-offset} />;
                offset += len;
                return el;
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-semibold leading-none text-ink tabular-nums">{total}</span>
              <span className="mt-0.5 text-[10.5px] text-faint">Chats</span>
            </div>
          </div>
          <ul className="m-0 flex min-w-0 flex-1 list-none flex-col gap-1.5 p-0 text-[12.5px]">
            {stats.outcomes.map((row) => (
              <li key={row.id} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: OUTCOME_COLOR[row.id] ?? "#8A94A6" }} />
                <span className="min-w-0 flex-1 truncate text-body">
                  <Label de={row.de} vi={row.vi} />
                </span>
                <span className="font-semibold text-ink tabular-nums">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

/** Why leads were lost. Losses are problems, so the bars are red; none at all is good news. */
function LossCard({ stats }: { stats: StatsSnapshot }) {
  const max = Math.max(1, ...stats.losses.map((r) => r.count));
  const total = stats.losses.reduce((s, r) => s + r.count, 0);
  return (
    <Card className="flex flex-col">
      <CardHead
        icon="bell"
        de="Warum es aufgehört hat"
        vi="Vì sao dừng"
        right={total > 0 ? <span className="rounded-full bg-bad-soft px-2 py-0.5 text-[11.5px] font-semibold text-bad tabular-nums">{total}</span> : undefined}
      />
      {stats.losses.length === 0 ? (
        <div className="m-4 flex items-center gap-3 rounded-lg bg-ok-soft px-3 py-3.5">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-ok">
            <Icon name="check" size={17} />
          </span>
          <p className="m-0 text-[12.5px] font-medium text-ok">
            <Label de="Kein verlorener Lead mit Grund in dieser Woche." vi="Tuần này chưa có khách mất với lý do." />
          </p>
        </div>
      ) : (
        <ul className="m-0 mt-3 flex list-none flex-col gap-2 px-4 pb-4">
          {stats.losses.map((row) => (
            <li key={row.id} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-[12.5px]">
              <span className="truncate text-body">
                <Label de={row.de} vi={row.vi} />
              </span>
              <span className="font-semibold text-ink tabular-nums">{row.count}</span>
              <span className="col-span-2 h-2 overflow-hidden rounded-full bg-[#F7EBE9]">
                <span className="block h-full rounded-full bg-[#D9695C]" style={{ width: `${(row.count / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** The AI labelling budget as a meter. Red when it is used up or the last run failed. */
function BudgetCard({ stats, euro }: { stats: StatsSnapshot; euro: string }) {
  const problem = stats.capReached || !!stats.labelError;
  const pct = Math.min(100, (stats.budgetEur / LABEL_BUDGET_EUR) * 100);
  return (
    <Card className={`flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 ${problem ? "border-bad/30 bg-bad-soft/50" : ""}`}>
      <div className="flex items-center gap-2.5">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${problem ? "bg-bad-soft text-bad" : "bg-ask-soft text-ask"}`}>
          <Icon name="spark" size={15} />
        </span>
        <div>
          <p className="m-0 text-[13px] font-semibold text-ink">
            <Label de="KI-Einordnung diesen Monat" vi="AI gắn nhãn tháng này" />
          </p>
          <p className="m-0 text-[11.5px] text-faint">
            <Label de="Läuft alle 15 Min., nur bei neuen Nachrichten oder einer unbeantworteten Nachfrage" vi="Chạy mỗi 15 phút, chỉ khi có tin mới hoặc tin nhắc chưa được trả lời" />
          </p>
        </div>
      </div>
      <div className="flex min-w-[220px] flex-1 items-center gap-3">
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#ECEEF1]">
          <span className={`block h-full rounded-full ${problem ? "bg-bad" : "bg-ask"}`} style={{ width: `${Math.max(pct, stats.budgetEur > 0 ? 1.5 : 0)}%` }} />
        </span>
        <span className={`whitespace-nowrap text-[13px] font-semibold tabular-nums ${problem ? "text-bad" : "text-ink"}`}>
          {euro} <span className="font-normal text-faint">/ {LABEL_BUDGET_EUR} €</span>
        </span>
      </div>
      {stats.labelError && <p className="m-0 w-full text-[12.5px] text-bad">{stats.labelError}</p>}
      {stats.capReached && !stats.labelError && (
        <p className="m-0 w-full text-[12.5px] text-bad">
          <Label de="Budget aufgebraucht – bis Monatsende wird nichts mehr eingeordnet." vi="Đã hết ngân sách – đến cuối tháng sẽ không gắn nhãn nữa." />
        </p>
      )}
    </Card>
  );
}

/* ───────────────────────────── page ───────────────────────────── */

export default async function MessengerStatsPage({ searchParams }: { searchParams: Promise<{ w?: string; interesse?: string; niveau?: string }> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const supabase = await createClient();
  const prevWeek = formatVnDate(addDays(parseWeekStart(sp.w), -7));
  // The week before is loaded alongside, with the same filter, only for the "ggü. Vorwoche" changes. If it fails, the page still shows.
  const [stats, before] = await Promise.all([
    loadMessengerStats(supabase, { week: sp.w, interest: sp.interesse, level: sp.niveau }),
    loadMessengerStats(supabase, { week: prevWeek, interest: sp.interesse, level: sp.niveau }).catch((err) => {
      console.error("[statistik] previous week", err);
      return null;
    }),
  ]);
  const now = Date.now();
  const today = formatVnDate(new Date(now));
  const currentWeek = formatVnDate(parseWeekStart(undefined));
  const median = stats.medianReplySeconds == null ? null : formatDuration(stats.medianReplySeconds);
  const within15 = stats.workHourLeads ? Math.round((stats.answeredWithin15 / stats.workHourLeads) * 100) : null;
  const within15Before = before?.workHourLeads ? Math.round((before.answeredWithin15 / before.workHourLeads) * 100) : null;
  const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: stats.budgetEur > 0 && stats.budgetEur < 0.01 ? 3 : 2,
    maximumFractionDigits: stats.budgetEur > 0 && stats.budgetEur < 0.01 ? 3 : 2,
  }).format(stats.budgetEur);
  const filtered = !!(stats.interest || stats.level);
  // In the running week only the days so far are compared, so a half week does not look like a drop.
  const running = stats.weekStart === currentWeek;
  const daysSoFar = stats.days.filter((d) => d.date <= today).length;
  const threadsBefore = before ? (running ? before.days.slice(0, daysSoFar).reduce((s, d) => s + d.threads, 0) : before.newThreads) : null;

  const todo: TodoGroup[] = [
    {
      id: "waiting",
      icon: "chat",
      de: "Wartet auf uns",
      vi: "Đang chờ mình",
      hintDe: "Die letzte Nachricht kam von der Person, seit mehr als 15 Minuten. Älteste zuerst.",
      hintVi: "Tin cuối là của khách, đã hơn 15 phút. Cũ nhất trước.",
      emptyDe: "Niemand wartet länger als 15 Minuten.",
      emptyVi: "Không ai chờ quá 15 phút.",
      capped: stats.waiting.length >= LIST_CAP,
      rows: todoRows(stats.waiting, now, (h) => (h >= 24 ? "bad" : h >= 1 ? "warn" : "plain")),
    },
    {
      id: "quiet",
      icon: "bell",
      de: "Nachfassen",
      vi: "Cần nhắc",
      hintDe: "Seit 24 Stunden still, und wir haben noch nicht nachgefragt.",
      hintVi: "Im lặng 24 giờ và mình chưa nhắn lại.",
      emptyDe: "Keine offenen Nachfragen.",
      emptyVi: "Không có tin nào cần nhắc.",
      capped: stats.quiet.length >= LIST_CAP,
      rows: todoRows(stats.quiet, now, (h) => (h >= 24 * 14 ? "bad" : h >= 24 * 3 ? "warn" : "plain")),
    },
    {
      id: "price",
      icon: "spark",
      de: "Preis, dann still",
      vi: "Học phí rồi im",
      hintDe: "Preis als Grund genannt, oder nach der Beratung 24 Stunden still.",
      hintVi: "Khách nói do học phí, hoặc im 24 giờ sau khi tư vấn.",
      emptyDe: "Keine solchen Gespräche.",
      emptyVi: "Không có cuộc nào như vậy.",
      capped: stats.price.length >= LIST_CAP,
      rows: todoRows(stats.price, now, (h) => (h >= 24 * 14 ? "bad" : h >= 24 * 3 ? "warn" : "plain")),
    },
  ];

  return (
    <>
      <Topbar>
        <MessengerCrumb current="statistik" />
      </Topbar>
      <div className="min-h-[calc(100dvh-48px)] border-t border-line bg-[#F6F7F9]">
        <header className="border-b border-line bg-white">
          <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-end gap-x-6 gap-y-3 px-6 pb-4 pt-5 max-sm:px-4">
            <div className="min-w-[min(100%,420px)] flex-1">
              <h1 className="title-display m-0 text-[28px] leading-tight tracking-tight">
                <Label de="Statistik" vi="Thống kê" />
              </h1>
              <p className="m-0 mt-1 max-w-[640px] text-[13px] text-muted">
                <Label
                  de="Neue Personen dieser Woche, wie schnell wir antworten, und wo das Gespräch aufhört. Anmeldungen stehen hier nicht — die passieren in Zalo und im CRM."
                  vi="Người mới trong tuần, tốc độ trả lời, và cuộc trò chuyện dừng ở đâu. Đăng ký không nằm ở đây — việc đó ở Zalo và CRM."
                />
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterPill
                label={{ de: "Interesse", vi: "Nhu cầu" }}
                current={stats.interest}
                clearHref={href(stats, { interesse: "" })}
                options={[{ id: "", text: "Alle · Tất cả", href: href(stats, { interesse: "" }) }, ...INTERESTS.map((item) => ({ id: item as string, text: item as string, href: href(stats, { interesse: item }) }))]}
              />
              <FilterPill
                label={{ de: "Niveau", vi: "Trình độ" }}
                current={stats.level}
                clearHref={href(stats, { niveau: "" })}
                options={[{ id: "", text: "Alle · Tất cả", href: href(stats, { niveau: "" }) }, ...LEVELS.map((item) => ({ id: item, text: item, href: href(stats, { niveau: item }) }))]}
              />
              <span aria-hidden="true" className="mx-1 h-5 w-px bg-line max-sm:hidden" />
              <WeekPicker stats={stats} currentWeek={currentWeek} />
            </div>
          </div>
          {filtered && (
            <div className="mx-auto w-full max-w-[1360px] px-6 pb-3 max-sm:px-4">
              <p className="m-0 flex items-start gap-2 rounded-lg bg-accent-soft/50 px-3 py-2 text-[12.5px] text-accent-dark">
                <Icon name="layers" size={14} className="mt-0.5 flex-none" />
                <Label
                  de="Filter gilt für die Woche und den Trichter. Gespräche ohne passende Einordnung fallen weg. „Nachrichten von Kunden“ und die Listen rechts bleiben ungefiltert."
                  vi="Bộ lọc áp cho tuần và phễu. Cuộc chưa gắn đúng nhãn sẽ ẩn. „Tin nhắn của khách“ và các danh sách bên phải không bị lọc."
                />
              </p>
            </div>
          )}
        </header>

        <div className="mx-auto grid w-full max-w-[1360px] items-start gap-4 px-6 pb-16 pt-5 max-sm:px-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <main className="flex min-w-0 flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Kpi
                icon="users"
                tone="accent"
                de="Neue Gespräche"
                vi="Cuộc trò chuyện mới"
                value={{ de: String(stats.newThreads), vi: String(stats.newThreads) }}
                delta={<Delta now={stats.newThreads} before={threadsBefore} better="up" partial={running} />}
                noteDe={`${stats.leads} Leads · ${stats.bestand} Bestand · ${stats.keinLead} keine Anfrage`}
                noteVi={`${stats.leads} khách mới · ${stats.bestand} học viên cũ · ${stats.keinLead} không phải khách`}
              />
              <Kpi
                icon="chat"
                de="Nachrichten von Kunden"
                vi="Tin nhắn của khách"
                value={{ de: String(stats.inboundMessages), vi: String(stats.inboundMessages) }}
                delta={running ? <span className="text-[11px] text-faint"><Label de={`Woche läuft noch · Tag ${daysSoFar} von 7`} vi={`Tuần chưa hết · ngày ${daysSoFar}/7`} /></span> : <Delta now={stats.inboundMessages} before={before?.inboundMessages ?? null} better="up" />}
                noteDe="Ganze Woche, ohne Filter"
                noteVi="Cả tuần, không lọc"
              />
              <Kpi
                icon="clock"
                de="Erste Antwort, Median"
                vi="Tin trả lời đầu, trung vị"
                value={median ?? { de: "–", vi: "–" }}
                delta={<Delta now={stats.medianReplySeconds == null ? null : Math.round(stats.medianReplySeconds / 60)} before={before?.medianReplySeconds == null ? null : Math.round(before.medianReplySeconds / 60)} better="down" unit=" Min." />}
                noteDe={median ? "Nur Leads, deren erste Nachricht zwischen 9 und 18 Uhr lag" : "Noch keine Antwort in der Arbeitszeit"}
                noteVi={median ? "Chỉ khách mới nhắn trong khoảng 9–18 giờ" : "Chưa có trả lời trong giờ làm"}
              />
              <Kpi
                icon="check"
                de="Unter 15 Minuten"
                vi="Dưới 15 phút"
                value={{ de: within15 == null ? "–" : `${within15} %`, vi: within15 == null ? "–" : `${within15} %` }}
                delta={<Delta now={within15} before={within15Before} better="up" unit=" Pkt." />}
                noteDe={stats.workHourLeads ? `${stats.answeredWithin15} von ${stats.workHourLeads} in der Arbeitszeit (9–18 Uhr)` : "Keine neuen Leads in der Arbeitszeit"}
                noteVi={stats.workHourLeads ? `${stats.answeredWithin15} / ${stats.workHourLeads} trong giờ làm (9–18h)` : "Không có khách mới trong giờ làm"}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <DayChart stats={stats} today={today} />
              <ReplyCard stats={stats} median={median} within15={within15} before={before} />
            </div>

            <FunnelCard stats={stats} />

            <div className="grid gap-4 md:grid-cols-2">
              <OutcomeCard stats={stats} />
              <LossCard stats={stats} />
            </div>

            <BudgetCard stats={stats} euro={euro} />
          </main>

          <aside className="min-w-0 lg:sticky lg:top-4">
            <StatsTodo groups={todo} filtered={filtered} />
          </aside>
        </div>
      </div>
    </>
  );
}
