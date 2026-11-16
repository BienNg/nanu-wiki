import type { ClassMode } from "@/lib/classes";
import { placeOf, type MessengerPlace } from "./types";

/**
 * A class from the Notion "Klassen Datenbank" that a Messenger lead can be assigned to:
 * upcoming (future Begin), not yet dated, or still running (End not passed). 1-1 and archived
 * classes are never assignable. Details are read live from Notion (src/lib/notion.ts), the
 * assignment itself lives in Supabase (messenger_class_assignments).
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
  return c.level.startsWith(level);
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

/** Today in the class timezone (Vietnam), as an ISO date. */
export function classToday() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
}

/** A class whose Begin has passed is running; views mark it, they do not hide it (End does that). */
export function hasStarted(c: AssignableClass, today = classToday()) {
  return !!c.begin && c.begin < today;
}

/** Over once the End date has passed; such classes are hidden everywhere, their assignments stay stored. */
export function hasEnded(c: Pick<AssignableClass, "end">, today = classToday()) {
  return !!c.end && c.end < today;
}
