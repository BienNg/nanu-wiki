import { MessageComposer, type Outgoing } from "@/components/admin/MessageComposer";
import { enabled } from "@/lib/messenger/providers/meta";
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
type Params = { c?: string; q?: string; ch?: string };
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
  return null;
}

/** Read-only copy of Messenger and WhatsApp Business chats, with the next action for each chat. */
export default async function MessengerInboxPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const channel = sp.ch === "whatsapp" || sp.ch === "messenger" ? sp.ch : "";
  const q = (sp.q ?? "").trim().slice(0, 80);
  const now = Date.now();

  const supabase = await createClient();
  let list = supabase.from("messenger_inbox").select("*").order("updated_time", { ascending: false }).limit(LIST_LIMIT);
  if (channel) list = list.eq("channel", channel);
  if (q) list = list.ilike("customer_name", `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`);

  const [{ data: inboxRows, error: inboxErr }, { data: stateRows }] = await Promise.all([
    list,
    supabase.from("messenger_sync_state").select("page_id, last_run_at, last_error"),
  ]);
  if (inboxErr) throw new Error(inboxErr.message);

  const conversations = (inboxRows ?? []) as InboxRow[];
  const labelById = new Map<string, InboxLabel>();
  const factById = new Map<string, FactRow>();
  const viewById = new Map<string, ConversationView>();
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

  const selectedId = sp.c ?? null;
  let selected: { id: string; customer_name: string | null; message_count: number | null; channel: string | null; account_name: string | null } | null = null;
  let messages: ThreadMessage[] = [];
  let attempts: Outgoing[] = [];
  let lastInbound: string | null = null;
  if (selectedId) {
    const [{ data: conv }, { data: msgs }, { data: oneLabel, error: oneLabelErr }, { data: oneFact, error: oneFactErr }] = await Promise.all([
      supabase.from("messenger_conversations").select("id, customer_name, message_count, channel, account_name").eq("id", selectedId).maybeSingle(),
      supabase
        .from("messenger_messages")
        .select("id, text, from_page, from_name, attachments, created_time")
        .eq("conversation_id", selectedId)
        .order("created_time", { ascending: false })
        .limit(1000),
      supabase.from("messenger_labels").select(LABEL_COLUMNS).eq("conversation_id", selectedId).maybeSingle(),
      supabase.from("messenger_facts").select(FACT_COLUMNS).eq("id", selectedId).maybeSingle(),
    ]);
    if (oneLabelErr) throw new Error(oneLabelErr.message);
    if (oneFactErr) throw new Error(oneFactErr.message);
    const [outbox, inbound] = await Promise.all([
      supabase.from("messenger_outbox").select("*").eq("conversation_id", selectedId).order("created_at", { ascending: false }).limit(20),
      supabase.from("messenger_messages").select("created_time").eq("conversation_id", selectedId).eq("from_page", false).order("created_time", { ascending: false }).limit(1).maybeSingle(),
    ]);
    attempts = (outbox.data ?? []).reverse() as Outgoing[];
    lastInbound = inbound.data?.created_time ?? null;
    selected = conv;
    messages = (msgs ?? []).reverse() as ThreadMessage[];
    if (oneLabel) labelById.set(selectedId, oneLabel as InboxLabel);
    if (oneFact) factById.set(selectedId, oneFact as FactRow);
    const label = labelById.get(selectedId);
    const inboxRow = conversations.find((row) => row.id === selectedId);
    viewById.set(selectedId, conversationView(label ? toActionLabel(label) : undefined, toTiming(factById.get(selectedId), inboxRow), now));
  }

  const href = (patch: Partial<Params>) => {
    const next = { c: selectedId ?? "", ch: channel, q, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]);
    return `/admin/messenger${qs.size ? `?${qs}` : ""}`;
  };

  const states = (stateRows ?? []) as SyncState[];
  const pageState =
    states.find((s) => s.page_id === process.env.META_PAGE_ID) ??
    states.find((s) => !s.page_id.startsWith("wa:")) ??
    null;
  const syncError = pageState?.last_error ?? states.find((s) => s.last_error)?.last_error ?? null;
  const syncAgeMin = pageState?.last_run_at ? Math.round((Date.now() - new Date(pageState.last_run_at).getTime()) / 60_000) : null;
  const syncOk = !syncError && syncAgeMin !== null && syncAgeMin <= 5;
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
              {channel && <input type="hidden" name="ch" value={channel} />}
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Name suchen · Tìm tên"
                className="h-8 w-full rounded-full bg-[#F0F2F5] px-3.5 text-[13px] text-ink outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </form>
            <div className="flex flex-wrap gap-1.5 text-[12px]">
              {[
                { id: "", de: "Alle Kanäle", vi: "Mọi kênh" },
                { id: "messenger", de: "Messenger", vi: "Messenger" },
                { id: "whatsapp", de: "WhatsApp", vi: "WhatsApp" },
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
                          <span
                            className={`mt-1 max-w-full self-start truncate rounded-full px-2 py-0.5 text-[11.5px] font-medium ${
                              view.action.today ? "bg-accent-soft text-accent-dark" : "bg-chip text-muted"
                            }`}
                          >
                            <Label de={view.action.de} vi={view.action.vi} />
                          </span>
                        </>
                      )}
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

        <section aria-label="Gespräch" className={`flex min-w-0 flex-1 flex-col ${selected ? "" : "max-md:hidden"}`}>
          {selected ? (
            <MessengerThread
              conversationId={selected.id}
              key={selected.id}
              name={selected.customer_name ?? "Unbekannt"}
              backHref={href({ c: "" })}
              messages={messages}
              totalCount={selected.message_count}
              status={<span>{selected.channel} · {selected.account_name || "NaNu NaNa"}</span>}
              composer={<MessageComposer key="composer" conversation={selected.id} channel={selected.channel || "messenger"} enabled={enabled(selected.channel || "messenger")} lastInbound={lastInbound} attempts={attempts} />}
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
                  de="Facebook und WhatsApp lesen und beantworten."
                  vi="Đọc và trả lời Facebook, WhatsApp."
                />
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
