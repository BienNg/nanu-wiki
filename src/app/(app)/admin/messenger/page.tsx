import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { initials } from "@/lib/format";
import { ActionChip } from "@/components/admin/ActionChip";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { FilterDetails } from "@/components/admin/FilterDetails";
import { ChatLink, FunnelNav, MessengerShell } from "@/components/admin/MessengerShell";
import { ThreadPane } from "@/components/admin/ThreadPane";
import { conversationView, type ConversationView } from "@/lib/messenger/nextAction";
import { FACT_COLUMNS, LABEL_COLUMNS, toActionLabel, toTiming, type FactRow, type InboxLabel } from "@/lib/messenger/thread";
import { INTERESTS, STAGES, STAGE_INFO, type Stage } from "@/lib/assistant/schema";

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
type Params = { c?: string; q?: string; ch?: string; i?: string; s?: string };
type SyncState = { page_id: string; last_run_at: string | null; last_error: string | null };
/** Just enough of a conversation to count it and to put it in order. */
type ChatKey = { id: string; updated_time: string };

const TZ = "Asia/Ho_Chi_Minh";
const LIST_LIMIT = 200;
const ALL_LIMIT = 5000;
/** Rows per request when a whole table is read (the API returns at most 1000 at a time). */
const PAGE = 1000;
/** Up to this many chats, their labels are fetched by id; above it, reading the label table in pages needs fewer requests. */
const BY_ID_MAX = 240;
const NO_INTEREST = "ohne";

/** Funnel steps per Interesse. Only Sprachkurs has its steps so far; the others get theirs later. */
const FUNNELS: Partial<Record<string, readonly Stage[]>> = { Sprachkurs: STAGES };
const FUNNEL_INTEREST = "Sprachkurs";

function interestKey(label: InboxLabel | undefined) {
  const v = label?.interest;
  return v && v !== "unklar" && v !== "keins" ? v : NO_INTEREST;
}

/** "1".."6" for a known step of the interest's funnel, otherwise "unklar". */
function stepKey(label: InboxLabel | undefined, steps: readonly Stage[]) {
  const i = label ? steps.indexOf(label.stage as Stage) : -1;
  return i >= 0 ? String(i + 1) : "unklar";
}

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
type IndexFilter = { channel: string; like: string; interest: string; step: string; steps: readonly Stage[] };
/** Counts for the menus and the funnel, plus the ids of the chats to show. `labels` only when they were read anyway. */
type InboxIndex = { source: "db" | "app"; interestCounts: Map<string, number>; stepCounts: Map<string, number>; total: number; ids: string[]; labels?: Map<string, InboxLabel> };

/**
 * One request: the database counts and picks (migration 20261114090000_messenger_inbox_index).
 * Returns null when the function is not there yet or answers with something unexpected.
 */
async function indexFromDb(supabase: Db, f: IndexFilter, funnelSteps: readonly Stage[]): Promise<InboxIndex | null> {
  const stepNo = Number(f.step);
  const { data, error } = await supabase.rpc("messenger_inbox_index", {
    p_channel: f.channel || null,
    p_name: f.like || null,
    p_interest: f.interest || null,
    p_stage: f.step && f.step !== "unklar" ? f.steps[stepNo - 1] : null,
    p_not_stages: f.step === "unklar" ? [...f.steps] : null,
    p_limit: LIST_LIMIT,
  });
  const found = data as { groups?: { interest: string; stage: string | null; n: number }[]; total?: number; ids?: string[] } | null;
  if (error || !found || !Array.isArray(found.groups) || !Array.isArray(found.ids) || typeof found.total !== "number") return null;

  const interestCounts = new Map<string, number>();
  const stepCounts = new Map<string, number>();
  for (const g of found.groups) {
    interestCounts.set(g.interest, (interestCounts.get(g.interest) ?? 0) + g.n);
    if (g.interest === FUNNEL_INTEREST) {
      const at = funnelSteps.indexOf(g.stage as Stage);
      const step = at >= 0 ? String(at + 1) : "unklar";
      stepCounts.set(step, (stepCounts.get(step) ?? 0) + g.n);
    }
  }
  return { source: "db", interestCounts, stepCounts, total: found.total, ids: found.ids };
}

/** The same result without the database function: read ids and labels, count here. */
async function indexFromRows(supabase: Db, f: IndexFilter, funnelSteps: readonly Stage[]): Promise<InboxIndex> {
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
  for (const c of everyChat) {
    const key = interestKey(labels.get(c.id));
    interestCounts.set(key, (interestCounts.get(key) ?? 0) + 1);
    if (key === FUNNEL_INTEREST) {
      const step = stepKey(labels.get(c.id), funnelSteps);
      stepCounts.set(step, (stepCounts.get(step) ?? 0) + 1);
    }
  }
  const matching = everyChat.filter((c) => {
    const label = labels.get(c.id);
    if (f.interest && interestKey(label) !== f.interest) return false;
    if (f.step && stepKey(label, f.steps) !== f.step) return false;
    return true;
  });
  return { source: "app", interestCounts, stepCounts, total: matching.length, ids: matching.slice(0, LIST_LIMIT).map((c) => c.id), labels };
}

/** WhatsApp or Messenger logo on the bottom-right of a chat's avatar, as in the Messenger app. */
function ChannelBadge({ channel, account }: { channel: string | null | undefined; account: string | null | undefined }) {
  const whatsapp = channel === "whatsapp";
  const name = whatsapp ? "WhatsApp" : "Messenger";
  return (
    <span
      title={account ? `${name} · ${account}` : name}
      className={`absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white ${
        whatsapp ? "bg-[#25D366]" : "bg-[#0866FF]"
      }`}
    >
      <svg viewBox="0 0 24 24" width={whatsapp ? 10 : 9} height={whatsapp ? 10 : 9} fill="#fff" aria-label={name} role="img">
        {whatsapp ? (
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        ) : (
          <path d="M.001 11.639C.001 4.949 5.241 0 12.001 0S24 4.95 24 11.639c0 6.689-5.24 11.638-12 11.638-1.21 0-2.38-.16-3.47-.46a.96.96 0 00-.64.05l-2.39 1.05a.96.96 0 01-1.35-.85l-.07-2.14a.97.97 0 00-.32-.68A11.39 11.389 0 01.002 11.64zm8.32-2.19l-3.52 5.6c-.35.53.32 1.139.82.75l3.79-2.87c.26-.2.6-.2.87 0l2.8 2.1c.84.63 2.04.4 2.6-.48l3.52-5.6c.35-.53-.32-1.13-.82-.75l-3.79 2.87c-.25.2-.6.2-.86 0l-2.8-2.1a1.8 1.8 0 00-2.61.48z" />
        )}
      </svg>
    </span>
  );
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
            chosen ? "rounded-l-full border-accent-soft bg-accent-soft text-accent-dark" : "rounded-full border-line text-body hover:bg-hover"
          }`}
        >
          {chosen ? <Label de={chosen.de} vi={chosen.vi} /> : <Label de={label.de} vi={label.vi} />}
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
              {o.count !== undefined && <span className="tabular-nums text-[12px] text-faint group-hover/item:text-white/80">{o.count}</span>}
            </Link>
          ))}
        </div>
      </FilterDetails>
      {chosen && (
        <Link
          href={clearHref}
          data-filter=""
          aria-label={`${label.de} zurücksetzen`}
          className="flex h-8 items-center rounded-r-full border border-l-0 border-accent-soft bg-accent-soft pl-1 pr-2.5 text-[13px] text-accent-dark transition-colors duration-150 hover:bg-[#d9e6ff]"
        >
          ×
        </Link>
      )}
    </div>
  );
}

/** Read-only copy of Messenger and WhatsApp Business chats, with the next action for each chat. */
export default async function MessengerInboxPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const channel = sp.ch === "whatsapp" || sp.ch === "messenger" ? sp.ch : "";
  const q = (sp.q ?? "").trim().slice(0, 80);
  const interestFilter = sp.i === NO_INTEREST || (INTERESTS as readonly string[]).includes(sp.i ?? "") ? (sp.i as string) : "";
  const funnel = FUNNELS[interestFilter];
  const stepFilter = funnel && sp.s && (sp.s === "unklar" || (Number(sp.s) >= 1 && Number(sp.s) <= funnel.length)) ? sp.s : "";
  const now = Date.now();

  const supabase = await createClient();
  const like = q ? `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%` : "";

  const funnelSteps = FUNNELS[FUNNEL_INTEREST]!;
  const filter: IndexFilter = { channel, like, interest: interestFilter, step: funnel ? stepFilter : "", steps: funnel ?? [] };
  const [index, { data: stateRows }] = await Promise.all([
    // Counted and picked in the database; the app-side way only runs until the migration is applied.
    indexFromDb(supabase, filter, funnelSteps).then((found) => found ?? indexFromRows(supabase, filter, funnelSteps)),
    supabase.from("messenger_sync_state").select("page_id, last_run_at, last_error"),
  ]);
  const { interestCounts, stepCounts, total, ids: shownIds } = index;

  // Full rows (newest message, label, facts) only for the chats that are shown.
  const [inboxRows, factRows, labelRows] = await Promise.all([
    inChunks<InboxRow>(shownIds, (slice) => supabase.from("messenger_inbox").select("*").in("id", slice)),
    inChunks<FactRow>(shownIds, (slice) => supabase.from("messenger_facts").select(FACT_COLUMNS).in("id", slice)),
    index.labels ? [] : inChunks<InboxLabel>(shownIds, (slice) => supabase.from("messenger_labels").select(LABEL_COLUMNS).in("conversation_id", slice)),
  ]);
  const labelById = index.labels ?? new Map(labelRows.map((row) => [row.conversation_id, row]));
  const inboxById = new Map(inboxRows.map((row) => [row.id, row]));
  const conversations = shownIds.map((id) => inboxById.get(id)).filter((row): row is InboxRow => !!row);

  const factById = new Map(factRows.map((row) => [row.id, row]));
  const viewById = new Map<string, ConversationView>();
  for (const row of conversations) {
    const label = labelById.get(row.id);
    viewById.set(row.id, conversationView(label ? toActionLabel(label) : undefined, toTiming(factById.get(row.id), row.last_from_page), now));
  }

  const href = (patch: Partial<Params>) => {
    const next = { ch: channel, i: interestFilter, s: stepFilter, q, ...patch };
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
      <MessengerShell stamp={now} className="flex h-[calc(100dvh-48px)] w-full flex-col border-t border-line max-md:h-[calc(100dvh-96px)]">
        <header className="flex flex-none flex-col gap-3 border-b border-line px-4 pb-3 pt-3 max-md:group-data-[chat=open]/shell:hidden">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-baseline gap-3">
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
            <div className="ml-auto flex flex-wrap items-center gap-2 max-md:ml-0 max-md:w-full">
              <form action="/admin/messenger" className="flex max-md:w-full">
                {channel && <input type="hidden" name="ch" value={channel} />}
                {interestFilter && <input type="hidden" name="i" value={interestFilter} />}
                {stepFilter && <input type="hidden" name="s" value={stepFilter} />}
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Name suchen · Tìm tên"
                  className="h-8 w-60 rounded-full bg-[#F0F2F5] px-3.5 text-[13px] text-ink outline-none transition-shadow duration-150 focus:ring-2 focus:ring-accent-soft max-md:w-full"
                />
              </form>
              <FilterMenu
                label={{ de: "Interesse", vi: "Nhu cầu" }}
                current={interestFilter}
                clearHref={href({ i: "", s: "", c: "" })}
                options={[
                  ...INTERESTS.map((id) => ({ id, de: id, vi: id })),
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
            </div>
          </div>

          {!interestFilter || interestFilter === FUNNEL_INTEREST ? (
            <nav aria-label={`Schritte ${FUNNEL_INTEREST}`} className="flex items-stretch gap-2">
              <span className="flex w-16 flex-none items-center text-[11px] font-medium leading-tight text-faint max-md:hidden">{FUNNEL_INTEREST}</span>
              <FunnelNav
                stamp={now}
                current={interestFilter === FUNNEL_INTEREST ? stepFilter : null}
                steps={[
                  { id: "", de: "Alle", vi: "Tất cả", count: interestCounts.get(FUNNEL_INTEREST) ?? 0 },
                  ...funnelSteps.map((stage, i) => ({ id: String(i + 1), de: STAGE_INFO[stage].short_de, vi: STAGE_INFO[stage].short_vi, count: stepCounts.get(String(i + 1)) ?? 0 })),
                  ...(stepCounts.get("unklar") ? [{ id: "unklar", de: "Unklar", vi: "Chưa rõ", count: stepCounts.get("unklar")! }] : []),
                ].map((step) => ({ ...step, href: href({ i: FUNNEL_INTEREST, s: step.id, c: "" }) }))}
              />
            </nav>
          ) : (
            <p className="m-0 text-[12px] text-faint">
              {interestFilter === NO_INTEREST ? (
                <Label de="Diese Gespräche haben noch kein Interesse." vi="Các cuộc này chưa có nhu cầu." />
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
            key={`${channel}|${interestFilter}|${stepFilter}|${q}`}
            className="anim-fade m-0 min-h-0 flex-1 list-none overflow-y-auto p-1.5 transition-opacity duration-200 group-data-[busy=true]/shell:pointer-events-none group-data-[busy=true]/shell:opacity-40"
          >
            {conversations.length === 0 && (
              <li className="px-3 py-8 text-center text-[13px] text-muted">
                <Label de="Keine Gespräche gefunden." vi="Không tìm thấy cuộc trò chuyện." />
              </li>
            )}
            {conversations.map((c) => {
              const unanswered = c.last_from_page === false;
              const preview = c.last_text ?? (c.last_has_attachment ? "📎 Anhang" : "");
              const view = viewById.get(c.id);
              const rawInterest = labelById.get(c.id)?.interest;
              const interest = rawInterest && rawInterest !== "unklar" && rawInterest !== "keins" ? rawInterest : null;
              return (
                <li key={c.id}>
                  <ChatLink
                    id={c.id}
                    href={href({ c: c.id })}
                    className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-150 hover:bg-hover aria-[current=page]:bg-accent-soft"
                  >
                    <span className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#E4E6EB] text-[13px] font-semibold text-ink">
                      {initials(c.customer_name)}
                      {unanswered && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent" />}
                      <ChannelBadge channel={c.channel} account={c.account_name} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="flex items-baseline gap-2">
                        <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                          <span className={`min-w-0 truncate text-[14px] ${unanswered ? "font-semibold text-ink" : "text-ink"}`}>
                            {c.customer_name ?? "Unbekannt"}
                          </span>
                          {interest && (
                            <span className="flex-none rounded-full bg-chip px-1.5 py-px text-[10.5px] font-medium text-muted">{interest}</span>
                          )}
                        </span>
                        <span className="flex-none text-[11.5px] text-faint">{shortTime(c.last_time ?? c.updated_time)}</span>
                      </span>
                      <span className={`truncate text-[12.5px] ${unanswered ? "font-medium text-body" : "text-muted"}`}>
                        {c.last_from_page ? "Du: " : ""}
                        {preview}
                      </span>
                      {view && (
                        <span className="mt-1 flex min-w-0 items-center gap-1.5" title={view.state.de}>
                          <ActionChip action={view.action} />
                          {view.note && (
                            <span className="flex-none text-[11px] text-faint">
                              <Label de={view.note.de} vi={view.note.vi} />
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  </ChatLink>
                </li>
              );
            })}
            {total > LIST_LIMIT && (
              <li className="px-3 py-3 text-center text-[12px] text-faint">
                <Label de={`Die neuesten ${LIST_LIMIT} – zum Finden älterer Gespräche den Namen suchen.`} vi={`${LIST_LIMIT} cuộc mới nhất – tìm theo tên để thấy cuộc cũ hơn.`} />
              </li>
            )}
          </ul>
        </section>

        <section aria-label="Gespräch" className="flex min-w-0 flex-1 flex-col max-md:group-data-[chat=none]/shell:hidden">
          <ThreadPane stamp={now} />
        </section>
      </main>
      </MessengerShell>
    </>
  );
}
