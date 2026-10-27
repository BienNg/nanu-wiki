"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "both", label: "DE+VI" },
  { value: "de", label: "DE" },
  { value: "vi", label: "VI" },
];

/** Switches language instantly by swapping the class on <html>;
 *  the choice is remembered in a cookie for server rendering.
 *  Once the bar scrolls away, the control pins to the top of its
 *  own column and collapses to the current language until it is opened. */
export function LangToggle({ initial }: { initial: Lang }) {
  const [lang, setLang] = useState<Lang>(initial);
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [pinRight, setPinRight] = useState<number | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stuckRef = useRef(false);
  const expanded = !stuck || open;

  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const slot: HTMLDivElement = el;

    let frame = 0;
    function update() {
      const rect = slot.getBoundingClientRect();
      const next = rect.top < 8;
      if (next !== stuckRef.current) {
        stuckRef.current = next;
        setStuck(next);
        if (!next) setOpen(false);
      }
      if (!next) return;
      const right = Math.max(0, window.innerWidth - rect.right);
      setPinRight((prev) => (prev !== null && Math.abs(prev - right) < 0.5 ? prev : right));
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!stuck || !open) return;
    function onPointer(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [stuck, open]);

  function choose(next: Lang) {
    setLang(next);
    const html = document.documentElement;
    html.classList.remove("lang-both", "lang-de", "lang-vi");
    html.classList.add(`lang-${next}`);
    html.lang = next === "vi" ? "vi" : "de";
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    if (stuckRef.current) setOpen(false);
  }

  return (
    <div ref={slotRef} className="relative h-8">
      <div aria-hidden="true" className="invisible flex h-8 gap-0.5 p-0.5">
        {OPTIONS.map((option) => (
          <span key={option.value} className="h-7 px-2.5 text-xs font-medium">
            {option.label}
          </span>
        ))}
      </div>
      <div
        ref={panelRef}
        role="group"
        aria-label="Sprache · Ngôn ngữ"
        aria-expanded={stuck ? open : undefined}
        className={`flex rounded-[7px] bg-chip p-0.5 transition-[box-shadow,gap] duration-200 ease-out motion-reduce:transition-none ${
          expanded ? "gap-0.5" : "gap-0"
        } ${
          stuck
            ? "fixed top-2 z-30 shadow-[0_1px_2px_rgba(20,24,32,0.06),0_8px_20px_rgba(20,24,32,0.1)]"
            : "absolute inset-y-0 right-0"
        }`}
        style={stuck && pinRight !== null ? { right: pinRight } : undefined}
      >
        {OPTIONS.map((option) => {
          const shown = expanded || option.value === lang;
          return (
            <div
              key={option.value}
              className={`grid min-w-0 overflow-hidden transition-[grid-template-columns,opacity] duration-200 ease-out motion-reduce:transition-none ${
                shown ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
              }`}
            >
              <div className="min-w-0 overflow-hidden">
                <button
                  type="button"
                  tabIndex={shown ? 0 : -1}
                  aria-pressed={option.value === lang}
                  aria-hidden={shown ? undefined : true}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!expanded) {
                      setOpen(true);
                      return;
                    }
                    choose(option.value);
                  }}
                  className="h-7 whitespace-nowrap rounded-[5px] px-2.5 text-xs font-medium text-[#4A4F57] aria-pressed:bg-accent-soft aria-pressed:text-accent-dark"
                >
                  {option.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
