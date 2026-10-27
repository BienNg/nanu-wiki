"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Fades and lifts every child marked with `data-reveal` in a short stagger.
 *  Respects "reduce motion". */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 14,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.06,
        clearProps: "all",
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Progress bar whose fill animates to `value` (0–100). */
export function AnimatedBar({ value, color = "#2C6ECB", track = "#EDEDEA", height = 6 }: { value: number; color?: string; track?: string; height?: number }) {
  const fill = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(fill.current, { width: `${value}%`, duration: 0.8, ease: "power3.out" });
    },
    { dependencies: [value] },
  );

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="overflow-hidden rounded-full"
      style={{ background: track, height }}
    >
      <div ref={fill} className="h-full rounded-full" style={{ width: 0, background: color }} />
    </div>
  );
}
