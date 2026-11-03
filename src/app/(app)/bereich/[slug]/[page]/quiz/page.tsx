import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { canReadPage, getPage, getPageQuiz } from "@/content";
import { PageQuizRunner, type PageQuizQuestionView } from "@/components/PageQuizRunner";
import { headingId, toPlain } from "@/lib/links";
import { currentLang } from "@/components/Topbar";

export const metadata = { title: "Quiz" };

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** The quiz at the end of a Handbuch page. Options come shuffled on every visit; the right answers stay on the server. */
export default async function PageQuizPage({ params }: { params: Promise<{ slug: string; page: string }> }) {
  const { profile } = await requireRole("staff");
  const { slug, page: pageSlug } = await params;
  const page = getPage(slug, pageSlug);
  if (!page || !canReadPage(profile, page)) notFound();
  const quiz = getPageQuiz(page.id);
  if (!quiz) notFound();

  const headings = new Map(page.body.flatMap((b) => (b.type === "heading" ? [[headingId(b), { de: toPlain(b.de), vi: toPlain(b.vi) }] as const] : [])));
  const questions: PageQuizQuestionView[] = quiz.questions.map((q) => ({
    question_de: q.question_de,
    question_vi: q.question_vi,
    options: shuffle(q.options.map((o, value) => ({ ...o, value }))),
    section: q.section ? { id: q.section, ...(headings.get(q.section) ?? { de: "Abschnitt", vi: "Mục" }) } : null,
  }));

  return (
    <PageQuizRunner
      pageId={page.id}
      version={quiz.version}
      page={{ href: page.href, title_de: page.title_de, title_vi: page.title_vi }}
      area={{ name_de: page.area.name_de, name_vi: page.area.name_vi }}
      questions={questions}
      lang={await currentLang()}
    />
  );
}
