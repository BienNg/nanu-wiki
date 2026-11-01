import Link from "next/link";
import type { PageWithMeta } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { KindBadge, QuizChip, VerifiedPill } from "./Badges";
import type { QuizStatus } from "@/lib/pageQuiz";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { PaneLink } from "./PaneLink";

const GRID = "grid grid-cols-[minmax(220px,1fr)_120px_120px_100px] items-center gap-3";
const GRID_QUIZ = "grid grid-cols-[minmax(220px,1fr)_120px_120px_70px_100px] items-center gap-3";

/** Slite-style document table: page, type, status, last activity.
 *  With `paneHref`, a click opens the page in the area's side pane. `narrow` = the table sits next to
 *  that pane: it shrinks to its "Seite" column and marks the page open there.
 *  `quiz`: this person's quiz status per page id; adds a Quiz column. */
export function PageTable({
  pages,
  empty,
  header = true,
  paneHref,
  narrow,
  quiz,
}: {
  pages: PageWithMeta[];
  empty?: React.ReactNode;
  header?: boolean;
  paneHref?: (p: PageWithMeta) => string;
  narrow?: boolean;
  quiz?: Record<string, QuizStatus>;
}) {
  const grid = quiz ? GRID_QUIZ : GRID;
  if (!pages.length) {
    return <p className="rounded-lg bg-side px-4 py-6 text-center text-[13px] text-muted">{empty ?? "Noch keine Seiten · Chưa có trang"}</p>;
  }
  if (narrow) {
    return (
      <div className="flex flex-col">
        {header && (
          <span className="cap flex min-h-8 items-center px-2.5">
            <Label de="Seite" vi="Trang" />
          </span>
        )}
        {pages.map((p) => (
          <PaneLink
            key={p.id}
            href={paneHref!(p)}
            fullHref={p.href}
            markCurrent
            className="flex min-h-10 items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] leading-snug text-ink hover:bg-side aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark"
          >
            <Icon name="doc" size={15} color={p.area.color} strokeWidth={2} className="flex-none" />
            <span className="min-w-0">
              <Bi de={p.title_de} vi={p.title_vi} />
              {!p.published && <span className="ml-1.5 rounded bg-chip px-1.5 text-[11px] text-muted">Entwurf</span>}
            </span>
            {quiz?.[p.id] && (
              <span className="ml-auto">
                <QuizChip status={quiz[p.id]} short />
              </span>
            )}
          </PaneLink>
        ))}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <div className={quiz ? "min-w-[650px]" : "min-w-[570px]"}>
        {header && (
          <div className={`${grid} min-h-8 px-2.5`}>
            <span className="cap">
              <Label de="Seite" vi="Trang" />
            </span>
            <span className="cap">
              <Label de="Typ" vi="Loại" />
            </span>
            <span className="cap">Status</span>
            {quiz && <span className="cap">Quiz</span>}
            <span className="cap">
              <Label de="Aktivität" vi="Hoạt động" />
            </span>
          </div>
        )}
        {pages.map((p) => {
          const cls = `${grid} min-h-11 rounded-md px-2.5 py-1.5 text-[13px] text-ink hover:bg-side`;
          const cells = (
            <>
              <span className="flex min-w-0 items-center gap-2">
                <Icon name="doc" size={15} color={p.area.color} strokeWidth={2} className="flex-none" />
                <span className="min-w-0 leading-snug">
                  <Bi de={p.title_de} vi={p.title_vi} />
                  {!p.published && <span className="ml-1.5 rounded bg-chip px-1.5 text-[11px] text-muted">Entwurf</span>}
                </span>
              </span>
              <span>
                <KindBadge kind={p.kind} />
              </span>
              <span>
                <VerifiedPill until={p.verified_until} />
              </span>
              {quiz && <span>{quiz[p.id] ? <QuizChip status={quiz[p.id]} short /> : <span className="text-faint">–</span>}</span>}
              <span className="text-muted">{formatDate(p.updated_at)}</span>
            </>
          );
          return paneHref ? (
            <PaneLink key={p.id} href={paneHref(p)} fullHref={p.href} data-reveal className={cls}>
              {cells}
            </PaneLink>
          ) : (
            <Link key={p.id} href={p.href} data-reveal className={cls}>
              {cells}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
