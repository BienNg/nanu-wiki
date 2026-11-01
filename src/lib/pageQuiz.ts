// Page quizzes are stored in quiz_attempts as "page:<area>/<slug>@<version>".
// The prefix keeps them apart from onboarding quizzes ("sales-woche-2") and interview rounds ("<page>#<mcq>").

export const PAGE_QUIZ_PREFIX = "page:";

export function pageQuizId(pageId: string, version: number) {
  return `${PAGE_QUIZ_PREFIX}${pageId}@${version}`;
}

export function parsePageQuizId(id: string): { pageId: string; version: number } | null {
  const m = /^page:(.+)@(\d+)$/.exec(id);
  return m ? { pageId: m[1], version: Number(m[2]) } : null;
}

export type QuizAttemptRow = { quiz_id: string; profile_id: string; passed: boolean; created_at: string };

/** passed = passed the current version · outdated = passed only an older one · failed = tried this version, not passed · open = never tried. */
export type QuizState = "passed" | "outdated" | "failed" | "open";
export type QuizStatus = { state: QuizState; at: string | null; tries: number };

/** One person's status for one page quiz, from their attempts (any version). */
export function quizStatus(attempts: QuizAttemptRow[], pageId: string, version: number): QuizStatus {
  const mine = attempts.flatMap((a) => {
    const id = parsePageQuizId(a.quiz_id);
    return id?.pageId === pageId ? [{ ...a, version: id.version }] : [];
  });
  const current = mine.filter((a) => a.version === version);
  const pass = current.find((a) => a.passed);
  if (pass) return { state: "passed", at: pass.created_at, tries: current.length };
  const older = mine.filter((a) => a.passed && a.version < version).sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  if (older) return { state: "outdated", at: older.created_at, tries: current.length };
  return { state: current.length ? "failed" : "open", at: null, tries: current.length };
}
