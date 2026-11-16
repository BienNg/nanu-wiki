"use client";

import { useEffect, useRef, useState } from "react";
import { tip } from "@/components/Bi";

/** A small icon button that puts the person's name on the clipboard, with a short ✓ as feedback. */
export function CopyName({ name, className }: { name: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      aria-label="Namen kopieren · Sao chép tên"
      {...tip("Namen kopieren", "Sao chép tên")}
      onClick={() => {
        navigator.clipboard
          .writeText(name)
          .then(() => {
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1500);
          })
          .catch(() => {});
      }}
      className={`flex h-5 w-5 flex-none items-center justify-center rounded text-muted transition-colors hover:bg-hover hover:text-ink ${className ?? ""}`}
    >
      {copied ? (
        <span aria-hidden="true" className="text-[11px] font-semibold text-[#31A24C]">
          ✓
        </span>
      ) : (
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
          <path d="M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3.5V9A1.5 1.5 0 0 0 4 10.5h1.5" />
        </svg>
      )}
    </button>
  );
}
