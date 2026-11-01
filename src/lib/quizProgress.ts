import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { PAGE_QUIZ_PREFIX, quizStatus, type QuizAttemptRow, type QuizStatus } from "@/lib/pageQuiz";
import type { PageWithMeta } from "@/lib/types";

/** All page-quiz attempts of one person, once per request. */
export const myQuizAttempts = cache(async (profileId: string): Promise<QuizAttemptRow[]> => {
  const supabase = await createClient();
  const { data } = await supabase.from("quiz_attempts").select("quiz_id, profile_id, passed, created_at").eq("profile_id", profileId).like("quiz_id", `${PAGE_QUIZ_PREFIX}%`);
  return (data ?? []) as QuizAttemptRow[];
});

/** Quiz status per page id, for the pages that have a quiz. */
export async function myQuizStatuses(profileId: string, pages: PageWithMeta[]): Promise<Record<string, QuizStatus>> {
  const rows = await myQuizAttempts(profileId);
  return Object.fromEntries(pages.flatMap((p) => (p.quiz ? [[p.id, quizStatus(rows, p.id, p.quiz.version)]] : [])));
}
