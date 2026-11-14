"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Label } from "@/components/Bi";

/**
 * Frame of the inbox. Tells its children through data attributes
 *  - whether a chat is open (`data-chat`), which only matters on phones, and
 *  - whether a filter or search is loading (`data-busy`), so the list can show its skeleton.
 * `stamp` changes with every server render; that is the sign that the new list has arrived.
 */
export function MessengerShell({ stamp, className, children }: { stamp: number; className?: string; children: ReactNode }) {
  const open = !!useSearchParams().get("c");
  const [busy, setBusy] = useState(false);
  useEffect(() => setBusy(false), [stamp]);
  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => setBusy(false), 15_000);
    return () => clearTimeout(t);
  }, [busy]);

  return (
    <div
      data-chat={open ? "open" : "none"}
      data-busy={busy}
      className={`group/shell ${className ?? ""}`}
      onClickCapture={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as Element).closest?.("a[data-filter]");
        if (a && a.getAttribute("aria-current") !== "page") setBusy(true);
      }}
      onSubmitCapture={() => setBusy(true)}
    >
      {children}
    </div>
  );
}

/**
 * A row of the inbox. Opening a chat only changes `?c=` in the address bar (no server round trip for
 * the list); <ThreadPane> sees the new id and loads that one chat.
 */
export function ChatLink({ id, href, className, children }: { id: string; href: string; className?: string; children: ReactNode }) {
  const current = useSearchParams().get("c") === id;
  return (
    <a
      href={href}
      data-pane=""
      aria-current={current ? "page" : undefined}
      className={className}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (!current) window.history.pushState(null, "", href);
      }}
    >
      {children}
    </a>
  );
}

/**
 * "Mehr laden" under the list. The server does not know which chat is open (opening one only changes
 * the address bar), so the open chat is added here and stays open while the longer list loads.
 */
export function MoreLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const open = useSearchParams().get("c");
  const target = open ? `${href}${href.includes("?") ? "&" : "?"}c=${encodeURIComponent(open)}` : href;
  return (
    <Link href={target} scroll={false} data-filter="" className={className}>
      {children}
    </Link>
  );
}

type FunnelStep = { id: string; de: string; vi: string; count: number; href: string };

/**
 * The step funnel. The step you click lights up at once (before the server has answered), so the
 * click feels immediate; the list below dims and then fades to the new result.
 * `current` is the step the server rendered (null: no step of this funnel is chosen).
 */
export function FunnelNav({ steps, current, stamp }: { steps: FunnelStep[]; current: string | null; stamp: number }) {
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => setPicked(null), [current, stamp]);
  const shown = picked ?? current;
  return (
    <div className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto">
      {steps.map((step, i) => {
        const active = shown === step.id;
        return (
          <Link
            key={step.id || "all"}
            href={step.href}
            scroll={false}
            data-filter=""
            aria-current={active ? "page" : undefined}
            onClick={(e) => {
              if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) setPicked(step.id);
            }}
            style={{
              clipPath:
                i === 0
                  ? "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)"
                  : "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)",
            }}
            className={`flex min-w-[92px] flex-1 flex-col py-1.5 leading-tight transition-colors duration-300 ease-out ${i === 0 ? "rounded-l-lg pl-3" : "pl-5"} pr-4 ${
              active ? "bg-accent-soft text-accent-dark" : "bg-[#F0F2F5] text-muted hover:bg-[#E4E6EB]"
            }`}
          >
            <span className={`text-[17px] font-semibold tabular-nums transition-colors duration-300 ease-out ${active ? "text-accent-dark" : "text-ink"}`}>{step.count}</span>
            <span className="truncate text-[11.5px]">
              <Label de={step.de} vi={step.vi} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
