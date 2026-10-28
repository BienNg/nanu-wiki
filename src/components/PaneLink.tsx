"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNavigationLoader } from "./NavigationLoader";

/** Below this width there is no room for the side pane: page links go to the full page instead. */
export const PANE_QUERY = "(min-width: 1024px)";

/**
 * Opens (or closes) the side pane on an area page without leaving it: same path, only `?seite=` changes,
 * so the list stays and the window keeps its scroll position. With `fullHref`, narrow screens open the full page.
 */
export function PaneLink({
  href,
  fullHref,
  children,
  ...rest
}: { href: string; fullHref?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const router = useRouter();
  const startLoader = useNavigationLoader();
  return (
    <Link
      {...rest}
      href={href}
      scroll={false}
      data-pane
      onClick={(e) => {
        rest.onClick?.(e);
        if (!fullHref || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (window.matchMedia(PANE_QUERY).matches) return;
        e.preventDefault();
        startLoader(fullHref);
        router.push(fullHref);
      }}
    >
      {children}
    </Link>
  );
}
