"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const LEAVE_MS = 240;
const CloseContext = createContext<() => void>(() => {});

// When the pane was last on screen. Switching pages remounts the area page, so a pane that mounts
// right after another one unmounted is a page switch (content fades) and not an open (pane slides in).
let lastUnmount = 0;

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Drop any leftover window scroll. The pane scrolls on its own; a previous long page must not
 *  leave the window parked below a shorter one (`html` uses smooth scrolling, so this is instant). */
export function scrollWindowToTop() {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = prev;
}

/** The side pane next to an area's page list: slides in from the right when it opens and out when it closes.
 *  Esc closes it – unless someone is typing or a comment popup is open (Esc closes that first). */
export function PaneFrame({ closeHref, label, children }: { closeHref: string; label: string; children: React.ReactNode }) {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const leaving = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current!;
    if (!reduceMotion()) el.classList.add(Date.now() - lastUnmount < 600 ? "pane-swap" : "pane-in");
    // A long page scrolls this pane, not the window. Start the new page at the top either way:
    // the window may still be offset from before the pane became its own scroller.
    scrollWindowToTop();
    el.scrollTop = 0;
    return () => {
      lastUnmount = Date.now();
    };
  }, []);

  const close = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    const go = () => router.push(closeHref, { scroll: false });
    if (reduceMotion()) return go();
    ref.current?.classList.remove("pane-in", "pane-swap");
    ref.current?.classList.add("pane-out");
    setTimeout(go, LEAVE_MS);
  }, [closeHref, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      if (document.querySelector('[data-comment-ui][role="dialog"]')) return;
      close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <CloseContext.Provider value={close}>
      <section ref={ref} aria-label={label} className="doc-pane min-h-0 min-w-0 flex-1 self-stretch overflow-y-auto border-l border-line bg-white">
        {children}
      </section>
    </CloseContext.Provider>
  );
}

/** Close button in the pane header (slides the pane out, then drops `?seite=`). */
export function PaneClose({ className }: { className?: string }) {
  const close = useContext(CloseContext);
  return (
    <button type="button" onClick={close} aria-label="Schließen · Đóng" title="Schließen (Esc) · Đóng" className={className}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  );
}
