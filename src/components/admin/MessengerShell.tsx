"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Label } from "@/components/Bi";
import { useLabelAdjust } from "@/components/admin/labelPatch";
import { FUNNEL_INTEREST } from "@/lib/messenger/steps";

/**
 * Frame of the inbox. Tells its children through data attributes
 *  - whether a chat is open (`data-chat`), which only matters on phones, and
 *  - whether a filter, search, or "Mehr laden" is loading (`data-busy`). A label save does not.
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
      onSubmitCapture={(e) => {
        if ((e.target as HTMLElement).closest?.("form[data-inbox-search]")) setBusy(true);
      }}
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

type FunnelStep = { id: string; de: string; vi: string; count: number; href: string; aim_de?: string; aim_vi?: string };

/**
 * "Alle" is a total, not a step, so it gets its own tile on the left. The steps follow as one
 * numbered chevron pipeline; each shows its count big, its name and, below, what to do in it.
 */
export function FunnelNav({ steps, current, stamp }: { steps: FunnelStep[]; current: string | null; stamp: number }) {
  const [picked, setPicked] = useState<string | null>(null);
  const adjust = useLabelAdjust();
  useEffect(() => setPicked(null), [current, stamp]);
  const shown = picked ?? current;
  const countOf = (step: FunnelStep) =>
    step.count + (step.id === "q" ? adjust.qualify : step.id === "" ? (adjust.interest[FUNNEL_INTEREST] ?? 0) : (adjust.step[step.id] ?? 0));
  const onPick = (id: string) => (e: React.MouseEvent) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) setPicked(id);
  };
  const all = steps.find((s) => s.id === "");
  const stages = steps.filter((s) => s.id !== "");
  return (
    <div className="flex min-w-0 flex-1 items-stretch gap-3 overflow-x-auto">
      {all && (
        <Link
          href={all.href}
          scroll={false}
          data-filter=""
          aria-current={shown === "" ? "page" : undefined}
          onClick={onPick("")}
          title={all.aim_de}
          className={`flex w-[108px] flex-none flex-col justify-center rounded-xl border px-3.5 py-2 leading-tight transition-colors duration-200 ease-out ${
            shown === "" ? "border-accent bg-accent text-white" : "border-line bg-white text-muted hover:bg-hover"
          }`}
        >
          <span className="text-[11.5px] font-medium">
            <Label de={all.de} vi={all.vi} />
          </span>
          <span className={`mt-0.5 text-[22px] font-semibold tabular-nums ${shown === "" ? "text-white" : "text-ink"}`}>{countOf(all)}</span>
        </Link>
      )}
      <ol className="m-0 flex min-w-0 flex-1 list-none gap-0.5 p-0">
        {stages.map((step, i) => {
          const active = shown === step.id;
          const n = countOf(step);
          const first = i === 0;
          const last = i === stages.length - 1;
          return (
            <li key={step.id} className="flex min-w-[132px] flex-1">
              <Link
                href={step.href}
                scroll={false}
                data-filter=""
                aria-current={active ? "page" : undefined}
                onClick={onPick(step.id)}
                title={step.aim_de ? `${step.aim_de} · ${step.aim_vi ?? ""}` : undefined}
                style={{
                  clipPath: first
                    ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)"
                    : last
                      ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)"
                      : "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)",
                }}
                className={`flex min-w-0 flex-1 flex-col justify-center py-2 leading-tight transition-colors duration-200 ease-out ${first ? "rounded-l-xl pl-3.5" : "pl-6"} ${last ? "rounded-r-xl pr-3.5" : "pr-5"} ${
                  active ? "bg-accent text-white" : "bg-[#F0F2F5] text-muted hover:bg-[#E4E6EB]"
                }`}
              >
                <span className="flex items-center gap-1.5 text-[12px] font-medium">
                  <span
                    className={`flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] font-semibold tabular-nums ${
                      active ? "bg-white/25 text-white" : "bg-white text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`truncate ${active ? "text-white" : "text-body"}`}>
                    <Label de={step.de} vi={step.vi} />
                  </span>
                </span>
                <span className={`mt-0.5 text-[22px] font-semibold tabular-nums ${active ? "text-white" : n === 0 ? "text-faint" : "text-ink"}`}>{n}</span>
                {step.aim_de && (
                  <span className={`truncate text-[11px] ${active ? "text-white/80" : "text-faint"}`}>
                    <Label de={step.aim_de} vi={step.aim_vi ?? step.aim_de} />
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
