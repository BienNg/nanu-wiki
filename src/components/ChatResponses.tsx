import { createClient } from "@/lib/supabase/server";
import { formatDate, initials } from "@/lib/format";
import type { Block, ChatTurn } from "@/lib/types";
import { Avatar } from "./Badges";
import { Label } from "./Bi";

type Row = {
  id: string;
  sim_id: string;
  turns: ChatTurn[];
  created_at: string;
  profile: { full_name: string | null; email: string; role: string } | null;
};

const secs = (s: number) => (s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${s % 60} s`);

/** For editors/admins: everyone's answers to the Messenger simulations on a page (RLS limits who sees what). */
export async function ChatResponses({ pageId, blocks }: { pageId: string; blocks: Block[] }) {
  const sims = blocks.filter((b) => b.type === "chat");
  if (!sims.length) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("chat_responses")
    .select("id, sim_id, turns, created_at, profile:profiles(full_name, email, role)")
    .eq("page_id", pageId)
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as unknown as Row[];

  return (
    <section data-reveal className="mt-6 flex flex-col gap-3 rounded-[10px] border border-line bg-side p-4">
      <h2 className="m-0 flex items-baseline gap-2 text-base font-semibold text-ink">
        <Label de="Antworten aus der Messenger-Simulation" vi="Câu trả lời trong mô phỏng Messenger" />
        <span className="text-xs font-normal text-muted">{rows.length}</span>
      </h2>
      {!rows.length && (
        <p className="m-0 text-sm text-muted">
          <Label de="Noch niemand hat die Simulation abgeschlossen." vi="Chưa có ai hoàn thành mô phỏng." />
        </p>
      )}
      {rows.map((r) => {
        const name = r.profile?.full_name ?? r.profile?.email ?? "–";
        const total = r.turns.reduce((sum, t) => sum + t.seconds, 0);
        const sim = sims.length > 1 ? sims.find((s) => s.id === r.sim_id)?.customer : null;
        return (
          <details key={r.id} className="group rounded-lg border border-line bg-white">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2.5 px-3.5 py-2.5 text-sm">
              <Avatar text={initials(r.profile?.full_name, r.profile?.email)} />
              <strong className="font-medium text-ink">{name}</strong>
              {r.profile?.role === "candidate" && <span className="rounded bg-chip px-1.5 py-0.5 text-[11px] text-muted">Kandidat · Ứng viên</span>}
              {sim && <span className="text-xs text-muted">· {sim}</span>}
              <span className="ml-auto text-xs text-muted">
                {formatDate(r.created_at)} · Ø {secs(Math.round(total / Math.max(1, r.turns.length)))}
              </span>
              <span aria-hidden="true" className="text-xs text-muted transition-transform group-open:rotate-90">›</span>
            </summary>
            <div className="flex flex-col gap-1.5 border-t border-line-soft px-3.5 py-3">
              {r.turns.map((t, k) => (
                <div key={k} className="flex flex-col gap-1.5">
                  <span className="max-w-[78%] self-start whitespace-pre-line rounded-[18px] bg-[#F0F0F0] px-3.5 py-2 text-[14px] leading-snug text-ink">{t.customer}</span>
                  <span className="max-w-[78%] self-end whitespace-pre-line rounded-[18px] bg-accent px-3.5 py-2 text-[14px] leading-snug text-white">{t.reply}</span>
                  <span className="mb-2 self-end text-[11px] text-muted">
                    <Label de={`nach ${secs(t.seconds)}`} vi={`sau ${secs(t.seconds)}`} />
                  </span>
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </section>
  );
}
