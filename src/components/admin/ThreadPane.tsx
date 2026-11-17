"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Label, type TipText } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { ActionChip } from "@/components/admin/ActionChip";
import { useThreadVersion } from "@/components/admin/InboxLive";
import { isLabelEditing, labelSaveFor, latestLabelWrite, onLabelSave, threadSeen, useLabelSaving } from "@/components/admin/labelPatch";
import { LabelEditor } from "@/components/admin/LabelEditor";
import { MessageComposer } from "@/components/admin/MessageComposer";
import { ThreadSkeleton } from "@/components/admin/MessengerSkeleton";
import { MessengerThread, type ThreadMessage } from "@/components/admin/MessengerThread";
import type { NextAction } from "@/lib/messenger/nextAction";
import { FUNNEL_INTEREST, STEP_INFO, type Step } from "@/lib/messenger/steps";
import { ClassAssignPanel } from "@/components/admin/ClassAssignPanel";
import { FollowupBanner, FollowupButton, FollowupMarker, type FollowupPopover } from "@/components/admin/FollowupControls";
import type { ChatFollowups, ThreadData, ThreadMessageRow } from "@/lib/messenger/thread";
import type { Outcome } from "@/lib/messenger/types";

type Loaded = ThreadData & { sendEnabled: boolean };

/** Chats opened in this tab. Going back to one shows it at once while the fresh copy loads. */
const recent = new Map<string, Loaded>();
function remember(data: Loaded) {
  recent.delete(data.id);
  recent.set(data.id, data);
  if (recent.size > 20) recent.delete(recent.keys().next().value!);
}

/** Actions that mean "work on this step" (ours or, with the clock, once the lead answers). Follow-ups and closed chats keep their own text. */
const STEP_TASKS = new Set(["ask_interest", "ask_level", "ask_place", "courses", "offer", "pay", "class", "wait"]);

/** In the open chat the chip shows the goal of the step instead of the single task. */
function goalAction(action: NextAction, step: Step | null): NextAction {
  if (!step || !STEP_TASKS.has(action.id)) return action;
  const { aim_de, aim_vi } = STEP_INFO[step];
  return action.id === "wait" ? { ...action, de: `Warten · dann ${aim_de}`, vi: `Chờ · sau đó ${aim_vi}` } : { ...action, de: aim_de, vi: aim_vi };
}

/** The goal follows the label, so it pulses while a label change is saving. */
function GoalChip({ id, children }: { id: string; children: ReactNode }) {
  const saving = useLabelSaving(id);
  return <span className={`flex items-center gap-1.5 ${saving ? "label-saving" : ""}`}>{children}</span>;
}

function goalTitle(data: Loaded): TipText {
  if (!data.step || !STEP_TASKS.has(data.view.action.id)) return { de: data.view.state.de, vi: data.view.state.vi };
  const info = STEP_INFO[data.step];
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
  const taskDe = data.view.action.de.replace(/^Warten(\s*·\s*(dann\s+)?)?/, "");
  const taskVi = data.view.action.vi.replace(/^Chờ(\s*·\s*(sau đó\s+)?)?/, "");
  return {
    de: [`${info.short_de}: ${info.goal_de}`, taskDe && `Jetzt: ${cap(taskDe)}`].filter(Boolean).join("\n"),
    vi: [`${info.short_vi}: ${info.goal_vi}`, taskVi && `Bây giờ: ${cap(taskVi)}`].filter(Boolean).join("\n"),
  };
}

/** What Status "Automatisch" comes to: whose turn it is, taken from the last message ("Wartet auf uns"). */
function autoText(data: Loaded) {
  const turn = (text: string) => {
    const part = text.split(" · ").at(-1) ?? text;
    return part.charAt(0).toUpperCase() + part.slice(1);
  };
  return { de: turn(data.view.state.de), vi: turn(data.view.state.vi) };
}

function formJudgment(outcome: Outcome | undefined) {
  if (outcome === "kein_lead" || outcome === "bestandskunde" || outcome === "weiter_auf_zalo" || outcome === "verloren") return outcome;
  return "auto";
}

/** Pages of older messages the reader asked for, kept while that chat stays open. */
type Older = { id: string; messages: ThreadMessageRow[]; hasOlder: boolean };

/**
 * The right pane: the chat named by `?c=`. It loads only that chat (api/messenger/thread), with a
 * skeleton the first time, and at first only its newest messages; "Ältere laden" adds a page.
 * It loads again when the chat's version changes (<InboxLive> asks every few seconds): a new
 * message, a saved label or a send status, from anyone. Nothing is fetched while nothing changes.
 */
export function ThreadPane() {
  const params = useSearchParams();
  const id = params.get("c");
  const latest = useThreadVersion(id);
  const [data, setData] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState<number | null>(null);
  const [older, setOlder] = useState<Older | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [retry, setRetry] = useState(0);
  const [settled, setSettled] = useState(0);
  const [popover, setPopover] = useState<FollowupPopover>(null);
  useEffect(() => setPopover(null), [id]);
  /** The copy that is here: its chat, its version, and the newest version that was known when it was asked for. */
  const have = useRef<{ id: string; version: string | null; asked: string | null } | null>(null);
  /** The request on its way, if any. A check that comes in meanwhile waits for it instead of starting a second one. */
  const flight = useRef<{ id: string; ctrl: AbortController } | null>(null);

  useEffect(() => {
    if (!id) return;
    if (flight.current?.id === id) return;
    // The person is still changing this label. A reload now would put the old fields back on the form.
    if (isLabelEditing(id) && have.current?.id === id) return;
    // Same chat, and nothing newer is known than what is here (or than what was known when it was loaded): keep it.
    if (have.current?.id === id && (latest === null || latest === have.current.version || latest === have.current.asked)) return;
    flight.current?.ctrl.abort();
    const ctrl = new AbortController();
    flight.current = { id, ctrl };
    setFailed(null);
    let again: ReturnType<typeof setTimeout> | undefined;
    fetch(`/api/messenger/thread?c=${encodeURIComponent(id)}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<Loaded>) : Promise.reject(r.status)))
      .then((next) => {
        if (flight.current?.ctrl !== ctrl) return;
        flight.current = null;
        const seen = threadSeen(id);
        const wrote = latestLabelWrite(id);
        if (isLabelEditing(id)) {
          have.current = { id, version: seen ?? have.current?.version ?? next.version, asked: latest };
          return;
        }
        const saved = labelSaveFor(id) ?? wrote;
        // A slow reload that started earlier must not cover a label this person just stored.
        const wroteAt = wrote?.label?.updated_at ?? "";
        const nextAt = next.label?.updated_at ?? "";
        const label = wrote && nextAt < wroteAt ? wrote.label : (saved?.label ?? next.label);
        const merged = { ...next, view: saved?.view ?? next.view, step: saved?.step ?? next.step, label };
        have.current = { id, version: seen ?? saved?.thread ?? next.version, asked: latest };
        remember(merged);
        setData(merged);
        // Look again: the version may have moved on while this was loading.
        setSettled((n) => n + 1);
      })
      .catch((e) => {
        if (flight.current?.ctrl !== ctrl) return;
        flight.current = null;
        have.current = null;
        setFailed(typeof e === "number" ? e : 0);
        // A chat that exists but did not load (network, deploy) is tried again shortly.
        if (e !== 404 && e !== 403) again = setTimeout(() => setRetry((n) => n + 1), 10_000);
      });
    return () => clearTimeout(again);
  }, [id, latest, retry, settled]);
  useEffect(() => {
    return onLabelSave((saved, paint) => {
      if (saved.conversationId !== id) return;
      if (have.current?.id === id) have.current = { id, version: saved.thread, asked: saved.thread };
      // An earlier save must not replace the fields the person has changed since.
      // The label form keeps what they picked; only the chip follows the stored result.
      if (!paint) return;
      const apply = (d: Loaded): Loaded => (d.id === id ? { ...d, view: saved.view, step: saved.step, label: saved.label } : d);
      setData((d) => (d && d.id === id ? apply(d) : d));
      const remembered = recent.get(id);
      if (remembered) recent.set(id, apply(remembered));
    });
  }, [id]);
  useEffect(
    () => () => {
      flight.current?.ctrl.abort();
      flight.current = null;
    },
    [],
  );

  /** A follow-up was set, moved or closed here: show it at once (the list follows through publishLabelSave). */
  const onFollowups = useCallback(
    (followups: ChatFollowups) => {
      if (!id) return;
      const apply = (d: Loaded): Loaded => (d.id === id ? { ...d, followups } : d);
      setData((d) => (d && d.id === id ? apply(d) : d));
      const remembered = recent.get(id);
      if (remembered) recent.set(id, apply(remembered));
    },
    [id],
  );

  const head = data?.id === id ? data : id ? (recent.get(id) ?? null) : null;
  const before = older?.id === id ? older.messages[0]?.created_time : head?.messages[0]?.created_time;
  const loadOlder = useCallback(() => {
    if (!id || !before) return;
    setLoadingOlder(true);
    fetch(`/api/messenger/thread?c=${encodeURIComponent(id)}&before=${encodeURIComponent(before)}`, { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<{ messages: ThreadMessageRow[]; hasOlder: boolean }>) : Promise.reject(r.status)))
      .then((page) => setOlder((prev) => ({ id, messages: [...page.messages, ...(prev?.id === id ? prev.messages : [])], hasOlder: page.hasOlder })))
      .catch(() => {})
      .finally(() => setLoadingOlder(false));
  }, [id, before]);

  if (!id) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-muted">
        <Icon name="chat" size={28} />
        <p className="m-0 text-[14px]">
          <Label de="Wähle links ein Gespräch." vi="Chọn một cuộc trò chuyện bên trái." />
        </p>
        <p className="m-0 max-w-[420px] text-[12.5px] text-faint">
          <Label de="Facebook und WhatsApp lesen und beantworten." vi="Đọc và trả lời Facebook, WhatsApp." />
        </p>
      </div>
    );
  }

  const back = new URLSearchParams(params);
  back.delete("c");
  const backHref = `/admin/messenger${back.size ? `?${back}` : ""}`;
  const shown = head;

  if (!shown) {
    if (failed === null) return <ThreadSkeleton />;
    return (
      <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-[13.5px] text-muted">
        <p className="m-0">
          {failed === 404 ? <Label de="Gespräch nicht gefunden." vi="Không tìm thấy cuộc trò chuyện." /> : <Label de="Das Gespräch konnte nicht geladen werden." vi="Không tải được cuộc trò chuyện." />}
        </p>
        <a href={backHref} className="text-accent hover:underline">
          <Label de="Zurück zur Liste" vi="Về danh sách" />
        </a>
      </div>
    );
  }

  // Older pages first, then the newest messages; a message that is in both is shown once.
  const seen = new Set<string>();
  const messages = [...(older?.id === id ? older.messages : []), ...shown.messages]
    .filter((m) => !seen.has(m.id) && !!seen.add(m.id))
    .sort((a, b) => Date.parse(a.created_time) - Date.parse(b.created_time));
  const label = shown.label;
  const channel = shown.channel || "messenger";
  // Copies remembered before follow-ups existed have none.
  const followups: ChatFollowups = shown.followups ?? { open: null, done: [] };
  return (
    <div key={shown.id} className="anim-fade flex min-h-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <MessengerThread
        conversationId={shown.id}
        name={shown.name ?? "Unbekannt"}
        backHref={backHref}
        messages={messages as ThreadMessage[]}
        hasOlder={older?.id === id ? older.hasOlder : shown.hasOlder}
        loadingOlder={loadingOlder}
        onLoadOlder={loadOlder}
        totalCount={shown.message_count}
        wallpaper={channel === "whatsapp" ? "whatsapp" : undefined}
        status={
          <span>
            {channel === "whatsapp" ? "WhatsApp" : "Messenger"} · {shown.account_name || "NaNu NaNa"}
          </span>
        }
        below={<span id={`status-${shown.id}`} className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5" />}
        actions={
          // Stufe on top, its goal below. The Stufe menu itself comes from the label form (LabelEditor).
          <span className="flex min-w-0 items-center gap-2">
            <FollowupButton conversationId={shown.id} followups={followups} popover={popover} setPopover={setPopover} onChange={onFollowups} />
            <span className="flex min-w-0 flex-col items-end gap-1">
              <span id={`stage-${shown.id}`} className="flex min-w-0 max-w-full" />
              <GoalChip id={shown.id}>
                <ActionChip action={goalAction(shown.view.action, shown.step)} title={goalTitle(shown)} />
              </GoalChip>
            </span>
          </span>
        }
        markers={followups.done.filter((f) => f.done_at).map((f) => ({ id: f.id, time: f.done_at!, node: <FollowupMarker f={f} /> }))}
        composer={<MessageComposer key="composer" conversation={shown.id} channel={channel} enabled={shown.sendEnabled} lastInbound={shown.lastInbound} attempts={shown.attempts} />}
        banner={
          <>
          <div className="relative z-10 border-b border-line bg-[#FAFBFC] px-3 py-2">
            <LabelEditor
              conversationId={shown.id}
              formKey={`${shown.id}:${label?.updated_at ?? "new"}`}
              stage={shown.step ?? "unklar"}
              interest={label?.interest ?? ""}
              level={label?.level && label.level !== "unklar" ? label.level : "unklar"}
              place={label?.place && label.place !== "unklar" ? label.place : ""}
              judgment={formJudgment(label?.outcome)}
              loss={label?.loss_reason ?? "unklar"}
              statusSlot={`status-${shown.id}`}
              stageSlot={`stage-${shown.id}`}
              coursesSent={!!label?.courses_sent}
              priceSent={!!label?.price_sent}
              paid={!!label?.paid}
              oneOnOne={!!label?.one_on_one}
              autoText={autoText(shown)}
              pinned={(label?.pinned ?? []).filter((field) => field !== "stage" || label?.stage === shown.step)}
            />
          </div>
          <FollowupBanner conversationId={shown.id} followups={followups} setPopover={setPopover} onChange={onFollowups} />
          </>
        }
        />
      </div>
      {label && label.interest === FUNNEL_INTEREST && <ClassAssignPanel conversationId={shown.id} level={label.level} place={label.place} />}
    </div>
  );
}
