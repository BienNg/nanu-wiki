import { Label, tip, type TipText } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import type { NextAction } from "@/lib/messenger/nextAction";

/** The wait chip shows a clock instead of "Warten · dann"; this is what follows it ("Interesse fragen"), or null. */
function waitRest(de: string, vi: string): { de: string; vi: string } | null {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const restDe = de.replace(/^Warten(\s*·\s*(dann\s+)?)?/, "");
  const restVi = vi.replace(/^Chờ(\s*·\s*(sau đó\s+)?)?/, "");
  return restDe ? { de: cap(restDe), vi: cap(restVi) } : null;
}

type Text = { de: string; vi: string };

/** One or two words per action for the inbox row; the full sentence stays in the chat header and the tooltip. */
const SHORT: Record<string, Text> = {
  pay: { de: "Zahlungsdaten", vi: "Gửi chuyển khoản" },
  offer: { de: "Preis schicken", vi: "Gửi học phí" },
  courses: { de: "Kurse schicken", vi: "Gửi khóa học" },
  class: { de: "Kursproblem", vi: "Vấn đề lớp" },
  nudge: { de: "Follow up", vi: "Nhắc lại" },
  nudge_offer: { de: "Follow up", vi: "Nhắc lại" },
  nudge_pay: { de: "Follow up", vi: "Nhắc lại" },
  stop: { de: "Nicht schreiben", vi: "Đừng nhắn" },
  zalo: { de: "Zalo", vi: "Zalo" },
  kein_lead: { de: "Kein Lead", vi: "Không phải khách" },
  none: { de: "Nichts tun", vi: "Không cần làm" },
};

/** Short text for the inbox row. Closed chats show their state ("Verloren · Preis", "Schüler") instead of "Nichts tun". */
function shortText(action: NextAction, note: Text | null | undefined): Text {
  if (action.id === "wait") return (action.next && SHORT[action.next]) || { de: "Warten", vi: "Chờ" };
  if (action.id === "followup_wait") {
    const day = action.de.match(/\d{2}\.\d{2}\./)?.[0];
    if (day) return { de: day, vi: day };
  }
  if ((action.id === "none" || action.id === "kein_lead") && note) return note;
  return SHORT[action.id] ?? { de: action.de, vi: action.vi };
}

/** The same chip, one or two words long, for the inbox list. Waiting shows a clock. */
export function ActionChipShort({ action, note }: { action: NextAction; note?: Text | null }) {
  const text = shortText(action, note);
  const waiting = action.id === "wait" || action.id === "followup_wait";
  return (
    <span
      className={`flex min-w-0 flex-shrink items-center gap-1 rounded-full px-1.5 py-px text-[11px] font-semibold leading-[18px] transition-colors duration-150 group-aria-[current=page]:bg-white ${
        action.today ? "bg-accent-soft text-accent-dark" : "bg-chip text-muted"
      }`}
    >
      {waiting && <Icon name="clock" size={11} strokeWidth={2.2} className="flex-none" />}
      {action.id === "followup_due" && <Icon name="bell" size={11} strokeWidth={2.2} className="flex-none" />}
      <span className="truncate">
        <Label {...text} />
      </span>
    </span>
  );
}

/**
 * A manual follow-up beside another action chip: the date with a clock, amber once it is due.
 * The note is in the row's tooltip.
 */
export function FollowupChipShort({ day, due }: { day: string; due: boolean }) {
  return (
    <span
      className={`flex flex-none items-center gap-1 rounded-full px-1.5 py-px text-[11px] font-semibold leading-[18px] group-aria-[current=page]:bg-white ${
        due ? "bg-[#FDF1DC] text-[#9A5B00]" : "bg-chip text-muted"
      }`}
    >
      <Icon name={due ? "bell" : "clock"} size={11} strokeWidth={2.2} className="flex-none" />
      {day}
    </span>
  );
}

/** The next step for a chat: blue when we act today, grey with a clock while we wait. */
export function ActionChip({ action, title }: { action: NextAction; title?: TipText }) {
  const rest = action.id === "wait" ? waitRest(action.de, action.vi) : null;
  return (
    <span
      {...tip(title)}
      className={`flex min-w-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium transition-colors duration-150 group-aria-[current=page]:bg-white ${
        action.today ? "bg-accent-soft text-accent-dark" : "bg-chip text-muted"
      }`}
    >
      {action.id === "wait" ? (
        <>
          <span className="flex-none" {...tip("Warten", "Chờ")}>
            <Icon name="clock" size={12} />
          </span>
          {rest && (
            <span className="truncate">
              <Label {...rest} />
            </span>
          )}
        </>
      ) : (
        <span className="truncate">
          <Label de={action.de} vi={action.vi} />
        </span>
      )}
    </span>
  );
}
