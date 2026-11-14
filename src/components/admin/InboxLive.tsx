"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Label } from "@/components/Bi";

/** How often an open, visible tab asks whether something changed. */
const CHECK_MS = 10_000;
/** Other people's changes reload the list at most this often; your own actions reload it at once. */
const LIST_GAP_MS = 20_000;
/** Without any change the list still loads again after this long: "follow up today" depends on the clock. */
const LIST_MAX_AGE_MS = 5 * 60_000;

type Sync = { at: string | null; error: string | null; checked: number };
type State = { threadId: string | null; thread: string | null; sync: Sync | null };

let state: State = { threadId: null, thread: null, sync: null };
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
function publish(next: State) {
  state = next;
  listeners.forEach((fn) => fn());
}

/** Ask now instead of waiting for the next round: after sending a message or when a send status arrives. */
export function checkInbox() {
  window.dispatchEvent(new CustomEvent("inbox:check", { detail: { own: true } }));
}

/** The newest known version of the chat `id` (null until the first answer). <ThreadPane> loads the chat again when it differs from its copy. */
export function useThreadVersion(id: string | null) {
  return useSyncExternalStore(
    subscribe,
    () => (id && state.threadId === id ? state.thread : null),
    () => null,
  );
}

/**
 * Keeps the inbox current without loading it on a timer. Asks api/messenger/version (one small request),
 * and only when the answer differs from `version` (what the server rendered) the list is rendered again.
 * The open chat is watched the same way through useThreadVersion.
 * `stamp` changes with every server render.
 */
export function InboxLive({ version, stamp }: { version: string; stamp: number }) {
  const router = useRouter();
  const id = useSearchParams().get("c");
  const shown = useRef({ version, at: 0, id });
  shown.current.version = version;
  shown.current.id = id;
  const refreshed = useRef(0);

  useEffect(() => {
    let stopped = false;
    let running = false;
    let again: ReturnType<typeof setTimeout> | undefined;

    const check = async (own: boolean) => {
      if (running || document.visibilityState !== "visible") return;
      running = true;
      try {
        const chat = shown.current.id;
        const res = await fetch(`/api/messenger/version${chat ? `?c=${encodeURIComponent(chat)}` : ""}`, { cache: "no-store" });
        if (!res.ok || stopped) return;
        const now = (await res.json()) as { inbox?: string; thread?: string | null; syncAt?: string | null; syncError?: string | null };
        if (stopped || typeof now.inbox !== "string") return;
        publish({ threadId: chat, thread: chat ? (now.thread ?? null) : null, sync: { at: now.syncAt ?? null, error: now.syncError ?? null, checked: Date.now() } });

        const changed = now.inbox !== shown.current.version;
        const old = Date.now() - shown.current.at > LIST_MAX_AGE_MS;
        if ((changed || old) && (own || Date.now() - refreshed.current > LIST_GAP_MS)) {
          refreshed.current = Date.now();
          router.refresh();
        }
      } catch {
        // Offline or a deploy in progress: the next round tries again.
      } finally {
        running = false;
      }
    };

    const timer = window.setInterval(() => check(false), CHECK_MS);
    const onVisible = () => check(false);
    // Several signals in a row (send, then its status events) become one request.
    const onCheck = (e: Event) => {
      const own = !!(e as CustomEvent<{ own?: boolean }>).detail?.own;
      clearTimeout(again);
      again = setTimeout(() => check(own), 250);
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("inbox:check", onCheck);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      clearTimeout(again);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("inbox:check", onCheck);
    };
  }, [router]);

  // The server rendered again (a saved label, a filter): see at once whether the open chat changed too.
  useEffect(() => {
    shown.current.at = Date.now();
    window.dispatchEvent(new CustomEvent("inbox:check", { detail: { own: false } }));
  }, [stamp]);

  return null;
}

/** "Sync vor 2 Min." next to the title. Starts with what the server rendered and follows the checks from then on. */
export function SyncBadge({ at, error, now }: { at: string | null; error: string | null; now: number }) {
  const live = useSyncExternalStore(
    subscribe,
    () => state.sync,
    () => null,
  );
  const syncAt = live ? live.at : at;
  const syncError = live ? live.error : error;
  const age = syncAt ? Math.max(0, Math.round(((live?.checked ?? now) - new Date(syncAt).getTime()) / 60_000)) : null;
  const ok = !syncError && age !== null && age <= 5;
  return (
    <span className={`flex items-center gap-1.5 text-[11.5px] ${ok ? "text-faint" : "text-bad"}`} title={syncError ?? undefined}>
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-ok" : "bg-bad"}`} />
      {syncError ? <Label de="Sync-Fehler" vi="Lỗi đồng bộ" /> : age === null ? <Label de="Noch nie synchronisiert" vi="Chưa đồng bộ" /> : <Label de={`Sync vor ${age} Min.`} vi={`Đồng bộ ${age} phút trước`} />}
    </span>
  );
}
