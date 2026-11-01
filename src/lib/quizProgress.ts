import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { PAGE_QUIZ_PREFIX, quizStatus, type QuizAttemptRow, type QuizStatus } from "@/lib/pageQuiz";
import { getOnboarding, onboardingQuizPage } from "@/content";
import type { PageWithMeta } from "@/lib/types";

/** All page-quiz attempts of one person, once per request. */
export const myQuizAttempts = cache(async (profileId: string): Promise<QuizAttemptRow[]> => {
  const supabase = await createClient();
  const { data } = await supabase.from("quiz_attempts").select("quiz_id, profile_id, passed, created_at").eq("profile_id", profileId).like("quiz_id", `${PAGE_QUIZ_PREFIX}%`);
  return (data ?? []) as QuizAttemptRow[];
});

/** Onboarding items that count as done: a manual tick, or – for items linking to a page with a quiz – a pass of the current version. */
export const onboardingDone = cache(async (profileId: string, areaSlug: string): Promise<Set<string>> => {
  const items = getOnboarding(areaSlug).flatMap((w) => w.items);
  if (!items.length) return new Set();
  const supabase = await createClient();
  const [{ data: ticks }, attempts] = await Promise.all([
    supabase.from("checklist_progress").select("item_id").eq("profile_id", profileId).in("item_id", items.map((i) => i.id)),
    myQuizAttempts(profileId),
  ]);
  const ticked = new Set((ticks ?? []).map((t) => t.item_id as string));
  return new Set(
    items.flatMap((i) => {
      const page = onboardingQuizPage(i);
      const done = page ? quizStatus(attempts, page.id, page.quiz!.version).state === "passed" : ticked.has(i.id);
      return done ? [i.id] : [];
    }),
  );
});

/** Quiz status per page id, for the pages that have a quiz. */
export async function myQuizStatuses(profileId: string, pages: PageWithMeta[]): Promise<Record<string, QuizStatus>> {
  const rows = await myQuizAttempts(profileId);
  return Object.fromEntries(pages.flatMap((p) => (p.quiz ? [[p.id, quizStatus(rows, p.id, p.quiz.version)]] : [])));
}
