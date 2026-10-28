import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, initials } from "@/lib/format";
import type { Block } from "@/lib/types";
import { Avatar } from "./Badges";
import { Bi, Label } from "./Bi";

type Row = {
  id: string;
  quiz_id: string;
  answers: number[];
  score: number;
  total: number;
  created_at: string;
  profile: { full_name: string | null; email: string; role: string } | null;
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** For editors/admins: everyone's multiple-choice rounds on a page.
 *  quiz_attempts RLS only lets admins and buddies read, so DocView renders this only for editors of the area
 *  and the rows are read with the service role. */
export async function McqResponses({ pageId, blocks }: { pageId: string; blocks: Block[] }) {
  const rounds = blocks.filter((b) => b.type === "mcq");
  if (!rounds.length) return null;

  const { data } = await createAdminClient()
    .from("quiz_attempts")
    .select("id, quiz_id, answers, score, total, created_at, profile:profiles(full_name, email, role)")
    .in("quiz_id", rounds.map((r) => `${pageId}#${r.id}`))
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as unknown as Row[];

  return (
    <section data-reveal className="mt-6 flex flex-col gap-3 rounded-[10px] border border-line bg-side p-4">
      <h2 className="m-0 flex items-baseline gap-2 text-base font-semibold text-ink">
        <Label de="Antworten aus der Multiple-Choice-Runde" vi="Câu trả lời phần trắc nghiệm" />
        <span className="text-xs font-normal text-muted">{rows.length}</span>
      </h2>
      {!rows.length && (
        <p className="m-0 text-sm text-muted">
          <Label de="Noch niemand hat die Runde abgeschlossen." vi="Chưa có ai hoàn thành." />
        </p>
      )}
      {rows.map((r) => {
        const round = rounds.find((b) => `${pageId}#${b.id}` === r.quiz_id);
        const name = r.profile?.full_name ?? r.profile?.email ?? "–";
        return (
          <details key={r.id} className="group rounded-lg border border-line bg-white">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2.5 px-3.5 py-2.5 text-sm">
              <Avatar text={initials(r.profile?.full_name, r.profile?.email)} />
              <strong className="font-medium text-ink">{name}</strong>
              {r.profile?.role === "candidate" && <span className="rounded bg-chip px-1.5 py-0.5 text-[11px] text-muted">Kandidat · Ứng viên</span>}
              <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${r.score === r.total ? "bg-ok-soft text-ok" : "bg-chip text-ink"}`}>
                {r.score}/{r.total}
              </span>
              <span className="ml-auto text-xs text-muted">{formatDate(r.created_at)}</span>
              <span aria-hidden="true" className="text-xs text-muted transition-transform group-open:rotate-90">›</span>
            </summary>
            {round && (
              <ol className="m-0 flex list-none flex-col border-t border-line-soft p-0">
                {round.questions.map((q, k) => {
                  const a = r.answers[k];
                  const ok = a === q.correct;
                  return (
                    <li key={k} className="flex items-start gap-2.5 border-t border-[#F0F1F3] px-3.5 py-2.5 text-[13px] first:border-t-0">
                      <span className={`mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full text-[10px] font-bold ${ok ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"}`}>
                        {ok ? "✓" : "✗"}
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-ink">
                          <Bi de={q.question_de} vi={q.question_vi} />
                        </span>
                        <span className={ok ? "text-ok" : "text-bad"}>
                          {LETTERS[a] ?? "–"}: {q.options[a] ? <Bi de={q.options[a].de} vi={q.options[a].vi} inline /> : <Label de="keine Antwort" vi="không trả lời" />}
                        </span>
                        {!ok && (
                          <span className="text-muted">
                            <Label de="Richtig" vi="Đúng" /> {LETTERS[q.correct]}: <Bi de={q.options[q.correct].de} vi={q.options[q.correct].vi} inline />
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </details>
        );
      })}
    </section>
  );
}
