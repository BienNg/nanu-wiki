"use client";

import { useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { submitMcq } from "@/app/actions";
import { Bi, Label } from "./Bi";

/** A question as the browser sees it – without the correct answer. */
export type McqCard = { question_de: string; question_vi: string; options: { de: string; vi: string }[] };

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Multiple-choice round as a deck of cards, moved through with Zurück / Weiter. Nothing is shown as right or wrong. */
export function McqCards({
  id,
  pageId,
  intro,
  questions,
  done = false,
}: {
  id: string;
  pageId?: string;
  intro?: { de: string; vi: string };
  questions: McqCard[];
  done?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [sent, setSent] = useState(done);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [moving, setMoving] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const dir = useRef<1 | -1>(1); // 1 = forward, -1 = back

  const total = questions.length;
  const q = questions[index];
  const picked = answers[index];
  const last = index === total - 1;
  const complete = answers.every((a) => a !== null);

  // The new card comes in from the side it is moving towards.
  useGSAP(
    () => {
      if (!card.current || reduced()) return;
      gsap.fromTo(card.current, { x: dir.current * 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
    },
    { scope, dependencies: [index, sent] },
  );

  function pick(k: number) {
    setAnswers((all) => all.map((a, i) => (i === index ? k : a)));
  }

  function go(step: 1 | -1) {
    const to = index + step;
    if (to < 0 || to >= total || moving) return;
    dir.current = step;
    if (reduced() || !card.current) return setIndex(to);
    // The current card slides off: left when going forward, right when going back.
    setMoving(true);
    gsap.to(card.current, { x: `${-step * 110}%`, rotate: -step * 5, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => {
      gsap.set(card.current, { rotate: 0 });
      setIndex(to);
      setMoving(false);
    } });
  }

  function submit() {
    if (!pageId || !complete) return;
    setError(null);
    startTransition(async () => {
      const res = await submitMcq(pageId, id, answers as number[]);
      if (res.ok) setSent(true);
      else setError(res.message);
    });
  }

  if (sent) {
    return (
      <div data-reveal className="flex flex-col items-center gap-1.5 rounded-[14px] border border-line bg-side px-6 py-10 text-center text-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ok-soft text-lg text-ok">✓</span>
        <strong className="text-ink">
          <Label de="Runde abgeschlossen" vi="Đã hoàn thành" />
        </strong>
        <span className="text-muted">
          <Bi de="Deine Antworten wurden gespeichert. Das Team schaut sie sich an." vi="Câu trả lời của bạn đã được lưu. Đội ngũ sẽ xem và phản hồi." />
        </span>
      </div>
    );
  }

  return (
    <div ref={scope} data-reveal className="flex flex-col gap-3">
      {intro && (
        <p className="m-0 text-body">
          <Bi de={intro.de} vi={intro.vi} />
        </p>
      )}
      <div className="flex items-center gap-3 text-[13px] text-muted">
        <span className="cap">
          <Label de={`Frage ${index + 1} von ${total}`} vi={`Câu ${index + 1}/${total}`} />
        </span>
        <div aria-hidden="true" className="grid max-w-[240px] flex-1 gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0,1fr))` }}>
          {questions.map((_, k) => (
            <span key={k} className="h-1 rounded-full" style={{ background: k === index ? "#2C6ECB" : answers[k] !== null ? "#2B2D31" : "#E3E5E8" }} />
          ))}
        </div>
      </div>

      {/* The deck: up to two cards peek out underneath the current one. */}
      <div className="relative -mx-2 overflow-x-clip px-2 pb-3">
        {[2, 1].map((d) =>
          index + d < total ? (
            <div
              key={d}
              aria-hidden="true"
              className="absolute inset-x-2 top-0 h-[calc(100%-12px)] rounded-[14px] border border-line bg-white"
              style={{ transform: `translateY(${d * 6}px) scale(${1 - d * 0.025})`, opacity: 1 - d * 0.25 }}
            />
          ) : null,
        )}
        <div
          ref={card}
          className="relative flex flex-col gap-4 rounded-[14px] border-[1.5px] border-ink bg-white p-5 shadow-[0_10px_30px_rgba(16,24,40,.08)]"
        >
          <h3 className="m-0 text-[17px] font-semibold leading-snug text-ink">
            <Bi de={q.question_de} vi={q.question_vi} />
          </h3>
          <div role="radiogroup" aria-label="Antworten" className="flex flex-col gap-2">
            {q.options.map((o, k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={k === picked}
                disabled={pending}
                onClick={() => pick(k)}
                className={`flex w-full items-start gap-3 rounded-lg border bg-white px-3.5 py-3 text-left text-sm leading-normal text-ink ${
                  k === picked ? "border-accent bg-[#F1F6FE] ring-1 ring-accent" : "border-line hover:bg-[#F8F9FA]"
                }`}
              >
                <span
                  className={`mt-px flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[5px] text-xs font-semibold ${
                    k === picked ? "bg-accent text-white" : "bg-chip text-[#4A4F57]"
                  }`}
                >
                  {LETTERS[k]}
                </span>
                <span className="min-w-0 flex-1">
                  <Bi de={o.de} vi={o.vi} />
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0 || moving || pending}
              className="h-10 rounded-[7px] bg-chip px-3.5 text-sm font-medium text-ink hover:bg-line disabled:opacity-40"
            >
              ← <Label de="Zurück" vi="Quay lại" />
            </button>
            {error && <span role="alert" className="text-[13px] text-bad">{error}</span>}
            {last && !complete && (
              <span className="text-[13px] text-muted">
                <Label de="Beantworte zuerst alle Fragen." vi="Hãy trả lời tất cả câu hỏi trước." />
              </span>
            )}
            {last ? (
              <button
                type="button"
                onClick={submit}
                disabled={!complete || pending}
                className="ml-auto h-10 rounded-[7px] bg-accent px-[18px] text-sm font-medium text-white hover:bg-[#1F5DB5] disabled:bg-[#E6E2DC] disabled:text-[#6B6660]"
              >
                {pending ? <Label de="Wird gespeichert …" vi="Đang lưu …" /> : <Label de="Abschicken" vi="Gửi" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go(1)}
                disabled={picked === null || moving}
                className="ml-auto h-10 rounded-[7px] bg-accent px-[18px] text-sm font-medium text-white hover:bg-[#1F5DB5] disabled:bg-[#E6E2DC] disabled:text-[#6B6660]"
              >
                <Label de="Weiter" vi="Tiếp" /> →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
