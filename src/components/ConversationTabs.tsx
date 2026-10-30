"use client";

import { useEffect, useRef, useState } from "react";
import type { Block, CommentAnchor, ConversationTab } from "@/lib/types";
import { Label } from "./Bi";
import { MessengerMockup } from "./MessengerMockup";
import { contentChanged } from "./commentDom";
import { defaultSelection, resolveConversation } from "@/lib/dialogue";
import { similarity } from "@/lib/anchorMatch";

type ConversationTabsBlock = Extract<Block, { type: "conversation_tabs" }>;

/** A tab's messages as shown with its start selection (`{tokens}` filled): Vietnamese and German. */
function shownText(t: ConversationTab) {
  const messages = resolveConversation(t, defaultSelection(t)).messages;
  return [messages.map((m) => m.text).join(" "), messages.map((m) => m.translation_de ?? "").join(" ")];
}

/** The tab a comment was written on: saved with it, or (older comments) the tab whose shown text is most like the quote.
 *  Its text may have been rewritten since, so the words are compared, not matched exactly. */
function tabOf(tabs: ConversationTab[], a: NonNullable<CommentAnchor>) {
  const saved = tabs.findIndex((t) => t.tab_de === a.tab);
  if (saved >= 0) return saved;
  if (!a.exact) return -1;
  let best = -1;
  let bestScore = 0.15;
  tabs.forEach((t, i) => {
    const score = Math.max(...shownText(t).map((text) => similarity(a.exact!, text)));
    if (score > bestScore) [best, bestScore] = [i, score];
  });
  return best;
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
