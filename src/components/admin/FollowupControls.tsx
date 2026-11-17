"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { closeFollowup, setFollowup, type FollowupResult } from "@/app/(app)/admin/messenger/actions";
import { Label, tip } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { publishLabelSave } from "@/components/admin/labelPatch";
import { toast } from "@/components/Toaster";
import { formatVnDate } from "@/lib/messenger/classify";
import { addDays, daysBetween, NOTE_MAX, shortDay, type Followup } from "@/lib/messenger/followups";
import type { ChatFollowups } from "@/lib/messenger/thread";

const QUICK = [
  { days: 1, de: "Morgen", vi: "Ngày mai" },
  { days: 3, de: "In 3 Tagen", vi: "3 ngày nữa" },
  { days: 7, de: "Nächste Woche", vi: "Tuần sau" },
  { days: 30, de: "In 1 Monat", vi: "1 tháng nữa" },
] as const;

function today() {
  return formatVnDate(new Date());
}

/** "heute", "morgen", "in 3 Tagen", "überfällig 2 T." */
function relative(day: string) {
  const n = daysBetween(today(), day);
  if (n === 0) return { de: "heute", vi: "hôm nay" };
  if (n === 1) return { de: "morgen", vi: "ngày mai" };
  if (n > 1) return { de: `in ${n} Tagen`, vi: `${n} ngày nữa` };
  return { de: `überfällig ${-n} T.`, vi: `quá ${-n} ngày` };
}

/** The list and the open chat take the result; a chat that moves in or out of "Zu tun" while it is not listed needs the list again. */
function useApply(onChange: (f: ChatFollowups) => void) {
  const router = useRouter();
  return (result: FollowupResult) => {
    if (result.error) {
      toast(result.error);
      return false;
    }
    if (result.saved) {
      publishLabelSave(result.saved, true);
      if (result.saved.prev.todo !== result.saved.next.todo) router.refresh();
    }
    if (result.followups) onChange(result.followups);
    return true;
  };
}

/** The date, quick picks and the note. Saving sets a new follow-up or moves the open one. */
function FollowupForm({
  conversationId,
  open,
  initialDay,
  onDone,
  onChange,
}: {
  conversationId: string;
  open: Followup | null;
  initialDay?: string;
  onDone: () => void;
  onChange: (f: ChatFollowups) => void;
}) {
  const [day, setDay] = useState(initialDay ?? open?.due_on ?? addDays(today(), 1));
  const [note, setNote] = useState(open?.note ?? "");
  const [pending, start] = useTransition();
  const apply = useApply(onChange);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (initialDay) noteRef.current?.focus();
  }, [initialDay]);
  const save = () =>
    start(async () => {
      if (apply(await setFollowup({ conversationId, dueOn: day, note }))) onDone();
    });
  const done = () =>
    start(async () => {
      if (!open) return;
      if (apply(await closeFollowup({ conversationId, id: open.id }))) onDone();
    });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="flex flex-col gap-2.5"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-semibold text-ink">
          {open ? <Label de="Follow-up ändern" vi="Sửa lịch nhắc lại" /> : <Label de="Follow-up planen" vi="Lên lịch nhắc lại" />}
        </span>
        <span className="text-[11.5px] text-faint">
          <Label {...relative(day)} />
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {QUICK.map((q) => {
          const d = addDays(today(), q.days);
          return (
            <button
              key={q.days}
              type="button"
              onClick={() => setDay(d)}
              aria-pressed={day === d}
              className="rounded-full border border-line px-2.5 py-1 text-[12px] font-medium text-body transition-colors duration-150 hover:bg-hover aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent-dark"
            >
              <Label de={q.de} vi={q.vi} />
            </button>
          );
        })}
      </div>
      <input
        type="date"
        required
        value={day}
        min={today()}
        onChange={(e) => e.target.value && setDay(e.target.value)}
        className="h-8 rounded-lg border border-line bg-white px-2.5 text-[13px] text-ink outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent-soft"
      />
      <textarea
        ref={noteRef}
        value={note}
        maxLength={NOTE_MAX}
        rows={3}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
        }}
        placeholder="Warum? z. B. bekommt am 20. ihr Gehalt · Vì sao?"
        className="resize-none rounded-lg border border-line bg-white px-2.5 py-2 text-[13px] leading-snug text-ink outline-none placeholder:text-faint focus:border-accent/40 focus:ring-2 focus:ring-accent-soft"
      />
      <div className="flex items-center gap-2">
        {open && (
          <button
            type="button"
            disabled={pending}
            onClick={done}
            className="flex h-8 items-center gap-1 rounded-full border border-line px-3 text-[12.5px] font-medium text-body transition-colors duration-150 hover:bg-hover disabled:opacity-50"
          >
            <Icon name="tick" size={13} strokeWidth={2.4} />
            <Label de="Erledigt" vi="Xong" />
          </button>
        )}
        <span className="flex-1" />
        <button type="button" onClick={onDone} className="h-8 rounded-full px-3 text-[12.5px] font-medium text-muted hover:bg-hover">
          <Label de="Abbrechen" vi="Hủy" />
        </button>
        <button
          type="submit"
          disabled={pending}
          className="h-8 rounded-full bg-accent px-3.5 text-[12.5px] font-semibold text-white transition-colors duration-150 hover:bg-accent-dark disabled:opacity-50"
        >
          {pending ? <Label de="Speichert…" vi="Đang lưu…" /> : <Label de="Speichern" vi="Lưu" />}
        </button>
      </div>
    </form>
  );
}

/** Which chat's popover is open, and with which day picked (from "Nächster Follow-up?"). Shared by the header button and the banner. */
export type FollowupPopover = { day?: string } | null;

/**
 * Header button next to the action chip. Without a follow-up: "Follow-up". With one: its date,
 * amber once due. Opens the popover with quick dates, a date picker and the note.
 */
export function FollowupButton({
  conversationId,
  followups,
  popover,
  setPopover,
  onChange,
}: {
  conversationId: string;
  followups: ChatFollowups;
  popover: FollowupPopover;
  setPopover: (p: FollowupPopover) => void;
  onChange: (f: ChatFollowups) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!popover) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setPopover(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPopover(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [popover, setPopover]);
  const open = followups.open;
  const due = !!open && open.due_on <= today();
  return (
    <div ref={box} className="relative flex-none">
      <button
        type="button"
        onClick={() => setPopover(popover ? null : {})}
        aria-expanded={!!popover}
        {...tip(open ? `Follow-up am ${shortDay(open.due_on)}${open.note ? `\n📌 ${open.note}` : ""}` : "Follow-up mit Datum und Notiz planen", open ? `Nhắc lại ngày ${shortDay(open.due_on)}${open.note ? `\n📌 ${open.note}` : ""}` : "Lên lịch nhắc lại với ngày và ghi chú")}
        className={`flex h-7 items-center gap-1 rounded-full border px-2.5 text-[12px] font-medium transition-colors duration-150 ${
          open
            ? due
              ? "border-[#F5D9A8] bg-[#FDF1DC] text-[#9A5B00] hover:bg-[#FBE7C4]"
              : "border-line bg-chip text-body hover:bg-hover"
            : "border-line bg-white text-body hover:bg-hover"
        }`}
      >
        <Icon name={open ? (due ? "bell" : "clock") : "calendar"} size={13} strokeWidth={2.1} />
        {open ? shortDay(open.due_on) : <Label de="Follow-up" vi="Nhắc lại" />}
      </button>
      {popover && (
        <div className="menu-pop absolute right-0 top-full z-40 mt-1.5 w-[320px] origin-top-right rounded-xl border border-black/[0.06] bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)] max-md:w-[290px]">
          <FollowupForm key={`${open?.id ?? "new"}:${popover.day ?? ""}`} conversationId={conversationId} open={open} initialDay={popover.day} onDone={() => setPopover(null)} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

/**
 * Above the messages while a follow-up is open: date, how far off, the note and who set it, with
 * Erledigt and Ändern. Amber once due, grey before. Right after "Erledigt" it offers the next one.
 */
export function FollowupBanner({
  conversationId,
  followups,
  setPopover,
  onChange,
}: {
  conversationId: string;
  followups: ChatFollowups;
  setPopover: (p: FollowupPopover) => void;
  onChange: (f: ChatFollowups) => void;
}) {
  const [justDone, setJustDone] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const apply = useApply(onChange);
  const open = followups.open;
  useEffect(() => {
    if (open) setJustDone(null);
  }, [open]);

  if (!open && justDone) {
    return (
      <div className="anim-fade flex flex-wrap items-center gap-2 border-b border-line bg-[#F3FAF5] px-4 py-2 text-[12.5px]">
        <span className="flex items-center gap-1 font-medium text-[#1E8E3E]">
          <Icon name="tick" size={13} strokeWidth={2.6} />
          <Label de="Erledigt." vi="Đã xong." />
        </span>
        <span className="text-body">
          <Label de="Nächster Follow-up?" vi="Nhắc lại lần sau?" />
        </span>
        {QUICK.map((q) => (
          <button
            key={q.days}
            type="button"
            onClick={() => setPopover({ day: addDays(today(), q.days) })}
            className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[12px] font-medium text-body transition-colors duration-150 hover:bg-hover"
          >
            <Label de={q.de} vi={q.vi} />
          </button>
        ))}
        <span className="flex-1" />
        <button type="button" onClick={() => setJustDone(null)} aria-label="Schließen · Đóng" className="flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-hover">
          <Icon name="close" size={12} strokeWidth={2.2} />
        </button>
      </div>
    );
  }
  if (!open) return null;

  const due = open.due_on <= today();
  const when = relative(open.due_on);
  return (
    <div className={`flex items-start gap-2.5 border-b px-4 py-2 ${due ? "border-[#F5D9A8] bg-[#FFF8EC]" : "border-line bg-[#F7F8FA]"}`}>
      <span className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full ${due ? "bg-[#FDE7C2] text-[#9A5B00]" : "bg-chip text-muted"}`}>
        <Icon name={due ? "bell" : "clock"} size={13} strokeWidth={2.2} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug">
        <span className="flex flex-wrap items-baseline gap-x-1.5 text-[12.5px]">
          <span className={`font-semibold ${due ? "text-[#7A4700]" : "text-ink"}`}>
            <Label de={`Follow-up ${shortDay(open.due_on)}`} vi={`Nhắc lại ${shortDay(open.due_on)}`} />
          </span>
          <span className={due ? "font-medium text-[#9A5B00]" : "text-muted"}>
            · <Label {...when} />
          </span>
          {open.created_by_name && (
            <span className="text-faint">
              · <Label de={`von ${open.created_by_name}`} vi={`bởi ${open.created_by_name}`} />
            </span>
          )}
        </span>
        {open.note ? (
          <span className="whitespace-pre-wrap break-words text-[13px] text-body">{open.note}</span>
        ) : (
          <span className="text-[12px] italic text-faint">
            <Label de="Keine Notiz" vi="Không có ghi chú" />
          </span>
        )}
      </div>
      <div className="flex flex-none items-center gap-1">
        <button
          type="button"
          onClick={() => setPopover({})}
          className="h-7 rounded-full px-2.5 text-[12px] font-medium text-muted transition-colors duration-150 hover:bg-black/[0.05] hover:text-ink"
        >
          <Label de="Ändern" vi="Sửa" />
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              if (apply(await closeFollowup({ conversationId, id: open.id }))) setJustDone(open.id);
            })
          }
          className={`flex h-7 items-center gap-1 rounded-full px-3 text-[12px] font-semibold transition-colors duration-150 disabled:opacity-50 ${
            due ? "bg-[#9A5B00] text-white hover:bg-[#7A4700]" : "border border-line bg-white text-body hover:bg-hover"
          }`}
        >
          <Icon name="tick" size={12} strokeWidth={2.6} />
          <Label de="Erledigt" vi="Xong" />
        </button>
      </div>
    </div>
  );
}

/** A closed follow-up in the chat timeline, on the moment it was closed. The note is in the tooltip. */
export function FollowupMarker({ f }: { f: Followup }) {
  const text = `${shortDay(f.due_on)}${f.note ? ` · ${f.note}` : ""}`;
  return (
    <span
      {...tip(`Follow-up ${text}${f.done_by_name ? `\nErledigt von ${f.done_by_name}` : ""}`, `Nhắc lại ${text}${f.done_by_name ? `\nXong bởi ${f.done_by_name}` : ""}`)}
      className="flex max-w-[80%] items-center gap-1 rounded-full bg-chip px-2.5 py-0.5 text-[11.5px] text-muted"
    >
      <Icon name="tick" size={11} strokeWidth={2.6} className="flex-none text-[#1E8E3E]" />
      <span className="flex-none font-medium">
        <Label de="Follow-up erledigt" vi="Đã nhắc lại" />
      </span>
      {f.note && <span className="truncate">· {f.note}</span>}
    </span>
  );
}
