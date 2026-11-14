"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { ActionChip } from "@/components/admin/ActionChip";
import { LabelEditor } from "@/components/admin/LabelEditor";
import { MessageComposer } from "@/components/admin/MessageComposer";
import { ThreadSkeleton } from "@/components/admin/MessengerSkeleton";
import { MessengerThread, type ThreadMessage } from "@/components/admin/MessengerThread";
import type { ThreadData } from "@/lib/messenger/thread";
import type { Outcome } from "@/lib/messenger/types";

type Loaded = ThreadData & { sendEnabled: boolean };

/** Chats opened in this tab. Going back to one shows it at once while the fresh copy loads. */
const recent = new Map<string, Loaded>();
function remember(data: Loaded) {
  recent.delete(data.id);
  recent.set(data.id, data);
  if (recent.size > 20) recent.delete(recent.keys().next().value!);
}

function formJudgment(outcome: Outcome | undefined) {
  if (outcome === "kein_lead" || outcome === "bestandskunde" || outcome === "weiter_auf_zalo" || outcome === "verloren") return outcome;
  return "auto";
}

/**
 * The right pane: the chat named by `?c=`. It loads only that chat (api/messenger/thread), with a
 * skeleton the first time. `stamp` changes whenever the server page renders again (auto refresh,
 * a saved label, a sent message); then the open chat is fetched again quietly.
 */
export function ThreadPane({ stamp }: { stamp: number }) {
  const params = useSearchParams();
  const id = params.get("c");
  const [data, setData] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setFailed(null);
    const ctrl = new AbortController();
    fetch(`/api/messenger/thread?c=${encodeURIComponent(id)}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<Loaded>) : Promise.reject(r.status)))
      .then((next) => {
        remember(next);
        setData(next);
      })
      .catch((e) => {
        if (!ctrl.signal.aborted) setFailed(typeof e === "number" ? e : 0);
      });
    return () => ctrl.abort();
  }, [id, stamp]);

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
  const shown = data?.id === id ? data : recent.get(id) ?? null;

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

  const label = shown.label;
  const channel = shown.channel || "messenger";
  return (
    <div key={shown.id} className="anim-fade flex min-h-0 flex-1 flex-col">
      <MessengerThread
        conversationId={shown.id}
        name={shown.name ?? "Unbekannt"}
        backHref={backHref}
        messages={shown.messages as ThreadMessage[]}
        totalCount={shown.message_count}
        wallpaper={channel === "whatsapp" ? "whatsapp" : undefined}
        status={
          <span>
            {channel === "whatsapp" ? "WhatsApp" : "Messenger"} · {shown.account_name || "NaNu NaNa"}
          </span>
        }
        actions={<ActionChip action={shown.view.action} title={shown.view.state.de} />}
        composer={<MessageComposer key="composer" conversation={shown.id} channel={channel} enabled={shown.sendEnabled} lastInbound={shown.lastInbound} attempts={shown.attempts} />}
        banner={
          <div className="relative z-10 border-b border-line bg-[#FAFBFC] px-3 py-2">
            <LabelEditor
              conversationId={shown.id}
              formKey={`${shown.id}:${label?.updated_at ?? "new"}`}
              stage={label?.stage ?? "unklar"}
              interest={label?.interest ?? ""}
              level={label?.level && label.level !== "unklar" ? label.level : "unklar"}
              place={label?.place && label.place !== "unklar" ? label.place : ""}
              judgment={formJudgment(label?.outcome)}
              loss={label?.loss_reason ?? "unklar"}
              resume={label?.resume_on?.slice(0, 10) ?? ""}
              pinned={label?.pinned ?? []}
            />
          </div>
        }
      />
    </div>
  );
}
