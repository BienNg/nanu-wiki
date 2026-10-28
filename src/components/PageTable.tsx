import Link from "next/link";
import type { PageWithMeta } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { KindBadge, VerifiedPill } from "./Badges";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { PaneLink } from "./PaneLink";

const GRID = "grid grid-cols-[minmax(220px,1fr)_120px_120px_100px] items-center gap-3";

/** Slite-style document table: page, type, status, last activity.
 *  With `paneHref`, a click opens the page in the area's side pane; `active` = the page open there,
 *  which also narrows the table to its "Seite" column. */
export function PageTable({
  pages,
  empty,
  header = true,
  paneHref,
  active,
}: {
  pages: PageWithMeta[];
  empty?: React.ReactNode;
  header?: boolean;
  paneHref?: (p: PageWithMeta) => string;
  active?: string;
}) {
  if (!pages.length) {
    return <p className="rounded-lg bg-side px-4 py-6 text-center text-[13px] text-muted">{empty ?? "Noch keine Seiten · Chưa có trang"}</p>;
  }
  if (active !== undefined) {
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
            aria-current={p.id === active ? "page" : undefined}
            className="flex min-h-10 items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] leading-snug text-ink hover:bg-side aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-dark"
          >
            <Icon name="doc" size={15} color={p.area.color} strokeWidth={2} className="flex-none" />
            <span className="min-w-0">
              <Bi de={p.title_de} vi={p.title_vi} />
              {!p.published && <span className="ml-1.5 rounded bg-chip px-1.5 text-[11px] text-muted">Entwurf</span>}
            </span>
          </PaneLink>
        ))}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[570px]">
        {header && (
          <div className={`${GRID} min-h-8 px-2.5`}>
            <span className="cap">
              <Label de="Seite" vi="Trang" />
            </span>
            <span className="cap">
              <Label de="Typ" vi="Loại" />
            </span>
            <span className="cap">Status</span>
            <span className="cap">
              <Label de="Aktivität" vi="Hoạt động" />
            </span>
          </div>
        )}
        {pages.map((p) => {
          const cls = `${GRID} min-h-11 rounded-md px-2.5 py-1.5 text-[13px] text-ink hover:bg-side`;
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
