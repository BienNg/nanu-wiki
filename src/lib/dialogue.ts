import type { Conversation, ConversationMessage, Level, Place } from "@/lib/types";
import { LEVEL_FACTS } from "@/content/levels";

/** How we address the customer. In Vietnamese this depends on who is older, so every Messenger example
 *  can be switched between these; "ban" is the default. */
export type Pronoun = "ban" | "em" | "chi" | "anh" | "co" | "chu";
// Place "vietnam" stands for anywhere else in Vietnam; the customer then says Đà Nẵng.
export type { Level, Place };
export type Selection = { pronoun: Pronoun; level: Level; place: Place };

export const PRONOUNS: Pronoun[] = ["ban", "em", "chi", "anh", "co", "chu"];
export const LEVELS: Level[] = ["A1", "A2", "B1", "B2"];
export const PLACES: Place[] = ["saigon", "hanoi", "vietnam", "germany"];

export const PRONOUN_LABEL: Record<Pronoun, string> = { ban: "bạn", em: "em", chi: "chị", anh: "anh", co: "cô", chu: "chú" };
export const PLACE_LABEL: Record<Place, { de: string; vi: string }> = {
  saigon: { de: "Sài Gòn", vi: "Sài Gòn" },
  hanoi: { de: "Hà Nội", vi: "Hà Nội" },
  vietnam: { de: "Vietnam (Đà Nẵng)", vi: "Việt Nam (Đà Nẵng)" },
  germany: { de: "Deutschland", vi: "Đức" },
};

/** Words that change with the pronoun.
 *  ban: how we call the customer · minh: how we call ourselves · benminh: "our school" ·
 *  toi: how the customer calls themself · goi: how the customer calls us · elder: we start with „Dạ“ (`{da}`)
 *  and put the pronoun before their name (`{ten}`) · chao: our greeting (uses the customer's name). */
const WORDS: Record<
  Pronoun,
  { ban: string; minh: string; benminh: string; toi: string; goi: string; elder: boolean; chao: (name: string) => string }
> = {
  ban: { ban: "bạn", minh: "mình", benminh: "bên mình", toi: "mình", goi: "bạn", elder: false, chao: (n) => `Chào ${n} ạ!` },
  em: { ban: "em", minh: "bên trung tâm", benminh: "trung tâm", toi: "em", goi: "ad", elder: false, chao: (n) => `Chào em ${n} nha!` },
  chi: { ban: "chị", minh: "em", benminh: "bên em", toi: "chị", goi: "em", elder: true, chao: (n) => `Dạ em chào chị ${n} ạ!` },
  anh: { ban: "anh", minh: "em", benminh: "bên em", toi: "anh", goi: "em", elder: true, chao: (n) => `Dạ em chào anh ${n} ạ!` },
  co: { ban: "cô", minh: "em", benminh: "bên em", toi: "cô", goi: "em", elder: true, chao: (n) => `Dạ em chào cô ${n} ạ!` },
  chu: { ban: "chú", minh: "em", benminh: "bên em", toi: "chú", goi: "em", elder: true, chao: (n) => `Dạ em chào chú ${n} ạ!` },
};

const CITY: Record<Place, { vi: string; de: string }> = {
  saigon: { vi: "Sài Gòn", de: "Sài Gòn" },
  hanoi: { vi: "Hà Nội", de: "Hà Nội" },
  vietnam: { vi: "Đà Nẵng", de: "Đà Nẵng" },
  germany: { vi: "Đức", de: "Deutschland" },
};

const NEXT: Record<Level, string> = { A1: "A2", A2: "B1", B1: "B2", B2: "C1" };
const PREV: Record<Level, string> = { A1: "", A2: "A1", B1: "A2", B2: "B1" };

const TOKEN = /\{(\w+)\}/g;
const LEVEL_TOKENS = ["level", "lv", "next", "prev", "sessions", "duration", "duration_de", "fee", "fee_early", "fee_eur"];
const PLACE_TOKENS = ["city", "city_de"];

/** Fills `{token}`s. A token written with a capital letter (`{Ban}`) gets a capitalised value.
 *  `{da}` starts a sentence: „Dạ “ for elders, and the next letter is capitalised only when „Dạ“ is left out. */
export function fill(text: string, sel: Selection, name: string): string {
  const w = WORDS[sel.pronoun];
  const facts = LEVEL_FACTS[sel.level];
  const values: Record<string, string> = {
    ban: w.ban,
    minh: w.minh,
    benminh: w.benminh,
    toi: w.toi,
    goi: w.goi,
    ten: w.elder ? `${w.ban} ${name}` : name,
    chao: w.chao(name),
    name,
    level: sel.level,
    lv: sel.level.toLowerCase(),
    next: NEXT[sel.level],
    prev: PREV[sel.level],
    sessions: facts.sessions,
    duration: facts.duration,
    duration_de: facts.duration_de,
    fee: facts.fee,
    fee_early: facts.fee_early,
    fee_eur: facts.fee_eur,
    city: CITY[sel.place].vi,
    city_de: CITY[sel.place].de,
  };
  return text
    .replace(TOKEN, (all, key: string) => {
      const v = values[key.toLowerCase()];
      if (v === undefined) return all;
      return key[0] === key[0].toUpperCase() ? v.charAt(0).toUpperCase() + v.slice(1) : v;
    })
    .replace(/\{da\}(.)/gu, (_, c: string) => (w.elder ? `Dạ ${c.toLowerCase()}` : c.toUpperCase()));
}

/** A message with the overrides for the chosen level and place applied, and all tokens filled. */
export function resolveMessage(m: ConversationMessage, sel: Selection, name: string): ConversationMessage {
  const city = sel.place === "saigon" || sel.place === "hanoi" ? m.places?.city : undefined;
  const { levels, places, ...base } = m;
  const merged: ConversationMessage = { ...base, ...levels?.[sel.level], ...city, ...places?.[sel.place] };
  const f = (t?: string) => (t === undefined ? t : fill(t, sel, name));
  return {
    ...merged,
    text: fill(merged.text, sel, name),
    translation_de: f(merged.translation_de),
    note_de: f(merged.note_de),
    note_vi: f(merged.note_vi),
  };
}

/** The conversation's note and goal for the chosen place, with tokens filled. */
export function resolveConversation(c: Conversation, sel: Selection) {
  const city = sel.place === "saigon" || sel.place === "hanoi" ? c.places?.city : undefined;
  const { places, ...base } = c;
  const merged = { ...base, ...city, ...places?.[sel.place] };
  const f = (t?: string) => (t === undefined ? t : fill(t, sel, c.customer));
  return {
    ...merged,
    note_de: f(merged.note_de),
    note_vi: f(merged.note_vi),
    goal_de: f(merged.goal_de),
    goal_vi: f(merged.goal_vi),
    messages: c.messages.map((m) => resolveMessage(m, sel, c.customer)),
  };
}

/** Which selectors a conversation needs: level and place only where its text depends on them. */
export function selectorsFor(c: Conversation) {
  const all = JSON.stringify(c);
  const has = (tokens: string[]) => tokens.some((t) => new RegExp(`\\{${t}\\}`, "i").test(all));
  return {
    level: has(LEVEL_TOKENS) || c.messages.some((m) => m.levels),
    place: has(PLACE_TOKENS) || !!c.places || c.messages.some((m) => m.places),
  };
}

export function defaultSelection(c: Conversation): Selection {
  return { pronoun: "ban", level: c.level ?? "A1", place: c.place ?? "vietnam" };
}

/** Placeholders like [HỌC PHÍ] that staff still have to fill in before sending. */
export function placeholders(text: string): string[] {
  return [...new Set(text.match(/\[[^\]]+\]/g) ?? [])];
}
