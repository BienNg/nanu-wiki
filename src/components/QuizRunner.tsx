"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { checkAnswer, submitQuiz } from "@/app/actions";
import { Bi, Label } from "./Bi";

export type QuizQuestion = {
  question_de: string;
  question_vi: string;
  options: { de: string; vi: string }[];
  explanation_de: string | null;
  explanation_vi: string | null;
};

type Result = { score: number; total: number; passed: boolean; correct: number[] };
const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizRunner({
  quizId,
  passPercent,
  week,
  area,
  questions,
}: {
  quizId: string;
  passPercent: number;
  week: { number: number; de: string; vi: string };
  area: { slug: string; name_de: string; name_vi: string; color: string };
  questions: QuizQuestion[];
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctIndex: number } | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [marks, setMarks] = useState<boolean[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, startTransition] = useTransition();
  const scope = useRef<HTMLDivElement>(null);

  const q = questions[index];
  const last = index === questions.length - 1;
  const backHref = `/bereich/${area.slug}?tab=onboarding`;

  // Slide each new question (and the result) in.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-step]", { opacity: 0, x: 24, duration: 0.45, ease: "power2.out", stagger: 0.05 });
    },
    { scope, dependencies: [index, result !== null] },
  );

  // Little pop on the feedback box.
  useGSAP(
    () => {
      if (feedback) gsap.from("[data-feedback]", { scale: 0.96, opacity: 0, duration: 0.3, ease: "back.out(2)" });
    },
    { scope, dependencies: [feedback] },
  );

  function check() {
    if (picked === null) return;
    startTransition(async () => {
      const res = await checkAnswer(quizId, index, picked);
      setFeedback(res);
      setAnswers((a) => [...a, picked]);
      setMarks((m) => [...m, res.isCorrect]);
    });
  }

  function next() {
    if (!last) {
      setIndex((i) => i + 1);
      setPicked(null);
      setFeedback(null);
      return;
    }
    startTransition(async () => {
      setResult(await submitQuiz(quizId, answers));
    });
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setFeedback(null);
    setAnswers([]);
    setMarks([]);
    setResult(null);
  }

  if (!questions.length) {
    return <p className="p-10 text-muted">Dieses Quiz hat noch keine Fragen · Quiz chưa có câu hỏi</p>;
  }

  return (
    <div ref={scope} className="flex min-h-full flex-1 flex-col bg-peach">
      <div className="flex flex-wrap items-center gap-3 px-6 py-3.5">
        <span className="text-[13px] text-body">
          <Label de={area.name_de} vi={area.name_vi} /> · <Label de={`Woche ${week.number}`} vi={`Tuần ${week.number}`} />
        </span>
        <Link href={backHref} className="ml-auto flex min-h-10 items-center px-1.5 text-[13px] text-[#4A4F57]">
          <Label de="Schließen" vi="Đóng" />
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-wrap items-start gap-12 px-8 pb-16 pt-8">
        {!result ? (
          <>
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4 pt-10">
              <span data-step className="cap text-[#6B6660]">
                <Label de={`Frage ${index + 1} von ${questions.length}`} vi={`Câu ${index + 1}/${questions.length}`} /> · <Bi de={week.de} vi={week.vi} inline />
              </span>
              <h1 data-step className="title-display m-0 text-[34px] leading-[1.18]">
                <Bi de={q.question_de} vi={q.question_vi} />
              </h1>
              <div aria-hidden="true" className="grid max-w-[320px] gap-1" style={{ gridTemplateColumns: `repeat(${questions.length}, minmax(0,1fr))` }}>
                {questions.map((_, k) => (
                  <span
                    key={k}
                    className="h-1 rounded-full"
                    style={{ background: k < marks.length ? (marks[k] ? "#23794A" : "#B9382A") : k === index ? "#2B2D31" : "#E3D6CA" }}
                  />
                ))}
              </div>
            </div>

            <section data-step className="flex min-w-0 flex-[1_1_440px] flex-col gap-4 rounded-[14px] border-[1.5px] border-ink bg-white p-6 shadow-[0_10px_30px_rgba(60,40,20,.08)]">
              <div role="radiogroup" aria-label="Antworten" className="flex flex-col gap-2">
                {q.options.map((o, k) => {
                  const state = feedback
                    ? k === feedback.correctIndex
                      ? "correct"
                      : k === picked
                        ? "wrong"
                        : "dim"
                    : k === picked
                      ? "selected"
                      : "idle";
                  const styles = {
                    idle: "border-line hover:bg-[#F8F9FA]",
                    selected: "border-accent bg-[#F1F6FE] ring-1 ring-accent",
                    correct: "border-ok bg-[#EEF8F1] ring-1 ring-ok",
                    wrong: "border-bad bg-bad-soft ring-1 ring-bad",
                    dim: "border-line text-muted",
                  }[state];
                  const key = {
                    idle: "bg-chip text-[#4A4F57]",
                    selected: "bg-accent text-white",
                    correct: "bg-ok text-white",
                    wrong: "bg-bad text-white",
                    dim: "bg-chip text-[#4A4F57]",
                  }[state];
                  return (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={k === picked}
                      disabled={!!feedback}
                      onClick={() => setPicked(k)}
                      className={`flex w-full items-start gap-3 rounded-lg border bg-white px-3.5 py-3 text-left text-sm leading-normal text-ink ${styles}`}
                    >
                      <span className={`mt-px flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[5px] text-xs font-semibold ${key}`}>{LETTERS[k]}</span>
                      <span className="min-w-0 flex-1">
                        <Bi de={o.de} vi={o.vi} />
                      </span>
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div
                  data-feedback
                  role="status"
                  className={`rounded-lg px-3.5 py-3 text-[13px] ${feedback.isCorrect ? "bg-ok-soft text-[#1C5E3A]" : "bg-bad-soft text-[#7A2618]"}`}
                >
                  <strong className="font-semibold">
                    {feedback.isCorrect ? <Label de="Richtig!" vi="Chính xác!" /> : <Label de="Nicht ganz." vi="Chưa đúng." />}
                  </strong>{" "}
                  {q.explanation_de && <Bi de={q.explanation_de} vi={q.explanation_vi} />}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                {!feedback ? (
                  <button
                    type="button"
                    onClick={check}
                    disabled={picked === null || pending}
                    className="h-10 rounded-[7px] bg-accent px-[18px] text-sm font-medium text-white hover:bg-[#1F5DB5] disabled:bg-[#E6E2DC] disabled:text-[#6B6660]"
                  >
                    <Label de="Antwort prüfen" vi="Kiểm tra" />
                  </button>
                ) : (
                  <button type="button" onClick={next} disabled={pending} className="h-10 rounded-[7px] bg-accent px-[18px] text-sm font-medium text-white hover:bg-[#1F5DB5] disabled:opacity-60">
                    {last ? <Label de="Ergebnis ansehen" vi="Xem kết quả" /> : <Label de="Weiter" vi="Tiếp tục" />} →
                  </button>
                )}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4 pt-10">
              <span data-step className="cap text-[#6B6660]">
                <Label de={`Ergebnis · Woche ${week.number}`} vi={`Kết quả · Tuần ${week.number}`} />
              </span>
              <h1 data-step className="title-display m-0 text-[38px] leading-[1.15]">
                {result.passed ? <Bi de="Bestanden – stark!" vi="Đã qua – tuyệt vời!" /> : <Bi de="Fast geschafft" vi="Gần được rồi" />}
              </h1>
              <p data-step className="m-0 max-w-[420px] text-[15px] text-[#4A4F57]">
                {result.passed ? (
                  <Bi de="Die Woche ist abgeschlossen. Dein Buddy bekommt eine Nachricht auf Slack." vi="Bạn đã hoàn thành tuần này. Người hướng dẫn sẽ nhận tin nhắn trên Slack." />
                ) : (
                  <Bi de={`Zum Bestehen brauchst du ${passPercent} %. Lies die Themen nach und versuch es noch einmal.`} vi={`Cần đạt ${passPercent} % để qua. Hãy đọc lại và thử lại nhé.`} />
                )}
              </p>
              <div data-step className="flex flex-wrap gap-2">
                <Link href={backHref} className="inline-flex h-10 items-center rounded-[7px] bg-accent px-[18px] text-sm font-medium text-white hover:bg-[#1F5DB5] hover:text-white">
                  <Label de="Zurück zum Lernpfad" vi="Về lộ trình" /> →
                </Link>
                <button type="button" onClick={restart} className="h-10 rounded-[7px] bg-chip px-3.5 text-sm font-medium text-ink hover:bg-line">
                  <Label de="Nochmal" vi="Làm lại" />
                </button>
              </div>
            </div>

            <section data-step className="flex min-w-0 flex-[1_1_440px] flex-col gap-4 rounded-[14px] border-[1.5px] border-ink bg-white p-6">
              <div className="flex items-center gap-4">
                <ScoreRing score={result.score} total={result.total} passed={result.passed} />
                <div className="text-[13px] leading-snug text-muted">
                  <strong className="block text-xl text-ink">{Math.round((result.score / result.total) * 100)} %</strong>
                  <Label de={`Bestehensgrenze ${passPercent} %`} vi={`Ngưỡng đạt ${passPercent} %`} />
                </div>
              </div>
              <div className="flex flex-col">
                {questions.map((qq, k) => {
                  const ok = answers[k] === result.correct[k];
                  return (
                    <div key={k} className="flex items-start gap-2.5 border-t border-[#F0F1F3] px-0.5 py-2.5 text-[13px]">
                      <span className={`mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full text-[10px] font-bold ${ok ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"}`}>
                        {ok ? "✓" : "✗"}
                      </span>
                      <span className="text-ink">
                        <Bi de={qq.question_de} vi={qq.question_vi} />
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function ScoreRing({ score, total, passed }: { score: number; total: number; passed: boolean }) {
  const ring = useRef<HTMLDivElement>(null);
  const pct = total ? score / total : 0;
  useGSAP(() => {
    const state = { p: 0 };
    gsap.to(state, {
      p: pct,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        if (ring.current) ring.current.style.background = `conic-gradient(${passed ? "#23794A" : "#B9382A"} ${state.p * 360}deg, #EEEFF1 0)`;
      },
    });
  });
  return (
    <div ref={ring} aria-hidden="true" className="flex h-[72px] w-[72px] flex-none items-center justify-center rounded-full bg-[#EEEFF1]">
      <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white text-[17px] font-bold text-ink">
        {score}/{total}
      </div>
    </div>
  );
}
