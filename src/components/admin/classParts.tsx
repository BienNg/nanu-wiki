"use client";

import { Label, tip, type TipText } from "@/components/Bi";
import { Icon, type AnyIcon } from "@/components/Icon";
import { shortDate } from "@/lib/classes";
import { classToday, hasStarted, OFFER_INFO, OFFER_STATES, type AssignableClass, type OfferState } from "@/lib/messenger/classes";

/** Shared pieces of the class cards in the Kurse panel and on /admin/messenger/klassen. */

const WEEKDAY = { de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] };

/** Whole days from today (class timezone) to an ISO date; negative once it has passed. */
export function daysUntil(iso: string) {
  const ms = Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${classToday()}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-md px-1.5 py-px text-[11px] font-semibold leading-[18px] ${className}`}>{children}</span>;
}

export function Fact({ icon, children, title }: { icon: AnyIcon; children: React.ReactNode; title?: TipText }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1" {...tip(title)}>
      <Icon name={icon} size={13} strokeWidth={2} className="flex-none text-faint" />
      {children}
    </span>
  );
}

/** "Mo, 16.11. · in 3 Tagen" / "läuft seit 5 T." / "Start noch offen". */
export function ClassWhen({ c }: { c: Pick<AssignableClass, "begin"> }) {
  if (!c.begin) {
    return (
      <span className="text-faint">
        <Label de="Start noch offen" vi="Chưa có ngày khai giảng" />
      </span>
    );
  }
  const when = shortDate(c.begin);
  const days = daysUntil(c.begin);
  const wd = new Date(`${c.begin}T00:00:00Z`).getUTCDay();
  return (
    <span className="truncate">
      <span className="font-medium">
        <Label de={`${WEEKDAY.de[wd]}, ${when.de}`} vi={`${WEEKDAY.vi[wd]}, ${when.vi}`} />
      </span>
      <span className="text-faint">
        {" · "}
        {days === 0 ? (
          <Label de="heute" vi="hôm nay" />
        ) : hasStarted(c) ? (
          <Label de={`läuft seit ${-days} T.`} vi={`đã học ${-days} ngày`} />
        ) : days === 1 ? (
          <Label de="morgen" vi="ngày mai" />
        ) : (
          <Label de={`in ${days} Tagen`} vi={`còn ${days} ngày`} />
        )}
      </span>
    </span>
  );
}

/** Sticky section heading with a count, over a list that scrolls. `bg` must match the surface behind it. */
export function SectionHead({ children, count, bg = "bg-[#F6F7F9]/95" }: { children: React.ReactNode; count?: number; bg?: string }) {
  return (
    <h3 className={`sticky top-0 z-[1] m-0 flex items-center gap-1.5 px-1 pb-1.5 pt-3 text-[11.5px] font-semibold text-muted backdrop-blur first:pt-1 ${bg}`}>
      {children}
      {count != null && <span className="rounded-full bg-[#E6E8EC] px-1.5 text-[10.5px] font-semibold leading-4 text-muted">{count}</span>}
    </h3>
  );
}

/** Stores the special-offer status of one chat on one class; rejects when the server did not save it. */
export async function saveOffer(conversationId: string, classId: string, offer: OfferState) {
  const r = await fetch("/api/messenger/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ c: conversationId, k: classId, offer }),
  });
  if (!r.ok) throw new Error(String(r.status));
}

/** Colour of each offer status: open is neutral, sent is green, skipped is grey. */
export const OFFER_TONE: Record<OfferState, string> = {
  offen: "bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.12)]",
  geschickt: "bg-[#1B8A6B] text-white shadow-[0_1px_2px_rgba(16,24,40,0.12)]",
  uebersprungen: "bg-[#8A909A] text-white shadow-[0_1px_2px_rgba(16,24,40,0.12)]",
};

/** Offen / Geschickt / Übersprungen as one segmented switch, for the special offer of one chat on one class. */
export function OfferSwitch({
  value,
  onChange,
  busy = false,
  size = "md",
  full = false,
}: {
  value: OfferState;
  onChange: (next: OfferState) => void;
  busy?: boolean;
  size?: "sm" | "md";
  /** Stretch over the whole width, segments sharing it equally. */
  full?: boolean;
}) {
  const sm = size === "sm";
  return (
    <span role="radiogroup" aria-label="Sonderangebot" className={`${full ? "flex w-full" : "inline-flex"} rounded-lg bg-[#ECEEF1] p-0.5 ${busy ? "opacity-60" : ""}`}>
      {OFFER_STATES.map((state) => {
        const active = state === value;
        return (
          <button
            key={state}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={busy}
            onClick={() => !active && onChange(state)}
            className={`inline-flex items-center justify-center gap-1 rounded-md font-semibold transition-colors disabled:cursor-wait ${full ? "flex-1" : ""} ${sm ? "px-1.5 py-0.5 text-[11px]" : "px-2.5 py-1 text-[12px]"} ${
              active ? OFFER_TONE[state] : "text-muted hover:text-ink"
            }`}
          >
            {state === "geschickt" && <Icon name="check" size={sm ? 11 : 12} strokeWidth={2.6} />}
            <Label de={OFFER_INFO[state].de} vi={OFFER_INFO[state].vi} />
          </button>
        );
      })}
    </span>
  );
}
