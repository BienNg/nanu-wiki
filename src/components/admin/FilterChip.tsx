"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/Bi";

export type FilterOption = { href: string; de: string; vi: string; prefix?: string; count?: number; selected: boolean };

/**
 * One filter as a chip that shows its current value ("Bereich: Visa") and opens a small menu with the options.
 * Active (not "Alle") chips are tinted and get an ✕ that clears just this filter.
 * The menu is fixed-positioned so the chip row can scroll sideways on phones without clipping it.
 */
export function FilterChip({
  label,
  value,
  active,
  clearHref,
  options,
  compact = false,
}: {
  compact?: boolean; // phones: value only, no "Label:"
  label: { de: string; vi: string };
  value: { de: string; vi: string; prefix?: string };
  active: boolean;
  clearHref: string;
  options: FilterOption[];
}) {
  const [at, setAt] = useState<{ top: number; left: number } | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!at) return;
    const close = () => setAt(null);
    function onPointer(e: PointerEvent) {
      if (!menu.current?.contains(e.target as Node) && !button.current?.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [at]);

  function toggle() {
    if (at) return setAt(null);
    const r = button.current!.getBoundingClientRect();
    setAt({ top: r.bottom + 6, left: Math.max(8, Math.min(r.left, window.innerWidth - 268)) });
  }

  return (
    <div
      className={`flex flex-none items-center rounded-full border text-[13px] ${
        active ? "border-accent bg-accent-soft text-accent-dark" : "border-line bg-white text-body hover:border-[#C9CDD3]"
      }`}
    >
      <button ref={button} type="button" aria-haspopup="menu" aria-expanded={Boolean(at)} onClick={toggle} className="flex items-center gap-1 whitespace-nowrap py-1 pl-3 pr-2">
        <span className={`${active ? "" : "text-muted"} ${compact ? "max-sm:hidden" : ""}`}>
          <Label de={label.de} vi={label.vi} />:
        </span>
        <span className="font-medium">
          {value.prefix} <Label de={value.de} vi={value.vi} />
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="opacity-60">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {active && (
        <Link href={clearHref} aria-label="Filter entfernen · Bỏ lọc" className="-ml-1 mr-1 flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/70">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </Link>
      )}

      {at && (
        <div
          ref={menu}
          role="menu"
          className="toast-in fixed z-50 flex max-h-[min(360px,60dvh)] w-[260px] flex-col overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-xl"
          style={{ top: at.top, left: at.left }}
        >
          {options.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              role="menuitemradio"
              aria-checked={o.selected}
              onClick={() => setAt(null)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-body hover:bg-hover aria-checked:font-medium aria-checked:text-ink"
            >
              <span className="w-3.5 flex-none text-accent">{o.selected ? "✓" : ""}</span>
              <span className="min-w-0 flex-1 truncate">
                {o.prefix} <Label de={o.de} vi={o.vi} />
              </span>
              {o.count !== undefined && <span className="text-xs text-faint">{o.count}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
