import type { createClient } from "@/lib/supabase/server";

/**
 * Manual follow-ups (migration 20261117150000_messenger_followups): "write to this person again on
 * <date>", with an optional note. At most one open per chat; it stays open until a person clicks
 * "Erledigt", even after we wrote. While one is open the automatic 24h follow-up is off (nextAction).
 */
export type Followup = {
  id: string;
  conversation_id: string;
  /** Vietnam date, YYYY-MM-DD. Due from the start of that day. */
  due_on: string;
  note: string | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
  done_at: string | null;
  done_by_name: string | null;
};

/** What the next action needs of an open follow-up. */
export type OpenFollowup = Pick<Followup, "due_on" | "note">;

export const FOLLOWUP_COLUMNS = "id, conversation_id, due_on, note, created_by_name, created_at, updated_at, done_at, done_by_name";
/** Closed follow-ups shown in a chat. */
export const FOLLOWUP_HISTORY = 5;
export const NOTE_MAX = 1000;

type Db = Awaited<ReturnType<typeof createClient>>;

/** The table is not there until the migration is applied: then there are no follow-ups. */
function missing(error: { code?: string; message: string } | null) {
  return !!error && (error.code === "42P01" || error.code === "PGRST205" || /messenger_followups/.test(error.message));
}

/** Every open follow-up, by chat. The table is small (one open row per chat at most), so it is read whole. */
export async function openFollowups(supabase: Db): Promise<Map<string, Followup>> {
  const { data, error } = await supabase.from("messenger_followups").select(FOLLOWUP_COLUMNS).is("done_at", null).limit(5000);
  if (error) {
    if (missing(error)) return new Map();
    throw new Error(error.message);
  }
  return new Map(((data ?? []) as Followup[]).map((f) => [f.conversation_id, f]));
}

/**
 * When each chat's follow-ups were last set, moved or closed (newest updated_at of any of its rows).
 * A chat whose last message is older than this was seen: see conversationView.
 */
export async function followupTouches(supabase: Db): Promise<Map<string, string>> {
  const touched = new Map<string, string>();
  const page = 1000;
  for (let from = 0; from < 50_000; from += page) {
    const { data, error } = await supabase
      .from("messenger_followups")
      .select("conversation_id, updated_at")
      .order("updated_at", { ascending: false })
      .order("id")
      .range(from, from + page - 1);
    if (error) {
      if (missing(error)) return touched;
      throw new Error(error.message);
    }
    const rows = (data ?? []) as Pick<Followup, "conversation_id" | "updated_at">[];
    for (const row of rows) if (!touched.has(row.conversation_id)) touched.set(row.conversation_id, row.updated_at);
    if (rows.length < page) break;
  }
  return touched;
}

/** The newest set, move or close among one chat's follow-ups (from chatFollowups). */
export function touchedAt(chat: { open: Followup | null; done: Followup[] }): string | null {
  let newest: string | null = null;
  for (const f of [chat.open, ...chat.done]) if (f && (!newest || new Date(f.updated_at) > new Date(newest))) newest = f.updated_at;
  return newest;
}

/** One chat's open follow-up and its newest closed ones. */
export async function chatFollowups(supabase: Db, id: string): Promise<{ open: Followup | null; done: Followup[] }> {
  const { data, error } = await supabase
    .from("messenger_followups")
    .select(FOLLOWUP_COLUMNS)
    .eq("conversation_id", id)
    .order("created_at", { ascending: false })
    .limit(FOLLOWUP_HISTORY + 1);
  if (error) {
    if (missing(error)) return { open: null, done: [] };
    throw new Error(error.message);
  }
  const rows = (data ?? []) as Followup[];
  return {
    open: rows.find((f) => !f.done_at) ?? null,
    done: rows.filter((f) => !!f.done_at).sort((a, b) => (b.done_at! > a.done_at! ? 1 : -1)).slice(0, FOLLOWUP_HISTORY),
  };
}

export function isDay(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/** "21.11." */
export function shortDay(day: string) {
  return `${day.slice(8, 10)}.${day.slice(5, 7)}.`;
}

/** Whole days from `from` to `to` (both YYYY-MM-DD). */
export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** The day `n` days after `day`. */
export function addDays(day: string, n: number) {
  return new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
}
