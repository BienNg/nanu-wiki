"use client";

import { forwardRef } from "react";
import { initials } from "@/lib/format";

/** Building blocks shared by the Messenger mockups (MessengerMockup, MessengerSim, ReplyAssistant). */

/** Top bar of a Messenger chat: avatar with green "online" dot, name, a status line and optional actions on the right. */
export function MessengerHeader({ name, status, actions }: { name: string; status: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-line bg-white px-3.5 py-2.5">
      <span className="relative flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#E4E6EB] text-[13px] font-semibold text-ink">
        {initials(name)}
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#31A24C]" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <strong className="truncate text-sm font-semibold text-ink">{name || "Kunde"}</strong>
        <span className="text-xs text-muted">{status}</span>
      </span>
      {actions && <span className="ml-auto flex items-center gap-1.5">{actions}</span>}
    </div>
  );
}

/** One message bubble: grey on the left for the customer, blue on the right for us. */
export function bubbleClass(mine: boolean) {
  return `block whitespace-pre-line rounded-[18px] px-3.5 py-2 text-[14px] leading-snug ${mine ? "bg-accent text-white" : "bg-[#F0F0F0] text-ink"}`;
}

/** The row around a bubble; `last` = last bubble of a run from the same sender (adds space below). */
export function bubbleRowClass(mine: boolean, last: boolean) {
  return `flex max-w-[78%] flex-col ${mine ? "items-end self-end" : "items-start self-start"} ${last ? "mb-2" : ""}`;
}

/** Three bouncing dots: the other side is typing. */
export function TypingDots({ mine = false, label = "schreibt" }: { mine?: boolean; label?: string }) {
  return (
    <div className={`flex items-center gap-1 rounded-[18px] px-3.5 py-3 ${mine ? "self-end bg-accent-soft" : "self-start bg-[#F0F0F0]"}`} aria-label={label}>
      {[0, 1, 2].map((k) => (
        <span key={k} className={`h-1.5 w-1.5 animate-bounce rounded-full ${mine ? "bg-accent" : "bg-faint"}`} style={{ animationDelay: `${k * 0.15}s` }} />
      ))}
    </div>
  );
}

/** Paper-plane send icon of Messenger. */
export function SendIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" />
    </svg>
  );
}

/** The rounded "Aa" text field of Messenger; grows with its content. */
export const ComposerField = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function ComposerField(
  { className = "", ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={1}
      {...props}
      className={`max-h-40 min-h-[38px] flex-1 [field-sizing:content] resize-none rounded-[19px] bg-[#F0F2F5] px-3.5 py-2 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-accent-soft ${className}`}
    />
  );
});
