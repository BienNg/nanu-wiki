"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "./Bi";

/** Distance below the top of the scroller at which a heading counts as "being read". */
const READ_LINE = 120;

/**
 * Table of contents beside a page: sticks vertically centered while the page scrolls
 * (the window on the full page, the pane itself in the side pane) and marks the section being read.
 * `height` = the visible height of that scroller, so the list stays centered in it.
 */
export function DocToc({ headings, height }: { headings: { id: string; de: string; vi: string }[]; height: string }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | undefined>(headings[0]?.id);

  useEffect(() => {
    const pane = ref.current?.closest<HTMLElement>(".doc-pane") ?? null;
    const target: HTMLElement | Window = pane ?? window;
    let frame = 0;
    function update() {
      const top = pane ? pane.getBoundingClientRect().top : 0;
      const els = headings.flatMap((h) => document.getElementById(h.id) ?? []);
      const atEnd = pane
        ? pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 4
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      const passed = els.filter((el) => el.getBoundingClientRect().top - top <= READ_LINE);
      setActive((atEnd ? els.at(-1) : passed.at(-1) ?? els[0])?.id);
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return (
    <nav
      ref={ref}
      aria-label="Inhaltsverzeichnis"
      className="sticky top-0 flex flex-col overflow-y-auto py-6"
      style={{ height, justifyContent: "safe center" }} // "safe": a long list starts at the top instead of being cut off
    >
      <span className="cap px-3 pb-2">
        <Label de="Inhalt" vi="Mục lục" />
      </span>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          aria-current={h.id === active ? "location" : undefined}
          onClick={(e) => {
            const el = document.getElementById(h.id);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", `#${h.id}`);
            setActive(h.id);
          }}
          className="border-l-2 border-transparent py-1 pl-3 text-[13px] leading-snug text-muted transition-colors hover:text-ink aria-[current=location]:border-accent aria-[current=location]:font-medium aria-[current=location]:text-ink"
        >
          <Label de={h.de} vi={h.vi || h.de} />
        </a>
      ))}
    </nav>
  );
}
