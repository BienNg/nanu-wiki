import type { ClassMode } from "@/lib/classes";
import { placeOf, type MessengerPlace } from "./types";

/**
 * A class from the Notion "Klassen Datenbank" that a Messenger lead can be assigned to:
 * upcoming (future Begin), not yet dated, or started at most ASSIGN_GRACE_DAYS ago (and End not
 * passed). 1-1 and archived classes are never assignable. A class that started longer ago is still
 * shown where chats are already assigned to it, until its End passes. Details are read live from
 * Notion (src/lib/notion.ts), the assignment itself lives in Supabase (messenger_class_assignments).
 */
export type AssignableClass = {
  /** Notion page id (dashed uuid). */
  id: string;
  name: string;
  /** The Level select ("A1.1", "Ôn thi A1", "Kommunikation", …) or the level parsed from the name; null when the class has none. */
  level: string | null;
  mode: ClassMode | null;
  /** "19:30" from the name, else the "Start Time" text as written. */
  time: string | null;
  /** ISO date of the first / last lesson; null when not planned yet. */
  begin: string | null;
  end: string | null;
  full: boolean;
  /** Whether the class page holds a marketing image (served through /api/classes/{id}/image). */
  hasImage: boolean;
  /** The "#Students" formula (signed-up students), null when Notion returns none. */
  students: number | null;
  /** The class page in Notion. */
  notionUrl: string | null;
};

/** Which modes fit where the lead wants to learn (label field Ort). */
export const MODES_FOR_PLACE: Record<MessengerPlace, ClassMode[]> = {
  Saigon: ["saigon", "online-vn"],
  Hanoi: ["hanoi", "online-vn"],
  "Online VN": ["online-vn"],
  "Online DE": ["online-de"],
  unklar: [],
};

/** "A1" matches "A1.1" and "A1.2"; a lead level "unklar" or a class without level matches nothing. */
function levelMatches(c: AssignableClass, level: string | null | undefined) {
  if (!level || level === "unklar" || !c.level) return false;
  // Notion calls exam prep "Ôn thi A1"; the label says "Prüfungsvorbereitung A1".
  const exam = level.match(/^Prüfungsvorbereitung (.+)$/);
  if (exam) return c.level.toLowerCase() === `ôn thi ${exam[1]}`.toLowerCase();
  return c.level.startsWith(level);
}

/** New leads start a level at its first half: "A1.1" yes, "A1.2" no. Levels without a half ("Ôn thi A1", "Kommunikation") count as a start. */
export function isLevelStart(c: AssignableClass) {
  const half = c.level?.match(/\.(\d+)$/);
  return !half || half[1] === "1";
}

/**
 * How well a class fits the label: +1 for the level, +1 for the place. The panel sorts by this
 * score, so with Niveau and Ort unknown every class scores 0 and the list is just by date.
 */
export function matchScore(c: AssignableClass, level: string | null | undefined, place: string | null | undefined) {
  let score = 0;
  if (levelMatches(c, level)) score += 1;
  if (c.mode && MODES_FOR_PLACE[placeOf(place)].includes(c.mode)) score += 1;
  return score;
}

/** Best match first; within a tier upcoming classes before running ones, then by start date (classes without a date last), then by name. */
export function rankClasses(classes: AssignableClass[], level: string | null | undefined, place: string | null | undefined) {
  const today = classToday();
  return [...classes].sort((a, b) => {
    const score = matchScore(b, level, place) - matchScore(a, level, place);
    if (score) return score;
    const started = Number(hasStarted(a, today)) - Number(hasStarted(b, today));
    if (started) return started;
    if (a.begin !== b.begin) {
      if (!a.begin) return 1;
      if (!b.begin) return -1;
      return a.begin < b.begin ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

/** Sort key for a level: A1.1, A1.2, A2.1 … C2.2 first, then other levels (Ôn thi, Kommunikation …) A–Z, classes without level last. */
function levelKey(level: string | null) {
  if (!level) return "2";
  const cefr = level.match(/^([ABC][12])(?:\.(\d+))?$/i);
  return cefr ? `0${cefr[1].toUpperCase()}.${cefr[2] ?? "0"}` : `1${level.toLowerCase()}`;
}

/** Sorted by level only (A1.1 → B2.2, then the rest); classes on the same level keep their incoming order. */
export function sortByLevel(classes: AssignableClass[]) {
  return [...classes].sort((a, b) => levelKey(a.level).localeCompare(levelKey(b.level)));
}

/** Today in the class timezone (Vietnam), as an ISO date. */
export function classToday() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
}

/** A class whose Begin has passed is running; views mark it, they do not hide it (End does that). */
export function hasStarted(c: Pick<AssignableClass, "begin">, today = classToday()) {
  return !!c.begin && c.begin < today;
}

/** New leads can join a class up to this many days after its Begin; Begin exactly 7 days ago still counts. */
export const ASSIGN_GRACE_DAYS = 7;

/** The earliest Begin (ISO date) a class may have to still take new leads. */
export function assignCutoff(today = classToday()) {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ASSIGN_GRACE_DAYS);
  return d.toISOString().slice(0, 10);
}

/** Started more than ASSIGN_GRACE_DAYS ago: no longer offered for new assignments. */
export function tooLateToAssign(c: Pick<AssignableClass, "begin">, today = classToday()) {
  return !!c.begin && c.begin < assignCutoff(today);
}

/** Over once the End date has passed; such classes are hidden everywhere, their assignments stay stored. */
export function hasEnded(c: Pick<AssignableClass, "end">, today = classToday()) {
  return !!c.end && c.end < today;
}

/** "G131" from "G131 - A1.1 - OFF HN(9H)"; the whole name when it has no short code. */
export function classCode(name: string) {
  const head = name.split(" - ")[0].trim();
  return head && head.length <= 10 && head !== name ? head : name;
}

/** Soft colour per class mode, the same in the Kurse panel and on the inbox rows. */
export const MODE_TONE: Record<ClassMode, string> = {
  hanoi: "bg-[#F1ECFB] text-[#5E3FA8]",
  saigon: "bg-[#FDF1E2] text-[#94560F]",
  "online-vn": "bg-[#E2F4EF] text-[#1B6E5D]",
  "online-de": "bg-[#E6EEFB] text-[#2558A3]",
};

/**
 * Special-offer outreach per chat and class (messenger_class_assignments.offer_status), set by hand:
 * right before a class starts, everyone assigned to it gets a message with a special offer.
 *   offen          still to write
 *   geschickt      the offer went out (sent outside the app, e.g. in Meta Business Suite)
 *   uebersprungen  deliberately not written (already a Schüler, not a lead …)
 */
export const OFFER_STATES = ["offen", "geschickt", "uebersprungen"] as const;
export type OfferState = (typeof OFFER_STATES)[number];

export const OFFER_INFO: Record<OfferState, { de: string; vi: string }> = {
  offen: { de: "Offen", vi: "Chưa gửi" },
  geschickt: { de: "Geschickt", vi: "Đã gửi" },
  uebersprungen: { de: "Übersprungen", vi: "Bỏ qua" },
};

export function isOfferState(value: unknown): value is OfferState {
  return typeof value === "string" && (OFFER_STATES as readonly string[]).includes(value);
}

/** What an inbox row needs to show a class the chat is assigned to. */
export type RowClass = { id: string; code: string; name: string; mode: ClassMode | null; offer: OfferState };

export function rowClass(c: Pick<AssignableClass, "id" | "name" | "mode">, offer: OfferState = "offen"): RowClass {
  return { id: c.id, code: classCode(c.name), name: c.name, mode: c.mode, offer };
}
