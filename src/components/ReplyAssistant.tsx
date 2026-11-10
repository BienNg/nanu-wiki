"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getSuggestion, saveAsExample } from "@/app/(app)/assistent/actions";
import type { ChatLine, Suggestion } from "@/lib/assistant/schema";
import type { SourceRef } from "@/lib/assistant/suggest";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { chatBubbles } from "./MessengerSim";
import { ComposerField, MessengerHeader, SendIcon, TypingDots, bubbleClass, bubbleRowClass } from "./MessengerParts";
import { toast } from "./Toaster";

type StageOption = { id: string; de: string; vi: string; short_de: string; short_vi: string; goal_de: string; goal_vi: string };
type Usage = { input: number; cached: number; output: number };
type Result = { id: number; suggestion: Suggestion; sources: SourceRef[]; usage: Usage; asked: ChatLine[] };

const CONFIDENCE: Record<Suggestion["confidence"], { de: string; vi: string; dot: string }> = {
  hoch: { de: "Gut belegt", vi: "Có cơ sở rõ", dot: "bg-ok" },
  mittel: { de: "Teilweise belegt", vi: "Có một phần cơ sở", dot: "bg-warn" },
  niedrig: { de: "Kaum belegt – selbst prüfen", vi: "Ít cơ sở – tự kiểm tra", dot: "bg-bad" },
};

const card = "rounded-[20px] border border-line/80 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,.04),0_8px_24px_rgba(16,24,40,.05)]";
const pill = "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition-[background,color,transform] active:scale-[.97]";

/** Paste a real conversation as Messenger bubbles → the AI places the person in the funnel and drafts our next reply
 *  (shown as draft bubbles in the chat), with the goal for the next stage and why it answers like this. */
export function ReplyAssistant({ stages }: { stages: StageOption[] }) {
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [draft, setDraft] = useState("");
  const [from, setFrom] = useState<ChatLine["from"]>("kunde");
  const [result, setResult] = useState<Result | null>(null);
  const [reply, setReply] = useState("");
  const [editing, setEditing] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [loading, startLoading] = useTransition();
  const [saving, startSaving] = useTransition();
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  const withDraft = (): ChatLine[] => (draft.trim() ? [...lines, ...chatBubbles(draft).map((text) => ({ from, text }))] : lines);
  const hasCustomer = withDraft().some((l) => l.from === "kunde");

  // Keep the newest bubble in view.
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [lines.length, result?.id, loading, editing]);

  function send() {
    if (!draft.trim()) return;
    setLines(withDraft());
    setDraft("");
  }

  function ask() {
    const all = withDraft();
    if (!all.some((l) => l.from === "kunde")) return;
    setLines(all);
    setDraft("");
    setError(null);
    setSavedUrl(null);
    setEditing(false);
    setResult(null);
    startLoading(async () => {
      const res = await getSuggestion(all);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setResult({ id: Date.now(), suggestion: res.suggestion, sources: res.sources, usage: res.usage, asked: all });
      setReply(res.suggestion.reply_vi.join("\n\n"));
      setStage(res.suggestion.stage === "unklar" ? "" : res.suggestion.stage);
    });
  }

  /** The suggestion was sent to the customer: it becomes part of the chat, ready for their next message. */
  function adopt() {
    if (!reply.trim()) return;
    setLines((ls) => [...ls, ...chatBubbles(reply).map((text) => ({ from: "wir" as const, text }))]);
    setResult(null);
    setEditing(false);
    setFrom("kunde");
    field.current?.focus();
  }

  async function copy() {
    await navigator.clipboard.writeText(reply);
    toast("Kopiert · Đã sao chép");
  }

  function save() {
    if (!result) return;
    startSaving(async () => {
      try {
        const { url } = await saveAsExample({ lines: result.asked, answer: reply, why: result.suggestion.why_de, stage, interests: result.suggestion.profile.interests });
        setSavedUrl(url);
        toast("Als Entwurf in Notion gespeichert");
      } catch {
        toast("Speichern fehlgeschlagen – hat die Notion-Integration Schreibrechte?");
      }
    });
  }

  function reset() {
    setLines([]);
    setDraft("");
    setResult(null);
    setError(null);
    setSavedUrl(null);
    setEditing(false);
    setFrom("kunde");
    field.current?.focus();
  }

  const s = result?.suggestion;
  const stageIdx = s ? stages.findIndex((x) => x.id === s.stage) : -1;
  const current = stageIdx >= 0 ? stages[stageIdx] : null;
  const next = stageIdx >= 0 ? stages[stageIdx + 1] : null;
  const bubbles = chatBubbles(reply);

  return (
    <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start gap-6 max-lg:grid-cols-1">
      {/* ------------------------------------------------------------ Messenger */}
      <section
        aria-label="Gespräch"
        className="flex h-[min(760px,calc(100dvh-170px))] min-h-[520px] flex-col overflow-hidden rounded-[22px] border border-line/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,.04),0_16px_48px_rgba(16,24,40,.08)] lg:sticky lg:top-4"
      >
        <MessengerHeader
          name="Kunde"
          status={
            loading ? (
              <Label de="KI schreibt einen Vorschlag …" vi="AI đang soạn gợi ý …" />
            ) : current ? (
              <Label de={`Messenger · Stufe ${stageIdx + 1}: ${current.de}`} vi={`Messenger · Bước ${stageIdx + 1}: ${current.vi}`} />
            ) : (
              <Label de="Messenger" vi="Messenger" />
            )
          }
          actions={
            (lines.length > 0 || result) && (
              <button type="button" onClick={reset} className={`${pill} text-accent hover:bg-accent-soft`} title="Neues Gespräch">
                <Icon name="plus" size={14} strokeWidth={2.2} />
                <Label de="Neu" vi="Mới" />
              </button>
            )
          }
        />

        <div ref={log} role="log" aria-live="polite" aria-label="Chatverlauf" className="flex flex-1 flex-col gap-1 overflow-y-auto bg-white px-3.5 py-4">
          {lines.length === 0 && !loading && (
            <div className="anim-rise m-auto flex max-w-[300px] flex-col items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon name="chat" size={24} />
              </span>
              <p className="m-0 text-[15px] font-semibold text-ink">
                <Label de="Füge die Nachricht des Kunden ein" vi="Dán tin nhắn của khách vào" />
              </p>
              <p className="m-0 text-[13px] leading-relaxed text-muted">
                <Label
                  de="Wie im Messenger: unten einfügen und mit Enter senden. Mit „Wir“ fügst du ein, was wir schon geantwortet haben."
                  vi="Như trên Messenger: dán vào ô dưới và nhấn Enter để gửi. Chọn „Mình“ để thêm những gì mình đã trả lời."
                />
              </p>
            </div>
          )}

          {lines.map((l, i) => {
            const mine = l.from === "wir";
            const lastOfRun = lines[i + 1]?.from !== l.from;
            return (
              <div key={i} className={`anim-pop group flex max-w-[86%] items-end gap-1.5 ${mine ? "flex-row-reverse self-end" : "self-start"} ${lastOfRun ? "mb-2" : ""}`}>
                {!mine && (
                  <span className={`mb-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#E4E6EB] text-[11px] font-semibold text-ink ${lastOfRun ? "" : "invisible"}`}>
                    K
                  </span>
                )}
                <span className={bubbleClass(mine)}>{l.text}</span>
                <button
                  type="button"
                  aria-label="Nachricht entfernen"
                  onClick={() => setLines(lines.filter((_, j) => j !== i))}
                  className="mb-1.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-[12px] text-faint opacity-0 transition-opacity hover:bg-hover hover:text-bad focus:opacity-100 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            );
          })}

          {loading && (
            <div className="anim-pop mt-1 flex flex-col items-end gap-1">
              <span className="px-1 text-[11px] font-medium text-accent">
                ✦ <Label de="KI-Vorschlag" vi="Gợi ý của AI" />
              </span>
              <TypingDots mine label="KI schreibt" />
            </div>
          )}

          {s && result && (
            <div key={result.id} className="mt-2 flex flex-col items-end gap-1">
              <span className="anim-pop flex items-center gap-1.5 px-1 text-[11px] font-medium text-accent">
                ✦ <Label de="KI-Vorschlag – noch nicht gesendet" vi="Gợi ý của AI – chưa gửi" />
              </span>
              {editing ? (
                <div className="anim-pop flex w-[86%] flex-col items-end gap-2">
                  <textarea
                    autoFocus
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    aria-label="Vorschlag bearbeiten"
                    className="min-h-[120px] w-full [field-sizing:content] resize-none rounded-[18px] border border-accent/40 bg-accent-soft/50 px-3.5 py-2.5 text-[14px] leading-snug text-ink outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                  <span className="text-[11px] text-faint">
                    <Label de="Leerzeile = neue Nachricht" vi="Dòng trống = tin nhắn mới" />
                  </span>
                </div>
              ) : (
                bubbles.map((b, i) => (
                  <div key={i} className={`${bubbleRowClass(true, false)} anim-pop max-w-[86%]`} style={{ animationDelay: `${120 + i * 110}ms` }}>
                    <span className="block whitespace-pre-line rounded-[18px] border border-dashed border-accent/50 bg-accent-soft/60 px-3.5 py-2 text-[14px] leading-snug text-ink">
                      {b}
                    </span>
                  </div>
                ))
              )}
              <div className="anim-pop mt-1.5 flex flex-wrap justify-end gap-1.5" style={{ animationDelay: `${180 + bubbles.length * 110}ms` }}>
                <button type="button" onClick={copy} className={`${pill} bg-chip text-ink hover:bg-active`}>
                  <Label de="Kopieren" vi="Sao chép" />
                </button>
                <button type="button" onClick={() => setEditing(!editing)} className={`${pill} bg-chip text-ink hover:bg-active`}>
                  <Icon name="edit" size={13} />
                  {editing ? <Label de="Fertig" vi="Xong" /> : <Label de="Bearbeiten" vi="Sửa" />}
                </button>
                <button type="button" onClick={adopt} disabled={!reply.trim()} className={`${pill} bg-accent text-white hover:bg-accent-dark disabled:opacity-50`}>
                  <Label de="Gesendet" vi="Đã gửi" /> ✓
                </button>
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="anim-pop m-0 mt-2 self-center rounded-full bg-bad-soft px-3.5 py-1.5 text-center text-[13px] text-bad">
              {error}
            </p>
          )}
        </div>

        {/* composer */}
        <div className="border-t border-line bg-white px-3 pb-3 pt-2.5">
          <div className="mb-2 flex items-center gap-2">
            <div role="radiogroup" aria-label="Wer schreibt?" className="relative grid grid-cols-2 rounded-full bg-[#F0F2F5] p-0.5 text-[12px] font-medium">
              <span
                aria-hidden
                className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-white shadow-[0_1px_3px_rgba(16,24,40,.12)] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ transform: from === "wir" ? "translateX(100%)" : "none" }}
              />
              {(["kunde", "wir"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={from === f}
                  onClick={() => {
                    setFrom(f);
                    field.current?.focus();
                  }}
                  className={`relative z-10 rounded-full px-3.5 py-1 transition-colors ${from === f ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {f === "kunde" ? <Label de="Kunde" vi="Khách" /> : <Label de="Wir" vi="Mình" />}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-faint max-sm:hidden">
              Enter <Label de="senden" vi="gửi" /> · ⇧Enter <Label de="neue Zeile" vi="xuống dòng" />
            </span>
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <ComposerField
              ref={field}
              value={draft}
              maxLength={4000}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
                e.preventDefault();
                if (e.metaKey || e.ctrlKey) ask();
                else send();
              }}
              placeholder={from === "kunde" ? "Nachricht des Kunden einfügen …" : "Was wir geantwortet haben …"}
              aria-label="Nachricht"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Senden"
              className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full text-accent transition-transform hover:bg-accent-soft active:scale-90 disabled:text-faint disabled:hover:bg-transparent"
            >
              <SendIcon />
            </button>
          </form>
          <button
            type="button"
            onClick={ask}
            disabled={loading || !hasCustomer}
            className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-semibold text-white transition-[transform,background,opacity] hover:bg-black active:scale-[.98] disabled:opacity-35"
          >
            <span aria-hidden className={loading ? "inline-block animate-spin" : ""}>
              ✦
            </span>
            {loading ? <Label de="Denkt nach …" vi="Đang suy nghĩ …" /> : <Label de="Antwort vorschlagen" vi="Gợi ý câu trả lời" />}
            <kbd className="ml-1 rounded-md bg-white/15 px-1.5 py-0.5 font-sans text-[11px] font-medium text-white/80 max-sm:hidden">⌘ Enter</kbd>
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------ insights */}
      <aside aria-label="Analyse" className="flex flex-col gap-4">
        <FunnelCard key={`f-${result?.id ?? 0}`} stages={stages} index={stageIdx} loading={loading} reason={s?.stage_reason_de} unclear={s?.stage === "unklar"} />

        {s && result ? (
          <div key={result.id} className="flex flex-col gap-4">
            <section className={`${card} anim-rise border-ok/25 bg-gradient-to-b from-ok-soft/70 to-white`} style={{ animationDelay: "80ms" }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ok text-white">
                  <Icon name="compass" size={15} strokeWidth={2.2} />
                </span>
                <h2 className="m-0 text-[15px] font-semibold text-ink">
                  <Label de="Ziel dieser Antwort" vi="Mục tiêu của câu trả lời" />
                </h2>
                {next && (
                  <span className="ml-auto rounded-full bg-white px-2.5 py-0.5 text-[12px] font-medium text-ok shadow-[0_1px_2px_rgba(16,24,40,.06)]">
                    → <Label de={`Stufe ${stageIdx + 2}: ${next.de}`} vi={`Bước ${stageIdx + 2}: ${next.vi}`} />
                  </span>
                )}
              </div>
              <p className="m-0 mt-3 text-[15px] leading-relaxed text-ink">
                <Bi de={s.next_goal_de} vi={s.next_goal_vi} />
              </p>
              {current && (
                <p className="m-0 mt-2 text-[13px] leading-relaxed text-muted">
                  <Label de={`Auf dieser Stufe allgemein: ${current.goal_de}`} vi={`Ở bước này nói chung: ${current.goal_vi}`} />
                </p>
              )}
            </section>

            {s.missing_de.length > 0 && (
              <section className={`${card} anim-rise border-warn/30 bg-warn-soft/60`} style={{ animationDelay: "140ms" }}>
                <h2 className="m-0 flex items-center gap-2 text-[15px] font-semibold text-warn">
                  <span aria-hidden>⚠︎</span>
                  <Label de="Vor dem Senden prüfen" vi="Kiểm tra trước khi gửi" />
                </h2>
                <ul className="m-0 mt-2 flex flex-col gap-1.5 pl-5 text-[14px] leading-relaxed text-ink">
                  {s.missing_de.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className={`${card} anim-rise`} style={{ animationDelay: "200ms" }}>
              <h2 className="m-0 text-[15px] font-semibold text-ink">
                <Label de="Wer ist das?" vi="Khách là ai?" />
              </h2>
              <p className="m-0 mt-2 text-[14px] leading-relaxed text-body">{s.profile.summary_de}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[12px]">
                {s.profile.interests.map((i) => (
                  <Chip key={i}>{i}</Chip>
                ))}
                {s.profile.level !== "unklar" && <Chip label="Niveau">{s.profile.level}</Chip>}
                {s.profile.place !== "unklar" && <Chip label="Ort">{s.profile.place}</Chip>}
                {s.profile.pronoun !== "unklar" && <Chip label="Anrede">{s.profile.pronoun}</Chip>}
              </div>
            </section>

            <section className={`${card} anim-rise`} style={{ animationDelay: "260ms" }}>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="m-0 text-[15px] font-semibold text-ink">
                  <Label de="Warum so?" vi="Tại sao trả lời như vậy?" />
                </h2>
                <span className="ml-auto flex items-center gap-1.5 text-[12px] text-muted">
                  <span className={`h-2 w-2 rounded-full ${CONFIDENCE[s.confidence].dot}`} />
                  <Label de={CONFIDENCE[s.confidence].de} vi={CONFIDENCE[s.confidence].vi} />
                </span>
              </div>
              <p className="m-0 mt-2 text-[14px] leading-relaxed text-body">
                <Bi de={s.why_de} vi={s.why_vi} />
              </p>
              {result.sources.length > 0 && (
                <ul className="m-0 mt-3 flex list-none flex-col gap-0.5 border-t border-line-soft p-0 pt-3 text-[13px]">
                  {result.sources.map((src) => (
                    <li key={src.id}>
                      <a
                        href={src.href}
                        target={src.kind === "example" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="-mx-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-body transition-colors hover:bg-side hover:text-accent-dark"
                      >
                        <Icon name={src.kind === "example" ? "chat" : "doc"} size={14} className="flex-none text-faint" />
                        <span className="w-12 flex-none text-[10px] font-semibold uppercase tracking-wide text-faint">{src.kind === "example" ? "Notion" : "Wiki"}</span>
                        <span className="truncate">{src.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <details className="mt-3 text-[13px] text-muted">
                <summary className="cursor-pointer select-none hover:text-ink">
                  <Label de="Deutsche Übersetzung der Antwort" vi="Bản dịch tiếng Đức của câu trả lời" />
                </summary>
                <div className="mt-2 whitespace-pre-wrap leading-relaxed text-body">{s.reply_de.join("\n\n")}</div>
              </details>
            </section>

            <section className={`${card} anim-rise`} style={{ animationDelay: "320ms" }}>
              <h2 className="m-0 text-[15px] font-semibold text-ink">
                <Label de="Gute Antwort?" vi="Câu trả lời tốt?" />
              </h2>
              <p className="m-0 mt-1 text-[13px] leading-relaxed text-muted">
                {savedUrl ? (
                  <a href={savedUrl} target="_blank" rel="noopener noreferrer" className="text-accent-dark underline">
                    <Label de="In Notion öffnen – „Warum“ ergänzen und Status auf „Geprüft“ setzen." vi="Mở trong Notion – bổ sung „Warum“ và đặt Status „Geprüft“." />
                  </a>
                ) : (
                  <Label
                    de="Speichert Gespräch und (bearbeitete) Antwort als „Entwurf“ in Notion. Die KI nutzt es, sobald es geprüft ist."
                    vi="Lưu cuộc trò chuyện và câu trả lời (đã sửa) thành „Entwurf“ trong Notion. AI dùng sau khi được kiểm tra."
                  />
                )}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  aria-label="Stufe"
                  className="h-9 min-w-0 flex-1 rounded-full border border-line bg-white px-3 text-[13px] text-ink outline-none focus:ring-2 focus:ring-accent-soft"
                >
                  <option value="">– Stufe –</option>
                  {stages.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || !!savedUrl || !reply.trim()}
                  className={`${pill} h-9 bg-accent text-white hover:bg-accent-dark disabled:opacity-60`}
                >
                  {savedUrl ? <Label de="Gespeichert ✓" vi="Đã lưu ✓" /> : saving ? <Label de="Speichert …" vi="Đang lưu …" /> : <Label de="Als Beispiel speichern" vi="Lưu làm ví dụ" />}
                </button>
              </div>
            </section>

            <p className={`m-0 text-center text-[11px] ${result.usage.input + result.usage.cached > 100_000 ? "font-medium text-bad" : "text-faint"}`}>
              {(result.usage.input + result.usage.cached).toLocaleString("de-DE")} Tokens rein ({result.usage.cached.toLocaleString("de-DE")} aus Cache) ·{" "}
              {result.usage.output.toLocaleString("de-DE")} raus
              {result.usage.input + result.usage.cached > 100_000 && " – über 100.000: 5× teurer"}
            </p>
          </div>
        ) : (
          !loading && (
            <p className="anim-rise m-0 px-2 text-center text-[13px] leading-relaxed text-muted">
              <Label
                de="Hier erscheinen das Ziel der Antwort, das Profil, was zu prüfen ist und warum die KI so antwortet."
                vi="Mục tiêu câu trả lời, hồ sơ khách, điều cần kiểm tra và lý do AI trả lời như vậy sẽ hiện ở đây."
              />
            </p>
          )
        )}
      </aside>
    </div>
  );
}

/** The six funnel stages as a track: done stages filled, the current one highlighted, the rest waiting. */
function FunnelCard({ stages, index, loading, reason, unclear }: { stages: StageOption[]; index: number; loading: boolean; reason?: string; unclear?: boolean }) {
  const current = index >= 0 ? stages[index] : null;
  const [shown, setShown] = useState(-1);
  // Fill the track after mount, so it visibly grows to the stage.
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(index));
    return () => cancelAnimationFrame(t);
  }, [index]);

  return (
    <section className={`${card} anim-rise`}>
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-faint">
          <Label de="Stufe im Verkaufstrichter" vi="Bước trong phễu bán hàng" />
        </span>
        {current && (
          <span className="ml-auto text-[12px] font-medium tabular-nums text-muted">
            {index + 1} / {stages.length}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <span className={`text-[34px] leading-none ${loading ? "animate-pulse" : ""}`} aria-hidden>
          {current ? current.id.split(" ")[0] : loading ? "✦" : "○"}
        </span>
        <div className="min-w-0">
          <p className="title-display m-0 text-[24px] font-semibold leading-tight text-ink">
            {current ? (
              <Label de={current.de} vi={current.vi} />
            ) : loading ? (
              <Label de="Wird analysiert …" vi="Đang phân tích …" />
            ) : unclear ? (
              <Label de="Unklar" vi="Chưa rõ" />
            ) : (
              <Label de="Noch keine Analyse" vi="Chưa phân tích" />
            )}
          </p>
          {reason && <p className="m-0 mt-1 text-[13px] leading-relaxed text-muted">{reason}</p>}
        </div>
      </div>

      <ol className="m-0 mt-4 grid list-none gap-1.5 p-0" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}>
        {stages.map((st, i) => {
          const state = i < shown ? "done" : i === shown ? "now" : "todo";
          return (
            <li key={st.id} className="flex min-w-0 flex-col gap-1.5" title={`${st.id} · ${st.de}`} aria-current={state === "now" ? "step" : undefined}>
              <span className={`relative h-1.5 overflow-hidden rounded-full bg-[#EDEEF1] ${loading ? "animate-pulse" : ""}`}>
                <span
                  className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${state === "now" ? "bg-accent" : "bg-accent/40"}`}
                  style={{ width: state === "todo" ? "0%" : "100%", transitionDelay: `${i * 80}ms` }}
                />
              </span>
              <span className={`truncate text-[11px] leading-tight transition-colors duration-500 ${state === "now" ? "font-semibold text-accent-dark" : state === "done" ? "text-body" : "text-faint"}`}>
                <Label de={st.short_de} vi={st.short_vi} />
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Chip({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-side px-2.5 py-1 text-ink ring-1 ring-inset ring-line">
      {label && <span className="text-faint">{label}</span>}
      <span className="font-medium">{children}</span>
    </span>
  );
}
