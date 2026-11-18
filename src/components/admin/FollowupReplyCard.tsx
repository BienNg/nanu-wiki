import Link from "next/link";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { formatDuration, formatWhen } from "@/lib/messenger/stats";
import type { FollowupChannel, FollowupCounts, FollowupStats } from "@/lib/messenger/followupStats";

/** "Nachfassen" on the Statistik page: how many follow-ups got an answer, by 1st/2nd/3rd+, over 8 weeks, and who answered. */

const SEGMENTS = [
  { key: "answered", de: "Beantwortet", vi: "Đã trả lời", bar: "bg-ok" },
  { key: "waiting", de: "Noch keine Antwort", vi: "Chưa trả lời", bar: "bg-[#C9CED6]" },
  { key: "superseded", de: "Ohne Antwort, nochmal nachgefasst", vi: "Không trả lời, đã nhắc tiếp", bar: "bg-[#E9A79E]" },
] as const;

const NTH = { "1": { de: "1. Nachfrage", vi: "Lần nhắc 1" }, "2": { de: "2. Nachfrage", vi: "Lần nhắc 2" }, "3": { de: "3. und später", vi: "Lần 3 trở đi" } };

function pct(part: number, whole: number) {
  return whole ? Math.round((part / whole) * 100) : null;
}

function StackBar({ c, tall = false }: { c: FollowupCounts; tall?: boolean }) {
  return (
    <span className={`flex overflow-hidden rounded-full bg-[#F0F2F5] ${tall ? "h-3" : "h-2.5"}`}>
      {c.sent > 0 &&
        SEGMENTS.map((s) =>
          c[s.key] ? <span key={s.key} title={`${s.de}: ${c[s.key]}`} className={`h-full border-r-2 border-white last:border-r-0 ${s.bar}`} style={{ width: `${(c[s.key] / c.sent) * 100}%` }} /> : null,
        )}
    </span>
  );
}

function Mini({ de, vi, value, noteDe, noteVi, tone = "plain" }: { de: string; vi: string; value: { de: string; vi: string }; noteDe: string; noteVi: string; tone?: "plain" | "ok" | "bad" }) {
  const color = tone === "ok" ? "text-ok" : tone === "bad" ? "text-bad" : "text-ink";
  return (
    <div className="min-w-0 rounded-lg bg-[#F6F7F9] px-3 py-2.5">
      <p className="m-0 text-[11.5px] font-medium text-muted">
        <Label de={de} vi={vi} />
      </p>
      <p className={`m-0 mt-1 text-[18px] font-semibold leading-none tabular-nums ${color}`}>
        <Label de={value.de} vi={value.vi} />
      </p>
      <p className="m-0 mt-1 text-[11px] leading-snug text-faint">
        <Label de={noteDe} vi={noteVi} />
      </p>
    </div>
  );
}

export function FollowupReplyCard({
  f,
  delta,
  channelHref,
  weekHref,
  weekName,
  currentWeek,
}: {
  f: FollowupStats;
  /** Change of the answer rate against the week before. */
  delta?: React.ReactNode;
  channelHref: (channel: FollowupChannel) => string;
  weekHref: (weekStart: string) => string;
  /** "KW 47" */
  weekName: (weekStart: string) => string;
  currentWeek: string;
}) {
  const rate = pct(f.total.answered, f.total.sent);
  const median = f.medianAnswerSeconds == null ? null : formatDuration(f.medianAnswerSeconds);
  const chosen = f.trend.at(-1)?.weekStart;
  const channels: { id: FollowupChannel; text: string }[] = [
    { id: "", text: "Alle" },
    { id: "messenger", text: "Messenger" },
    { id: "whatsapp", text: "WhatsApp" },
  ];

  return (
    <section className="rounded-xl border border-line bg-white">
      <div className="flex flex-wrap items-start gap-2.5 px-4 pt-3.5">
        <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-chip text-muted">
          <Icon name="bell" size={15} />
        </span>
        <div className="min-w-[200px] flex-1">
          <h2 className="m-0 text-[14.5px] font-semibold leading-tight text-ink">
            <Label de="Nachfassen: Kommt eine Antwort?" vi="Nhắc lại: khách có trả lời không?" />
          </h2>
          <p className="m-0 mt-0.5 text-[12px] text-faint">
            <Label
              de="Unsere Nachrichten, wenn die Person seit 24 Std. still ist. Gezählt in der Woche, in der wir sie geschickt haben."
              vi="Tin mình gửi khi khách im lặng 24 giờ. Tính vào tuần mình gửi."
            />
          </p>
          <p className="m-0 mt-0.5 text-[11px] text-faint">
            <Label de={`Stand ${formatWhen(f.computedAt)} · wird alle 5 Min. neu berechnet`} vi={`Cập nhật ${formatWhen(f.computedAt)} · tính lại mỗi 5 phút`} />
          </p>
        </div>
        <nav aria-label="Kanal" className="flex flex-none rounded-full border border-line bg-[#F6F7F9] p-0.5">
          {channels.map((c) => (
            <Link
              key={c.id || "all"}
              href={channelHref(c.id)}
              aria-current={f.channel === c.id ? "page" : undefined}
              className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors duration-150 ${f.channel === c.id ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-ink"}`}
            >
              {c.id ? c.text : <Label de="Alle" vi="Tất cả" />}
            </Link>
          ))}
        </nav>
      </div>

      {f.total.sent === 0 ? (
        <p className="m-4 rounded-lg bg-chip px-3 py-6 text-center text-[12.5px] text-muted">
          <Label de="In dieser Woche haben wir nicht nachgefasst." vi="Tuần này mình chưa nhắc lại ai." />
        </p>
      ) : (
        <div className="grid gap-x-6 gap-y-4 px-4 pb-4 pt-3 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <p className="title-display m-0 text-[30px] leading-none tracking-tight text-ink tabular-nums">{rate} %</p>
              <span className="pb-0.5 text-[12.5px] text-muted">
                <Label de={`${f.total.answered} von ${f.total.sent} beantwortet`} vi={`${f.total.answered} / ${f.total.sent} đã trả lời`} />
              </span>
              <span className="ml-auto pb-0.5">{delta}</span>
            </div>
            <StackBar c={f.total} tall />
            <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[11.5px] text-muted">
              {SEGMENTS.map((s) => (
                <li key={s.key} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-sm ${s.bar}`} />
                  <Label de={s.de} vi={s.vi} />
                  <span className="font-semibold text-ink tabular-nums">{f.total[s.key]}</span>
                </li>
              ))}
            </ul>

            <ol className="m-0 mt-1 flex list-none flex-col gap-2 p-0">
              {f.byNth.map((row) => {
                const p = pct(row.answered, row.sent);
                return (
                  <li key={row.id} className="grid grid-cols-[96px_1fr_78px] items-center gap-2.5 text-[12.5px]">
                    <span className={row.sent ? "font-medium text-ink" : "text-muted"}>
                      <Label de={NTH[row.id].de} vi={NTH[row.id].vi} />
                    </span>
                    <StackBar c={row} />
                    <span className="flex items-baseline justify-end gap-1.5 tabular-nums">
                      <span className={`font-semibold ${row.sent ? "text-ink" : "text-faint"}`}>
                        {row.answered}/{row.sent}
                      </span>
                      {p != null && <span className="w-8 text-right text-[11px] text-faint">{p} %</span>}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-1 grid grid-cols-3 gap-2 max-sm:grid-cols-1">
              <Mini
                de="Antwort nach"
                vi="Trả lời sau"
                value={median ?? { de: "–", vi: "–" }}
                noteDe="Median, ab unserer Nachfrage"
                noteVi="Trung vị, tính từ lúc mình nhắc"
              />
              <Mini
                de="Jetzt Schüler"
                vi="Giờ là học viên"
                tone={f.schueler ? "ok" : "plain"}
                value={{ de: String(f.schueler), vi: String(f.schueler) }}
                noteDe={`von ${f.total.answered} Antworten`}
                noteVi={`trong ${f.total.answered} lần trả lời`}
              />
              <Mini
                de="Antwort war Nein"
                vi="Trả lời là không"
                tone={f.verloren ? "bad" : "plain"}
                value={{ de: String(f.verloren), vi: String(f.verloren) }}
                noteDe="Chat steht jetzt auf Verloren"
                noteVi="Cuộc giờ là Mất khách"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <p className="m-0 text-[12px] font-medium text-muted">
              <Label de={`Antwortquote, letzte ${f.trend.length} Wochen`} vi={`Tỉ lệ trả lời, ${f.trend.length} tuần gần nhất`} />
            </p>
            <div className="mt-2 grid flex-1 grid-cols-8 gap-1.5">
              {f.trend.map((w) => {
                const p = pct(w.answered, w.sent);
                const on = w.weekStart === chosen;
                return (
                  <Link
                    key={w.weekStart}
                    href={weekHref(w.weekStart)}
                    aria-current={on ? "page" : undefined}
                    title={`${weekName(w.weekStart)}: ${w.answered} von ${w.sent} beantwortet`}
                    className={`group flex min-w-0 flex-col items-center gap-1 rounded-lg px-0.5 pb-1 pt-1 transition-colors duration-100 ${on ? "bg-accent-soft/60" : "hover:bg-hover"}`}
                  >
                    <span className={`text-[11.5px] font-semibold tabular-nums ${p == null ? "text-faint" : "text-ink"}`}>{p == null ? "–" : `${p}%`}</span>
                    {/* The whole bar is 100 %; the green part is the share that got an answer. */}
                    <span className={`relative flex h-28 w-full max-w-[34px] flex-col justify-end overflow-hidden rounded-md ${w.sent ? "bg-[#E4E7EB]" : "border border-dashed border-line"}`}>
                      {p != null && p > 0 && <span className="w-full rounded-t-[3px] bg-ok" style={{ height: `${Math.max(p, 3)}%` }} />}
                    </span>
                    <span className={`whitespace-nowrap text-[10.5px] ${on ? "font-semibold text-accent-dark" : "text-faint"}`}>{weekName(w.weekStart).replace("KW ", "")}</span>
                    <span className="text-[10px] text-faint tabular-nums">{w.sent}</span>
                  </Link>
                );
              })}
            </div>
            <p className="m-0 mt-2 flex flex-wrap gap-x-3 text-[11px] text-faint">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-ok" />
                <Label de="beantwortet" vi="đã trả lời" />
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-[#E4E7EB]" />
                <Label de="ohne Antwort · Zahl unten: gesendet" vi="chưa trả lời · số bên dưới: đã gửi" />
              </span>
              {chosen === currentWeek && (
                <span>
                  <Label de="Diese Woche läuft noch, viele können noch antworten" vi="Tuần này chưa hết, nhiều người còn có thể trả lời" />
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {f.answeredPeople.length > 0 && (
        <div className="border-t border-line-soft px-4 pb-3 pt-3">
          <p className="m-0 mb-2 text-[12px] font-medium text-muted">
            <Label
              de={`Haben auf eine Nachfrage dieser Woche geantwortet${f.answeredCapped ? " (die neuesten 30)" : ""}`}
              vi={`Đã trả lời tin nhắc trong tuần này${f.answeredCapped ? " (30 người mới nhất)" : ""}`}
            />
          </p>
          <ul className="m-0 grid max-h-[300px] list-none gap-1 overflow-y-auto p-0 sm:grid-cols-2">
            {f.answeredPeople.map((p) => {
              const after = formatDuration(p.answerSeconds);
              return (
                <li key={`${p.id}:${p.at}`}>
                  <Link
                    href={`/admin/messenger?c=${encodeURIComponent(p.id)}`}
                    title={`Nachfrage ${formatWhen(p.at)} · Antwort ${formatWhen(p.answeredAt)}`}
                    className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] transition-colors duration-100 hover:bg-hover"
                  >
                    <span className="min-w-0 flex-1 truncate font-medium text-ink">{p.name}</span>
                    <span className="flex-none rounded-full bg-chip px-1.5 py-px text-[10.5px] font-medium text-muted">
                      <Label de={`${p.nth}.`} vi={`lần ${p.nth}`} />
                    </span>
                    {p.schueler && (
                      <span className="flex-none rounded-full bg-ok-soft px-1.5 py-px text-[10.5px] font-semibold text-ok">
                        <Label de="Schüler" vi="Học viên" />
                      </span>
                    )}
                    {p.verloren && (
                      <span className="flex-none rounded-full bg-bad-soft px-1.5 py-px text-[10.5px] font-semibold text-bad">
                        <Label de="Verloren" vi="Mất khách" />
                      </span>
                    )}
                    <span className="flex-none text-right text-[11.5px] text-faint tabular-nums">
                      <Label de={`nach ${after.de}`} vi={`sau ${after.vi}`} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
