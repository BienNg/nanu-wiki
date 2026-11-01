"use client";

import { currentDoc } from "./DocLink";
import { toast } from "./Toaster";

/** Where copied links point, also when copied on localhost: they are meant to be shared with the team. */
const PRODUCTION_URL = "https://nanu-wiki.vercel.app";

/** Next to a heading: copies a link that opens the full page at this section (also when read in the side pane). */
export function SectionLinkButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      aria-label="Link zu diesem Abschnitt kopieren · Sao chép link đến mục này"
      title="Link kopieren · Sao chép link"
      onClick={async (e) => {
        const { area, page } = currentDoc(!!e.currentTarget.closest(".doc-pane"));
        if (!area || !page) return;
        try {
          await navigator.clipboard.writeText(`${PRODUCTION_URL}/bereich/${area}/${page}#${id}`);
          toast("Link kopiert · Đã sao chép link");
        } catch {
          toast("Kopieren fehlgeschlagen · Không sao chép được");
        }
      }}
      className="mt-[0.15em] flex h-7 w-7 flex-none items-center justify-center rounded-md text-muted hover:bg-chip hover:text-accent-dark"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
      </svg>
    </button>
  );
}
