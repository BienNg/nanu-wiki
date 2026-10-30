import type { Conversation, ConversationMessage, Level, Place } from "@/lib/types";

/** Where a class runs. Online DE runs on German time; all others on Vietnamese time. */
export type ClassMode = "online-de" | "online-vn" | "hanoi" | "saigon";

/** An upcoming group class from the Notion "Klassen Datenbank" (see `src/lib/notion.ts`). */
export type UpcomingClass = {
  id: string;
  name: string;
  /** e.g. "A1.1" */
  level: string;
  mode: ClassMode;
  /** Start time as written in the class name, e.g. "21:00"; null when the name has none. */
  time: string | null;
  /** ISO date of the first lesson. */
  begin: string;
  hasImage: boolean;
};

/** The pieces of a message built from the classes staff tick: `text`/`translation_de` hold `{classes}`
 *  where the list goes; `line`/`line_de` is one list entry with `{kurs}`, `{art}`, `{zeit}` and `{start}`. */
export type ClassList = { line: string; line_de: string };

const MODE_LABEL: Record<ClassMode, { de: string; vi: string }> = {
  "online-de": { de: "online (deutsche Zeit)", vi: "online (giờ Đức)" },
  "online-vn": { de: "online (vietnamesische Zeit)", vi: "online (giờ Việt Nam)" },
  hanoi: { de: "vor Ort in Hà Nội", vi: "tại Hà Nội" },
  saigon: { de: "vor Ort in HCM", vi: "tại TP.HCM" },
};

export const MODE_SHORT: Record<ClassMode, string> = { "online-de": "Online DE", "online-vn": "Online VN", hanoi: "Hà Nội", saigon: "Sài Gòn" };

/** Which classes fit a customer: in Germany only Online DE; in Sài Gòn / Hà Nội the local classes and Online VN. */
const MODES_FOR: Record<Place, ClassMode[]> = {
  germany: ["online-de"],
  vietnam: ["online-vn"],
  saigon: ["saigon", "online-vn"],
  hanoi: ["hanoi", "online-vn"],
};

export function fits(c: UpcomingClass, level: Level, place: Place) {
  return c.level.startsWith(level) && MODES_FOR[place].includes(c.mode);
}

/** "2026-11-02" → "2/11" (vi) or "2.11." (de). */
export function shortDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return { vi: `${d}/${m}`, de: `${d}.${m}.` };
}

function line(template: string, c: UpcomingClass, lang: "de" | "vi") {
  const values: Record<string, string> = {
    kurs: c.level,
    art: MODE_LABEL[c.mode][lang],
    zeit: c.time ?? (lang === "vi" ? "[GIỜ]" : "[UHRZEIT]"),
    start: shortDate(c.begin)[lang],
  };
  return template.replace(/\{(kurs|art|zeit|start)\}/g, (_, k: string) => values[k]);
}

/** The list that replaces `{classes}`; with nothing ticked, a placeholder the copy check warns about. */
export function classLines(list: ClassList, picked: UpcomingClass[]) {
  if (!picked.length) return { vi: "[CHỌN LỚP]", de: "[KURS WÄHLEN]" };
  return {
    vi: picked.map((c) => line(list.line, c, "vi")).join("\n"),
    de: picked.map((c) => line(list.line_de, c, "de")).join(", "),
  };
}

export function imageSrc(c: UpcomingClass) {
  return `/api/classes/${c.id}/image`;
}

/** The conversation with `{classes}` filled from the ticked classes, and each class's image sent right after that message. */
export function withClasses(c: Conversation, picked: UpcomingClass[]): Conversation {
  return {
    ...c,
    messages: c.messages.flatMap((m) => {
      if (!m.classes) return [m];
      const lines = classLines(m.classes, picked);
      const { classes, ...rest } = m; // eslint-disable-line @typescript-eslint/no-unused-vars
      const images = picked
        .filter((x) => x.hasImage)
        .map((x): ConversationMessage => ({ from: "me", text: "", image: { src: imageSrc(x), alt_de: x.name, alt_vi: x.name } }));
      return [{ ...rest, text: m.text.replace("{classes}", lines.vi), translation_de: m.translation_de?.replace("{classes}", lines.de) }, ...images];
    }),
  };
}
