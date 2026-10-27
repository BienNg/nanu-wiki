"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_MESSAGE = "Noch nicht verfügbar · Chưa có nội dung";
const SHOW_MS = 2600;

/**
 * Catches clicks on placeholder links (`href="#"`) app-wide and shows a short toast instead
 * of doing nothing. A link can set its own text with `data-toast="…"`.
 */
export function Toaster() {
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.('a[href="#"]');
      if (!(a instanceof HTMLAnchorElement)) return;
      e.preventDefault();
      clearTimeout(timer.current);
      setToast({ id: Date.now(), text: a.dataset.toast || DEFAULT_MESSAGE });
      timer.current = setTimeout(() => setToast(null), SHOW_MS);
    }
    // Capture phase: cancel before next/link sees the click (it skips default-prevented events).
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          role="status"
          className="toast-in flex max-w-[420px] items-center gap-2 rounded-lg bg-ink px-3.5 py-2.5 text-[13px] font-medium text-white shadow-lg"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="flex-none opacity-80">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" />
          </svg>
          {toast.text}
        </div>
      )}
    </div>
  );
}
