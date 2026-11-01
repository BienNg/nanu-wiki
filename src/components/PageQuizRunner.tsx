"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { submitPageQuiz } from "@/app/actions";
import { Bi, Label } from "./Bi";
import { LangToggle } from "./LangToggle";
import type { Lang } from "@/lib/types";

/** `value` = the option's original index, which is what the server grades. */
export type PageQuizQuestionView = {
  question_de: string;
  question_vi: string;
  options: { de: string; vi: string; value: number }[];
  section: { id: string; de: string; vi: string } | null;
};

type Result = { score: number; total: number; passed: boolean; wrong: number[] };
const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** End-of-page quiz: no right/wrong during the run, 100 % to pass. A failed run lists the wrong questions
 *  with a link to their section, never the right answers. „Nochmal“ reloads, so the options come reshuffled. */
export function PageQuizRunner({
  pageId,
  version,
  page,
  area,
  questions,
  lang,
}: {
  pageId: string;
  version: number;
  page: { href: string; title_de: string; title_vi: string };
  area: { name_de: string; name_vi: string };
  questions: PageQuizQuestionView[];
  lang: Lang;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const scope = useRef<HTMLDivElement>(null);

  const q = questions[index];
  const last = index === questions.length - 1;
  const picked = answers[index];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-step]", { opacity: 0, x: 24, duration: 0.45, ease: "power2.out", stagger: 0.05 });
    },
    { scope, dependencies: [index, result !== null] },
  );

  function pick(value: number) {
    setAnswers((a) => a.map((v, k) => (k === index ? value : v)));
  }

  function next() {
    if (!last) return setIndex((i) => i + 1);
    setError(null);
    startTransition(async () => {
      const res = await submitPageQuiz(pageId, version, answers.map((a) => a ?? -1));
      if (!res.ok) return setError(res.message);
      setResult(res);
    });
  }

  function restart() {
    setIndex(0);
    setAnswers(questions.map(() => null));
    setResult(null);
    router.refresh(); // new shuffle from the server
  }

  return (
    <div ref={scope} className="flex min-h-full flex-1 flex-col bg-peach">
      <div className="flex flex-wrap items-center gap-3 px-6 py-3.5">
        <span className="min-w-0 truncate text-[13px] text-body">
          <Label de={area.name_de} vi={area.name_vi} /> · <Label de={page.title_de} vi={page.title_vi} />
        </span>
        <div className="ml-auto flex items-center gap-2">
          <LangToggle initial={lang} />
          <Link href={page.href} className="flex min-h-10 items-center px-1.5 text-[13px] text-[#4A4F57]">
            <Label de="Schließen" vi="Đóng" />
          </Link>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-wrap items-start gap-12 px-8 pb-16 pt-8 max-sm:gap-6 max-sm:px-4">
        {!result ? (
          <>
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4 pt-10 max-sm:pt-2">
              <span data-step className="cap text-[#6B6660]">
                <Label de={`Frage ${index + 1} von ${questions.length}`} vi={`Câu ${index + 1}/${questions.length}`} />
              </span>
              <h1 data-step className="title-display m-0 text-[34px] leading-[1.18] max-sm:text-[26px]">
                <Bi de={q.question_de} vi={q.question_vi} />
              </h1>
              <div aria-hidden="true" className="grid max-w-[320px] gap-1" style={{ gridTemplateColumns: `repeat(${questions.length}, minmax(0,1fr))` }}>
                {questions.map((_, k) => (
                  <span key={k} className="h-1 rounded-full" style={{ background: k === index ? "#2B2D31" : answers[k] !== null ? "#8C7F73" : "#E3D6CA" }} />
                ))}
              </div>
              <p data-step className="m-0 max-w-[420px] text-[13px] text-[#6B6660]">
                <Label
                  de="Du siehst erst am Ende, ob alles stimmt. Zum Bestehen müssen alle Antworten richtig sein."
                  vi="Bạn chỉ biết kết quả ở cuối. Phải đúng tất cả các câu mới đạt."
                />
              </p>
            </div>

            <section data-step className="flex min-w-0 flex-[1_1_440px] flex-col gap-4 rounded-[14px] border-[1.5px] border-ink bg-white p-6 shadow-[0_10px_30px_rgba(60,40,20,.08)] max-sm:p-4">
              <div role="radiogroup" aria-label="Antworten" className="flex flex-col gap-2">
                {q.options.map((o, k) => {
                  const on = o.value === picked;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => pick(o.value)}
                      className={`flex w-full items-start gap-3 rounded-lg border bg-white px-3.5 py-3 text-left text-sm leading-normal text-ink ${on ? "border-accent bg-[#F1F6FE] ring-1 ring-accent" : "border-line hover:bg-[#F8F9FA]"}`}
                    >
                      <span className={`mt-px flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[5px] text-xs font-semibold ${on ? "bg-accent text-white" : "bg-chip text-[#4A4F57]"}`}>
                        {LETTERS[k]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <Bi de={o.de} vi={o.vi} />
                      </span>
                    </button>
                  );
                })}
              </div>

              {error && (
                <p role="alert" className="m-0 rounded-lg bg-bad-soft px-3.5 py-3 text-[13px] text-[#7A2618]">
                  {error}
                </p>
              )}

              <div className="flex justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIndex((i) => i - 1)}
                  disabled={index === 0 || pending}
                  className="h-10 rounded-[7px] bg-chip px-3.5 text-sm font-medium text-ink hover:bg-line disabled:invisible"
                >
                  ← <Label de="Zurück" vi="Quay lại" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={picked === null || pending}
                  className="h-10 rounded-[7px] bg-accent px-[18px] text-sm font-medium text-white hover:bg-[#1F5DB5] disabled:bg-[#E6E2DC] disabled:text-[#6B6660]"
                >
                  {last ? <Label de="Abgeben" vi="Nộp bài" /> : <Label de="Weiter" vi="Tiếp tục" />} →
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4 pt-10 max-sm:pt-2">
              <span data-step className="cap text-[#6B6660]">
                <Label de={`Ergebnis · ${result.score} von ${result.total} richtig`} vi={`Kết quả · đúng ${result.score}/${result.total}`} />
              </span>
              <h1 data-step className="title-display m-0 text-[38px] leading-[1.15] max-sm:text-[28px]">
                {result.passed ? <Bi de="Bestanden – stark!" vi="Đã qua – tuyệt vời!" /> : <Bi de="Noch nicht bestanden" vi="Chưa đạt" />}
              </h1>
              <p data-step className="m-0 max-w-[420px] text-[15px] text-[#4A4F57]">
                {result.passed ? (
                  <Bi de="Du hast alles richtig. Das ist jetzt gespeichert." vi="Bạn đã đúng tất cả. Kết quả đã được lưu." />
                ) : (
                  <Bi
                    de="Lies die Abschnitte zu den falschen Fragen noch einmal und versuch es dann wieder. Die Antworten kommen beim nächsten Mal in anderer Reihenfolge."
                    vi="Hãy đọc lại các mục của những câu sai rồi làm lại. Lần sau thứ tự đáp án sẽ khác."
                  />
                )}
              </p>
              <div data-step className="flex flex-wrap gap-2">
                <Link href={page.href} className="inline-flex h-10 items-center rounded-[7px] bg-accent px-[18px] text-sm font-medium text-white hover:bg-[#1F5DB5] hover:text-white">
                  <Label de="Zurück zur Seite" vi="Về trang" /> →
                </Link>
                {!result.passed && (
                  <button type="button" onClick={restart} className="h-10 rounded-[7px] bg-chip px-3.5 text-sm font-medium text-ink hover:bg-line">
                    <Label de="Nochmal versuchen" vi="Làm lại" />
                  </button>
                )}
              </div>
            </div>

            <section data-step className="flex min-w-0 flex-[1_1_440px] flex-col rounded-[14px] border-[1.5px] border-ink bg-white p-6 max-sm:p-4">
              {questions.map((qq, k) => {
                const ok = !result.wrong.includes(k);
                return (
                  <div key={k} className="flex items-start gap-2.5 border-t border-[#F0F1F3] px-0.5 py-2.5 text-[13px] first:border-t-0">
                    <span className={`mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full text-[10px] font-bold ${ok ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"}`}>
                      {ok ? "✓" : "✗"}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-ink">
                        <Bi de={qq.question_de} vi={qq.question_vi} />
                      </span>
                      {!ok && (
                        <Link href={qq.section ? `${page.href}#${qq.section.id}` : page.href} className="self-start text-xs font-medium text-accent">
                          {qq.section ? <Label de={`Lesen: ${qq.section.de}`} vi={`Đọc: ${qq.section.vi}`} /> : <Label de="Seite lesen" vi="Đọc trang" />} →
                        </Link>
                      )}
                    </span>
                  </div>
                );
              })}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
