import "server-only";
import { unstable_cache } from "next/cache";
import { INTERESTS } from "@/lib/assistant/schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { addDays, formatVnDate, parseWeekStart } from "./classify";
import { findFollowups, type FollowupEvent, type FollowupMessage } from "./followupReplies";
import { stepOf } from "./steps";
import { LABEL_COLUMNS, type InboxLabel } from "./thread";

/**
 * "Nachfassen" on the Statistik page: how many of our follow-ups got an answer (findFollowups).
 * A follow-up counts in the week it was sent. Left out: Bestandskunde, Keine Anfrage, and follow-ups
 * that mention Zalo. "Schüler" and "Verloren" are where the chat stands now (its label), not then.
 * The chosen week is the last of TREND_WEEKS. The follow-ups come from the database function
 * messenger_followup_events (a few hundred rows); until that migration is applied they are worked
 * out here from every message of the chats (slower). The result is cached for CACHE_SECONDS.
 */

export const TREND_WEEKS = 8;
export const FOLLOWUP_CHANNELS = ["messenger", "whatsapp"] as const;
export type FollowupChannel = (typeof FOLLOWUP_CHANNELS)[number] | "";

const PAGE = 1000;
const ID_CHUNK = 100;
const LIST_MAX = 30;
export const CACHE_SECONDS = 300;

export type FollowupCounts = {
  sent: number;
  answered: number;
  /** We followed up again before any answer. */
  superseded: number;
  /** No answer and no later follow-up yet. */
  waiting: number;
};

export type AnsweredPerson = {
  id: string;
  name: string;
  nth: number;
  at: string;
  answeredAt: string;
  answerSeconds: number;
  schueler: boolean;
  verloren: boolean;
};

export type FollowupStats = {
  channel: FollowupChannel;
  total: FollowupCounts;
  /** 1st, 2nd, 3rd and later. */
  byNth: (FollowupCounts & { id: "1" | "2" | "3" })[];
  medianAnswerSeconds: number | null;
  /** Answered follow-ups whose chat is at the step Schüler now. */
  schueler: number;
  /** Answered follow-ups whose chat is Verloren now: the answer was a "no". */
  verloren: number;
  /** Newest answer first. */
  answeredPeople: AnsweredPerson[];
  answeredCapped: boolean;
  /** Oldest week first; the last one is the chosen week. */
  trend: (FollowupCounts & { weekStart: string })[];
  /** When this was worked out (it is cached for a few minutes). */
  computedAt: string;
  /** "db": from messenger_followup_events; "messages": worked out here, the migration is not applied yet. */
  source: "db" | "messages";
};

/** One follow-up of one chat, as messenger_followup_events returns it. */
export type FollowupRow = {
  conversation_id: string;
  channel: string | null;
  customer_name: string | null;
  at: string;
  nth: number;
  answered_at: string | null;
  answer_seconds: number | null;
  superseded: boolean;
  zalo: boolean;
};

type Client = { from: (table: string) => any; rpc: (fn: string, args: object) => any };

function empty(): FollowupCounts {
  return { sent: 0, answered: 0, superseded: 0, waiting: 0 };
}

function add(c: FollowupCounts, e: FollowupRow) {
  c.sent++;
  if (e.answered_at) c.answered++;
  else if (e.superseded) c.superseded++;
  else c.waiting++;
}

function median(nums: number[]) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

function chunks<T>(list: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

/** Every page of a query (PostgREST hands out at most 1000 rows at a time). */
async function allRows<T>(build: () => any): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build().range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as T[]));
    if (!data || data.length < PAGE) return rows;
  }
}

export function isFollowupChannel(value: string | undefined): value is (typeof FOLLOWUP_CHANNELS)[number] {
  return (FOLLOWUP_CHANNELS as readonly string[]).includes(value ?? "");
}

/** The function is not there until the migration is applied. */
function missingFunction(error: { code?: string; message: string }) {
  return error.code === "PGRST202" || error.code === "42883" || /messenger_followup_events/.test(error.message);
}

function toRow(id: string, channel: string | null, name: string | null, e: FollowupEvent): FollowupRow {
  return {
    conversation_id: id,
    channel,
    customer_name: name,
    at: e.at,
    nth: e.nth,
    answered_at: e.answeredAt,
    answer_seconds: e.answerSeconds,
    superseded: e.superseded,
    zalo: e.zalo,
  };
}

/** Follow-ups that started in [from, to) from the database; null when the function is not there yet. */
export async function followupRowsFromDb(supabase: Client, from: Date, to: Date, conversation?: string): Promise<FollowupRow[] | null> {
  const rows: FollowupRow[] = [];
  for (let start = 0; ; start += PAGE) {
    const { data, error } = await supabase
      .rpc("messenger_followup_events", { p_from: from.toISOString(), p_to: to.toISOString(), p_conversation: conversation ?? null })
      .range(start, start + PAGE - 1);
    if (error) {
      if (missingFunction(error)) return null;
      throw new Error(error.message);
    }
    rows.push(...((data ?? []) as FollowupRow[]));
    if (!data || data.length < PAGE) return rows;
  }
}

/** The same, worked out here from every message of the chats where we wrote in [from, to). */
async function followupRowsFromMessages(supabase: Client, from: Date, to: Date): Promise<FollowupRow[]> {
  const facts = await allRows<{ id: string; customer_name: string | null; channel: string | null }>(() =>
    supabase.from("messenger_facts").select("id, customer_name, channel").gt("customer_msgs", 0).gte("last_page_at", from.toISOString()).order("id"),
  );
  const rows: FollowupRow[] = [];
  await Promise.all(
    chunks(facts, ID_CHUNK).map(async (part) => {
      const msgs = await allRows<FollowupMessage & { conversation_id: string }>(() =>
        supabase
          .from("messenger_messages")
          .select("conversation_id, from_page, created_time, text")
          .in("conversation_id", part.map((f) => f.id))
          .order("conversation_id")
          .order("created_time")
          .order("id"),
      );
      const byChat = new Map<string, FollowupMessage[]>();
      for (const m of msgs) {
        const list = byChat.get(m.conversation_id) ?? [];
        list.push(m);
        byChat.set(m.conversation_id, list);
      }
      for (const f of part) {
        for (const e of findFollowups(byChat.get(f.id) ?? [])) {
          const t = Date.parse(e.at);
          if (t >= from.getTime() && t < to.getTime()) rows.push(toRow(f.id, f.channel, f.customer_name, e));
        }
      }
    }),
  );
  return rows;
}

export async function loadFollowupStats(
  supabase: Client,
  opts: { week?: string; interest?: string; level?: string; channel?: string },
): Promise<FollowupStats> {
  const channel: FollowupChannel = isFollowupChannel(opts.channel) ? opts.channel : "";
  // Same cleaning as loadMessengerStats: an unknown value means no filter.
  const interest = INTERESTS.includes(opts.interest as (typeof INTERESTS)[number]) ? opts.interest! : "";
  const level = ["A1", "A2", "B1", "B2", "C1"].includes(opts.level ?? "") ? opts.level! : "";
  const weekStart = parseWeekStart(opts.week);
  const weeks = Array.from({ length: TREND_WEEKS }, (_, i) => addDays(weekStart, -7 * (TREND_WEEKS - 1 - i)));
  const trendStart = weeks[0];
  const end = addDays(weekStart, 7);

  const fromDb = await followupRowsFromDb(supabase, trendStart, end);
  const all = fromDb ?? (await followupRowsFromMessages(supabase, trendStart, end));
  const rows = all.filter((r) => !r.zalo && (!channel || r.channel === channel));

  const ids = [...new Set(rows.map((r) => r.conversation_id))];
  const labels = new Map<string, InboxLabel>();
  await Promise.all(
    chunks(ids, ID_CHUNK).map(async (part) => {
      const labs = await allRows<InboxLabel>(() => supabase.from("messenger_labels").select(LABEL_COLUMNS).in("conversation_id", part).order("conversation_id"));
      for (const l of labs) labels.set(l.conversation_id, l);
    }),
  );

  const trend = weeks.map((w) => ({ weekStart: formatVnDate(w), ...empty() }));
  const total = empty();
  const byNth = (["1", "2", "3"] as const).map((id) => ({ id, ...empty() }));
  const answerTimes: number[] = [];
  const answeredPeople: AnsweredPerson[] = [];
  let schueler = 0;
  let verloren = 0;
  const startMs = trendStart.getTime();
  const weekMs = weekStart.getTime();

  for (const e of rows) {
    const label = labels.get(e.conversation_id);
    if (label?.outcome === "bestandskunde" || label?.outcome === "kein_lead") continue;
    if (interest && label?.interest !== interest) continue;
    if (level && label?.level !== level) continue;
    const t = Date.parse(e.at);
    add(trend[Math.max(0, Math.min(TREND_WEEKS - 1, Math.floor((t - startMs) / (7 * 86_400_000))))], e);
    if (t < weekMs) continue;
    add(total, e);
    add(byNth[Math.min(2, e.nth - 1)], e);
    if (!e.answered_at) continue;
    const isSchueler = stepOf(label ?? null) === "schueler";
    const isVerloren = label?.outcome === "verloren";
    answerTimes.push(e.answer_seconds ?? 0);
    if (isSchueler) schueler++;
    if (isVerloren) verloren++;
    answeredPeople.push({
      id: e.conversation_id,
      name: e.customer_name ?? "Unbekannt",
      nth: e.nth,
      at: e.at,
      answeredAt: e.answered_at,
      answerSeconds: e.answer_seconds ?? 0,
      schueler: isSchueler,
      verloren: isVerloren,
    });
  }

  answeredPeople.sort((a, b) => b.answeredAt.localeCompare(a.answeredAt));
  return {
    channel,
    total,
    byNth,
    medianAnswerSeconds: median(answerTimes),
    schueler,
    verloren,
    answeredPeople: answeredPeople.slice(0, LIST_MAX),
    answeredCapped: answeredPeople.length > LIST_MAX,
    trend,
    computedAt: new Date().toISOString(),
    source: fromDb ? "db" : "messages",
  };
}

const cached = unstable_cache(
  // Service-role client: unstable_cache cannot use the signed-in user's cookies. Only the admin-only
  // Statistik page calls this (after requireRole), and it only reads; the inputs are cleaned above.
  (week: string, interest: string, level: string, channel: string) => loadFollowupStats(createAdminClient(), { week, interest, level, channel }),
  ["messenger-followup-stats-v1"],
  { revalidate: CACHE_SECONDS },
);

/** loadFollowupStats, at most CACHE_SECONDS old. The key is the cleaned inputs, so equal views share it. */
export function cachedFollowupStats(opts: { week?: string; interest?: string; level?: string; channel?: string }) {
  const week = formatVnDate(parseWeekStart(opts.week));
  const interest = INTERESTS.includes(opts.interest as (typeof INTERESTS)[number]) ? opts.interest! : "";
  const level = ["A1", "A2", "B1", "B2", "C1"].includes(opts.level ?? "") ? opts.level! : "";
  const channel = isFollowupChannel(opts.channel) ? opts.channel : "";
  return cached(week, interest, level, channel);
}
