"use client";

import { useState } from "react";
import type { Block } from "@/lib/types";
import { Label } from "./Bi";
import { MessengerMockup } from "./MessengerMockup";

type ConversationTabsBlock = Extract<Block, { type: "conversation_tabs" }>;

/** Several static Messenger examples behind one row of tabs; only the chosen one is shown. */
export function ConversationTabs({ block }: { block: ConversationTabsBlock }) {
  const [active, setActive] = useState(0);
  const tab = block.tabs[active];
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
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
      <div role="tabpanel">
        <MessengerMockup key={active} block={tab} />
      </div>
    </div>
  );
}
