import "server-only";
import { hasRole } from "@/lib/auth";
import type { Area, DailyTask, HandbookGroup, OnboardingWeek, PageQuiz, PageWithMeta, Profile, QuizContent } from "@/lib/types";
import { AREAS } from "./areas";
import { HANDBOOK_GROUPS_BY_AREA, PAGES_BY_AREA } from "./pages";
import { ONBOARDING_BY_AREA } from "./onboarding";
import { DAILY_TASKS_BY_AREA } from "./daily";
import { weekday } from "@/lib/days";
import { pageAnchors, parseLinks, parseTarget } from "@/lib/links";

// Everything people read lives in this folder. The database only stores who did what
// (checklist_progress, quiz_attempts, chat_responses) next to profiles and roles.
// This module is server-only so quiz answers never reach the browser bundle.

export { AREAS };

// A page's quiz (with its answers) is kept out of PAGES: page objects reach the browser (search),
// so the questions are only handed out by getPageQuiz.
const PAGE_QUIZZES = new Map<string, PageQuiz>(
  AREAS.flatMap((area) => (PAGES_BY_AREA[area.slug] ?? []).flatMap((p) => (p.quiz?.questions.length ? [[`${area.slug}/${p.slug}`, p.quiz] as const] : []))),
);

export const PAGES: PageWithMeta[] = AREAS.flatMap((area) =>
  (PAGES_BY_AREA[area.slug] ?? []).map(({ quiz, ...p }) => ({
    ...p,
    id: `${area.slug}/${p.slug}`,
    quiz: quiz?.questions.length ? { version: quiz.version, questions: quiz.questions.length } : null,
    href: `/bereich/${area.slug}/${p.slug}`,
    published: p.published ?? true,
    area: { slug: area.slug, name_de: area.name_de, name_vi: area.name_vi, color: area.color, icon: area.icon },
  })),
);

/** Content links (`[text](area/page#section)`) and daily-task pages whose page or section doesn't exist, and ids on one page that are used twice. */
export function brokenLinks(): string[] {
  const ids = new Map(PAGES.map((p) => [p.id, pageAnchors(p.body)]));
  const problems: string[] = [];
  for (const [id, headings] of ids) {
    const twice = headings.filter((h, i) => headings.indexOf(h) !== i);
    if (twice.length) problems.push(`${id}: Abschnitte mit gleicher id: ${twice.join(", ")}`);
  }
  const check = (where: string, text: string) => {
    for (const part of parseLinks(text)) {
      if (typeof part === "string" || "url" in part) continue;
      const target = part.page ? `${part.area}/${part.page}` : where;
      const headings = ids.get(target);
      if (!headings) problems.push(`${where}: Seite „${target}“ gibt es nicht ([${part.text}])`);
      else if (part.anchor && !headings.includes(part.anchor)) problems.push(`${where}: Abschnitt „${target}#${part.anchor}“ gibt es nicht ([${part.text}])`);
    }
  };
  const walk = (where: string, v: unknown, key?: string): void => {
    if (typeof v === "string") {
      if (key !== "text") check(where, v); // template text is copied as-is, never linked
    } else if (Array.isArray(v)) v.forEach((x) => walk(where, x));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(where, x, k);
  };
  for (const p of PAGES) walk(p.id, p.body);
  for (const [id, quiz] of PAGE_QUIZZES) {
    quiz.questions.forEach((q, i) => {
      if (q.section && !ids.get(id)?.includes(q.section)) problems.push(`${id}: Quizfrage ${i + 1} zeigt auf Abschnitt „${q.section}“, den es nicht gibt`);
      if (!q.options[q.correct]) problems.push(`${id}: Quizfrage ${i + 1} hat keine richtige Antwort`);
    });
  }
  for (const [area, tasks] of Object.entries(DAILY_TASKS_BY_AREA)) {
    for (const t of tasks) {
      if (!t.page) continue;
      const { area: a, page, anchor } = parseTarget(t.page);
      const headings = ids.get(`${a}/${page}`);
      if (!headings) problems.push(`Tägliche Aufgabe ${area}/${t.id}: Seite „${a}/${page}“ gibt es nicht`);
      else if (anchor && !headings.includes(anchor)) problems.push(`Tägliche Aufgabe ${area}/${t.id}: Abschnitt „${t.page}“ gibt es nicht`);
    }
  }
  return problems;
}

// Broken links fail the build, and show in the dev server log while editing. At runtime they just
// lead to the page without the section, so production never throws here.
if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "development") {
  const problems = brokenLinks();
  if (problems.length) {
    const message = `Kaputte Links im Handbuch:\n- ${problems.join("\n- ")}`;
    if (process.env.NEXT_PHASE === "phase-production-build") throw new Error(message);
    console.error(message);
  }
}

export function getArea(slug: string | null | undefined): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export function getPage(areaSlug: string, pageSlug: string): PageWithMeta | undefined {
  return PAGES.find((p) => p.area.slug === areaSlug && p.slug === pageSlug);
}

export function getPageById(id: string): PageWithMeta | undefined {
  return PAGES.find((p) => p.id === id);
}

/** The quiz of a page, answers included. Server only – never pass it to a client component as is. */
export function getPageQuiz(pageId: string): PageQuiz | undefined {
  return PAGE_QUIZZES.get(pageId);
}

/** Pages whose quiz someone must pass: all of „Für alle“ plus the Handbuch of their own role. Drafts and Interview never count. */
export function requiredQuizPages(primaryArea: string | null): PageWithMeta[] {
  return PAGES.filter((p) => p.quiz && p.published && p.section !== "interview" && (p.area.slug === "fuer-alle" || p.area.slug === primaryArea));
}

export function getHandbookGroups(areaSlug: string): HandbookGroup[] {
  return HANDBOOK_GROUPS_BY_AREA[areaSlug] ?? [];
}

export function getOnboarding(areaSlug: string): OnboardingWeek[] {
  return ONBOARDING_BY_AREA[areaSlug] ?? [];
}

/** The page whose quiz ticks this onboarding item (instead of a manual tick), if its link points to one. */
export function onboardingQuizPage(item: OnboardingWeek["items"][number]): PageWithMeta | undefined {
  const page = item.page ? getPageById(item.page.split("#")[0]) : undefined;
  return page?.quiz && page.published ? page : undefined;
}

/** Every task of an area's daily checklist, whatever the weekday. */
export function getDailyTasks(areaSlug: string): DailyTask[] {
  return DAILY_TASKS_BY_AREA[areaSlug] ?? [];
}

/** The tasks due on `day` ("YYYY-MM-DD"): the everyday ones plus that weekday's. */
export function dailyTasksFor(areaSlug: string, day: string): DailyTask[] {
  const wd = weekday(day);
  return getDailyTasks(areaSlug).filter((t) => !t.days || t.days.includes(wd));
}

export function getQuiz(id: string): { quiz: QuizContent; week: OnboardingWeek; area: Area } | undefined {
  for (const area of AREAS) {
    const week = getOnboarding(area.slug).find((w) => w.quiz?.id === id);
    if (week?.quiz) return { quiz: week.quiz, week, area };
  }
  return undefined;
}

export type AreaTab = "handbook" | "daily" | "onboarding" | "interview";

// ------------------------------------------------------------------ access rules (formerly RLS on the content tables)
/** Staff+ see every area; candidates only the role they applied for. */
export function visibleAreas(profile: Profile): Area[] {
  return hasRole(profile.role, "staff") ? AREAS : AREAS.filter((a) => a.slug === profile.candidate_area);
}

/** Tabs on a role page, in display order.
 *  Only admin sees Interview next to Handbuch and Onboarding. Staff and editors: Handbuch and Onboarding.
 *  Candidates: Handbuch and Interview of the role they applied for.
 *  Areas with a daily checklist add „Tägliche Aufgaben“ for staff+ – anyone may tick it, not only the area's own people. */
export function areaTabs(profile: Profile, areaSlug: string): AreaTab[] {
  if (profile.role === "candidate") return ["handbook", "interview"];
  const daily: AreaTab[] = getDailyTasks(areaSlug).length ? ["daily"] : [];
  if (profile.role === "admin") return [...daily, "handbook", "onboarding", "interview"];
  return [...daily, "handbook", "onboarding"];
}

/** Admins everywhere; editors in the areas an admin assigned them (area_editors). */
export function canEditArea(profile: Profile, editorAreas: string[], areaSlug: string) {
  return profile.role === "admin" || (profile.role === "editor" && editorAreas.includes(areaSlug));
}

/** Admins read everything, including Interview. Editors read drafts of their areas, but not Interview.
 *  Staff read published Handbuch and Onboarding, not Interview.
 *  Candidates read published Handbuch and Interview of the role they applied for. */
export function canReadPage(profile: Profile, editorAreas: string[], page: PageWithMeta) {
  if (profile.role === "admin") return true;
  if (page.section === "interview") {
    return page.published && profile.role === "candidate" && page.area.slug === profile.candidate_area;
  }
  if (canEditArea(profile, editorAreas, page.area.slug)) return true;
  if (!page.published) return false;
  if (hasRole(profile.role, "staff")) return true;
  return profile.role === "candidate" && page.section === "handbook" && page.area.slug === profile.candidate_area;
}

export function readablePages(profile: Profile, editorAreas: string[]) {
  return PAGES.filter((p) => canReadPage(profile, editorAreas, p));
}

/** Case-insensitive match on title and all block text, newest first. */
export function searchPages(pages: PageWithMeta[], q: string) {
  const needle = q.trim().toLowerCase();
  const hits = needle ? pages.filter((p) => searchText(p).includes(needle)) : pages;
  return [...hits].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

const searchCache = new Map<string, string>();
function searchText(p: PageWithMeta) {
  let text = searchCache.get(p.id);
  if (text === undefined) {
    text = [p.title_de, p.title_vi, JSON.stringify(p.body)].join(" ").toLowerCase();
    searchCache.set(p.id, text);
  }
  return text;
}
