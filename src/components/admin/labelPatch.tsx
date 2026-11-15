"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/Bi";
import { acknowledgeOwnInbox } from "@/components/admin/InboxLive";
import { FUNNEL_INTEREST } from "@/lib/messenger/steps";
import { inFunnelStep, matchesInboxFilter, NO_INTEREST, type InboxPlace } from "@/lib/messenger/inboxPlace";
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
/** Chats whose label form still has a change waiting or in flight. A finished save must not replace that form. */
const editing = new Set<string>();
/** Newest write from this person, including one not shown yet because they kept editing. */
const latestWrite = new Map<string, SavedLabel>();

function emit(next: Entry[]) {
  entries = next;
  listeners.forEach((fn) => fn());
}

export function setLabelEditing(id: string, on: boolean) {
  if (on) editing.add(id);
  else editing.delete(id);
}

export function isLabelEditing(id: string) {
  return editing.has(id);
}

/** Chats with a label change not yet stored: from the first change, through the pause, until the server answers. */
let savingIds: ReadonlySet<string> = new Set();
const savingListeners = new Set<() => void>();

export function setLabelSaving(id: string, on: boolean) {
  if (savingIds.has(id) === on) return;
  const next = new Set(savingIds);
  if (on) next.add(id);
  else next.delete(id);
  savingIds = next;
  savingListeners.forEach((fn) => fn());
}

export function useLabelSaving(id: string) {
  return useSyncExternalStore(
    (fn) => {
      savingListeners.add(fn);
      return () => savingListeners.delete(fn);
    },
    () => savingIds.has(id),
    () => false,
  );
}

/** Small ring that turns while a label is saving. */
export function SavingSpinner({ size = 12 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" className="flex-none animate-spin text-accent">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function threadSeen(id: string) {
  return latestWrite.get(id)?.thread;
}

export function latestLabelWrite(id: string) {
  return latestWrite.get(id);
}

/**
 * `paint` is false when the person has already changed the label again.
 * The version is still remembered, so a check does not reload the old copy over the form.
 */
export function publishLabelSave(saved: SavedLabel, paint = true) {
  acknowledgeOwnInbox(saved.inbox);
  latestWrite.set(saved.conversationId, saved);
  if (!paint) {
    applied.forEach((fn) => fn(saved, false));
    return;
  }
  const i = entries.findIndex((e) => e.conversationId === saved.conversationId);
  const next = entries.slice();
  if (i >= 0) next[i] = { ...saved, prev: next[i].prev };
  else next.push(saved);
  emit(next);
  const stored = next.find((e) => e.conversationId === saved.conversationId) ?? saved;
  applied.forEach((fn) => fn(stored, true));
}

const applied = new Set<(saved: SavedLabel, paint: boolean) => void>();

/** Fires for every write. `paint` is false when a newer change is still on the form. */
export function onLabelSave(fn: (saved: SavedLabel, paint: boolean) => void) {
  applied.add(fn);
  return () => {
    applied.delete(fn);
  };
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
  const status: Record<string, number> = {};
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
    const prevStep = e.prev.interestKey === FUNNEL_INTEREST && inFunnelStep(e.prev.status) ? e.prev.stepKey : null;
    const nextStep = e.next.interestKey === FUNNEL_INTEREST && inFunnelStep(e.next.status) ? e.next.stepKey : null;
    if (prevStep !== nextStep) {
      if (prevStep) add(stepDelta, prevStep, -1);
      if (nextStep) add(stepDelta, nextStep, 1);
    }
    qualify += (qualifyOf(e.next) ? 1 : 0) - (qualifyOf(e.prev) ? 1 : 0);
    if (e.prev.status !== e.next.status) {
      add(status, e.prev.status, -1);
      add(status, e.next.status, 1);
    }
    const was = matchesInboxFilter(e.prev, interest, step);
    const now = matchesInboxFilter(e.next, interest, step);
    total += (now ? 1 : 0) - (was ? 1 : 0);
    if (listedIds?.includes(e.conversationId) && !now) hidden += 1;
  }
  return { interest: interestDelta, step: stepDelta, qualify, status, total, hidden };
}

/** One funnel step's count, plus the saves since this list was rendered. */
export function StepCount({ id, count }: { id: string; count: number }) {
  const adjust = useLabelAdjust();
  return <>{count + (adjust.step[id] ?? 0)}</>;
}

/** One Status filter's count, plus the saves since this list was rendered. */
export function StatusCount({ id, count }: { id: string; count: number }) {
  const adjust = useLabelAdjust();
  return <>{count + (adjust.status[id] ?? 0)}</>;
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
