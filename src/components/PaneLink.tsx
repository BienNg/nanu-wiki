"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { scrollWindowToTop } from "./DocPane";
import { useNavigationLoader } from "./NavigationLoader";

/** Below this width there is no room for the side pane: page links go to the full page instead. */
export const PANE_QUERY = "(min-width: 1024px)";

/**
 * Opens the side pane on an area page without leaving it: same path, only `?seite=` changes, so the
 * list stays put. With `fullHref` (a page of this area), the URL changes on the click itself and the
 * pane slides in right away; PaneLayout then loads the page into it. Narrow screens open the full page.
 * `markCurrent`: highlight this link while its page is the one in the pane.
 */
export function PaneLink({
  href,
  fullHref,
  markCurrent,
  children,
  ...rest
}: { href: string; fullHref?: string; markCurrent?: boolean; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const router = useRouter();
  const startLoader = useNavigationLoader();
  const seite = useSearchParams().get("seite");
  const current = markCurrent && seite !== null && new URLSearchParams(href.split("?")[1]?.split("#")[0]).get("seite") === seite;
  return (
    <Link
      {...rest}
      href={href}
      scroll={false}
      data-pane
      aria-current={current ? "page" : rest["aria-current"]}
      onClick={(e) => {
        rest.onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!fullHref || window.matchMedia(PANE_QUERY).matches) {
          // Before the new (often shorter) page arrives, leave the top of the screen. Otherwise the
          // window stays at the bottom of the previous page and the new one opens on blank space.
          scrollWindowToTop();
          document.querySelector<HTMLElement>(".doc-pane")?.scrollTo(0, 0);
          if (fullHref) {
            e.preventDefault();
            window.history.pushState(null, "", href);
          }
          return;
        }
        e.preventDefault();
        startLoader(fullHref);
        router.push(fullHref);
      }}
    >
      {children}
    </Link>
  );
}
