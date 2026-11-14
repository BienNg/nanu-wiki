"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionChip } from "@/components/admin/ActionChip";
import { ChatLink } from "@/components/admin/MessengerShell";
import { SavingSpinner, useLabelSave, useLabelSaving } from "@/components/admin/labelPatch";
import { initials } from "@/lib/format";
import { matchesInboxFilter, type InboxPlace } from "@/lib/messenger/inboxPlace";
import type { ConversationView } from "@/lib/messenger/nextAction";
import { FUNNEL_INTEREST } from "@/lib/messenger/steps";

/** WhatsApp or Messenger logo on the bottom-right of a chat's avatar, as in the Messenger app. */
function ChannelBadge({ channel, account }: { channel: string | null | undefined; account: string | null | undefined }) {
  const whatsapp = channel === "whatsapp";
  const name = whatsapp ? "WhatsApp" : "Messenger";
  return (
    <span
      title={account ? `${name} · ${account}` : name}
      className={`absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white ${
        whatsapp ? "bg-[#25D366]" : "bg-[#0866FF]"
      }`}
    >
      <svg viewBox="0 0 24 24" width={whatsapp ? 10 : 9} height={whatsapp ? 10 : 9} fill="#fff" aria-label={name} role="img">
        {whatsapp ? (
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        ) : (
          <path d="M.001 11.639C.001 4.949 5.241 0 12.001 0S24 4.95 24 11.639c0 6.689-5.24 11.638-12 11.638-1.21 0-2.38-.16-3.47-.46a.96.96 0 00-.64.05l-2.39 1.05a.96.96 0 01-1.35-.85l-.07-2.14a.97.97 0 00-.32-.68A11.39 11.389 0 01.002 11.64zm8.32-2.19l-3.52 5.6c-.35.53.32 1.139.82.75l3.79-2.87c.26-.2.6-.2.87 0l2.8 2.1c.84.63 2.04.4 2.6-.48l3.52-5.6c.35-.53-.32-1.13-.82-.75l-3.79 2.87c-.25.2-.6.2-.86 0l-2.8-2.1a1.8 1.8 0 00-2.61.48z" />
        )}
      </svg>
    </span>
  );
}

export type InboxRowData = {
  id: string;
  href: string;
  name: string;
  time: string;
  preview: string;
  fromPage: boolean;
  unanswered: boolean;
  channel: string | null;
  account: string | null;
  chips: string[];
  view: ConversationView | null;
  place: InboxPlace;
};

/** One chat in the list. A saved label updates this row alone; the row leaves when it no longer matches the filter. */
export function InboxRow({ row }: { row: InboxRowData }) {
  const sp = useSearchParams();
  const interestFilter = sp.get("i") ?? "";
  const stepFilter = interestFilter === FUNNEL_INTEREST ? (sp.get("s") ?? "") : "";
  const saved = useLabelSave(row.id);
  const saving = useLabelSaving(row.id);
  const place = saved?.next ?? row.place;
  const matches = matchesInboxFilter(place, interestFilter, stepFilter);
  const [gone, setGone] = useState(!matches);
  useEffect(() => {
    if (matches) setGone(false);
  }, [matches]);
  if (!matches && gone) return null;
  const leaving = !matches;
  const chips = saved ? saved.chips : row.chips;
  const view = saved?.view ?? row.view;
  return (
    <li
      className={leaving ? "row-leave" : undefined}
      aria-hidden={leaving || undefined}
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) setGone(true);
      }}
    >
      <div>
        <ChatLink
          id={row.id}
          href={row.href}
          className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-150 hover:bg-hover aria-[current=page]:bg-accent-soft"
        >
          <span className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#E4E6EB] text-[13px] font-semibold text-ink">
            {initials(row.name)}
            {row.unanswered && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent" />}
            <ChannelBadge channel={row.channel} account={row.account} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            {chips.length > 0 && (
              <span className={`mb-0.5 flex min-w-0 items-center gap-1 ${saving ? "label-saving" : ""}`}>
                {chips.map((chip) => (
                  <span key={chip} className="flex-none rounded-full bg-chip px-1.5 py-px text-[10.5px] font-medium text-muted">
                    {chip}
                  </span>
                ))}
              </span>
            )}
            <span className="flex items-baseline gap-2">
              <span className={`min-w-0 flex-1 truncate text-[14px] ${row.unanswered ? "font-semibold text-ink" : "text-ink"}`}>{row.name}</span>
              <span className="flex flex-none items-center gap-1 text-[11.5px] text-faint">
                {saving ? <SavingSpinner size={11} /> : null}
                {row.time}
              </span>
            </span>
            <span className={`truncate text-[12.5px] ${row.unanswered ? "font-medium text-body" : "text-muted"}`}>
              {row.fromPage ? "Du: " : ""}
              {row.preview}
            </span>
            {view && (
              <span className={`mt-1 flex min-w-0 items-center ${saving ? "label-saving" : ""}`} title={view.state.de}>
                <ActionChip action={view.action} />
              </span>
            )}
          </span>
        </ChatLink>
      </div>
    </li>
  );
}
