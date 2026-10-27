import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { QuizRunner, type QuizQuestion } from "@/components/QuizRunner";

export const metadata = { title: "Quiz" };

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("staff");
  const { id } = await params;
  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, pass_percent, onboarding_weeks(week, title_de, title_vi, areas(slug, name_de, name_vi, color, icon))")
    .eq("id", id)
    .maybeSingle();
  if (!quiz) notFound();

  // correct_index is NOT selectable for users (column grant) – answers are checked by RPC.
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, sort, question_de, question_vi, options, explanation_de, explanation_vi")
    .eq("quiz_id", id)
    .order("sort");

  const week = quiz.onboarding_weeks as unknown as {
    week: number;
    title_de: string;
    title_vi: string;
    areas: { slug: string; name_de: string; name_vi: string; color: string };
  };

  return (
    <QuizRunner
      quizId={quiz.id}
      passPercent={quiz.pass_percent}
      week={{ number: week.week, de: week.title_de, vi: week.title_vi }}
      area={week.areas}
      questions={(questions ?? []) as QuizQuestion[]}
    />
  );
}
