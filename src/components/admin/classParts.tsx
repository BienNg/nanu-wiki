"use client";

import { Label, tip, type TipText } from "@/components/Bi";
import { Icon, type AnyIcon } from "@/components/Icon";
import { shortDate } from "@/lib/classes";
import { classToday, hasStarted, type AssignableClass } from "@/lib/messenger/classes";

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
