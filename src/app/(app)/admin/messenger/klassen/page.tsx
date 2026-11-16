import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar, Crumb } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { MODE_SHORT, shortDate } from "@/lib/classes";
import { hasStarted, type AssignableClass } from "@/lib/messenger/classes";
import { STEP_INFO, stepOf } from "@/lib/messenger/steps";
import { toActionLabel, LABEL_COLUMNS, type InboxLabel } from "@/lib/messenger/thread";
import { assignableClassById, assignableClasses } from "@/lib/notion";

export const metadata = { title: "Messenger-Klassen" };
export const dynamic = "force-dynamic";

const TZ = "Asia/Ho_Chi_Minh";
const dayFmt = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "2-digit" });

type ConversationRow = { id: string; customer_name: string | null; updated_time: string; channel: string | null };

/** Status next to the lead's name: the outcome if the chat is closed, else the funnel step. */
function stateChip(label: InboxLabel | null) {
  if (label?.outcome === "verloren") return { de: "Verloren", vi: "Đã mất" };
  if (label?.outcome === "kein_lead") return { de: "Kein Lead", vi: "Không phải khách" };
  if (label?.outcome === "weiter_auf_zalo") return { de: "Zalo", vi: "Zalo" };
  if (label?.outcome === "bestandskunde") return { de: "Schüler", vi: "Học viên" };
  const step = stepOf(label ? toActionLabel(label) : null);
  return step ? { de: STEP_INFO[step].short_de, vi: STEP_INFO[step].short_vi } : { de: "Unklar", vi: "Chưa rõ" };
}

function Badge({ tone, children }: { tone: "muted" | "warn"; children: React.ReactNode }) {
  const cls = tone === "warn" ? "bg-[#FDF1E2] text-[#9A5B13]" : "bg-[#F1F2F4] text-muted";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{children}</span>;
}

/**
 * Upcoming classes and the Messenger chats assigned to them, for reaching out to every prospect of
 * a class. Classes come live from Notion (the assignable pool plus assigned classes fetched by id
 * until their End date passes); the assignments live in Supabase. Rows open the chat in the inbox.
 */
export default async function MessengerKlassenPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: rows, error }, pool] = await Promise.all([
    supabase.from("messenger_class_assignments").select("conversation_id, class_id"),
    assignableClasses(),
  ]);
  if (error) throw new Error(error.message);

  const byClass = new Map<string, string[]>();
  for (const r of rows ?? []) {
    const list = byClass.get(r.class_id) ?? [];
    list.push(r.conversation_id);
    byClass.set(r.class_id, list);
  }
  const known = new Set(pool.map((c) => c.id));
  const extras = (await Promise.all([...byClass.keys()].filter((k) => !known.has(k)).map(assignableClassById))).filter((c): c is AssignableClass => !!c);
  const classes = [...pool, ...extras].sort((a, b) => {
    if (a.begin !== b.begin) {
      if (!a.begin) return 1;
      if (!b.begin) return -1;
      return a.begin < b.begin ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const selected = classes.find((c) => c.id === sp.k) ?? null;
  let prospects: { conv: ConversationRow; label: InboxLabel | null }[] = [];
  if (selected) {
    const ids = byClass.get(selected.id) ?? [];
    if (ids.length) {
      const [{ data: convs, error: convErr }, { data: labels, error: labelErr }] = await Promise.all([
        supabase.from("messenger_conversations").select("id, customer_name, updated_time, channel").in("id", ids),
        supabase.from("messenger_labels").select(LABEL_COLUMNS).in("conversation_id", ids),
      ]);
      if (convErr || labelErr) throw new Error(convErr?.message ?? labelErr?.message);
      const labelById = new Map((labels ?? []).map((l) => [l.conversation_id, l as InboxLabel]));
      prospects = ((convs ?? []) as ConversationRow[])
        .map((conv) => ({ conv, label: labelById.get(conv.id) ?? null }))
        .sort((a, b) => (a.conv.updated_time < b.conv.updated_time ? 1 : -1));
    }
  }

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
          <Label de="Klassen" vi="Lớp học" />
        </Crumb>
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-8 pb-20 pt-8 max-sm:px-4">
        <header>
          <h1 className="title-display m-0 text-[34px] leading-tight">
            <Label de="Klassen" vi="Lớp học" />
          </h1>
          <p className="m-0 mt-1 text-[13px] text-muted">
            <Label
              de="Kommende Kurse aus Notion und die Chats, die ihnen zugeordnet sind. Eine Klasse öffnen und jeden Interessenten anschreiben."
              vi="Các lớp sắp mở từ Notion và các cuộc trò chuyện đã gán. Mở một lớp để nhắn cho từng khách quan tâm."
            />
          </p>
        </header>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 max-md:grid-cols-1">
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {classes.map((c) => {
              const count = byClass.get(c.id)?.length ?? 0;
              const current = selected?.id === c.id;
              const when = c.begin ? shortDate(c.begin) : null;
              return (
                <li key={c.id}>
                  <Link
                    href={current ? "/admin/messenger/klassen" : `/admin/messenger/klassen?k=${c.id}`}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors ${current ? "border-accent bg-accent-soft" : "border-line bg-white hover:bg-hover"}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="m-0 truncate text-[13.5px] font-medium" title={c.name}>
                        {c.name}
                      </p>
                      <p className="m-0 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-muted">
                        {c.mode && <span>{MODE_SHORT[c.mode]}</span>}
                        {when ? (
                          <span>
                            <Label de={`ab ${when.de}`} vi={`từ ${when.vi}`} />
                            {c.time ? ` · ${c.time}` : ""}
                          </span>
                        ) : (
                          <Badge tone="muted">
                            <Label de="Start offen" vi="Chưa có ngày" />
                          </Badge>
                        )}
                        {c.full && (
                          <Badge tone="warn">
                            <Label de="Voll" vi="Đã đầy" />
                          </Badge>
                        )}
                        {hasStarted(c) && (
                          <Badge tone="muted">
                            <Label de="Läuft" vi="Đang học" />
                          </Badge>
                        )}
                      </p>
                    </div>
                    <span className={`flex-none rounded-full px-2 py-0.5 text-[12px] font-medium ${count ? "bg-accent-soft text-accent" : "bg-[#F1F2F4] text-faint"}`}>{count}</span>
                  </Link>
                </li>
              );
            })}
            {classes.length === 0 && (
              <li className="rounded-xl border border-line bg-white px-4 py-3 text-[13px] text-muted">
                <Label de="Keine kommenden Klassen in Notion gefunden." vi="Không tìm thấy lớp sắp mở trong Notion." />
              </li>
            )}
          </ul>
          <section>
            {!selected ? (
              <p className="m-0 rounded-xl border border-dashed border-line px-4 py-8 text-center text-[13px] text-muted">
                <Label de="Links eine Klasse wählen." vi="Chọn một lớp bên trái." />
              </p>
            ) : (
              <div className="rounded-xl border border-line bg-white">
                <header className="border-b border-line px-4 py-3">
                  <h2 className="m-0 text-[15px] font-semibold">{selected.name}</h2>
                  <p className="m-0 mt-0.5 text-[12px] text-muted">
                    {prospects.length === 1 ? (
                      <Label de="1 Interessent" vi="1 khách quan tâm" />
                    ) : (
                      <Label de={`${prospects.length} Interessenten`} vi={`${prospects.length} khách quan tâm`} />
                    )}
                  </p>
                </header>
                {prospects.length === 0 ? (
                  <p className="m-0 px-4 py-6 text-[13px] text-muted">
                    <Label de="Diesem Kurs ist noch kein Chat zugeordnet." vi="Chưa có cuộc trò chuyện nào được gán cho lớp này." />
                  </p>
                ) : (
                  <ul className="m-0 list-none p-0">
                    {prospects.map(({ conv, label }) => {
                      const chip = stateChip(label);
                      return (
                        <li key={conv.id} className="border-b border-line last:border-b-0">
                          <Link href={`/admin/messenger?c=${encodeURIComponent(conv.id)}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-hover">
                            <div className="min-w-0 flex-1">
                              <p className="m-0 truncate text-[13.5px] font-medium">{conv.customer_name ?? "Unbekannt"}</p>
                              <p className="m-0 mt-0.5 text-[12px] text-muted">{conv.channel === "whatsapp" ? "WhatsApp" : "Messenger"}</p>
                            </div>
                            <span className="flex-none rounded-full bg-[#F1F2F4] px-2 py-0.5 text-[11.5px] font-medium text-muted">
                              <Label de={chip.de} vi={chip.vi} />
                            </span>
                            <span className="flex-none text-[12px] text-faint">{dayFmt.format(new Date(conv.updated_time))}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
