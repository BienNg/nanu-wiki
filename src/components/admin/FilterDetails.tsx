"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** A <details> dropdown that closes after a choice, on a click outside, or on Escape. */
export function FilterDetails({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: Event) => {
      const el = ref.current;
      if (!el?.open) return;
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") el.open = false;
        return;
      }
      const target = e.target as Node;
      if (!el.contains(target) || (target instanceof Element && target.closest("a"))) el.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  return (
    <details ref={ref} className={className}>
      {children}
    </details>
  );
}
