import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getQuiz } from "@/content";
import { QuizRunner, type QuizQuestion } from "@/components/QuizRunner";

export const metadata = { title: "Quiz" };

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("staff");
  const { id } = await params;
  const found = getQuiz(id);
  if (!found) notFound();
  const { quiz, week, area } = found;

  // Strip the correct answers – they stay on the server and are checked by server actions.
  const questions: QuizQuestion[] = quiz.questions.map(({ correct: _correct, ...q }) => q);

  return (
    <QuizRunner
      quizId={quiz.id}
      passPercent={quiz.pass_percent}
      week={{ number: week.week, de: week.title_de, vi: week.title_vi }}
      area={{ slug: area.slug, name_de: area.name_de, name_vi: area.name_vi, color: area.color }}
      questions={questions}
    />
  );
}
