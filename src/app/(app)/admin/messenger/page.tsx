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
import { FilterDetails } from "@/components/admin/FilterDetails";
import { LabelEditor } from "@/components/admin/LabelEditor";
import { MessengerThread, type ThreadMessage } from "@/components/admin/MessengerThread";
import { conversationView, type ActionLabel, type ActionTiming, type ConversationView } from "@/lib/messenger/nextAction";
import type { LossReason, Outcome } from "@/lib/messenger/types";
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
const ALL_LIMIT = 5000;
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

/** The wait badge shows a clock instead of "Warten · dann"; this is what follows it ("Interesse fragen"), or null. */
function waitRest(de: string, vi: string): { de: string; vi: string } | null {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const restDe = de.replace(/^Warten(\s*·\s*(dann\s+)?)?/, "");
  const restVi = vi.replace(/^Chờ(\s*·\s*(sau đó\s+)?)?/, "");
  return restDe ? { de: cap(restDe), vi: cap(restVi) } : null;
}

function formJudgment(outcome: Outcome | undefined) {
  if (outcome === "kein_lead" || outcome === "bestandskunde" || outcome === "weiter_auf_zalo" || outcome === "verloren") return outcome;
  return "auto";
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
          className={`flex h-8 cursor-pointer list-none items-center gap-1.5 border px-3 text-[12.5px] font-medium [&::-webkit-details-marker]:hidden ${
            chosen ? "rounded-l-full border-accent-soft bg-accent-soft text-accent-dark" : "rounded-full border-line text-body hover:bg-hover"
          }`}
        >
          {chosen ? <Label de={chosen.de} vi={chosen.vi} /> : <Label de={label.de} vi={label.vi} />}
          <span className="rotate-90 transition-transform group-open:-rotate-90">
            <Icon name="chevron" size={11} />
          </span>
        </summary>
        <div className="absolute right-0 z-30 mt-1 w-56 rounded-xl border border-line bg-white p-1 shadow-lg max-md:left-0 max-md:right-auto">
          {options.map((o) => (
            <Link
              key={o.id}
              href={o.href}
              aria-current={o.id === current ? "page" : undefined}
              className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-ink hover:bg-hover aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark"
            >
              <Label de={o.de} vi={o.vi} />
              {o.count !== undefined && <span className="tabular-nums text-[12px] text-faint">{o.count}</span>}
            </Link>
          ))}
        </div>
      </FilterDetails>
      {chosen && (
        <Link
          href={clearHref}
          aria-label={`${label.de} zurücksetzen`}
          className="flex h-8 items-center rounded-r-full border border-l-0 border-accent-soft bg-accent-soft pl-1 pr-2.5 text-[13px] text-accent-dark hover:bg-[#d9e6ff]"
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
  let list = supabase.from("messenger_inbox").select("*").order("updated_time", { ascending: false }).limit(ALL_LIMIT);
  if (channel) list = list.eq("channel", channel);
  if (q) list = list.ilike("customer_name", `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`);

  const [{ data: inboxRows, error: inboxErr }, { data: stateRows }] = await Promise.all([
    list,
    supabase.from("messenger_sync_state").select("page_id, last_run_at, last_error"),
  ]);
  if (inboxErr) throw new Error(inboxErr.message);

  // Counts come from every chat that matches Kanal + Name; the list then narrows to Interesse + Schritt.
  const everyChat = (inboxRows ?? []) as InboxRow[];
  const labelById = new Map<string, InboxLabel>();
  for (const row of await inChunks<InboxLabel>(everyChat.map((c) => c.id), (slice) => supabase.from("messenger_labels").select(LABEL_COLUMNS).in("conversation_id", slice))) {
    labelById.set(row.conversation_id, row);
  }
  const interestCounts = new Map<string, number>();
  const stepCounts = new Map<string, number>();
  const funnelSteps = FUNNELS[FUNNEL_INTEREST]!;
  for (const c of everyChat) {
    const key = interestKey(labelById.get(c.id));
    interestCounts.set(key, (interestCounts.get(key) ?? 0) + 1);
    if (key === FUNNEL_INTEREST) {
      const step = stepKey(labelById.get(c.id), funnelSteps);
      stepCounts.set(step, (stepCounts.get(step) ?? 0) + 1);
    }
  }
  const matching = everyChat.filter((c) => {
    const label = labelById.get(c.id);
    if (interestFilter && interestKey(label) !== interestFilter) return false;
    if (funnel && stepFilter && stepKey(label, funnel) !== stepFilter) return false;
    return true;
  });
  const conversations = matching.slice(0, LIST_LIMIT);

  const factById = new Map<string, FactRow>();
  const viewById = new Map<string, ConversationView>();
  for (const row of await inChunks<FactRow>(conversations.map((c) => c.id), (slice) => supabase.from("messenger_facts").select(FACT_COLUMNS).in("id", slice))) {
    factById.set(row.id, row);
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
    const next = { c: selectedId ?? "", ch: channel, i: interestFilter, s: stepFilter, q, ...patch };
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
      <div className="flex h-[calc(100dvh-48px)] w-full flex-col border-t border-line max-md:h-[calc(100dvh-96px)]">
        <header className={`flex flex-none flex-col gap-3 border-b border-line px-4 pb-3 pt-3 ${selected ? "max-md:hidden" : ""}`}>
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
                  className="h-8 w-60 rounded-full bg-[#F0F2F5] px-3.5 text-[13px] text-ink outline-none focus:ring-2 focus:ring-accent-soft max-md:w-full"
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
              <div className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto">
                {[
                  { id: "", de: "Alle", vi: "Tất cả", count: interestCounts.get(FUNNEL_INTEREST) ?? 0 },
                  ...funnelSteps.map((stage, i) => ({ id: String(i + 1), de: STAGE_INFO[stage].short_de, vi: STAGE_INFO[stage].short_vi, count: stepCounts.get(String(i + 1)) ?? 0 })),
                  ...(stepCounts.get("unklar") ? [{ id: "unklar", de: "Unklar", vi: "Chưa rõ", count: stepCounts.get("unklar")! }] : []),
                ].map((step, i) => {
                  const active = interestFilter === FUNNEL_INTEREST && stepFilter === step.id;
                  return (
                    <Link
                      key={step.id || "all"}
                      href={href({ i: FUNNEL_INTEREST, s: step.id, c: "" })}
                      aria-current={active ? "page" : undefined}
                      style={{
                        clipPath:
                          i === 0
                            ? "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)"
                            : "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)",
                      }}
                      className={`flex min-w-[92px] flex-1 flex-col py-1.5 leading-tight ${i === 0 ? "rounded-l-lg pl-3" : "pl-5"} pr-4 ${
                        active ? "bg-accent-soft text-accent-dark" : "bg-[#F0F2F5] text-muted hover:bg-[#E4E6EB]"
                      }`}
                    >
                      <span className={`text-[17px] font-semibold tabular-nums ${active ? "text-accent-dark" : "text-ink"}`}>{step.count}</span>
                      <span className="truncate text-[11.5px]">
                        <Label de={step.de} vi={step.vi} />
                      </span>
                    </Link>
                  );
                })}
              </div>
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
        <section aria-label="Gespräche" className={`flex w-[340px] flex-none flex-col border-r border-line max-md:w-full ${selected ? "max-md:hidden" : ""}`}>
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
              const rawInterest = labelById.get(c.id)?.interest;
              const interest = rawInterest && rawInterest !== "unklar" && rawInterest !== "keins" ? rawInterest : null;
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
                        <>
                          <span className="mt-1 truncate text-[11px] text-faint">
                            <Label de={view.state.de} vi={view.state.vi} />
                          </span>
                          <span
                            className={`mt-1 flex max-w-full items-center gap-1 self-start rounded-full px-2 py-0.5 text-[11.5px] font-medium ${
                              view.action.today ? "bg-accent-soft text-accent-dark" : "bg-chip text-muted"
                            }`}
                          >
                            {view.action.id === "wait" ? (
                              <>
                                <span className="flex-none" title="Warten">
                                  <Icon name="clock" size={12} />
                                </span>
                                {waitRest(view.action.de, view.action.vi) && (
                                  <span className="truncate">
                                    <Label {...waitRest(view.action.de, view.action.vi)!} />
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="truncate">
                                <Label de={view.action.de} vi={view.action.vi} />
                              </span>
                            )}
                          </span>
                        </>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
            {matching.length > LIST_LIMIT && (
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
      </div>
    </>
  );
}
