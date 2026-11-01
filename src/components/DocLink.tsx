"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PANE_QUERY } from "./PaneLink";
import { useNavigationLoader } from "./NavigationLoader";

// Links inside content text to another page or section (see lib/links):
// - a page in the same area opens in the side pane when the link sits in the pane, otherwise the full page opens;
// - on arrival the page scrolls to the section and it flashes briefly;
// - Back returns to the exact spot the link was clicked from (window and side pane).

export const ARRIVE = "nanu:arrive"; // the URL a link just opened, so its section is shown once (not again on Back)
const POS = "nanu:pos:"; // + URL → where that page was scrolled to when a link left it

type Pos = { win: number; pane: number | null };

const urlKey = () => location.pathname + location.search + location.hash;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function store(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {}
}
function read(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/** The page being read: from the side pane (`?seite=`) or the full page path. */
export function currentDoc(inPane: boolean) {
  const [, , area, page] = location.pathname.split("/");
  if (inPane) return { area, page: new URLSearchParams(location.search).get("seite") ?? undefined };
  return location.pathname.startsWith("/bereich/") ? { area, page } : {};
}

/** Scrolls to a section and flashes it. A heading flashes with every block up to the next heading;
 *  a step or a time section („Jeden Tag“ …) flashes on its own. */
export function showSection(id: string, smooth: boolean) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: smooth && !reduceMotion() ? "smooth" : "instant", block: "start" });
  if (reduceMotion()) return;
  const section = [target];
  if (/^H[1-6]$/.test(target.tagName)) {
    section[0] = target.closest<HTMLElement>("[data-block]") ?? target;
    for (let n = section[0].nextElementSibling; n instanceof HTMLElement && !n.querySelector("h2"); n = n.nextElementSibling) section.push(n);
  }
  section.forEach((el, i) => {
    el.classList.remove("section-flash", "section-flash-first", "section-flash-last");
    void el.offsetWidth; // restart the animation when the same section is shown twice in a row
    el.classList.add("section-flash");
    if (i === 0) el.classList.add("section-flash-first");
    if (i === section.length - 1) el.classList.add("section-flash-last");
    el.addEventListener("animationend", () => el.classList.remove("section-flash", "section-flash-first", "section-flash-last"), { once: true });
  });
}

export function DocLink({ area, page, anchor, children }: { area?: string; page?: string; anchor?: string; children: React.ReactNode }) {
  const router = useRouter();
  const startLoader = useNavigationLoader();
  const hash = anchor ? `#${anchor}` : "";
  const href = page ? `/bereich/${area}/${page}${hash}` : hash;

  return (
    <a
      href={href}
      data-pane // handled here, not by NavigationLoader's click capture (it would scroll away before the spot is saved)
      className="text-accent-dark underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const pane = e.currentTarget.closest<HTMLElement>(".doc-pane");
        const here = currentDoc(!!pane);
        // Remember this spot for Back.
        store(POS + urlKey(), JSON.stringify({ win: window.scrollY, pane: pane ? pane.scrollTop : null } satisfies Pos));

        if (!page || (area === here.area && page === here.page)) {
          if (!anchor) return;
          window.history.pushState(null, "", hash);
          showSection(anchor, true);
          return;
        }
        let to: string;
        if (pane && area === here.area && window.matchMedia(PANE_QUERY).matches) {
          const url = new URL(location.href);
          url.searchParams.set("seite", page);
          url.hash = hash;
          to = url.pathname + url.search + url.hash;
        } else {
          to = href;
          startLoader(href);
        }
        store(ARRIVE, to);
        router.push(to, { scroll: false });
      }}
    >
      {children}
    </a>
  );
}

let firstLoad = true; // the first page of a browser visit, e.g. a copied section link pasted into the address bar

/** On a page a link just opened: go to the linked section and flash it (or start at the top).
 *  Also when the site is opened straight at a section (`…#abschnitt`). */
export function SectionArrival() {
  useEffect(() => {
    if (location.hash.length <= 1) firstLoad = false;
    if (!firstLoad && read(ARRIVE) !== urlKey()) return;
    // After PaneFrame has reset the pane to the top on mount. Cleared only once shown: a remount
    // in between (React may mount effects twice) must still find it.
    const frame = requestAnimationFrame(() => {
      firstLoad = false;
      store(ARRIVE, null);
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) showSection(id, false);
      else if (!document.querySelector(".doc-pane")) window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}

/** Back / Forward: put the window and the side pane back where they were when a link left the page.
 *  Re-applied for a moment on `popstate` and again once the router shows that URL (a slow page arrives later),
 *  unless the reader scrolls in between. */
export function ScrollMemory() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const pending = useRef<string | null>(null);
  const stop = useRef<(() => void) | undefined>(undefined);

  const restore = useCallback(() => {
    stop.current?.();
    const saved = read(POS + urlKey());
    if (!saved) return;
    const pos = JSON.parse(saved) as Pos;
    const until = performance.now() + 1200;
    let frame = 0;
    const cancel = () => {
      pending.current = null;
      stop.current?.();
    };
    const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    stop.current = () => {
      cancelAnimationFrame(frame);
      events.forEach((ev) => window.removeEventListener(ev, cancel));
      stop.current = undefined;
    };
    events.forEach((ev) => window.addEventListener(ev, cancel, { passive: true }));
    const step = () => {
      if (pos.pane !== null) document.querySelector<HTMLElement>(".doc-pane")?.scrollTo({ top: pos.pane, behavior: "instant" });
      window.scrollTo({ top: pos.win, behavior: "instant" });
      if (performance.now() < until) frame = requestAnimationFrame(step);
      else stop.current?.();
    };
    frame = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    function onPop() {
      pending.current = urlKey();
      restore();
    }
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      stop.current?.();
    };
  }, [restore]);

  // The page for the URL we went back to is on screen now.
  useEffect(() => {
    if (pending.current !== urlKey()) return;
    pending.current = null;
    restore();
  }, [pathname, search, restore]);

  return null;
}
