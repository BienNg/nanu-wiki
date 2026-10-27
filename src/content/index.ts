import "server-only";
import { hasRole } from "@/lib/auth";
import type { Area, OnboardingWeek, PageWithMeta, Profile, QuizContent } from "@/lib/types";
import { AREAS } from "./areas";
import { PAGES_BY_AREA } from "./pages";
import { ONBOARDING_BY_AREA } from "./onboarding";

// Everything people read lives in this folder. The database only stores who did what
// (checklist_progress, quiz_attempts, chat_responses) next to profiles and roles.
// This module is server-only so quiz answers never reach the browser bundle.

export { AREAS };

export const PAGES: PageWithMeta[] = AREAS.flatMap((area) =>
  (PAGES_BY_AREA[area.slug] ?? []).map((p) => ({
    ...p,
    id: `${area.slug}/${p.slug}`,
    href: `/bereich/${area.slug}/${p.slug}`,
    published: p.published ?? true,
    area: { slug: area.slug, name_de: area.name_de, name_vi: area.name_vi, color: area.color, icon: area.icon },
  })),
);

export function getArea(slug: string | null | undefined): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export function getPage(areaSlug: string, pageSlug: string): PageWithMeta | undefined {
  return PAGES.find((p) => p.area.slug === areaSlug && p.slug === pageSlug);
}

export function getPageById(id: string): PageWithMeta | undefined {
  return PAGES.find((p) => p.id === id);
}

export function getOnboarding(areaSlug: string): OnboardingWeek[] {
  return ONBOARDING_BY_AREA[areaSlug] ?? [];
}

export function getQuiz(id: string): { quiz: QuizContent; week: OnboardingWeek; area: Area } | undefined {
  for (const area of AREAS) {
    const week = getOnboarding(area.slug).find((w) => w.quiz?.id === id);
    if (week?.quiz) return { quiz: week.quiz, week, area };
  }
  return undefined;
}

// ------------------------------------------------------------------ access rules (formerly RLS on the content tables)
/** Staff+ see every area; candidates only the role they applied for. */
export function visibleAreas(profile: Profile): Area[] {
  return hasRole(profile.role, "staff") ? AREAS : AREAS.filter((a) => a.slug === profile.candidate_area);
}

/** Admins everywhere; editors in the areas an admin assigned them (area_editors). */
export function canEditArea(profile: Profile, editorAreas: string[], areaSlug: string) {
  return profile.role === "admin" || (profile.role === "editor" && editorAreas.includes(areaSlug));
}

/** Staff read published pages, editors also drafts of their areas, candidates only published interview pages of their role. */
export function canReadPage(profile: Profile, editorAreas: string[], page: PageWithMeta) {
  if (canEditArea(profile, editorAreas, page.area.slug)) return true;
  if (!page.published) return false;
  if (hasRole(profile.role, "staff")) return true;
  return profile.role === "candidate" && page.section === "interview" && page.area.slug === profile.candidate_area;
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
