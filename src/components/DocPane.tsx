"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "./Bi";
import { RAIL_WIDTH, useCollapseSidebarWhileOpen } from "./AppShell";

const CloseContext = createContext<() => void>(() => {});

// When the pane was last on screen. Switching pages remounts the area page, so a pane that mounts
// right after another one unmounted is a page switch (content fades) and not an open (pane slides in).
let lastUnmount = 0;
let lastPane: HTMLElement | null = null; // React may run mount effects twice on the same element: that is not a switch

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

type Titles = Record<string, { de: string; vi: string }>;

/**
 * An area page and its side pane, driven by `?seite=` in the URL – not by the server.
 * Both layouts arrive already rendered: `closed` (the full list) and `list` (the list next to the pane).
 * Opening (PaneLink) and closing only change the URL, so the pane slides in or out on the click itself.
 * The page inside comes from the server afterwards: until it is there, the pane shows a placeholder.
 * `open` = the page the server rendered into `children`; `titles` = every page the pane may show.
 */
export function PaneLayout({
  open,
  titles,
  closeHref,
  closed,
  topbar,
  list,
  children,
}: {
  open?: string;
  titles: Titles;
  closeHref: string;
  closed: React.ReactNode;
  topbar: React.ReactNode;
  list: React.ReactNode;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const seite = useSearchParams().get("seite");
  const shown = seite && titles[seite] ? seite : null;

  // A page opened on the client (or reached with Back): fetch it now, the pane is already moving.
  // `refresh` loads the URL as it is now; a navigation to it would skip the server when only the
  // #section differs from where the router thinks it is.
  useEffect(() => {
    if (shown && shown !== open) router.refresh();
  }, [shown, open, router]);

  if (!shown) return closed;
  // Exactly one screen: the list and the page each scroll on their own, so a long page
  // cannot stretch the window and leave the next, shorter page scrolled into empty space.
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden [overflow-anchor:none]">
      {topbar}
      <div className="flex min-h-0 flex-1">
        <aside aria-label="Seiten" className="w-[300px] flex-none overflow-y-auto max-lg:hidden">
          {list}
        </aside>
        <PaneFrame key={shown} closeHref={closeHref} label={titles[shown].de}>
          {shown === open ? children : <PanePlaceholder />}
        </PaneFrame>
      </div>
    </div>
  );
}

/** The open page's title in the top bar, next to the area. */
export function PaneCrumb({ titles }: { titles: Titles }) {
  const seite = useSearchParams().get("seite");
  const t = seite ? titles[seite] : undefined;
  if (!t) return null;
  return (
    <>
      <span aria-hidden="true" className="text-[#B7BBC2]">
        /
      </span>
      <span className="max-w-[320px] truncate">
        <Label de={t.de} vi={t.vi || t.de} />
      </span>
    </>
  );
}

/** What the pane shows for the moment its page is still on the way. */
function PanePlaceholder() {
  const bar = "rounded-md bg-side animate-pulse";
  return (
    <div aria-busy="true" className="flex flex-col">
      <div className="flex min-h-12 items-center px-4">
        <PaneClose className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink" />
      </div>
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-8 pt-2">
        <div className={`${bar} h-5 w-40`} />
        <div className={`${bar} h-10 w-3/4`} />
        <div className={`${bar} h-4 w-full`} />
        <div className={`${bar} h-4 w-11/12`} />
        <div className={`${bar} h-4 w-4/5`} />
      </div>
    </div>
  );
}

/** The side pane next to an area's page list: slides in from the right when it opens and out when it closes.
 *  Esc closes it – unless someone is typing or a comment popup is open (Esc closes that first). */
export function PaneFrame({ closeHref, label, children }: { closeHref: string; label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const leaving = useRef(false);
  useCollapseSidebarWhileOpen();

  useLayoutEffect(() => {
    const el = ref.current!;
    const swap = Date.now() - lastUnmount < 600 && lastPane !== el;
    el.classList.remove("pane-in", "pane-swap");
    if (!reduceMotion()) el.classList.add(swap ? "pane-swap" : "pane-in");
    // The sidebar folds to its rail while the pane slides in, and the pane would grow with it –
    // its text reflowing every frame. Hold it at the width it ends up with until the slide is done.
    el.style.flex = "";
    const sidebar = document.getElementById("app-sidebar");
    if (!swap && !reduceMotion() && sidebar && getComputedStyle(sidebar).position !== "fixed") {
      const grow = Math.max(0, sidebar.getBoundingClientRect().width - RAIL_WIDTH);
      if (grow) el.style.flex = `0 0 ${el.getBoundingClientRect().width + grow}px`;
    }
    // A long page scrolls this pane, not the window. Start the new page at the top either way:
    // the window may still be offset from before the pane became its own scroller.
    scrollWindowToTop();
    el.scrollTop = 0;
    // The slide uses a transform. While that animation is applied, position:fixed inside the pane
    // (the comment panel, the pinned language and comment buttons) sticks to the pane and scrolls
    // away with it. Drop the animation once it has finished so they pin to the screen again.
    function clearSlide(e?: Event) {
      if (e && e.target !== el) return;
      el.classList.remove("pane-in", "pane-swap");
      el.style.flex = "";
    }
    el.addEventListener("animationend", clearSlide);
    const fallback = window.setTimeout(clearSlide, 700);
    return () => {
      lastUnmount = Date.now();
      lastPane = el;
      el.removeEventListener("animationend", clearSlide);
      window.clearTimeout(fallback);
    };
  }, []);

  const close = useCallback(() => {
    const el = ref.current;
    if (leaving.current || !el) return;
    leaving.current = true;
    // Back reopens the pane where it was (ScrollMemory restores this).
    try {
      sessionStorage.setItem(`nanu:pos:${location.pathname}${location.search}${location.hash}`, JSON.stringify({ win: 0, pane: el.scrollTop }));
    } catch {}
    // Everything moves at once: a copy of the pane slides out on top while, underneath, the full
    // list is already there and the sidebar unfolds – no waiting for the slide to finish first.
    if (!reduceMotion()) {
      const rect = el.getBoundingClientRect();
      const ghost = el.cloneNode(true) as HTMLElement;
      ghost.removeAttribute("aria-label");
      ghost.setAttribute("aria-hidden", "true");
      ghost.inert = true;
      ghost.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      Object.assign(ghost.style, {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        flex: "none",
        overflow: "hidden",
        zIndex: "30",
      });
      ghost.classList.remove("pane-in", "pane-swap");
      ghost.classList.add("pane-out");
      document.body.appendChild(ghost);
      ghost.scrollTop = el.scrollTop;
      const remove = () => ghost.remove();
      ghost.addEventListener("animationend", (e) => e.target === ghost && remove());
      window.setTimeout(remove, 600); // in case the animation never ends (background tab)
    }
    window.history.pushState(null, "", closeHref);
    scrollWindowToTop();
  }, [closeHref]);

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

/** Close button in the pane header (slides the pane out, then drops `?seite=`, see PaneLayout). */
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
