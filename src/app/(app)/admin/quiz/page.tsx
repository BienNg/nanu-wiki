import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AREAS, PAGES, requiredQuizPages } from "@/content";
import { Topbar } from "@/components/Topbar";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { formatDate, initials } from "@/lib/format";
import { PAGE_QUIZ_PREFIX, parsePageQuizId, quizStatus, type QuizAttemptRow, type QuizStatus } from "@/lib/pageQuiz";

export const metadata = { title: "Quiz-Übersicht" };

type Attempt = QuizAttemptRow & { score: number; total: number };
type Person = { id: string; full_name: string | null; email: string; primary_area: string | null };

const QUIZ_PAGES = PAGES.filter((p) => p.quiz && p.published && p.section !== "interview");
const QUIZ_AREAS = AREAS.filter((a) => QUIZ_PAGES.some((p) => p.area.slug === a.slug));

/** Admins: who passed which page quiz, one area at a time. „Pflicht“ = Für alle + the person's own role, across all areas. */
export default async function QuizAdminPage({ searchParams }: { searchParams: Promise<{ bereich?: string }> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const area = QUIZ_AREAS.find((a) => a.slug === sp.bereich) ?? QUIZ_AREAS[0];
  const pages = QUIZ_PAGES.filter((p) => p.area.slug === area.slug);

  const supabase = await createClient();
  const [{ data: attemptData }, { data: staff }] = await Promise.all([
    supabase.from("quiz_attempts").select("quiz_id, profile_id, passed, created_at, score, total").like("quiz_id", `${PAGE_QUIZ_PREFIX}%`).order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email, primary_area").in("role", ["staff", "editor", "admin"]),
  ]);
  const attempts = (attemptData ?? []) as Attempt[];
  const all = (staff ?? []) as Person[];
  // Für alle: everyone. A role: its own people, plus anyone else who tried one of its quizzes.
  const tried = new Set(attempts.filter((a) => pages.some((p) => p.id === parsePageQuizId(a.quiz_id)?.pageId)).map((a) => a.profile_id));
  const people = all
    .filter((p) => area.is_shared || p.primary_area === area.slug || tried.has(p.id))
    .sort((a, b) => (a.full_name ?? a.email).localeCompare(b.full_name ?? b.email, "de"));

  const mine = (pid: string) => attempts.filter((a) => a.profile_id === pid);
  const required = (p: Person) => {
    const list = requiredQuizPages(p.primary_area);
    return { done: list.filter((q) => quizStatus(mine(p.id), q.id, q.quiz!.version).state === "passed").length, total: list.length };
  };

  // The page count varies, so the columns are an inline style (Tailwind can't build class names at runtime).
  const cols = "grid items-center gap-1";
  const grid = { gridTemplateColumns: `minmax(180px,1.4fr) repeat(${pages.length},minmax(76px,1fr)) minmax(80px,0.8fr)` };

  return (
    <>
      <Topbar>
        <Icon name="cap" size={14} />
        <Label de="Quiz-Übersicht" vi="Tổng quan quiz" />
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1300px] flex-col gap-5 px-8 pb-20 pt-9 max-sm:px-4">
        <header className="flex flex-col gap-1">
          <h1 className="title-display m-0 text-[34px] leading-tight">
            <Label de="Quiz-Übersicht" vi="Tổng quan quiz" />
          </h1>
          <p className="m-0 max-w-[760px] text-[13px] text-muted">
            <Label
              de="Wer welches Handbuch-Quiz bestanden hat. Pflicht für alle: „Für alle“ plus das Handbuch der eigenen Rolle. Eine Zeile öffnen für alle Versuche."
              vi="Ai đã qua quiz nào của Sổ tay. Bắt buộc với mọi người: „Für alle“ và Sổ tay của vai trò mình. Mở một dòng để xem mọi lần làm."
            />
          </p>
        </header>

        <nav aria-label="Bereich" className="flex flex-wrap gap-1 self-start rounded-lg bg-side p-[3px]">
          {QUIZ_AREAS.map((a) => (
            <Link
              key={a.slug}
              href={a.slug === QUIZ_AREAS[0].slug ? "/admin/quiz" : `/admin/quiz?bereich=${a.slug}`}
              aria-current={a.slug === area.slug ? "page" : undefined}
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-[#4A4F57] hover:text-ink aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark"
            >
              <Icon name={a.icon} size={13} color={a.color} strokeWidth={2} />
              <Label de={a.name_de} vi={a.name_vi} />
            </Link>
          ))}
        </nav>

        <div className="overflow-x-auto rounded-[10px] border border-line">
          <div style={{ minWidth: 300 + pages.length * 80 }}>
            <div style={grid} className={`${cols} items-end bg-side px-3 py-2 text-[11px] font-medium leading-tight text-muted`}>
              <span>
                <Label de="Person" vi="Người" />
              </span>
              {pages.map((p) => (
                <Link key={p.id} href={p.href} title={p.title_de} className="line-clamp-3 text-center text-muted hover:text-ink">
                  <Label de={p.title_de} vi={p.title_vi} />
                  <span className="block font-normal text-faint">v{p.quiz!.version}</span>
                </Link>
              ))}
              <span className="text-center">
                <Label de="Pflicht gesamt" vi="Bắt buộc" />
              </span>
            </div>

            {people.length === 0 && (
              <p className="m-0 border-t border-line-soft px-3 py-6 text-center text-[13px] text-muted">
                <Label de="Niemand mit dieser Rolle." vi="Chưa có ai với vai trò này." />
              </p>
            )}

            {people.map((person) => {
              const rows = mine(person.id);
              const req = required(person);
              const history = rows.filter((a) => pages.some((p) => p.id === parsePageQuizId(a.quiz_id)?.pageId));
              return (
                <details key={person.id} className="group border-t border-line-soft">
                  <summary style={grid} className={`${cols} cursor-pointer list-none px-3 py-2 hover:bg-hover [&::-webkit-details-marker]:hidden`}>
                    <span className="flex min-w-0 items-center gap-2">
                      <Icon name="chevron" size={12} className="flex-none text-muted transition-transform group-open:rotate-90" />
                      <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#FCE6DC] text-[11px] font-bold text-[#9E3617]">
                        {initials(person.full_name, person.email)}
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block truncate text-[13px] font-semibold text-ink">{person.full_name ?? person.email}</span>
                        <span className="block truncate text-[11px] text-muted">
                          {AREAS.find((a) => a.slug === person.primary_area)?.name_de ?? <Label de="Keine Rolle" vi="Chưa có vai trò" />}
                        </span>
                      </span>
                    </span>
                    {pages.map((p) => (
                      <Cell key={p.id} status={quizStatus(rows, p.id, p.quiz!.version)} />
                    ))}
                    <span className={`mx-auto rounded-md px-1.5 py-0.5 text-center text-xs font-medium ${req.done === req.total ? "bg-ok-soft text-ok" : "bg-chip text-ink"}`}>
                      {req.done}/{req.total}
                    </span>
                  </summary>

                  <div className="border-t border-line-soft bg-[#FAFAF9] px-3 py-2 pl-8 text-xs">
                    {history.length === 0 ? (
                      <p className="m-0 py-1 text-muted">
                        <Label de="Noch kein Versuch in diesem Bereich." vi="Chưa làm lần nào trong mục này." />
                      </p>
                    ) : (
                      history.map((a, k) => {
                        const id = parsePageQuizId(a.quiz_id)!;
                        const page = pages.find((p) => p.id === id.pageId)!;
                        return (
                          <div key={k} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-b border-line-soft py-1.5 last:border-b-0">
                            <span className="w-[86px] text-muted">{formatDate(a.created_at)}</span>
                            <span className={`w-[52px] font-semibold ${a.passed ? "text-ok" : "text-[#B42318]"}`}>
                              {a.score}/{a.total}
                            </span>
                            <span className="min-w-0 flex-1 text-ink">
                              <Bi de={page.title_de} vi={page.title_vi} inline />
                            </span>
                            <span className={id.version < page.quiz!.version ? "text-[#7F5F05]" : "text-muted"}>
                              v{id.version}
                              {id.version < page.quiz!.version && <Label de=" (alte Version)" vi=" (phiên bản cũ)" />}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        <p className="m-0 text-xs text-muted">
          <Label
            de="✓ bestanden (Datum) · ↻ nur eine ältere Version bestanden, die Seite hat neue Inhalte · ✗ versucht, nicht bestanden (Anzahl Versuche) · – noch nicht gemacht"
            vi="✓ đã qua (ngày) · ↻ chỉ qua phiên bản cũ, trang có nội dung mới · ✗ đã làm nhưng chưa qua (số lần) · – chưa làm"
          />
        </p>
      </main>
    </>
  );
}

function Cell({ status }: { status: QuizStatus }) {
  if (status.state === "open") return <span className="text-center text-xs text-faint">–</span>;
  const look = {
    passed: { cls: "bg-ok-soft text-ok", text: `✓ ${status.at ? formatDate(status.at).slice(0, 5) : ""}` },
    outdated: { cls: "bg-warn-soft text-[#7F5F05]", text: "↻" },
    failed: { cls: "bg-[#FDE8E7] text-[#B42318]", text: `✗ ${status.tries}×` },
  }[status.state];
  return <span className={`mx-auto whitespace-nowrap rounded-md px-1.5 py-0.5 text-center text-xs font-medium ${look.cls}`}>{look.text}</span>;
}
