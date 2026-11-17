import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { FilterDetails } from "@/components/admin/FilterDetails";
import { InboxLive, SyncBadge } from "@/components/admin/InboxLive";
import { MessengerCrumb } from "@/components/admin/MessengerTabs";
import { FunnelNav, MessengerShell, MoreLink } from "@/components/admin/MessengerShell";
import { ClearLabelPatches, InboxCount, InboxEmpty, InboxMore, StatusCount, StepCount, TodoCount } from "@/components/admin/labelPatch";
import { InboxRow } from "@/components/admin/InboxRow";
import { ThreadPane } from "@/components/admin/ThreadPane";
import { conversationView, type ConversationView } from "@/lib/messenger/nextAction";
import { inboxPlace, inFunnelStep, interestKey, isOpen, labelChips, matchesInboxFilter, NO_INTEREST, ONE_ON_ONE, QUALIFY, STATUS_FILTERS, STATUSES, statusOf, stepKey, tabOf, type InboxPlace } from "@/lib/messenger/inboxPlace";
import { openFollowups } from "@/lib/messenger/followups";
import { FACT_COLUMNS, LABEL_COLUMNS, toActionLabel, toTiming, type FactRow, type InboxLabel } from "@/lib/messenger/thread";
import { INTERESTS } from "@/lib/assistant/schema";
import { FUNNEL_INTEREST, STEPS, STEP_INFO, type Step } from "@/lib/messenger/steps";
import { inboxVersion } from "@/lib/messenger/version";
import { isOfferState, rowClass, type RowClass } from "@/lib/messenger/classes";
import { assignableClasses } from "@/lib/notion";

export const metadata = { title: "Messenger" };

type InboxDbRow = {
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
type Params = { c?: string; q?: string; ch?: string; i?: string; s?: string; n?: string; t?: string };
/** Just enough of a conversation to count it and to put it in order. */
type ChatKey = { id: string; updated_time: string };

const TZ = "Asia/Ho_Chi_Minh";
/** Chats shown at first, and how many "Mehr laden" adds. Each one is rendered again whenever the list changes, so the list starts short. */
const LIST_STEP = 60;
const LIST_MAX = 300;
const ALL_LIMIT = 5000;
/** Rows per request when a whole table is read (the API returns at most 1000 at a time). */
const PAGE = 1000;
/** Up to this many chats, their labels are fetched by id; above it, reading the label table in pages needs fewer requests. */
const BY_ID_MAX = 240;
/**
 * Funnel steps per Interesse. Only Sprachkurs has its steps so far; the others get theirs later.
 * Qualifizieren is not in the list: those chats have no Interesse yet, so the funnel links it to the QUALIFY filter.
 */
const FUNNELS: Partial<Record<string, readonly Step[]>> = { [FUNNEL_INTEREST]: STEPS.filter((s) => s !== "qualifizieren") };

function shortTime(value: string) {
  const d = new Date(value);
  const day = (x: Date) => new Intl.DateTimeFormat("de-DE", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "2-digit" }).format(x);
  if (day(d) === day(new Date())) return new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(d);
  const sameYear = day(d).slice(-2) === day(new Date()).slice(-2);
  return sameYear ? day(d).slice(0, 6) : day(d);
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

/** Reads a whole result in pages of PAGE rows, one after the other, until a page comes back short. */
async function allPages<T>(load: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const rows: T[] = [];
  for (let from = 0; from < ALL_LIMIT; from += PAGE) {
    const { data, error } = await load(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if ((data?.length ?? 0) < PAGE) break;
  }
  return rows;
}

type Db = Awaited<ReturnType<typeof createClient>>;

/**
 * The classes each shown chat is assigned to, with their short code. Only classes that are still in
 * the Notion pool are listed (ended ones are hidden everywhere). Without Notion the rows show none.
 */
async function assignedClasses(supabase: Db, ids: string[]): Promise<Map<string, RowClass[]>> {
  const byChat = new Map<string, RowClass[]>();
  try {
    const [rows, pool] = await Promise.all([
      inChunks<{ conversation_id: string; class_id: string; created_at: string; offer_status: string }>(ids, (slice) =>
        supabase.from("messenger_class_assignments").select("conversation_id, class_id, created_at, offer_status").in("conversation_id", slice).order("created_at"),
      ),
      assignableClasses(),
    ]);
    const classById = new Map(pool.map((c) => [c.id, c]));
    for (const row of rows) {
      const c = classById.get(row.class_id);
      if (!c) continue;
      const list = byChat.get(row.conversation_id) ?? [];
      list.push(rowClass(c, isOfferState(row.offer_status) ? row.offer_status : "offen"));
      byChat.set(row.conversation_id, list);
    }
  } catch (err) {
    console.error("[messenger] assigned classes", err);
  }
  return byChat;
}
type IndexFilter = { channel: string; like: string; interest: string; step: string; steps: readonly Step[]; limit: number };
/** Counts for the menus and the funnel, plus the ids of the chats to show. `labels` only when they were read anyway. */
type InboxIndex = { source: "db" | "app"; interestCounts: Map<string, number>; stepCounts: Map<string, number>; qualify: number; statuses: Record<string, number>; total: number; ids: string[]; labels?: Map<string, InboxLabel> };

/**
 * One request: the database counts and picks (migrations 20261114090000_messenger_inbox_index and
 * 20261114170000_messenger_inbox_qualify). Returns null when the function is not there yet, is still
 * the older one (groups without `open` and `status`, or no `statuses` counts), or answers with something unexpected.
 */
async function indexFromDb(supabase: Db, f: IndexFilter, funnelSteps: readonly Step[]): Promise<InboxIndex | null> {
  const stepNo = Number(f.step);
  const { data, error } = await supabase.rpc("messenger_inbox_index", {
    p_channel: f.channel || null,
    p_name: f.like || null,
    p_interest: f.interest || null,
    p_stage: f.step && f.step !== "unklar" ? f.steps[stepNo - 1] : null,
    p_not_stages: f.step === "unklar" ? [...f.steps] : null,
    p_limit: f.limit,
  });
  const found = data as { groups?: { interest: string; stage: string | null; open?: boolean; status?: string; n: number }[]; total?: number; ids?: string[]; statuses?: Record<string, number> } | null;
  if (error || !found || !Array.isArray(found.groups) || !Array.isArray(found.ids) || typeof found.total !== "number") return null;
  if (found.groups.some((g) => typeof g.open !== "boolean" || typeof g.status !== "string") || !found.statuses || typeof found.statuses.auto !== "number") return null;

  const interestCounts = new Map<string, number>();
  const stepCounts = new Map<string, number>();
  let qualify = 0;
  for (const g of found.groups) {
    interestCounts.set(g.interest, (interestCounts.get(g.interest) ?? 0) + g.n);
    if (g.interest === NO_INTEREST && g.open) qualify += g.n;
    if (g.interest === FUNNEL_INTEREST && inFunnelStep(g.status as InboxPlace["status"])) {
      const at = funnelSteps.indexOf(g.stage as Step);
      const step = at >= 0 ? String(at + 1) : "unklar";
      stepCounts.set(step, (stepCounts.get(step) ?? 0) + g.n);
    }
  }
  return { source: "db", interestCounts, stepCounts, qualify, statuses: found.statuses, total: found.total, ids: found.ids };
}

/** The same result without the database function: read ids and labels, count here. */
async function indexFromRows(supabase: Db, f: IndexFilter, funnelSteps: readonly Step[]): Promise<InboxIndex> {
  // Every chat that matches Kanal + Name, but only id and time: enough to count and to sort.
  const everyChat = await allPages<ChatKey>((from, to) => {
    let keys = supabase.from("messenger_conversations").select("id, updated_time").order("updated_time", { ascending: false }).order("id");
    if (f.channel) keys = keys.eq("channel", f.channel);
    if (f.like) keys = keys.ilike("customer_name", f.like);
    return keys.range(from, to);
  });

  // Their labels: by id for a short list, otherwise the label table in a few big pages.
  const labels = new Map<string, InboxLabel>();
  const labelRows =
    everyChat.length <= BY_ID_MAX
      ? await inChunks<InboxLabel>(everyChat.map((c) => c.id), (slice) => supabase.from("messenger_labels").select(LABEL_COLUMNS).in("conversation_id", slice))
      : await allPages<InboxLabel>((from, to) => supabase.from("messenger_labels").select(LABEL_COLUMNS).order("conversation_id").range(from, to));
  for (const row of labelRows) labels.set(row.conversation_id, row);

  const interestCounts = new Map<string, number>();
  const stepCounts = new Map<string, number>();
  let qualify = 0;
  const statuses: Record<string, number> = {};
  for (const c of everyChat) {
    const label = labels.get(c.id);
    const key = interestKey(label);
    interestCounts.set(key, (interestCounts.get(key) ?? 0) + 1);
    const status = statusOf(label);
    if (key !== ONE_ON_ONE) statuses[status] = (statuses[status] ?? 0) + 1;
    if (key === NO_INTEREST && isOpen(label)) qualify++;
    if (key === FUNNEL_INTEREST && inFunnelStep(status)) {
      const step = stepKey(labels.get(c.id));
      stepCounts.set(step, (stepCounts.get(step) ?? 0) + 1);
    }
  }
  const matching = everyChat.filter((c) => matchesInboxFilter(inboxPlace(labels.get(c.id), false), f.interest, f.step, "alle", !!f.like));
  return { source: "app", interestCounts, stepCounts, qualify, statuses, total: matching.length, ids: matching.slice(0, f.limit).map((c) => c.id), labels };
}

/** Every chat (Kanal + Name), with its label and its next action. "Zu tun" and its counts need all of them. */
type ChatStates = { chats: ChatKey[]; labels: Map<string, InboxLabel>; views: Map<string, ConversationView> };

async function chatStates(supabase: Db, f: Pick<IndexFilter, "channel" | "like">, now: number): Promise<ChatStates> {
  const [chats, labelRows, factRows, followups] = await Promise.all([
    allPages<ChatKey>((from, to) => {
      let keys = supabase.from("messenger_conversations").select("id, updated_time").order("updated_time", { ascending: false }).order("id");
      if (f.channel) keys = keys.eq("channel", f.channel);
      if (f.like) keys = keys.ilike("customer_name", f.like);
      return keys.range(from, to);
    }),
    allPages<InboxLabel>((from, to) => supabase.from("messenger_labels").select(LABEL_COLUMNS).order("conversation_id").range(from, to)),
    allPages<FactRow>((from, to) => supabase.from("messenger_facts").select(FACT_COLUMNS).order("id").range(from, to)),
    openFollowups(supabase),
  ]);
  const labels = new Map(labelRows.map((row) => [row.conversation_id, row]));
  const facts = new Map(factRows.map((row) => [row.id, row]));
  const views = new Map<string, ConversationView>();
  for (const c of chats) {
    const label = labels.get(c.id);
    const fact = facts.get(c.id);
    views.set(c.id, conversationView(label ? toActionLabel(label) : undefined, toTiming(fact, fact?.last_from_page), now, followups.get(c.id) ?? null));
  }
  return { chats, labels, views };
}

/**
 * "Zu tun": only chats with something to do now (action.today), counted like the full list.
 * Most urgent first (action rank: Zahlung, Preis, Kurse, Antworten, Follow-ups), then whoever has waited longest.
 */
function indexTodo(states: ChatStates, f: IndexFilter): InboxIndex {
  const { labels, views } = states;
  const todo = states.chats.filter((c) => views.get(c.id)?.action.today);
  const interestCounts = new Map<string, number>();
  const stepCounts = new Map<string, number>();
  let qualify = 0;
  const statuses: Record<string, number> = {};
  for (const c of todo) {
    const label = labels.get(c.id);
    const key = interestKey(label);
    interestCounts.set(key, (interestCounts.get(key) ?? 0) + 1);
    const status = statusOf(label);
    if (key !== ONE_ON_ONE) statuses[status] = (statuses[status] ?? 0) + 1;
    if (key === NO_INTEREST && isOpen(label)) qualify++;
    if (key === FUNNEL_INTEREST && inFunnelStep(status)) {
      const step = stepKey(label);
      stepCounts.set(step, (stepCounts.get(step) ?? 0) + 1);
    }
  }
  const matching = todo
    .filter((c) => matchesInboxFilter(inboxPlace(labels.get(c.id), true), f.interest, f.step, "alle", !!f.like))
    .map((c) => ({ c, view: views.get(c.id)! }))
    .sort(byUrgency);
  return { source: "app", interestCounts, stepCounts, qualify, statuses, total: matching.length, ids: matching.slice(0, f.limit).map((m) => m.c.id), labels };
}

/** Most urgent first (action rank), then whoever has waited longest, then the newest chat. */
function byUrgency(a: { c: ChatKey; view: ConversationView }, b: { c: ChatKey; view: ConversationView }) {
  return a.view.action.rank - b.view.action.rank || (a.view.since ?? "9").localeCompare(b.view.since ?? "9") || b.c.updated_time.localeCompare(a.c.updated_time);
}

/**
 * The 1-1 list: every 1-1 chat whatever its status or tab. Those with something to do now come first
 * (most urgent first, as under "Zu tun"), then the rest, newest first.
 */
function oneOnOneList(states: ChatStates) {
  const all = states.chats.filter((c) => interestKey(states.labels.get(c.id)) === ONE_ON_ONE).map((c) => ({ c, view: states.views.get(c.id)! }));
  const now = all.filter((m) => m.view.action.today).sort(byUrgency);
  const rest = all.filter((m) => !m.view.action.today);
  return [...now, ...rest].map((m) => m.c.id);
}

type MenuOption = { id: string; de: string; vi: string; href: string; count?: number };

/** A pill that opens a list of choices (plain <details>, so it works without JS). Shows the chosen value with × to clear it. */
function FilterMenu({ label, current, options, clearHref }: { label: { de: string; vi: string }; current: string; options: MenuOption[]; clearHref: string }) {
  const chosen = options.find((o) => o.id === current);
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
              <Label de={chosen.de} vi={chosen.vi} />
            </>
          ) : (
            <Label de={label.de} vi={label.vi} />
          )}
          <span className="rotate-90 transition-transform duration-200 group-open:-rotate-90">
            <Icon name="chevron" size={11} />
          </span>
        </summary>
        <div className="menu-pop absolute right-0 z-30 mt-1.5 w-60 origin-top-right rounded-xl border border-black/[0.06] bg-white/85 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)] backdrop-blur-xl max-md:left-0 max-md:right-auto max-md:origin-top-left">
          {options.map((o) => (
            <Link
              key={o.id}
              href={o.href}
              data-filter=""
              aria-current={o.id === current ? "page" : undefined}
              className="group/item flex items-center gap-1.5 rounded-[7px] px-1.5 py-[5px] text-[13px] text-ink hover:bg-accent hover:text-white"
            >
              <svg aria-hidden="true" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={`flex-none ${o.id === current ? "" : "invisible"}`}>
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              <span className="min-w-0 flex-1 truncate">
                <Label de={o.de} vi={o.vi} />
              </span>
              {o.count !== undefined && (
                <span className="tabular-nums text-[12px] text-faint group-hover/item:text-white/80">
                  <InboxCount id={o.id} count={o.count} />
                </span>
              )}
            </Link>
          ))}
        </div>
      </FilterDetails>
      {chosen && (
        <Link
          href={clearHref}
          data-filter=""
          aria-label={`${label.de} zurücksetzen`}
          className="flex h-8 items-center rounded-r-full border border-l-0 border-accent-soft bg-accent-soft pl-1.5 pr-2.5 text-accent-dark/70 transition-colors duration-150 hover:bg-[#cddcf7] hover:text-accent-dark"
        >
          <Icon name="close" size={12} strokeWidth={2.2} />
        </Link>
      )}
    </div>
  );
}

/** "Zu tun" is empty: nothing waits for us. With a search or filter, the chat may just have nothing to do: link to "Alle". */
function TodoEmpty({ allHref, searching }: { allHref: string; searching: boolean }) {
  return (
    <li className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E7F6EC] text-[#1E8E3E]">
        <Icon name="tick" size={20} strokeWidth={2.6} />
      </span>
      <span className="text-[14px] font-medium text-ink">
        {searching ? <Label de="Hier gibt es gerade nichts zu tun." vi="Ở đây hiện không có việc cần làm." /> : <Label de="Alles erledigt." vi="Đã xong hết." />}
      </span>
      <span className="max-w-[260px] text-[12.5px] text-muted">
        <Label de="Neue Nachrichten und fällige Follow-ups erscheinen hier." vi="Tin nhắn mới và các lần nhắc lại đến hạn sẽ hiện ở đây." />
      </span>
      <Link href={allHref} scroll={false} data-filter="" className="mt-1 text-[12.5px] font-medium text-accent hover:underline">
        <Label de="Alle Gespräche ansehen" vi="Xem tất cả cuộc trò chuyện" />
      </Link>
    </li>
  );
}

/** Read-only copy of Messenger and WhatsApp Business chats, with the next action for each chat. */
export default async function MessengerInboxPage({ searchParams }: { searchParams: Promise<Params> }) {
  const supabase = await createClient();
  // The version is read while the session is checked, and so before the list (see inboxVersion): never newer than what is shown.
  const [version] = await Promise.all([inboxVersion(supabase), requireRole("admin")]);
  const sp = await searchParams;
  const channel = sp.ch === "whatsapp" || sp.ch === "messenger" ? sp.ch : "";
  const q = (sp.q ?? "").trim().slice(0, 80);
  const interestFilter = sp.i === NO_INTEREST || sp.i === QUALIFY || sp.i === ONE_ON_ONE || (STATUS_FILTERS as readonly string[]).includes(sp.i ?? "") || (INTERESTS as readonly string[]).includes(sp.i ?? "") ? (sp.i as string) : "";
  const funnel = FUNNELS[interestFilter];
  const stepFilter = funnel && sp.s && Number(sp.s) >= 1 && Number(sp.s) <= funnel.length ? sp.s : "";
  const tab = tabOf(sp.t);
  const limit = Math.min(LIST_MAX, Math.max(LIST_STEP, Math.ceil((Number(sp.n) || 0) / LIST_STEP) * LIST_STEP));
  const now = Date.now();

  const like = q ? `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%` : "";

  const funnelSteps = FUNNELS[FUNNEL_INTEREST]!;
  const filter: IndexFilter = { channel, like, interest: interestFilter, step: funnel ? stepFilter : "", steps: funnel ?? [], limit };
  // Every chat's next action, for "Zu tun" and its count. "Alle" is counted and picked in the database
  // (the app-side way only runs until that migration is applied).
  const [states, dbIndex] = await Promise.all([
    chatStates(supabase, filter, now),
    tab === "alle" ? indexFromDb(supabase, filter, funnelSteps) : null,
  ]);
  const index = tab === "zu_tun" ? indexTodo(states, filter) : (dbIndex ?? (await indexFromRows(supabase, filter, funnelSteps)));
  // 1-1 chats are counted only under 1-1 (that list ignores the tab), or with the rest while a name is searched.
  const oneOnOneIds = oneOnOneList(states);
  const oneOnOneView = interestFilter === ONE_ON_ONE;
  const { interestCounts, stepCounts, qualify, statuses } = index;
  const total = oneOnOneView ? oneOnOneIds.length : index.total;
  const shownIds = oneOnOneView ? oneOnOneIds.slice(0, limit) : index.ids;
  interestCounts.set(ONE_ON_ONE, oneOnOneIds.length);
  const hidden = new Set(q ? [] : oneOnOneIds);
  let todoCount = 0;
  for (const [id, view] of states.views) if (view.action.today && !hidden.has(id)) todoCount++;
  const allCount = states.chats.length - hidden.size;

  // Full rows (newest message) and classes only for the chats that are shown.
  const [inboxRows, classesById] = await Promise.all([
    inChunks<InboxDbRow>(shownIds, (slice) => supabase.from("messenger_inbox").select("*").in("id", slice)),
    assignedClasses(supabase, shownIds),
  ]);
  const labelById = states.labels;
  const inboxById = new Map(inboxRows.map((row) => [row.id, row]));
  const conversations = shownIds.map((id) => inboxById.get(id)).filter((row): row is InboxDbRow => !!row);
  const viewById = states.views;

  const schuelerKey = String(funnelSteps.indexOf("schueler") + 1);
  const schuelerOn = interestFilter === FUNNEL_INTEREST && stepFilter === schuelerKey;
  const statusId = schuelerOn ? "schueler" : (STATUS_FILTERS as readonly string[]).includes(interestFilter) ? interestFilter : "";
  const statusOn = STATUSES.find((s) => s.id === statusId);

  const href = (patch: Partial<Params>) => {
    const next = { t: tab === "alle" ? "alle" : "", ch: channel, i: interestFilter, s: stepFilter, q, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]);
    return `/admin/messenger${qs.size ? `?${qs}` : ""}`;
  };

  return (
    <>
      <InboxLive version={version.inbox} stamp={now} />
      <ClearLabelPatches stamp={now} />
      <Topbar>
        <MessengerCrumb current="inbox" />
      </Topbar>
      <MessengerShell stamp={now} className="flex h-[calc(100dvh-48px)] w-full flex-col border-t border-line max-md:h-[calc(100dvh-96px)]">
        <header className="flex flex-none flex-col gap-3 border-b border-line px-4 pb-3 pt-3 max-md:group-data-[chat=open]/shell:hidden">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2.5">
              <h1 className="title-display m-0 text-[22px] leading-tight tracking-tight">
                <Label de="Posteingang" vi="Hộp thư" />
              </h1>
              <SyncBadge at={version.syncAt} error={version.syncError} now={now} />
            </div>
            {/* What needs doing now (the default) or every chat. Filters and steps stay when switching. The 1-1 list has no tabs. */}
            {!oneOnOneView && (
            <nav aria-label="Liste" className="flex h-8 items-center rounded-full bg-[#F0F2F5] p-0.5">
              {(
                [
                  { id: "zu_tun", de: "Zu tun", vi: "Cần làm", count: <TodoCount count={todoCount} />, href: href({ t: "", c: "" }) },
                  { id: "alle", de: "Alle", vi: "Tất cả", count: allCount, href: href({ t: "alle", c: "" }) },
                ] as const
              ).map((o) => (
                <Link
                  key={o.id}
                  href={o.href}
                  scroll={false}
                  data-filter=""
                  aria-current={tab === o.id ? "page" : undefined}
                  className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium transition-colors duration-150 ${
                    tab === o.id ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-muted hover:text-ink"
                  }`}
                >
                  <Label de={o.de} vi={o.vi} />
                  <span className={`tabular-nums text-[12px] ${tab === o.id && o.id === "zu_tun" ? "font-semibold text-accent-dark" : "text-faint"}`}>{o.count}</span>
                </Link>
              ))}
            </nav>
            )}
            <div className="ml-auto flex flex-wrap items-center gap-2 max-md:ml-0 max-md:w-full">
              <form action="/admin/messenger" data-inbox-search="" className="relative flex max-md:w-full">
                <Icon name="search" size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
                {tab === "alle" && <input type="hidden" name="t" value="alle" />}
                {channel && <input type="hidden" name="ch" value={channel} />}
                {interestFilter && <input type="hidden" name="i" value={interestFilter} />}
                {stepFilter && <input type="hidden" name="s" value={stepFilter} />}
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Name suchen · Tìm tên"
                  className="h-8 w-60 rounded-full border border-transparent bg-[#F0F2F5] pl-8 pr-3.5 text-[13px] text-ink outline-none transition-[box-shadow,background-color,border-color] duration-150 placeholder:text-faint hover:bg-[#E9ECF0] focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent-soft max-md:w-full"
                />
              </form>
              <span aria-hidden="true" className="mx-1 h-5 w-px bg-line max-md:hidden" />
              <FilterMenu
                label={{ de: "Interesse", vi: "Nhu cầu" }}
                current={interestFilter}
                clearHref={href({ i: "", s: "", c: "" })}
                options={[
                  ...INTERESTS.flatMap((id) => (id === FUNNEL_INTEREST ? [{ id, de: id, vi: id }, { id: ONE_ON_ONE, de: "1-1", vi: "Kèm 1-1" }] : [{ id, de: id, vi: id }])),
                  { id: NO_INTEREST, de: "Ohne Interesse", vi: "Chưa rõ nhu cầu" },
                ].map((o) => ({ ...o, count: interestCounts.get(o.id) ?? 0, href: href({ i: o.id, s: "", c: "" }) }))}
              />
              <FilterMenu
                label={{ de: "Kanal", vi: "Kênh" }}
                current={channel}
                clearHref={href({ ch: "", c: "" })}
                options={[
                  { id: "messenger", de: "Messenger", vi: "Messenger" },
                  { id: "whatsapp", de: "WhatsApp", vi: "WhatsApp" },
                ].map((o) => ({ ...o, href: href({ ch: o.id, c: "" }) }))}
              />
              <div className="flex items-center">
                <FilterDetails className="group relative">
                  <summary
                    className={`flex h-8 cursor-pointer list-none items-center gap-1.5 border px-3 text-[12.5px] font-medium transition-colors duration-150 [&::-webkit-details-marker]:hidden ${
                      statusOn ? "rounded-l-full border-accent-soft bg-accent-soft text-accent-dark" : "rounded-full border-line bg-white text-ink hover:border-[#d5d8dd] hover:bg-hover"
                    }`}
                  >
                    {statusOn ? (
                      <>
                        <span className="font-normal text-accent-dark/65">
                          <Label de="Status" vi="Trạng thái" />
                        </span>
                        <Label de={statusOn.de} vi={statusOn.vi} />
                      </>
                    ) : (
                      <Label de="Status" vi="Trạng thái" />
                    )}
                    {statusOn && (
                      <span className="tabular-nums text-[12px] text-faint">
                        {statusOn.id === "schueler" ? <StepCount id={schuelerKey} count={stepCounts.get(schuelerKey) ?? 0} /> : <StatusCount id={statusOn.id} count={statuses[statusOn.id] ?? 0} />}
                      </span>
                    )}
                    <span className="rotate-90 transition-transform duration-200 group-open:-rotate-90">
                      <Icon name="chevron" size={11} />
                    </span>
                  </summary>
                  <div className="menu-pop absolute right-0 z-30 mt-1.5 w-56 origin-top-right rounded-xl border border-black/[0.06] bg-white/85 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)] backdrop-blur-xl max-md:left-0 max-md:right-auto max-md:origin-top-left">
                    {STATUSES.map((o) => {
                      const on = o.id === statusId;
                      const hrefFor = o.id === "schueler" ? href({ i: FUNNEL_INTEREST, s: schuelerKey, c: "" }) : href({ i: o.id, s: "", c: "" });
                      const count = o.id === "schueler" ? <StepCount id={schuelerKey} count={stepCounts.get(schuelerKey) ?? 0} /> : <StatusCount id={o.id} count={statuses[o.id] ?? 0} />;
                      return (
                        <Link
                          key={o.id}
                          href={hrefFor}
                          data-filter=""
                          aria-current={on ? "page" : undefined}
                          className="group/item flex items-center gap-1.5 rounded-[7px] px-1.5 py-[5px] text-[13px] text-ink hover:bg-accent hover:text-white"
                        >
                          <svg aria-hidden="true" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={`flex-none ${on ? "" : "invisible"}`}>
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                          <span className="min-w-0 flex-1 truncate">
                            <Label de={o.de} vi={o.vi} />
                          </span>
                          <span className="tabular-nums text-[12px] text-faint group-hover/item:text-white/80">{count}</span>
                        </Link>
                      );
                    })}
                  </div>
                </FilterDetails>
                {statusOn && (
                  <Link
                    href={href({ i: FUNNEL_INTEREST, s: "", c: "" })}
                    data-filter=""
                    aria-label="Status zurücksetzen"
                    className="flex h-8 items-center rounded-r-full border border-l-0 border-accent-soft bg-accent-soft pl-1.5 pr-2.5 text-accent-dark/70 transition-colors duration-150 hover:bg-[#cddcf7] hover:text-accent-dark"
                  >
                    <Icon name="close" size={12} strokeWidth={2.2} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {!interestFilter || interestFilter === FUNNEL_INTEREST || interestFilter === QUALIFY || (STATUS_FILTERS as readonly string[]).includes(interestFilter) ? (
            <nav aria-label={`Schritte ${FUNNEL_INTEREST}`} className="flex items-stretch gap-2">
              <FunnelNav
                stamp={now}
                current={interestFilter === FUNNEL_INTEREST ? stepFilter : interestFilter === QUALIFY ? "q" : null}
                steps={[
                  { id: "", de: "Alle", vi: "Tất cả", aim_de: `Alle Chats mit Interesse ${FUNNEL_INTEREST}`, count: interestCounts.get(FUNNEL_INTEREST) ?? 0 },
                  { id: "q", de: STEP_INFO.qualifizieren.short_de, vi: STEP_INFO.qualifizieren.short_vi, aim_de: STEP_INFO.qualifizieren.aim_de, aim_vi: STEP_INFO.qualifizieren.aim_vi, count: qualify },
                  ...funnelSteps.flatMap((stage, i) =>
                    stage === "schueler" ? [] : [{ id: String(i + 1), de: STEP_INFO[stage].short_de, vi: STEP_INFO[stage].short_vi, aim_de: STEP_INFO[stage].aim_de, aim_vi: STEP_INFO[stage].aim_vi, count: stepCounts.get(String(i + 1)) ?? 0 }],
                  ),
                ].map((step) => ({ ...step, href: step.id === "q" ? href({ i: QUALIFY, s: "", c: "" }) : href({ i: FUNNEL_INTEREST, s: step.id, c: "" }) }))}
              />
            </nav>
          ) : (
            <p className="m-0 text-[12px] text-faint">
              {interestFilter === NO_INTEREST ? (
                <Label de="Diese Gespräche haben noch kein Interesse." vi="Các cuộc này chưa có nhu cầu." />
              ) : oneOnOneView ? (
                <Label de="Alle Chats, die 1-1 wollen, mit jedem Status. Was jetzt zu tun ist, steht oben." vi="Tất cả khách muốn học kèm 1-1, mọi trạng thái. Việc cần làm ngay nằm trên cùng." />
              ) : (
                <Label de={`Die Schritte für ${interestFilter} legen wir noch fest.`} vi={`Các bước cho ${interestFilter} sẽ có sau.`} />
              )}
            </p>
          )}
        </header>

      <main className="flex min-h-0 w-full flex-1">
        <section aria-label="Gespräche" data-index={index.source} className="flex w-[340px] flex-none flex-col border-r border-line max-md:w-full max-md:group-data-[chat=open]/shell:hidden">
          {/* While a filter loads, the old list stays and dims under a thin progress line; the new one fades in. */}
          <div aria-hidden="true" className="load-bar invisible h-0.5 flex-none group-data-[busy=true]/shell:visible" />
          <ul
            key={`${tab}|${channel}|${interestFilter}|${stepFilter}|${q}`}
            className="anim-fade m-0 min-h-0 flex-1 list-none overflow-y-auto p-1.5 transition-opacity duration-200 group-data-[busy=true]/shell:pointer-events-none group-data-[busy=true]/shell:opacity-40"
          >
            {conversations.length === 0 &&
              (tab === "zu_tun" && !oneOnOneView ? (
                <TodoEmpty allHref={href({ t: "alle", c: "" })} searching={!!q || !!channel || !!interestFilter} />
              ) : (
                <li className="px-3 py-8 text-center text-[13px] text-muted">
                  <Label de="Keine Gespräche gefunden." vi="Không tìm thấy cuộc trò chuyện." />
                </li>
              ))}
            <InboxEmpty shown={conversations.length} listedIds={conversations.map((c) => c.id)} empty={tab === "zu_tun" && !oneOnOneView ? <TodoEmpty allHref={href({ t: "alle", c: "" })} searching={!!q || !!channel || !!interestFilter} /> : undefined} />
            {conversations.map((c) => {
              const label = labelById.get(c.id);
              return (
                <InboxRow
                  key={c.id}
                  row={{
                    id: c.id,
                    href: href({ c: c.id, n: limit > LIST_STEP ? String(limit) : "" }),
                    name: c.customer_name ?? "Unbekannt",
                    time: shortTime(c.last_time ?? c.updated_time),
                    preview: c.last_text ?? (c.last_has_attachment ? "📎 Anhang" : ""),
                    fromPage: !!c.last_from_page,
                    unanswered: c.last_from_page === false,
                    channel: c.channel ?? null,
                    account: c.account_name ?? null,
                    chips: labelChips(label),
                    view: viewById.get(c.id) ?? null,
                    classes: classesById.get(c.id) ?? [],
                    place: inboxPlace(label, !!viewById.get(c.id)?.action.today),
                  }}
                />
              );
            })}
            {total > conversations.length && limit < LIST_MAX && (
              <li className="px-3 py-2 text-center">
                <MoreLink
                  href={href({ n: String(limit + LIST_STEP) })}
                  className="inline-flex h-8 items-center rounded-full border border-line px-3.5 text-[12.5px] font-medium text-body transition-colors duration-150 hover:bg-hover"
                >
                  <InboxMore shown={conversations.length} total={total} listedIds={conversations.map((c) => c.id)} />
                </MoreLink>
              </li>
            )}
            {total > conversations.length && limit >= LIST_MAX && (
              <li className="px-3 py-3 text-center text-[12px] text-faint">
                <Label de={`Die neuesten ${LIST_MAX} – zum Finden älterer Gespräche den Namen suchen.`} vi={`${LIST_MAX} cuộc mới nhất – tìm theo tên để thấy cuộc cũ hơn.`} />
              </li>
            )}
          </ul>
        </section>

        <section aria-label="Gespräch" className="flex min-w-0 flex-1 flex-col max-md:group-data-[chat=none]/shell:hidden">
          <ThreadPane />
        </section>
      </main>
      </MessengerShell>
    </>
  );
}
