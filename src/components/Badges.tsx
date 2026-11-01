import type { KnowledgeKind } from "@/lib/types";
import type { QuizState, QuizStatus } from "@/lib/pageQuiz";
import { isVerified, formatDate } from "@/lib/format";
import { Label } from "./Bi";
import { Icon } from "./Icon";

export const KIND: Record<KnowledgeKind, { de: string; vi: string; cls: string; dot: string }> = {
  reference: { de: "Referenz", vi: "Tham khảo", cls: "bg-[#E3EEF9] text-[#2D5F92]", dot: "#2D5F92" },
  process: { de: "Prozess", vi: "Quy trình", cls: "bg-[#E2F3EA] text-[#1F6E46]", dot: "#1F6E46" },
  decision: { de: "Entscheidung", vi: "Quyết định", cls: "bg-[#EEE9FA] text-[#553A9E]", dot: "#553A9E" },
  living: { de: "Living", vi: "Cập nhật liên tục", cls: "bg-[#FCEBDD] text-[#9A4A16]", dot: "#9A4A16" },
};

export function KindBadge({ kind }: { kind: KnowledgeKind }) {
  const k = KIND[kind];
  return (
    <span className={`inline-flex h-[22px] items-center whitespace-nowrap rounded px-[7px] text-xs font-medium ${k.cls}`}>
      <Label de={k.de} vi={k.vi} />
    </span>
  );
}

export function VerifiedPill({ until, showDate = false }: { until: string | null; showDate?: boolean }) {
  const ok = isVerified(until);
  return (
    <span
      className={`inline-flex h-[22px] items-center gap-1 whitespace-nowrap rounded-full px-[7px] text-xs font-medium ${
        ok ? "bg-ok-soft text-ok" : "bg-chip text-muted"
      }`}
    >
      <Icon name="check" size={11} strokeWidth={2.6} />
      {ok ? <Label de="Geprüft" vi="Đã duyệt" /> : <Label de="Ungeprüft" vi="Chưa duyệt" />}
      {ok && showDate ? <span className="font-normal opacity-80">· {formatDate(until)}</span> : null}
    </span>
  );
}

export function Avatar({ text, color = "#FCE6DC", fg = "#9E3617", size = 18 }: { text: string; color?: string; fg?: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex flex-none items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: color, color: fg, fontSize: Math.max(8, size * 0.42) }}
    >
      {text}
    </span>
  );
}

const QUIZ: Record<QuizState, { de: string; vi: string; cls: string }> = {
  passed: { de: "Quiz bestanden", vi: "Đã qua quiz", cls: "bg-ok-soft text-ok" },
  outdated: { de: "Neue Inhalte – Quiz wiederholen", vi: "Có nội dung mới – làm lại quiz", cls: "bg-warn-soft text-[#7F5F05]" },
  failed: { de: "Quiz noch nicht bestanden", vi: "Chưa qua quiz", cls: "bg-bad-soft text-[#7A2618]" },
  open: { de: "Quiz offen", vi: "Chưa làm quiz", cls: "bg-chip text-muted" },
};

/** Where someone stands with a page's quiz. `short` = only a symbol, for narrow lists. */
export function QuizChip({ status, short = false }: { status: QuizStatus; short?: boolean }) {
  const q = QUIZ[status.state];
  const symbol = { passed: "✓", outdated: "↻", failed: "✗", open: "?" }[status.state];
  if (short) {
    return (
      <span title={`${q.de} · ${q.vi}`} className={`inline-flex h-[18px] min-w-[18px] flex-none items-center justify-center rounded-full px-1 text-[10px] font-bold ${q.cls}`}>
        {symbol}
      </span>
    );
  }
  return (
    <span className={`inline-flex h-[22px] items-center gap-1 whitespace-nowrap rounded-full px-[7px] text-xs font-medium ${q.cls}`}>
      <span aria-hidden="true">{symbol}</span>
      <Label de={q.de} vi={q.vi} />
      {status.state === "passed" && status.at ? <span className="font-normal opacity-80">· {formatDate(status.at)}</span> : null}
    </span>
  );
}
