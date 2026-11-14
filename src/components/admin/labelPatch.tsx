"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/Bi";
import { acknowledgeOwnInbox } from "@/components/admin/InboxLive";
import { FUNNEL_INTEREST } from "@/lib/messenger/steps";
import { matchesInboxFilter, NO_INTEREST, type InboxPlace } from "@/lib/messenger/inboxPlace";
import type { SavedLabel } from "@/lib/messenger/labelSave";

/**
 * Label saves applied on top of the server-rendered list.
 * Cleared when the inbox is rendered again (a filter, a new message, the periodic refresh).
 * The first `prev` stays, so a second save of the same chat still counts from the list on screen.
 */
type Entry = SavedLabel;

const EMPTY: Entry[] = [];
let entries: Entry[] = EMPTY;
const listeners = new Set<() => void>();

function emit(next: Entry[]) {
  entries = next;
  listeners.forEach((fn) => fn());
}

export function publishLabelSave(saved: SavedLabel) {
  acknowledgeOwnInbox(saved.inbox);
  const i = entries.findIndex((e) => e.conversationId === saved.conversationId);
  const next = entries.slice();
  if (i >= 0) next[i] = { ...saved, prev: next[i].prev };
  else next.push(saved);
  emit(next);
  applied.forEach((fn) => fn(next.find((e) => e.conversationId === saved.conversationId) ?? saved));
}

const applied = new Set<(saved: SavedLabel) => void>();

/** Fires with the stored entry (its `prev` is still the place on the server-rendered list). */
export function onLabelSave(fn: (saved: SavedLabel) => void) {
  applied.add(fn);
  return () => applied.delete(fn);
}

export function labelSaveFor(id: string) {
  return entries.find((e) => e.conversationId === id);
}

export function useLabelSave(id: string) {
  const saved = useSyncExternalStore(subscribe, () => entries, () => EMPTY);
  return saved.find((e) => e.conversationId === id);
}

export function clearLabelSaves() {
  if (entries.length === 0) return;
  emit(EMPTY);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Drop local saves once the server has rendered the inbox again. */
export function ClearLabelPatches({ stamp }: { stamp: number }) {
  useEffect(() => clearLabelSaves(), [stamp]);
  return null;
}

export function useLabelAdjust(listedIds?: readonly string[]) {
  const saved = useSyncExternalStore(subscribe, () => entries, () => EMPTY);
  const sp = useSearchParams();
  const interest = sp.get("i") ?? "";
  const step = interest === FUNNEL_INTEREST ? (sp.get("s") ?? "") : "";
  const interestDelta: Record<string, number> = {};
  const stepDelta: Record<string, number> = {};
  let qualify = 0;
  let total = 0;
  let hidden = 0;
  const add = (map: Record<string, number>, key: string, n: number) => {
    map[key] = (map[key] ?? 0) + n;
  };
  const qualifyOf = (p: InboxPlace) => p.interestKey === NO_INTEREST && p.open;
  for (const e of saved) {
    if (e.prev.interestKey !== e.next.interestKey) {
      add(interestDelta, e.prev.interestKey, -1);
      add(interestDelta, e.next.interestKey, 1);
    }
    const prevStep = e.prev.interestKey === FUNNEL_INTEREST ? e.prev.stepKey : null;
    const nextStep = e.next.interestKey === FUNNEL_INTEREST ? e.next.stepKey : null;
    if (prevStep !== nextStep) {
      if (prevStep) add(stepDelta, prevStep, -1);
      if (nextStep) add(stepDelta, nextStep, 1);
    }
    qualify += (qualifyOf(e.next) ? 1 : 0) - (qualifyOf(e.prev) ? 1 : 0);
    const was = matchesInboxFilter(e.prev, interest, step);
    const now = matchesInboxFilter(e.next, interest, step);
    total += (now ? 1 : 0) - (was ? 1 : 0);
    if (listedIds?.includes(e.conversationId) && !now) hidden += 1;
  }
  return { interest: interestDelta, step: stepDelta, qualify, total, hidden };
}

/** Interesse menu count, plus the saves since this list was rendered. */
export function InboxCount({ id, count }: { id: string; count: number }) {
  const adjust = useLabelAdjust();
  return <>{count + (adjust.interest[id] ?? 0)}</>;
}

/** "Mehr laden (60 von 230)" with one chat added or removed since the render. */
export function InboxMore({ shown, total, listedIds }: { shown: number; total: number; listedIds: readonly string[] }) {
  const adjust = useLabelAdjust(listedIds);
  const n = shown - adjust.hidden;
  const t = total + adjust.total;
  return <Label de={`Mehr laden (${n} von ${t})`} vi={`Tải thêm (${n} / ${t})`} />;
}

/** The list had rows, and every one of them has left the open filter. */
export function InboxEmpty({ shown, listedIds }: { shown: number; listedIds: readonly string[] }) {
  const adjust = useLabelAdjust(listedIds);
  if (shown === 0 || shown - adjust.hidden > 0) return null;
  return (
    <li className="px-3 py-8 text-center text-[13px] text-muted">
      <Label de="Keine Gespräche gefunden." vi="Không tìm thấy cuộc trò chuyện." />
    </li>
  );
}
