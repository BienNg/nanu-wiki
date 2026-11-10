import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AREAS, dailyLeavesFor, getDailyTasks } from "@/content";
import { Topbar } from "@/components/Topbar";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { addDays, isDay, shortDate, vnToday, weekday, weekStart, WEEKDAYS } from "@/lib/days";
import { initials } from "@/lib/format";

export const metadata = { title: "Tägliche Aufgaben" };

type Log = { profile_id: string; task_id: string; day: string; done: boolean; note: string | null };
type Person = { id: string; full_name: string | null; email: string };

const DAILY_AREAS = AREAS.filter((a) => getDailyTasks(a.slug).length);
/** The checklists went live on this day; earlier days count as nothing due. */
const FIRST_DAY = "2026-11-01";

/** Admins: who ticked which daily task, one week (Mon–Sun, Vietnam time) and one area at a time. */
export default async function DailyTasksAdminPage({ searchParams }: { searchParams: Promise<{ bereich?: string; woche?: string }> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const area = DAILY_AREAS.find((a) => a.slug === sp.bereich) ?? DAILY_AREAS[0];
  const today = vnToday();
  const thisWeek = weekStart(today);
  const monday = isDay(sp.woche) ? weekStart(sp.woche) : thisWeek;
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const href = (patch: { bereich?: string; woche?: string }) => {
    const next = { bereich: area.slug, woche: monday, ...patch };
    const qs = new URLSearchParams();
    if (next.bereich !== DAILY_AREAS[0].slug) qs.set("bereich", next.bereich);
    if (next.woche !== thisWeek) qs.set("woche", next.woche);
    return `/admin/aufgaben${qs.size ? `?${qs}` : ""}`;
  };

  const supabase = await createClient();
  const [{ data: logData }, { data: members }] = await Promise.all([
    supabase.from("daily_task_log").select("profile_id, task_id, day, done, note").eq("area", area.slug).gte("day", days[0]).lte("day", days[6]),
    // The area's own people always get a row, so an empty week shows up as 0 – others appear once they ticked something.
    supabase.from("profiles").select("id, full_name, email").eq("primary_area", area.slug).in("role", ["staff", "admin"]),
  ]);
  const logs = (logData ?? []) as Log[];
  const known = new Map(((members ?? []) as Person[]).map((p) => [p.id, p]));
  const missing = [...new Set(logs.map((l) => l.profile_id))].filter((id) => !known.has(id));
  if (missing.length) {
    const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", missing);
    for (const p of (data ?? []) as Person[]) known.set(p.id, p);
  }
  const people = [...known.values()].sort((a, b) => (a.full_name ?? a.email).localeCompare(b.full_name ?? b.email, "de"));

  const due = days.map((d) => (d > today || d < FIRST_DAY ? [] : dailyLeavesFor(area.slug, d)));
  const allTasks = getDailyTasks(area.slug);
  const find = (pid: string | null, taskId: string, day: string) =>
    pid ? logs.find((l) => l.profile_id === pid && l.task_id === taskId && l.day === day) : logs.find((l) => l.done && l.task_id === taskId && l.day === day);
  const doneOn = (pid: string | null, i: number) => due[i].filter((t) => find(pid, t.id, days[i])?.done).length;
  const weekTotals = (pid: string | null) => {
    const total = due.reduce((n, d) => n + d.length, 0);
    const done = days.reduce((n, _, i) => n + doneOn(pid, i), 0);
    return { done, total };
  };

  const rows: { id: string | null; name: string; sub: { de: string; vi: string } | null; avatar: string }[] = [
    { id: null, name: "Team", sub: { de: "von mindestens einer Person erledigt", vi: "ít nhất một người đã làm" }, avatar: "∑" },
    ...people.map((p) => ({ id: p.id, name: p.full_name ?? p.email, sub: null, avatar: initials(p.full_name, p.email) })),
  ];

  const cols = "grid grid-cols-[minmax(170px,1.4fr)_repeat(7,minmax(46px,1fr))_minmax(64px,0.8fr)] items-center gap-1";

  return (
    <>
      <Topbar>
        <Icon name="check" size={14} />
        <Label de="Tägliche Aufgaben" vi="Việc hằng ngày" />
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-8 pb-20 pt-9 max-sm:px-4">
        <header className="flex flex-col gap-1">
          <h1 className="title-display m-0 text-[34px] leading-tight">
            <Label de="Tägliche Aufgaben" vi="Việc hằng ngày" />
          </h1>
          <p className="m-0 text-[13px] text-muted">
            <Label
              de="Wer welche Aufgabe an welchem Tag abgehakt hat. Tage nach Vietnam-Zeit, Woche von Montag bis Sonntag. Eine Zeile öffnen für Aufgaben und Notizen."
              vi="Ai đã đánh dấu việc nào vào ngày nào. Ngày theo giờ Việt Nam, tuần từ Thứ Hai đến Chủ Nhật. Mở một dòng để xem từng việc và ghi chú."
            />
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Bereich" className="flex gap-1 rounded-lg bg-side p-[3px]">
            {DAILY_AREAS.map((a) => (
              <Link
                key={a.slug}
                href={href({ bereich: a.slug })}
                aria-current={a.slug === area.slug ? "page" : undefined}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-[#4A4F57] hover:text-ink aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark"
              >
                <Icon name={a.icon} size={13} color={a.color} strokeWidth={2} />
                <Label de={a.name_de} vi={a.name_vi} />
              </Link>
            ))}
          </nav>
          <nav aria-label="Woche" className="flex items-center gap-1 text-[13px]">
            <Link
              href={href({ woche: addDays(monday, -7) })}
              aria-disabled={monday <= FIRST_DAY}
              className={`inline-flex h-8 items-center rounded-md border border-line bg-white px-2.5 text-ink hover:bg-hover ${monday <= FIRST_DAY ? "pointer-events-none opacity-40" : ""}`}
            >
              ←
            </Link>
            <span className="min-w-[150px] px-2 text-center font-medium text-ink">
              {shortDate(days[0])} – {shortDate(days[6])}
              {days[6].slice(0, 4)}
            </span>
            <Link
              href={href({ woche: addDays(monday, 7) })}
              aria-disabled={monday >= thisWeek}
              className={`inline-flex h-8 items-center rounded-md border border-line bg-white px-2.5 text-ink hover:bg-hover ${monday >= thisWeek ? "pointer-events-none opacity-40" : ""}`}
            >
              →
            </Link>
            {monday !== thisWeek && (
              <Link href={href({ woche: thisWeek })} className="ml-1 px-1.5 text-muted hover:text-ink hover:underline">
                <Label de="Diese Woche" vi="Tuần này" />
              </Link>
            )}
          </nav>
        </div>

        <div className="overflow-x-auto rounded-[10px] border border-line">
          <div className="min-w-[640px]">
            <div className={`${cols} bg-side px-3 py-2 text-xs font-medium text-muted`}>
              <span>
                <Label de="Person" vi="Người" />
              </span>
              {days.map((d, i) => (
                <span key={d} className={`text-center ${d === today ? "font-semibold text-ink" : ""}`}>
                  <Label de={WEEKDAYS[i].short_de} vi={WEEKDAYS[i].short_vi} />
                  <span className="block text-[11px] font-normal">{shortDate(d)}</span>
                </span>
              ))}
              <span className="text-center">
                <Label de="Woche" vi="Tuần" />
              </span>
            </div>

            {rows.length === 1 && logs.length === 0 && (
              <p className="m-0 border-t border-line-soft px-3 py-6 text-center text-[13px] text-muted">
                <Label de="In dieser Woche wurde noch nichts abgehakt." vi="Tuần này chưa có ai đánh dấu việc nào." />
              </p>
            )}

            {rows.map((r) => {
              const w = weekTotals(r.id);
              return (
                <details key={r.id ?? "team"} className="group border-t border-line-soft">
                  <summary className={`${cols} cursor-pointer list-none px-3 py-2 hover:bg-hover [&::-webkit-details-marker]:hidden`}>
                    <span className="flex min-w-0 items-center gap-2">
                      <Icon name="chevron" size={12} className="flex-none text-muted transition-transform group-open:rotate-90" />
                      <span aria-hidden="true" className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-[11px] font-bold ${r.id ? "bg-[#FCE6DC] text-[#9E3617]" : "bg-chip text-ink"}`}>
                        {r.avatar}
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block truncate text-[13px] font-semibold text-ink">{r.name}</span>
                        {r.sub && (
                          <span className="block truncate text-[11px] text-muted">
                            <Label de={r.sub.de} vi={r.sub.vi} />
                          </span>
                        )}
                      </span>
                    </span>
                    {days.map((d, i) => (
                      <Cell key={d} done={doneOn(r.id, i)} total={due[i].length} future={d > today || d < FIRST_DAY} />
                    ))}
                    <Cell done={w.done} total={w.total} future={false} percent />
                  </summary>

                  <div className="border-t border-line-soft bg-[#FAFAF9] px-3 py-2">
                    {allTasks.flatMap((t) => {
                      const parts = t.subtasks?.length
                        ? t.subtasks.map((s) => ({ id: s.id, label_de: s.label_de, label_vi: s.label_vi, days: t.days, indent: true }))
                        : [{ id: t.id, label_de: t.label_de, label_vi: t.label_vi, days: t.days, indent: false }];
                      return [
                        t.subtasks?.length ? (
                          <div key={t.id} className="pt-2 text-xs font-semibold leading-snug text-ink">
                            <span className="pl-5">
                              <Bi de={t.label_de} vi={t.label_vi} />
                            </span>
                          </div>
                        ) : null,
                        ...parts.map((part) => {
                          const notes = days.flatMap((d) => {
                            const l = r.id ? find(r.id, part.id, d) : null;
                            return l?.note ? [{ d, note: l.note }] : [];
                          });
                          return (
                            <div key={part.id} className="border-b border-line-soft py-1.5 last:border-b-0">
                              <div className={cols}>
                                <span className={`min-w-0 text-xs leading-snug text-ink ${part.indent ? "pl-9" : "pl-5"}`}>
                                  <Bi de={part.label_de} vi={part.label_vi} />
                                </span>
                                {days.map((d, i) => {
                                  const isDue = due[i].some((x) => x.id === part.id);
                                  const l = find(r.id, part.id, d);
                                  return (
                                    <span key={d} className="text-center text-[13px]" title={l?.note ?? undefined}>
                                      {!isDue ? <span className="text-faint">·</span> : l?.done ? <span className="font-semibold text-ok">✓</span> : <span className="text-[#B42318]">✕</span>}
                                      {l?.note && <span className="ml-0.5 align-super text-[9px] text-accent-dark">●</span>}
                                    </span>
                                  );
                                })}
                                <span />
                              </div>
                              {notes.map((n) => (
                                <p key={n.d} className={`m-0 mt-1 text-xs text-muted ${part.indent ? "pl-9" : "pl-5"}`}>
                                  <span className="font-medium text-ink">
                                    <Label de={WEEKDAYS[weekday(n.d) - 1].short_de} vi={WEEKDAYS[weekday(n.d) - 1].short_vi} /> {shortDate(n.d)}
                                  </span>{" "}
                                  {n.note}
                                </p>
                              ))}
                            </div>
                          );
                        }),
                      ];
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        <p className="m-0 text-xs text-muted">
          <Label
            de="✓ erledigt · ✕ an dem Tag fällig, nicht abgehakt · „·“ an dem Tag nicht fällig · ● mit Notiz (in der Zeile darunter)"
            vi="✓ đã xong · ✕ đến hạn nhưng chưa đánh dấu · „·“ không phải việc của ngày đó · ● có ghi chú (ở dòng bên dưới)"
          />
        </p>
      </main>
    </>
  );
}

function Cell({ done, total, future, percent = false }: { done: number; total: number; future: boolean; percent?: boolean }) {
  if (future || total === 0) return <span className="text-center text-xs text-faint">–</span>;
  const pct = Math.round((done / total) * 100);
  const cls = pct === 100 ? "bg-ok-soft text-ok" : pct >= 50 ? "bg-warn-soft text-[#7F5F05]" : "bg-[#FDE8E7] text-[#B42318]";
  return <span className={`mx-auto rounded-md px-1.5 py-0.5 text-center text-xs font-medium ${cls}`}>{percent ? `${pct} %` : `${done}/${total}`}</span>;
}
