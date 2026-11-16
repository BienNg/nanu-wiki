"use client";

import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { useEffect, useRef } from "react";

/** Wait before the first tooltip shows; moving on to the next element within REPEAT_MS shows it at once. */
const DELAY_MS = 120;
const REPEAT_MS = 400;

/**
 * One tooltip for the whole app: every element with a `title` (or `data-tip`) gets a black tooltip with
 * white text that opens fast, instead of the browser's slow grey one. Nothing to change where a title is set.
 * The title moves to `data-tip` on first hover so the browser's own tooltip does not show as well;
 * an element whose name was only its title keeps it as `aria-label`.
 */
export function TooltipLayer() {
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tip = tipRef.current;
    if (!tip) return;
    let current: Element | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let hiddenAt = 0;

    const textOf = (el: Element) => {
      const title = el.getAttribute("title");
      if (title) {
        el.setAttribute("data-tip", title);
        el.removeAttribute("title");
        if (!el.hasAttribute("aria-label") && !el.textContent?.trim()) el.setAttribute("aria-label", title);
      }
      return el.getAttribute("data-tip") ?? "";
    };

    const hide = () => {
      clearTimeout(timer);
      if (current && tip.dataset.open === "true") hiddenAt = Date.now();
      current = null;
      tip.dataset.open = "false";
    };

    const show = (el: Element) => {
      const text = textOf(el);
      if (!text) return hide();
      if (el === current) return;
      clearTimeout(timer);
      current = el;
      const open = () => {
        if (current !== el || !el.isConnected) return;
        tip.textContent = text;
        computePosition(el, tip, { placement: "top", strategy: "fixed", middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })] }).then(({ x, y, placement }) => {
          if (current !== el) return;
          tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
          tip.dataset.side = placement.split("-")[0];
          tip.dataset.open = "true";
        });
      };
      if (Date.now() - hiddenAt < REPEAT_MS || tip.dataset.open === "true") open();
      else timer = setTimeout(open, DELAY_MS);
    };

    const find = (target: EventTarget | null) => (target instanceof Element ? target.closest("[title], [data-tip]") : null);

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = find(e.target);
      if (el) show(el);
      else if (current) hide();
    };
    const onOut = (e: PointerEvent) => {
      if (current && !(e.relatedTarget instanceof Node && current.contains(e.relatedTarget))) hide();
    };
    const onFocus = (e: FocusEvent) => {
      const el = find(e.target);
      if (el && e.target instanceof Element && e.target.matches(":focus-visible")) show(el);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerdown", hide, true);
    document.addEventListener("scroll", hide, true);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", hide);
    document.addEventListener("keydown", onKey);
    window.addEventListener("blur", hide);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", hide, true);
      document.removeEventListener("scroll", hide, true);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div
      ref={tipRef}
      role="tooltip"
      data-open="false"
      className="tooltip pointer-events-none fixed left-0 top-0 z-[1000] max-w-[280px] whitespace-pre-line rounded-md bg-black px-2 py-1 text-[12px] font-medium leading-snug text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
    />
  );
}
