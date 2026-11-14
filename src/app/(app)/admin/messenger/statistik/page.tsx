import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { INTERESTS } from "@/lib/assistant/schema";
import { Topbar, Crumb } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { LABEL_BUDGET_EUR } from "@/lib/messenger/classify";
import { formatDuration, formatWhen, loadMessengerStats, type PersonRow, type StatsSnapshot } from "@/lib/messenger/stats";

export const metadata = { title: "Messenger-Statistik" };
export const dynamic = "force-dynamic";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

function href(stats: StatsSnapshot, patch: { w?: string; interesse?: string; niveau?: string }) {
  const interest = patch.interesse !== undefined ? patch.interesse : stats.interest;
  const level = patch.niveau !== undefined ? patch.niveau : stats.level;
  const q = new URLSearchParams();
  q.set("w", patch.w ?? stats.weekStart);
  if (interest) q.set("interesse", interest);
  if (level) q.set("niveau", level);
  return `/admin/messenger/statistik?${q}`;
}

function Stat({ de, vi, valueDe, valueVi, noteDe, noteVi }: { de: string; vi: string; valueDe: string; valueVi: string; noteDe?: string; noteVi?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3">
      <p className="m-0 text-[12px] text-muted">
        <Label de={de} vi={vi} />
      </p>
      <p className="title-display m-0 mt-1 text-[28px] leading-none">
        <Label de={valueDe} vi={valueVi} />
      </p>
      {noteDe && noteVi && (
        <p className="m-0 mt-1.5 text-[12px] text-faint">
          <Label de={noteDe} vi={noteVi} />
        </p>
      )}
    </div>
  );
}

function People({ titleDe, titleVi, rows, emptyDe, emptyVi }: { titleDe: string; titleVi: string; rows: PersonRow[]; emptyDe: string; emptyVi: string }) {
  return (
    <section className="rounded-xl border border-line bg-white">
      <h2 className="m-0 border-b border-line px-4 py-3 text-[15px] font-semibold">
        <Label de={titleDe} vi={titleVi} />
        <span className="ml-2 text-[13px] font-medium text-faint">{rows.length}</span>
      </h2>
      {rows.length === 0 ? (
        <p className="m-0 px-4 py-6 text-[13px] text-muted">
          <Label de={emptyDe} vi={emptyVi} />
        </p>
      ) : (
        <ul className="m-0 list-none p-1.5">
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/messenger?c=${encodeURIComponent(row.id)}`} className="flex items-baseline gap-3 rounded-lg px-2.5 py-2 hover:bg-hover">
                <span className="w-[38%] min-w-0 truncate text-[14px] font-medium text-ink">{row.name}</span>
                <span className="hidden min-w-0 flex-1 truncate text-[12.5px] text-muted sm:block">
                  <Label de={row.detailDe} vi={row.detailVi} />
                </span>
                <span className="ml-auto flex-none text-[12px] text-faint">{formatWhen(row.at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function MessengerStatsPage({ searchParams }: { searchParams: Promise<{ w?: string; interesse?: string; niveau?: string }> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const supabase = await createClient();
  const stats = await loadMessengerStats(supabase, { week: sp.w, interest: sp.interesse, level: sp.niveau });
  const median = stats.medianReplySeconds == null ? null : formatDuration(stats.medianReplySeconds);
  const within15 = stats.workHourLeads ? Math.round((stats.answeredWithin15 / stats.workHourLeads) * 100) : null;
  const maxFunnel = Math.max(1, ...stats.funnel.map((row) => row.count));
  const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: stats.budgetEur > 0 && stats.budgetEur < 0.01 ? 3 : 2,
    maximumFractionDigits: stats.budgetEur > 0 && stats.budgetEur < 0.01 ? 3 : 2,
  }).format(stats.budgetEur);

  return (
    <>
      <Topbar
        actions={
          <Link href="/admin/messenger" className="rounded-full px-2.5 py-1 font-medium text-accent hover:bg-accent-soft">
            <Label de="Posteingang" vi="Hộp thư" />
          </Link>
        }
      >
        <Link href="/admin/messenger" className="text-body">
          <Icon name="chat" size={14} />
        </Link>
        <Crumb>
          <Label de="Statistik" vi="Thống kê" />
        </Crumb>
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-8 pb-20 pt-8 max-sm:px-4">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="title-display m-0 text-[34px] leading-tight">
                <Label de="Messenger" vi="Messenger" />
              </h1>
              <p className="m-0 mt-1 text-[13px] text-muted">
                <Label
                  de="Neue Personen dieser Woche, wie schnell wir antworten, und wo das Gespräch aufhört. Anmeldungen stehen hier nicht — die passieren in Zalo und im CRM."
                  vi="Người mới trong tuần, tốc độ trả lời, và cuộc trò chuyện dừng ở đâu. Đăng ký không nằm ở đây — việc đó ở Zalo và CRM."
                />
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[13px]">
              <Link href={href(stats, { w: stats.prevWeek })} className="rounded-full px-3 py-1 font-medium hover:bg-hover">
                ‹
              </Link>
              <span className="min-w-[7.5rem] text-center font-medium">
                <Label de={stats.rangeDe} vi={stats.rangeVi} />
              </span>
              {stats.nextWeek ? (
                <Link href={href(stats, { w: stats.nextWeek })} className="rounded-full px-3 py-1 font-medium hover:bg-hover">
                  ›
                </Link>
              ) : (
                <span className="px-3 py-1 text-faint">›</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[13px]">
            <Link href={href(stats, { interesse: "" })} aria-current={stats.interest ? undefined : "page"} className="rounded-full px-3 py-1 font-medium text-body hover:bg-hover aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark">
              <Label de="Alle Interessen" vi="Mọi nhu cầu" />
            </Link>
            {INTERESTS.map((item) => (
              <Link key={item} href={href(stats, { interesse: item })} aria-current={stats.interest === item ? "page" : undefined} className="rounded-full px-3 py-1 font-medium text-body hover:bg-hover aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark">
                {item}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 text-[13px]">
            <Link href={href(stats, { niveau: "" })} aria-current={stats.level ? undefined : "page"} className="rounded-full px-3 py-1 font-medium text-body hover:bg-hover aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark">
              <Label de="Alle Niveaus" vi="Mọi trình độ" />
            </Link>
            {LEVELS.map((item) => (
              <Link key={item} href={href(stats, { niveau: item })} aria-current={stats.level === item ? "page" : undefined} className="rounded-full px-3 py-1 font-medium text-body hover:bg-hover aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark">
                {item}
              </Link>
            ))}
          </div>
          {(stats.interest || stats.level) && (
            <p className="m-0 text-[12.5px] text-muted">
              <Label
                de="Filter gilt für die Woche und den Trichter. Gespräche ohne passende Einordnung fallen weg. Die drei Listen darunter bleiben ungefiltert."
                vi="Bộ lọc áp cho tuần và phễu. Cuộc chưa gắn đúng nhãn sẽ ẩn. Ba danh sách bên dưới không bị lọc."
              />
            </p>
          )}
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat de="Neue Gespräche" vi="Cuộc trò chuyện mới" valueDe={String(stats.newThreads)} valueVi={String(stats.newThreads)} noteDe={`${stats.leads} Leads · ${stats.bestand} Bestand · ${stats.keinLead} keine Anfrage`} noteVi={`${stats.leads} khách mới · ${stats.bestand} học viên cũ · ${stats.keinLead} không phải khách`} />
          <Stat de="Nachrichten von Kunden" vi="Tin nhắn của khách" valueDe={String(stats.inboundMessages)} valueVi={String(stats.inboundMessages)} noteDe="Ganze Woche, ohne Filter" noteVi="Cả tuần, không lọc" />
          <Stat
            de="Erste Antwort, Median"
            vi="Tin trả lời đầu, trung vị"
            valueDe={median?.de ?? "–"}
            valueVi={median?.vi ?? "–"}
            noteDe={median ? "Nur Leads, deren erste Nachricht zwischen 9 und 18 Uhr lag" : "Noch keine Antwort in der Arbeitszeit"}
            noteVi={median ? "Chỉ khách mới nhắn trong khoảng 9–18 giờ" : "Chưa có trả lời trong giờ làm"}
          />
          <Stat
            de="Unter 15 Minuten"
            vi="Dưới 15 phút"
            valueDe={within15 == null ? "–" : `${within15} %`}
            valueVi={within15 == null ? "–" : `${within15} %`}
            noteDe={stats.workHourLeads ? `${stats.answeredWithin15} von ${stats.workHourLeads} in der Arbeitszeit (9–18 Uhr)` : "Keine neuen Leads in der Arbeitszeit"}
            noteVi={stats.workHourLeads ? `${stats.answeredWithin15} / ${stats.workHourLeads} trong giờ làm (9–18h)` : "Không có khách mới trong giờ làm"}
          />
        </section>

        <section className="grid gap-3 sm:grid-cols-7">
          {stats.days.map((day) => (
            <div key={day.date} className="rounded-xl border border-line bg-white px-3 py-2.5">
              <p className="m-0 text-[12px] text-muted">
                <Label de={day.de} vi={day.vi} />
              </p>
              <p className="m-0 mt-1 text-[20px] font-semibold leading-none">{day.leads}</p>
              <p className="m-0 mt-1 text-[11.5px] text-faint">
                <Label de={`${day.threads} Gespräche`} vi={`${day.threads} cuộc`} />
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <h2 className="m-0 text-[15px] font-semibold">
              <Label de="Erste Antwort" vi="Tin trả lời đầu" />
            </h2>
            <ul className="m-0 mt-3 list-none space-y-2 p-0">
              {stats.buckets.map((row) => (
                <li key={row.id} className="flex items-center gap-2 text-[13px]">
                  <span className="w-28 text-muted">
                    <Label de={row.de} vi={row.vi} />
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#F0F2F5]">
                    <span className="block h-full rounded-full bg-accent" style={{ width: `${stats.workHourLeads ? (row.count / stats.workHourLeads) * 100 : 0}%` }} />
                  </span>
                  <span className="w-6 text-right font-medium">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <h2 className="m-0 text-[15px] font-semibold">
              <Label de="Wie weit die Leads kamen" vi="Khách mới đi đến đâu" />
            </h2>
            <p className="m-0 mt-1 text-[12px] text-faint">
              <Label de={`${stats.unlabeled} noch ohne Einordnung. Ein Chat kann nur eine Stufe haben.`} vi={`${stats.unlabeled} chưa gắn nhãn. Mỗi cuộc chỉ một bước.`} />
            </p>
            <ul className="m-0 mt-3 list-none space-y-2 p-0">
              {stats.funnel.map((row) => (
                <li key={row.id} className="flex items-center gap-2 text-[13px]">
                  <span className="w-36 truncate text-muted">
                    <Label de={row.de} vi={row.vi} />
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#F0F2F5]">
                    <span className="block h-full rounded-full bg-accent" style={{ width: `${(row.count / maxFunnel) * 100}%` }} />
                  </span>
                  <span className="w-6 text-right font-medium">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <h2 className="m-0 text-[15px] font-semibold">
              <Label de="Stand" vi="Trạng thái" />
            </h2>
            {stats.outcomes.length === 0 ? (
              <p className="m-0 mt-3 text-[13px] text-muted">
                <Label de="Noch keine Einordnung in dieser Woche." vi="Tuần này chưa có cuộc nào được gắn nhãn." />
              </p>
            ) : (
              <ul className="m-0 mt-3 list-none space-y-1.5 p-0 text-[13px]">
                {stats.outcomes.map((row) => (
                  <li key={row.id} className="flex justify-between gap-3">
                    <Label de={row.de} vi={row.vi} />
                    <span className="font-medium">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <h2 className="m-0 text-[15px] font-semibold">
              <Label de="Warum es aufgehört hat" vi="Vì sao dừng" />
            </h2>
            {stats.losses.length === 0 ? (
              <p className="m-0 mt-3 text-[13px] text-muted">
                <Label de="Kein verlorener Lead mit Grund in dieser Woche." vi="Tuần này chưa có khách mất với lý do." />
              </p>
            ) : (
              <ul className="m-0 mt-3 list-none space-y-1.5 p-0 text-[13px]">
                {stats.losses.map((row) => (
                  <li key={row.id} className="flex justify-between gap-3">
                    <Label de={row.de} vi={row.vi} />
                    <span className="font-medium">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <People titleDe="Wartet auf uns" titleVi="Đang chờ mình" rows={stats.waiting} emptyDe="Niemand wartet länger als 15 Minuten." emptyVi="Không ai chờ quá 15 phút." />
        <People titleDe="Still seit 24 Stunden, ohne Nachfrage" titleVi="Im 24 giờ, chưa nhắc" rows={stats.quiet} emptyDe="Keine offenen Nachfragen." emptyVi="Không có tin nào cần nhắc." />
        <People titleDe="Preis oder Beratung, dann still" titleVi="Học phí hoặc đang tư vấn, rồi im" rows={stats.price} emptyDe="Keine solchen Gespräche." emptyVi="Không có cuộc nào như vậy." />

        <p className={`m-0 text-[12.5px] ${stats.capReached || stats.labelError ? "text-bad" : "text-faint"}`}>
          {stats.labelError ? (
            stats.labelError
          ) : (
            <Label
              de={`Einordnung diesen Monat ${euro} von ${LABEL_BUDGET_EUR} €. Läuft alle 15 Minuten, nur wenn ein Chat neue Nachrichten hat oder eine Nachfrage einen Tag unbeantwortet blieb.`}
              vi={`Phân loại tháng này ${euro} / ${LABEL_BUDGET_EUR} €. Chạy mỗi 15 phút, chỉ khi cuộc trò chuyện có tin mới hoặc tin nhắc đã một ngày không được trả lời.`}
            />
          )}
        </p>
      </main>
    </>
  );
}
