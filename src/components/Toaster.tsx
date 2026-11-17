"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_MESSAGE = "Noch nicht verfügbar · Chưa có nội dung";
const SHOW_MS = 2600;
/** A toast with a button (e.g. "Rückgängig") stays longer, so there is time to click it. */
const ACTION_MS = 6000;
const EVENT = "nanu:toast";

export type ToastAction = { label: string; onClick: () => void };
type ToastDetail = { text: string; action?: ToastAction };

/** Shows a short message at the bottom of the screen, from any client component; `action` adds a button to it. */
export function toast(text: string, action?: ToastAction) {
  window.dispatchEvent(new CustomEvent<ToastDetail>(EVENT, { detail: { text, action } }));
}

/**
 * Shows the messages sent with `toast()`. Also catches clicks on placeholder links (`href="#"`)
 * app-wide and shows a short toast instead of doing nothing. A link can set its own text with `data-toast="…"`.
 */
export function Toaster() {
  const [toast, setToast] = useState<({ id: number } & ToastDetail) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function show(text: string, action?: ToastAction) {
      clearTimeout(timer.current);
      setToast({ id: Date.now(), text, action });
      timer.current = setTimeout(() => setToast(null), action ? ACTION_MS : SHOW_MS);
    }
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.('a[href="#"]');
      if (!(a instanceof HTMLAnchorElement)) return;
      e.preventDefault();
      show(a.dataset.toast || DEFAULT_MESSAGE);
    }
    function onToast(e: Event) {
      const { text, action } = (e as CustomEvent<ToastDetail>).detail;
      show(text, action);
    }
    // Capture phase: cancel before next/link sees the click (it skips default-prevented events).
    document.addEventListener("click", onClick, true);
    window.addEventListener(EVENT, onToast);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(EVENT, onToast);
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
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                clearTimeout(timer.current);
                setToast(null);
              }}
              className="pointer-events-auto -my-1 ml-1 flex-none rounded-md px-2 py-1 font-semibold text-[#9EC2FF] transition-colors hover:bg-white/10"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
