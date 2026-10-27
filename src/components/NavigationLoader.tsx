"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import HomeLoading from "@/app/(app)/loading";
import AreaLoading from "@/app/(app)/bereich/[slug]/loading";
import PageLoading from "@/app/(app)/seite/[id]/loading";
import EditorLoading from "@/app/(app)/seite/[id]/bearbeiten/loading";
import SearchLoading from "@/app/(app)/suche/loading";
import QuizLoading from "@/app/(app)/quiz/[id]/loading";
import UsersLoading from "@/app/(app)/admin/benutzer/loading";

/** The route's own loading.tsx, so the instant skeleton and Next's one are identical. */
function loaderFor(pathname: string): React.ComponentType | null {
  if (pathname === "/") return HomeLoading;
  if (/^\/bereich\/[^/]+$/.test(pathname)) return AreaLoading;
  if (/^\/seite\/[^/]+\/bearbeiten$/.test(pathname)) return EditorLoading;
  if (/^\/seite\/[^/]+$/.test(pathname)) return PageLoading;
  if (pathname === "/suche") return SearchLoading;
  if (/^\/quiz\/[^/]+$/.test(pathname)) return QuizLoading;
  if (pathname === "/admin/benutzer") return UsersLoading;
  return null;
}

/** If a navigation never changes the URL (e.g. a redirect back to the same page), stop waiting. */
const GIVE_UP_MS = 15_000;

const StartContext = createContext<(href: string) => void>(() => {});

/** Call with the destination before a programmatic `router.push` to show its skeleton right away. */
export function useNavigationLoader() {
  return useContext(StartContext);
}

/**
 * Swaps the page for the destination's skeleton the moment a navigation starts – on the click,
 * not when the server answers. Covers every same-origin link, forms marked with
 * `data-loading-href` (server actions that redirect), and `useNavigationLoader()`.
 */
export function NavigationLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [pending, setPending] = useState<string | null>(null);

  const start = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname && url.searchParams.toString() === search) return;
      if (!loaderFor(url.pathname)) return;
      setPending(url.pathname);
      window.scrollTo(0, 0);
    },
    [pathname, search],
  );

  // The router committed the new URL – Next's own loading.tsx or the page takes over.
  useEffect(() => setPending(null), [pathname, search]);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(null), GIVE_UP_MS);
    const cancel = () => setPending(null);
    window.addEventListener("popstate", cancel);
    return () => {
      clearTimeout(t);
      window.removeEventListener("popstate", cancel);
    };
  }, [pending]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      start(a.href);
    }
    function onSubmit(e: SubmitEvent) {
      const href = (e.target as HTMLElement | null)?.dataset?.loadingHref;
      if (href) start(href);
    }
    // Capture phase: runs before any handler can stop propagation.
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [start]);

  const Loader = pending ? loaderFor(pending) : null;

  return (
    <StartContext.Provider value={start}>
      {Loader && <Loader />}
      {/* Kept mounted so nothing is lost if the navigation is abandoned. */}
      <div className={Loader ? "hidden" : "contents"}>{children}</div>
    </StartContext.Provider>
  );
}
