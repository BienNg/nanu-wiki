"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="h-8 rounded-md bg-chip px-2.5 text-xs font-medium text-ink hover:bg-line"
    >
      {copied ? "✓ Kopiert · Đã sao chép" : "Kopieren · Sao chép"}
    </button>
  );
}
