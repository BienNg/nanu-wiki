import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { initials } from "@/lib/format";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { LabelEditor } from "@/components/admin/LabelEditor";
import { MessengerThread, type ThreadMessage } from "@/components/admin/MessengerThread";
import { formatVnDate } from "@/lib/messenger/classify";
import { conversationView, type ActionLabel, type ActionTiming, type ConversationView } from "@/lib/messenger/nextAction";
import type { LossReason, Outcome } from "@/lib/messenger/types";

export const metadata = { title: "Messenger" };

type InboxRow = {
  id: string;
  customer_name: string | null;
  updated_time: string;
  last_text: string | null;
  last_from_page: boolean | null;
  last_has_attachment: boolean | null;
  last_time: string | null;
  channel?: string | null;
  account_name?: string | null;
};
type Params = { c?: string; filter?: string; q?: string; ch?: string };
type SyncState = { page_id: string; last_run_at: string | null; last_error: string | null };
type InboxLabel = {
  conversation_id: string;
  stage: string;
  interest: string | null;
  level: string | null;
  place: string | null;
  outcome: Outcome;
  loss_reason: LossReason | null;
  labeled_through: string;
  resume_on: string | null;
  pinned: string[] | null;
  updated_at: string | null;
};
type FactRow = {
  id: string;
  customer_name: string | null;
  last_from_page: boolean | null;
  last_page_at: string | null;
  last_customer_at: string | null;
  followup_sent: boolean | null;
  last_page_has_zalo: boolean | null;
  channel: string | null;
};

const LABEL_COLUMNS = "conversation_id, stage, interest, level, place, outcome, loss_reason, labeled_through, resume_on, pinned, updated_at";
const FACT_COLUMNS = "id, customer_name, last_from_page, last_page_at, last_customer_at, followup_sent, last_page_has_zalo, channel";
const TZ = "Asia/Ho_Chi_Minh";
const LIST_LIMIT = 200;
const WAITING_LIMIT = 400;
const DAY_MS = 24 * 60 * 60 * 1000;

function shortTime(value: string) {
  const d = new Date(value);
  const day = (x: Date) => new Intl.DateTimeFormat("de-DE", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "2-digit" }).format(x);
  if (day(d) === day(new Date())) return new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(d);
  const sameYear = day(d).slice(-2) === day(new Date()).slice(-2);
  return sameYear ? day(d).slice(0, 6) : day(d);
}

function toActionLabel(row: InboxLabel): ActionLabel {
  return {
    stage: row.stage,
    interest: row.interest,
    level: row.level,
    place: row.place,
    outcome: row.outcome,
    loss_reason: row.loss_reason,
    labeled_through: row.labeled_through,
    resume_on: row.resume_on,
  };
}

function toTiming(row: FactRow | undefined, inbox: InboxRow | undefined): ActionTiming {
  return {
    last_from_page: row?.last_from_page ?? inbox?.last_from_page ?? null,
    last_page_at: row?.last_page_at ?? null,
    last_customer_at: row?.last_customer_at ?? null,
    followup_sent: !!row?.followup_sent,
    last_page_has_zalo: !!row?.last_page_has_zalo,
  };
}

async function inChunks<T>(ids: string[], load: (slice: string[]) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  if (!ids.length) return [];
  const slices: string[][] = [];
  for (let i = 0; i < ids.length; i += 80) slices.push(ids.slice(i, i + 80));
  const parts = await Promise.all(slices.map((slice) => load(slice)));
  const rows: T[] = [];
  for (const part of parts) {
    if (part.error) throw new Error(part.error.message);
    rows.push(...(part.data ?? []));
  }
  return rows;
}

function formJudgment(outcome: Outcome | undefined) {
  if (outcome === "kein_lead" || outcome === "bestandskunde" || outcome === "weiter_auf_zalo" || outcome === "verloren") return outcome;
  return "auto";
}

function channelMark(row: InboxRow): { de: string; vi: string } | null {
  if (row.channel === "whatsapp") return { de: row.account_name ? `WhatsApp · ${row.account_name}` : "WhatsApp", vi: row.account_name ? `WhatsApp · ${row.account_name}` : "WhatsApp" };
  if (row.channel === "zalo") return { de: row.account_name ? `Zalo · ${row.account_name}` : "Zalo", vi: row.account_name ? `Zalo · ${row.account_name}` : "Zalo" };
  return null;
}

function replyHint(channel: string | null | undefined) {
  if (channel === "whatsapp") return { de: "Nur lesen · in WhatsApp Business antworten", vi: "Chỉ đọc · trả lời trong WhatsApp Business" };
  if (channel === "zalo") return { de: "Nur lesen · im Zalo OA Manager antworten", vi: "Chỉ đọc · trả lời trong Zalo OA Manager" };
  return { de: "Nur lesen · in der Business Suite antworten", vi: "Chỉ đọc · trả lời trong Business Suite" };
}

/** Read-only copy of Messenger, WhatsApp Business, and Zalo OA chats, with the next action for each chat. */
export default async function MessengerInboxPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const filter = sp.filter === "offen" || sp.filter === "heute" ? sp.filter : "alle";
  const channel = sp.ch === "whatsapp" || sp.ch === "zalo" || sp.ch === "messenger" ? sp.ch : "";
  const q = (sp.q ?? "").trim().slice(0, 80);
  const now = Date.now();
  const dayAgo = new Date(now - DAY_MS).toISOString();
  const todayVn = formatVnDate(new Date(now));

  const supabase = await createClient();
  let list = supabase.from("messenger_inbox").select("*").order("updated_time", { ascending: false }).limit(LIST_LIMIT);
  let open = supabase.from("messenger_inbox").select("id", { count: "exact", head: true }).eq("last_from_page", false);
  let waiting = supabase.from("messenger_facts").select(FACT_COLUMNS).eq("last_from_page", false).gt("customer_msgs", 0).order("last_customer_at", { ascending: true }).limit(WAITING_LIMIT);
  let nudge = supabase
    .from("messenger_facts")
    .select(FACT_COLUMNS)
    .eq("last_from_page", true);
  if (channel) {
    list = list.eq("channel", channel);
    open = open.eq("channel", channel);
    waiting = waiting.eq("channel", channel);
    nudge = nudge.eq("channel", channel);
  }
  if (filter === "offen") list = list.eq("last_from_page", false);
  if (q && filter !== "heute") list = list.ilike("customer_name", `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`);

  const [{ data: inboxRows, error: inboxErr }, { count: openCount }, { data: stateRows }, waitingRes, nudgeRes, laterRes] = await Promise.all([
    filter === "heute" ? Promise.resolve({ data: [], error: null }) : list,
    open,
    supabase.from("messenger_sync_state").select("page_id, last_run_at, last_error"),
    waiting,
    nudge
      .eq("followup_sent", false)
      .eq("last_page_has_zalo", false)
      .lte("last_page_at", dayAgo)
      .order("last_page_at", { ascending: true })
      .limit(300),
    supabase.from("messenger_labels").select("conversation_id").eq("loss_reason", "spaeter").or(`resume_on.is.null,resume_on.lte.${todayVn}`).limit(100),
  ]);
  if (inboxErr) throw new Error(inboxErr.message);
  if (waitingRes.error) throw new Error(waitingRes.error.message);
  if (nudgeRes.error) throw new Error(nudgeRes.error.message);
  if (laterRes.error) throw new Error(laterRes.error.message);

  const factById = new Map<string, FactRow>();
  for (const row of [...((waitingRes.data ?? []) as FactRow[]), ...((nudgeRes.data ?? []) as FactRow[])]) factById.set(row.id, row);
  const laterIds = ((laterRes.data ?? []) as { conversation_id: string }[]).map((row) => row.conversation_id).filter((id) => !factById.has(id));
  if (laterIds.length) {
    const rows = await inChunks<FactRow>(laterIds, (slice) => {
      const query = supabase.from("messenger_facts").select(FACT_COLUMNS).in("id", slice);
      return channel ? query.eq("channel", channel) : query;
    });
    for (const row of rows) factById.set(row.id, row);
  }

  const workIds = [...factById.keys()];
  const workLabels = new Map<string, InboxLabel>();
  if (workIds.length) {
    const rows = await inChunks<InboxLabel>(workIds, (slice) => supabase.from("messenger_labels").select(LABEL_COLUMNS).in("conversation_id", slice));
    for (const row of rows) workLabels.set(row.conversation_id, row);
  }

  const waitingCapped = (waitingRes.data?.length ?? 0) >= WAITING_LIMIT;
  const todayEntries = workIds
    .map((id) => {
      const label = workLabels.get(id);
      const timing = toTiming(factById.get(id), undefined);
      const view = conversationView(label ? toActionLabel(label) : undefined, timing, now);
      const factChannel = factById.get(id)?.channel;
      if (channel && factChannel && factChannel !== channel) return null;
      return { id, label, timing, view };
    })
    .filter((item): item is NonNullable<typeof item> => !!item && item.view.action.today)
    .sort((a, b) => a.view.action.rank - b.view.action.rank);

  let conversations: InboxRow[];
  const labelById = new Map<string, InboxLabel>(workLabels);
  const viewById = new Map<string, ConversationView>();

  if (filter === "heute") {
    const wanted = todayEntries.filter((item) => {
      if (!q) return true;
      const name = (factById.get(item.id)?.customer_name ?? "").toLowerCase();
      return name.includes(q.toLowerCase());
    });
    const ids = wanted.map((item) => item.id);
    const inboxById = new Map<string, InboxRow>();
    if (ids.length) {
      const rows = await inChunks<InboxRow>(ids, (slice) => supabase.from("messenger_inbox").select("*").in("id", slice));
      for (const row of rows) inboxById.set(row.id, row);
    }
    conversations = [];
    for (const item of wanted) {
      const row = inboxById.get(item.id);
      if (!row) continue;
      if (q && !(row.customer_name ?? "").toLowerCase().includes(q.toLowerCase())) continue;
      conversations.push(row);
      viewById.set(item.id, item.view);
      if (item.label) labelById.set(item.id, item.label);
    }
    conversations.sort((a, b) => {
      const rankA = viewById.get(a.id)?.action.rank ?? 999;
      const rankB = viewById.get(b.id)?.action.rank ?? 999;
      if (rankA !== rankB) return rankA - rankB;
      return (b.last_time ?? b.updated_time).localeCompare(a.last_time ?? a.updated_time);
    });
  } else {
    conversations = (inboxRows ?? []) as InboxRow[];
    if (conversations.length) {
      const ids = conversations.map((row) => row.id);
      const [labels, facts] = await Promise.all([
        inChunks<InboxLabel>(ids, (slice) => supabase.from("messenger_labels").select(LABEL_COLUMNS).in("conversation_id", slice)),
        inChunks<FactRow>(ids, (slice) => supabase.from("messenger_facts").select(FACT_COLUMNS).in("id", slice)),
      ]);
      for (const row of labels) labelById.set(row.conversation_id, row);
      for (const row of facts) factById.set(row.id, row);
    }
    for (const row of conversations) {
      const label = labelById.get(row.id);
      viewById.set(row.id, conversationView(label ? toActionLabel(label) : undefined, toTiming(factById.get(row.id), row), now));
    }
  }

  const selectedId = sp.c ?? null;
  let selected: { id: string; customer_name: string | null; message_count: number | null; channel: string | null; account_name: string | null } | null = null;
  let messages: ThreadMessage[] = [];
  if (selectedId) {
    const [{ data: conv }, { data: msgs }, { data: oneLabel, error: oneLabelErr }, { data: oneFact, error: oneFactErr }] = await Promise.all([
      supabase.from("messenger_conversations").select("id, customer_name, message_count, channel, account_name").eq("id", selectedId).maybeSingle(),
      supabase
        .from("messenger_messages")
        .select("id, text, from_page, from_name, attachments, created_time")
        .eq("conversation_id", selectedId)
        .order("created_time", { ascending: true })
        .limit(1000),
      supabase.from("messenger_labels").select(LABEL_COLUMNS).eq("conversation_id", selectedId).maybeSingle(),
      supabase.from("messenger_facts").select(FACT_COLUMNS).eq("id", selectedId).maybeSingle(),
    ]);
    if (oneLabelErr) throw new Error(oneLabelErr.message);
    if (oneFactErr) throw new Error(oneFactErr.message);
    selected = conv;
    messages = (msgs ?? []) as ThreadMessage[];
    if (oneLabel) labelById.set(selectedId, oneLabel as InboxLabel);
    if (oneFact) factById.set(selectedId, oneFact as FactRow);
    const label = labelById.get(selectedId);
    const inboxRow = conversations.find((row) => row.id === selectedId);
    viewById.set(selectedId, conversationView(label ? toActionLabel(label) : undefined, toTiming(factById.get(selectedId), inboxRow), now));
  }

  const href = (patch: Partial<Params>) => {
    const next = { c: selectedId ?? "", filter: filter === "alle" ? "" : filter, ch: channel, q, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]);
    return `/admin/messenger${qs.size ? `?${qs}` : ""}`;
  };

  const states = (stateRows ?? []) as SyncState[];
  const pageState =
    states.find((s) => s.page_id === process.env.META_PAGE_ID) ??
    states.find((s) => !s.page_id.startsWith("wa:") && !s.page_id.startsWith("zalo")) ??
    null;
  const syncError = pageState?.last_error ?? states.find((s) => s.last_error)?.last_error ?? null;
  const syncAgeMin = pageState?.last_run_at ? Math.round((Date.now() - new Date(pageState.last_run_at).getTime()) / 60_000) : null;
  const syncOk = !syncError && syncAgeMin !== null && syncAgeMin <= 5;
  const todayCount = todayEntries.length;
  const selectedLabel = selectedId ? labelById.get(selectedId) : undefined;
  const selectedView = selectedId ? viewById.get(selectedId) : undefined;

  return (
    <>
      <AutoRefresh seconds={30} />
      <Topbar
        actions={
          <Link href="/admin/messenger/statistik" className="rounded-full px-2.5 py-1 font-medium text-accent hover:bg-accent-soft">
            <Label de="Statistik" vi="Thống kê" />
          </Link>
        }
      >
        <Icon name="chat" size={14} />
        <Label de="Messenger" vi="Messenger" />
      </Topbar>
      <main className="flex h-[calc(100dvh-48px)] min-h-0 max-md:h-[calc(100dvh-96px)] w-full border-t border-line">
        <section aria-label="Gespräche" className={`flex w-[340px] flex-none flex-col border-r border-line max-md:w-full ${selected ? "max-md:hidden" : ""}`}>
          <div className="flex flex-col gap-2.5 border-b border-line px-3.5 pb-3 pt-3">
            <div className="flex items-baseline justify-between gap-2">
              <h1 className="title-display m-0 text-[20px] leading-tight tracking-tight">
                <Label de="Posteingang" vi="Hộp thư" />
              </h1>
              <span className={`flex items-center gap-1.5 text-[11.5px] ${syncOk ? "text-faint" : "text-bad"}`} title={syncError ?? undefined}>
                <span className={`h-1.5 w-1.5 rounded-full ${syncOk ? "bg-ok" : "bg-bad"}`} />
                {syncError ? (
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
              {channel && <input type="hidden" name="ch" value={channel} />}
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
                { id: "heute", de: `Heute${todayCount ? ` (${waitingCapped ? `${todayCount}+` : todayCount})` : ""}`, vi: `Hôm nay${todayCount ? ` (${waitingCapped ? `${todayCount}+` : todayCount})` : ""}` },
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
            <div className="flex flex-wrap gap-1.5 text-[12px]">
              {[
                { id: "", de: "Alle Kanäle", vi: "Mọi kênh" },
                { id: "messenger", de: "Messenger", vi: "Messenger" },
                { id: "whatsapp", de: "WhatsApp", vi: "WhatsApp" },
                { id: "zalo", de: "Zalo", vi: "Zalo" },
              ].map((t) => (
                <Link
                  key={t.id || "all"}
                  href={href({ ch: t.id, c: "" })}
                  aria-current={channel === t.id ? "page" : undefined}
                  className="rounded-full px-2.5 py-0.5 font-medium text-body hover:bg-hover aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark"
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
              const view = viewById.get(c.id);
              const mark = channelMark(c);
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
                        {mark ? (
                          <span className="text-faint">
                            <Label de={mark.de} vi={mark.vi} />
                            {" · "}
                          </span>
                        ) : null}
                        {c.last_from_page ? "Du: " : ""}
                        {preview}
                      </span>
                      {view && (
                        <>
                          <span className="mt-1 truncate text-[11px] text-faint">
                            <Label de={view.state.de} vi={view.state.vi} />
                          </span>
                          <span className={`truncate text-[12px] ${view.action.today ? "font-medium text-ink" : "text-muted"}`}>
                            <Label de={view.action.de} vi={view.action.vi} />
                          </span>
                        </>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
            {filter !== "heute" && conversations.length === LIST_LIMIT && (
              <li className="px-3 py-3 text-center text-[12px] text-faint">
                <Label de={`Die neuesten ${LIST_LIMIT} – zum Finden älterer Gespräche den Namen suchen.`} vi={`${LIST_LIMIT} cuộc mới nhất – tìm theo tên để thấy cuộc cũ hơn.`} />
              </li>
            )}
            {filter === "heute" && waitingCapped && (
              <li className="px-3 py-3 text-center text-[12px] text-faint">
                <Label de={`Die ${WAITING_LIMIT} am längsten wartenden offenen Chats.`} vi={`${WAITING_LIMIT} cuộc chờ lâu nhất.`} />
              </li>
            )}
          </ul>
        </section>

        <section aria-label="Gespräch" className={`flex min-w-0 flex-1 flex-col ${selected ? "" : "max-md:hidden"}`}>
          {selected ? (
            <MessengerThread
              key={selected.id}
              name={selected.customer_name ?? "Unbekannt"}
              backHref={href({ c: "" })}
              messages={messages}
              totalCount={selected.message_count}
              status={<Label de={replyHint(selected.channel).de} vi={replyHint(selected.channel).vi} />}
              banner={
                <>
                  {selectedView && (
                    <div className="border-b border-line px-4 py-2">
                      <p className="m-0 text-[12px] text-faint">
                        <Label de={selectedView.state.de} vi={selectedView.state.vi} />
                      </p>
                      <p className="m-0 text-[14px] font-medium text-ink">
                        <Label de={selectedView.action.de} vi={selectedView.action.vi} />
                      </p>
                    </div>
                  )}
                  <LabelEditor
                    conversationId={selected.id}
                    formKey={`${selected.id}:${selectedLabel?.updated_at ?? "new"}`}
                    stage={selectedLabel?.stage ?? "unklar"}
                    interest={selectedLabel?.interest ?? ""}
                    level={selectedLabel?.level && selectedLabel.level !== "unklar" ? selectedLabel.level : "unklar"}
                    place={selectedLabel?.place && selectedLabel.place !== "unklar" ? selectedLabel.place : ""}
                    judgment={formJudgment(selectedLabel?.outcome)}
                    loss={selectedLabel?.loss_reason ?? "unklar"}
                    resume={selectedLabel?.resume_on?.slice(0, 10) ?? ""}
                    pinned={selectedLabel?.pinned ?? []}
                  />
                </>
              }
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-muted">
              <Icon name="chat" size={28} />
              <p className="m-0 text-[14px]">
                <Label de="Wähle links ein Gespräch." vi="Chọn một cuộc trò chuyện bên trái." />
              </p>
              <p className="m-0 max-w-[420px] text-[12.5px] text-faint">
                <Label
                  de="Nur lesen. Antworten bleiben in der Meta Business Suite, in WhatsApp Business oder im Zalo OA Manager. Neue Nachrichten erscheinen hier innerhalb von etwa einer Minute."
                  vi="Chỉ để đọc. Vẫn trả lời trong Meta Business Suite, WhatsApp Business hoặc Zalo OA Manager. Tin nhắn mới hiện ở đây trong khoảng một phút."
                />
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
