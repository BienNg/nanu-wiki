import Link from "next/link";
import type { PageWithMeta } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { KindBadge, VerifiedPill } from "./Badges";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";

const GRID = "grid grid-cols-[minmax(220px,1fr)_120px_120px_100px] items-center gap-3";

/** Slite-style document table: page, type, status, last activity. */
export function PageTable({ pages, empty }: { pages: PageWithMeta[]; empty?: React.ReactNode }) {
  if (!pages.length) {
    return <p className="rounded-lg bg-side px-4 py-6 text-center text-[13px] text-muted">{empty ?? "Noch keine Seiten · Chưa có trang"}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[570px]">
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
        {pages.map((p) => (
          <Link key={p.id} href={`/seite/${p.id}`} data-reveal className={`${GRID} min-h-11 rounded-md px-2.5 py-1.5 text-[13px] text-ink hover:bg-side`}>
            <span className="flex min-w-0 items-center gap-2">
              <Icon name="doc" size={15} color={p.area?.color ?? "#6B7079"} strokeWidth={2} className="flex-none" />
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export const PAGE_SELECT =
  "id, area_id, slug, title_de, title_vi, kind, section, verified_until, published, updated_at, body, area:areas(slug, name_de, name_vi, color, icon)";
