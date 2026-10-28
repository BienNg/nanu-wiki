"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Esc closes the side pane – unless someone is typing or a comment popup is open (Esc closes that first). */
export function PaneEscape({ closeHref }: { closeHref: string }) {
  const router = useRouter();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      if (document.querySelector('[data-comment-ui][role="dialog"]')) return;
      router.push(closeHref, { scroll: false });
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeHref, router]);
  return null;
}
