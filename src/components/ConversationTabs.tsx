"use client";

import { useEffect, useRef, useState } from "react";
import type { Block, CommentAnchor, ConversationTab } from "@/lib/types";
import { Label } from "./Bi";
import { MessengerMockup } from "./MessengerMockup";
import { contentChanged } from "./commentDom";

type ConversationTabsBlock = Extract<Block, { type: "conversation_tabs" }>;

const words = (t: string) => t.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

/** The tab a comment was written on: saved with it, or (older comments) the tab whose text has most of its words.
 *  The text on screen is filled from `{tokens}`, so the quote never matches a tab's content exactly. */
function tabOf(tabs: ConversationTab[], a: NonNullable<CommentAnchor>) {
  const saved = tabs.findIndex((t) => t.tab_de === a.tab);
  if (saved >= 0) return saved;
  const quote = words(a.exact ?? "");
  if (!quote.length) return -1;
  let best = -1;
  let bestScore = 0;
  tabs.forEach((t, i) => {
    const own = new Set(words(JSON.stringify(t)));
    const score = quote.filter((w) => own.has(w)).length / quote.length;
    if (score > bestScore) [best, bestScore] = [i, score];
  });
  return bestScore >= 0.5 ? best : -1;
}

/** Several static Messenger examples behind one row of tabs; only the chosen one is shown.
 *  Focusing a comment on another tab switches to that tab (see `revealAnchor`). */
export function ConversationTabs({ block }: { block: ConversationTabsBlock }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const tab = block.tabs[active];

  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("[data-block]");
    if (!host) return;
    function onReveal(e: Event) {
      const i = tabOf(block.tabs, (e as CustomEvent<NonNullable<CommentAnchor>>).detail);
      if (i < 0 || i === active) return;
      e.preventDefault();
      setActive(i);
    }
    host.addEventListener("comment-reveal", onReveal);
    return () => host.removeEventListener("comment-reveal", onReveal);
  }, [block.tabs, active]);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) return void (first.current = false);
    if (ref.current) contentChanged(ref.current);
  }, [active]);

  return (
    <div ref={ref} className="flex min-w-0 flex-col gap-2.5">
      <div role="tablist" aria-label="Beispiele" className="flex flex-wrap gap-1.5">
        {block.tabs.map((t, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full border px-3 py-1 text-[13px] font-medium transition-colors ${
              i === active ? "border-accent bg-accent text-white" : "border-line bg-white text-body hover:bg-chip"
            }`}
          >
            <Label de={t.tab_de} vi={t.tab_vi} />
          </button>
        ))}
      </div>
      <div role="tabpanel" data-tab={tab.tab_de}>
        <MessengerMockup key={active} block={tab} />
      </div>
    </div>
  );
}
