"use client";

import { useSyncExternalStore } from "react";
import type { AssignableClass, RowClass } from "@/lib/messenger/classes";

/**
 * Classes per chat (with their offer status) as the Kurse panel last saw or saved them. Assigning a class does not change the
 * inbox version, so the list row reads this instead of waiting for the next full reload.
 */
let byChat = new Map<string, RowClass[]>();
const listeners = new Set<() => void>();

export function setRowClasses(conversationId: string, classes: RowClass[]) {
  const before = byChat.get(conversationId);
  if (before && before.length === classes.length && before.every((c, i) => c.id === classes[i].id && c.offer === classes[i].offer)) return;
  byChat = new Map(byChat).set(conversationId, classes);
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** The classes to show on a row: the panel's copy when there is one, else what the server rendered. */
export function useRowClasses(conversationId: string, rendered: RowClass[]) {
  const map = useSyncExternalStore(subscribe, () => byChat, () => byChat);
  return map.get(conversationId) ?? rendered;
}

/** The full assigned classes per chat (for the cards under the chat), kept in step by the Kurse panel. */
let fullByChat = new Map<string, AssignableClass[]>();
const fullListeners = new Set<() => void>();
const NONE: AssignableClass[] = [];

export function setAssignedClasses(conversationId: string, classes: AssignableClass[]) {
  const before = fullByChat.get(conversationId);
  if (before && before.length === classes.length && before.every((c, i) => c === classes[i])) return;
  fullByChat = new Map(fullByChat).set(conversationId, classes);
  fullListeners.forEach((fn) => fn());
}

function subscribeFull(fn: () => void) {
  fullListeners.add(fn);
  return () => fullListeners.delete(fn);
}

export function useAssignedClasses(conversationId: string) {
  const map = useSyncExternalStore(subscribeFull, () => fullByChat, () => fullByChat);
  return map.get(conversationId) ?? NONE;
}
