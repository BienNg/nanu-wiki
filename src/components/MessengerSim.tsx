"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { submitChat } from "@/app/actions";
import { initials } from "@/lib/format";
import type { Block, ChatTurn } from "@/lib/types";
import { Bi, Label } from "./Bi";

type ChatBlock = Extract<Block, { type: "chat" }>;
type Line = { from: "customer" | "me"; text: string; translation?: string };

/** A blank line splits one customer message into several bubbles sent in a row. */
export function chatBubbles(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** How long the "is typing" dots show before a bubble pops up. */
const typingMs = (text: string) => Math.min(2600, 700 + text.length * 22);

/** Messenger-style simulation: an imaginary customer sends one message, the user replies once and that reply is saved. */
export function MessengerSim({ block, pageId, done = false }: { block: ChatBlock; pageId?: string; done?: boolean }) {
  const message = block.message;
  const [started, setStarted] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(false);
  const [waitingSince, setWaitingSince] = useState<number | null>(null);
  const [turn, setTurn] = useState<ChatTurn | null>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(done);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const scope = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  const canSend = waitingSince !== null && turn === null && draft.trim() !== "";

  // Customer "types" and sends the bubbles of the message one after another.
  useEffect(() => {
    if (!started) return;
    const parts = chatBubbles(message.text);
    const timers: number[] = [];
    let t = 400;
    parts.forEach((part, k) => {
      const last = k === parts.length - 1;
      timers.push(window.setTimeout(() => setTyping(true), t));
      t += typingMs(part);
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setLines((ls) => [...ls, { from: "customer", text: part, translation: last ? message.translation_de : undefined }]);
          if (last) {
            setWaitingSince(Date.now());
            field.current?.focus({ preventScroll: true });
          }
        }, t),
      );
      t += 450;
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Keep the newest message in view.
  useEffect(() => {
    feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: "smooth" });
  }, [lines.length, typing]);

  // Pop the newest bubble in.
  useGSAP(
    () => {
      if (!lines.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const all = scope.current?.querySelectorAll("[data-line]");
      const el = all?.[all.length - 1];
      if (el) gsap.from(el, { opacity: 0, y: 10, scale: 0.94, duration: 0.32, ease: "back.out(1.8)" });
    },
    { scope, dependencies: [lines.length] },
  );

  /** The one reply ends the scenario and is saved right away. */
  function send() {
    if (!canSend) return;
    const reply = draft.trim();
    const t = { customer: message.text, reply, seconds: Math.round((Date.now() - waitingSince!) / 1000) };
    setLines((ls) => [...ls, { from: "me", text: reply }]);
    setDraft("");
    setTurn(t);
    save(t);
  }

  function save(t: ChatTurn) {
    if (!pageId) return;
    setError(null);
    startTransition(async () => {
      const res = await submitChat(pageId, block.id, [t]);
      if (res.ok) setSent(true);
      else setError(res.message);
    });
  }

  const header = (
    <div className="flex items-center gap-2.5 border-b border-line bg-white px-3.5 py-2.5">
      <span className="relative flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#E4E6EB] text-[13px] font-semibold text-ink">
        {initials(block.customer)}
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#31A24C]" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <strong className="truncate text-sm font-semibold text-ink">{block.customer || "Kunde"}</strong>
        <span className="text-xs text-muted">
          {typing ? <Label de="schreibt …" vi="đang soạn tin …" /> : <Label de="Messenger · aktiv" vi="Messenger · đang hoạt động" />}
        </span>
      </span>
    </div>
  );

  if (sent) {
    return (
      <div data-reveal className="overflow-hidden rounded-[14px] border border-line">
        {header}
        <div className="flex flex-col items-center gap-1.5 bg-side px-6 py-10 text-center text-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ok-soft text-lg text-ok">✓</span>
          <strong className="text-ink">
            <Label de="Antwort gespeichert" vi="Đã lưu câu trả lời" />
          </strong>
          <span className="text-muted">
            <Bi de="Deine Antwort wurde gespeichert. Das Team schaut sie sich an." vi="Câu trả lời của bạn đã được lưu. Đội ngũ sẽ xem và phản hồi." />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={scope} data-reveal className="overflow-hidden rounded-[14px] border border-line shadow-[0_6px_20px_rgba(16,24,40,.06)]">
      {header}

      <div ref={feed} role="log" aria-live="polite" aria-label="Chatverlauf" className="flex h-[400px] flex-col gap-1.5 overflow-y-auto bg-white px-3.5 py-4">
        {!started ? (
          <div className="m-auto flex max-w-[440px] flex-col items-center gap-3 text-center text-sm">
            {block.intro_de && (
              <p className="m-0 text-body">
                <Bi de={block.intro_de} vi={block.intro_vi} />
              </p>
            )}
            <button
              type="button"
              disabled={!message.text.trim()}
              onClick={() => setStarted(true)}
              className="h-10 rounded-[7px] bg-accent px-[18px] text-sm font-medium text-white hover:bg-[#1F5DB5] disabled:opacity-50"
            >
              <Label de="Simulation starten" vi="Bắt đầu mô phỏng" /> →
            </button>
          </div>
        ) : (
          <>
            {lines.map((l, i) => {
              const mine = l.from === "me";
              const nextSame = lines[i + 1]?.from === l.from;
              return (
                <div key={i} data-line className={`flex max-w-[78%] flex-col ${mine ? "items-end self-end" : "items-start self-start"} ${nextSame ? "" : "mb-2"}`}>
                  <span
                    className={`whitespace-pre-line rounded-[18px] px-3.5 py-2 text-[14px] leading-snug ${
                      mine ? "bg-accent text-white" : "bg-[#F0F0F0] text-ink"
                    }`}
                  >
                    {l.text}
                  </span>
                  {l.translation && <span className="de mt-1 px-1 text-xs italic text-muted">{l.translation}</span>}
                </div>
              );
            })}
            {typing && (
              <div className="flex items-center gap-1 self-start rounded-[18px] bg-[#F0F0F0] px-3.5 py-3" aria-label="schreibt">
                {[0, 1, 2].map((k) => (
                  <span key={k} className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint" style={{ animationDelay: `${k * 0.15}s` }} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {turn ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-line bg-side px-3.5 py-3 text-sm">
          <span className="flex-1 text-body">
            {pending ? <Label de="Wird gespeichert …" vi="Đang lưu …" /> : error ? <span role="alert" className="text-bad">{error}</span> : null}
          </span>
          {error && (
            <button
              type="button"
              onClick={() => save(turn)}
              disabled={pending}
              className="h-9 rounded-md bg-accent px-4 text-[13px] font-medium text-white hover:bg-[#1F5DB5] disabled:opacity-60"
            >
              <Label de="Nochmal versuchen" vi="Thử lại" />
            </button>
          )}
        </div>
      ) : (
        started && (
          <form
            className="flex items-end gap-2 border-t border-line bg-white px-3 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <textarea
              ref={field}
              rows={1}
              value={draft}
              maxLength={2000}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Aa"
              aria-label="Deine Antwort"
              className="max-h-32 min-h-[38px] flex-1 [field-sizing:content] resize-none rounded-[19px] bg-[#F0F2F5] px-3.5 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent-soft"
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Senden"
              title={waitingSince === null ? "Warte auf die Nachricht · Chờ tin nhắn" : "Senden · Gửi"}
              className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full text-accent hover:bg-accent-soft disabled:text-faint disabled:hover:bg-transparent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" />
              </svg>
            </button>
          </form>
        )
      )}
    </div>
  );
}
