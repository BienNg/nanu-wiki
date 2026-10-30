import { initials } from "@/lib/format";
import type { Conversation } from "@/lib/types";
import { Bi, Label } from "./Bi";

/** Static Messenger example: a finished conversation between a customer and NaNu NaNa ("me"), nothing to type. */
export function MessengerMockup({ block }: { block: Conversation }) {
  const messages = block.messages.filter((m) => m.text.trim());
  return (
    <figure data-reveal className="m-0 overflow-hidden rounded-[14px] border border-line shadow-[0_6px_20px_rgba(16,24,40,.06)]">
      <div className="flex items-center gap-2.5 border-b border-line bg-white px-3.5 py-2.5">
        <span className="relative flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#E4E6EB] text-[13px] font-semibold text-ink">
          {initials(block.customer)}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#31A24C]" />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <strong className="truncate text-sm font-semibold text-ink">{block.customer || "Kunde"}</strong>
          <span className="text-xs text-muted">Messenger</span>
        </span>
        <span className="cap ml-auto rounded-full bg-chip px-2.5 py-1">
          <Label de={block.label_de ?? "Beispiel"} vi={block.label_vi ?? "Ví dụ"} />
        </span>
      </div>

      <div role="log" aria-label="Beispielchat" className="flex flex-col gap-1.5 bg-white px-3.5 py-4">
        {messages.map((m, i) => {
          const mine = m.from === "me";
          const next = messages[i + 1];
          const nextSame = next?.from === m.from && !next.stamp_de;
          return (
            <div key={i} className="contents">
              {m.stamp_de && (
                <span className="my-2 self-center text-center text-[11px] font-medium text-faint">
                  <Label de={m.stamp_de} vi={m.stamp_vi ?? m.stamp_de} />
                </span>
              )}
              <div className={`flex max-w-[78%] flex-col ${mine ? "items-end self-end" : "items-start self-start"} ${nextSame ? "" : "mb-2"}`}>
                <span
                  className={`whitespace-pre-line rounded-[18px] px-3.5 py-2 text-[14px] leading-snug ${
                    mine ? "bg-accent text-white" : "bg-[#F0F0F0] text-ink"
                  }`}
                >
                  {m.text}
                </span>
                {m.translation_de && <span className={`de mt-1 px-1 text-xs italic text-muted ${mine ? "text-right" : ""}`}>{m.translation_de}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {(block.note_de || block.goal_de) && (
        <figcaption className="flex flex-col gap-2 border-t border-line bg-side px-3.5 py-2.5 text-[13px] leading-relaxed text-body">
          {block.note_de && (
            <span>
              <Bi de={block.note_de} vi={block.note_vi} />
            </span>
          )}
          {block.goal_de && (
            <span>
              <strong className="cap mb-0.5 block text-accent">
                <Label de="Ziel der nächsten Nachricht" vi="Mục tiêu của tin nhắn tiếp theo" />
              </strong>
              <Bi de={block.goal_de} vi={block.goal_vi} />
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
