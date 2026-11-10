import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { initials } from "@/lib/format";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { MessengerThread, type ThreadMessage } from "@/components/admin/MessengerThread";

export const metadata = { title: "Messenger" };

type InboxRow = {
  id: string;
  customer_name: string | null;
  updated_time: string;
  last_text: string | null;
  last_from_page: boolean | null;
  last_has_attachment: boolean | null;
  last_time: string | null;
};
type Params = { c?: string; filter?: string; q?: string };

const TZ = "Asia/Ho_Chi_Minh";
const LIST_LIMIT = 200;

/** Today → "14:05", this year → "07.11.", older → "07.11.25" (Vietnam time, like the daily tasks). */
function shortTime(value: string) {
  const d = new Date(value);
  const day = (x: Date) => new Intl.DateTimeFormat("de-DE", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "2-digit" }).format(x);
  if (day(d) === day(new Date())) return new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(d);
  const sameYear = day(d).slice(-2) === day(new Date()).slice(-2);
  return sameYear ? day(d).slice(0, 6) : day(d);
}

/** Read-only copy of the Facebook Page inbox (synced every minute by /api/cron/messenger-sync). */
export default async function MessengerInboxPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const filter = sp.filter === "offen" ? "offen" : "alle";
  const q = (sp.q ?? "").trim().slice(0, 80);

  const supabase = await createClient();
  let list = supabase.from("messenger_inbox").select("*").order("updated_time", { ascending: false }).limit(LIST_LIMIT);
  if (filter === "offen") list = list.eq("last_from_page", false);
  if (q) list = list.ilike("customer_name", `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`);

  const [{ data: rows }, { count: openCount }, { data: state }] = await Promise.all([
    list,
    supabase.from("messenger_inbox").select("id", { count: "exact", head: true }).eq("last_from_page", false),
    supabase.from("messenger_sync_state").select("last_run_at, last_error").maybeSingle(),
  ]);
  const conversations = (rows ?? []) as InboxRow[];

  const selectedId = sp.c ?? null;
  let selected: { id: string; customer_name: string | null; message_count: number | null } | null = null;
  let messages: ThreadMessage[] = [];
  if (selectedId) {
    const [{ data: conv }, { data: msgs }] = await Promise.all([
      supabase.from("messenger_conversations").select("id, customer_name, message_count").eq("id", selectedId).maybeSingle(),
      supabase
        .from("messenger_messages")
        .select("id, text, from_page, from_name, attachments, created_time")
        .eq("conversation_id", selectedId)
        .order("created_time", { ascending: true })
        .limit(1000),
    ]);
    selected = conv;
    messages = (msgs ?? []) as ThreadMessage[];
  }

  const href = (patch: Partial<Params>) => {
    const next = { c: selectedId ?? "", filter: filter === "alle" ? "" : filter, q, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]);
    return `/admin/messenger${qs.size ? `?${qs}` : ""}`;
  };

  const syncAgeMin = state?.last_run_at ? Math.round((Date.now() - new Date(state.last_run_at).getTime()) / 60_000) : null;
  const syncOk = !state?.last_error && syncAgeMin !== null && syncAgeMin <= 5;

  return (
    <>
      <AutoRefresh seconds={30} />
      <Topbar>
        <Icon name="chat" size={14} />
        <Label de="Messenger" vi="Messenger" />
      </Topbar>
      <main className="flex h-[calc(100dvh-48px)] min-h-0 max-md:h-[calc(100dvh-96px)] w-full border-t border-line">
        {/* Conversation list */}
        <section aria-label="Gespräche" className={`flex w-[340px] flex-none flex-col border-r border-line max-md:w-full ${selected ? "max-md:hidden" : ""}`}>
          <div className="flex flex-col gap-2.5 border-b border-line px-3.5 pb-3 pt-3">
            <div className="flex items-baseline justify-between gap-2">
              <h1 className="title-display m-0 text-[20px] leading-tight tracking-tight">
                <Label de="Posteingang" vi="Hộp thư" />
              </h1>
              <span
                className={`flex items-center gap-1.5 text-[11.5px] ${syncOk ? "text-faint" : "text-bad"}`}
                title={state?.last_error ?? undefined}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${syncOk ? "bg-ok" : "bg-bad"}`} />
                {state?.last_error ? (
                  <Label de="Sync-Fehler" vi="Lỗi đồng bộ" />
                ) : syncAgeMin === null ? (
                  <Label de="Noch nie synchronisiert" vi="Chưa đồng bộ" />
                ) : (
                  <Label de={`Sync vor ${syncAgeMin} Min.`} vi={`Đồng bộ ${syncAgeMin} phút trước`} />
                )}
              </span>
            </div>
            <form action="/admin/messenger" className="flex">
              {filter !== "alle" && <input type="hidden" name="filter" value={filter} />}
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Name suchen · Tìm tên"
                className="h-8 w-full rounded-full bg-[#F0F2F5] px-3.5 text-[13px] text-ink outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </form>
            <div className="flex gap-1.5 text-[13px]">
              {[
                { id: "alle", de: "Alle", vi: "Tất cả" },
                { id: "offen", de: `Antwort offen${openCount ? ` (${openCount})` : ""}`, vi: `Chưa trả lời${openCount ? ` (${openCount})` : ""}` },
              ].map((t) => (
                <Link
                  key={t.id}
                  href={href({ filter: t.id === "alle" ? "" : t.id, c: "" })}
                  aria-current={filter === t.id ? "page" : undefined}
                  className="rounded-full px-3 py-1 font-medium text-body hover:bg-hover aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark"
                >
                  <Label de={t.de} vi={t.vi} />
                </Link>
              ))}
            </div>
          </div>

          <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-1.5">
            {conversations.length === 0 && (
              <li className="px-3 py-8 text-center text-[13px] text-muted">
                <Label de="Keine Gespräche gefunden." vi="Không tìm thấy cuộc trò chuyện." />
              </li>
            )}
            {conversations.map((c) => {
              const unanswered = c.last_from_page === false;
              const preview = c.last_text ?? (c.last_has_attachment ? "📎 Anhang" : "");
              return (
                <li key={c.id}>
                  <Link
                    href={href({ c: c.id })}
                    aria-current={c.id === selectedId ? "page" : undefined}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-hover aria-[current=page]:bg-accent-soft"
                  >
                    <span className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#E4E6EB] text-[13px] font-semibold text-ink">
                      {initials(c.customer_name)}
                      {unanswered && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent" />}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="flex items-baseline gap-2">
                        <span className={`min-w-0 flex-1 truncate text-[14px] ${unanswered ? "font-semibold text-ink" : "text-ink"}`}>
                          {c.customer_name ?? "Unbekannt"}
                        </span>
                        <span className="flex-none text-[11.5px] text-faint">{shortTime(c.last_time ?? c.updated_time)}</span>
                      </span>
                      <span className={`truncate text-[12.5px] ${unanswered ? "font-medium text-body" : "text-muted"}`}>
                        {c.last_from_page ? "Du: " : ""}
                        {preview}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
            {conversations.length === LIST_LIMIT && (
              <li className="px-3 py-3 text-center text-[12px] text-faint">
                <Label de={`Die neuesten ${LIST_LIMIT} – zum Finden älterer Gespräche den Namen suchen.`} vi={`${LIST_LIMIT} cuộc mới nhất – tìm theo tên để thấy cuộc cũ hơn.`} />
              </li>
            )}
          </ul>
        </section>

        {/* Thread */}
        <section aria-label="Gespräch" className={`flex min-w-0 flex-1 flex-col ${selected ? "" : "max-md:hidden"}`}>
          {selected ? (
            <MessengerThread
              key={selected.id}
              name={selected.customer_name ?? "Unbekannt"}
              backHref={href({ c: "" })}
              messages={messages}
              totalCount={selected.message_count}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-muted">
              <Icon name="chat" size={28} />
              <p className="m-0 text-[14px]">
                <Label de="Wähle links ein Gespräch." vi="Chọn một cuộc trò chuyện bên trái." />
              </p>
              <p className="m-0 max-w-[420px] text-[12.5px] text-faint">
                <Label
                  de="Nur lesen: Antworten weiter in der Meta Business Suite schreiben. Neue Nachrichten erscheinen hier innerhalb von etwa einer Minute."
                  vi="Chỉ để đọc: vẫn trả lời trong Meta Business Suite. Tin nhắn mới hiện ở đây trong khoảng một phút."
                />
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
