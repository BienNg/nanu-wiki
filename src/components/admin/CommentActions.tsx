"use client";

import { useState, useTransition } from "react";
import { setCommentStatus } from "@/app/actions";
import type { CommentStatus } from "@/lib/types";
import { Label } from "@/components/Bi";

/** Status buttons on an inbox row. Closing (done / won't do) asks for an optional reply that goes to the author on Slack. */
export function CommentActions({ id, status }: { id: string; status: CommentStatus }) {
  const [closing, setClosing] = useState<"resolved" | "declined" | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function apply(next: CommentStatus, withNote?: string) {
    setError(null);
    start(async () => {
      const res = await setCommentStatus(id, next, withNote);
      if (!res.ok) setError(res.message);
      else setClosing(null);
    });
  }

  const btn = "rounded-md border border-line px-2.5 py-1 text-[13px] text-body hover:bg-hover disabled:opacity-60";

  if (closing) {
    return (
      <form
        className="flex w-full flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          apply(closing, note);
        }}
      >
        <input
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={2000}
          placeholder={closing === "resolved" ? "Was wurde geändert? (optional, geht per Slack an die Person)" : "Warum nicht? (optional, geht per Slack an die Person)"}
          className="min-w-[240px] flex-1 rounded-md border border-line px-2.5 py-1 text-[13px] outline-none focus:border-accent"
        />
        <button type="submit" disabled={pending} className="rounded-md bg-accent px-3 py-1 text-[13px] font-medium text-white hover:bg-accent-dark disabled:opacity-60">
          {closing === "resolved" ? <Label de="Erledigt & danken" vi="Xong & cảm ơn" /> : <Label de="Ablehnen" vi="Không làm" />}
        </button>
        <button type="button" onClick={() => setClosing(null)} className={btn}>
          <Label de="Abbrechen" vi="Hủy" />
        </button>
        {error && <span className="text-[13px] text-bad">{error}</span>}
      </form>
    );
  }

  return (
    <div className="ml-auto flex flex-wrap items-center gap-1.5">
      {error && <span className="text-[13px] text-bad">{error}</span>}
      {status === "open" && (
        <button type="button" disabled={pending} onClick={() => apply("in_progress")} className={btn}>
          <Label de="In Arbeit" vi="Đang xử lý" />
        </button>
      )}
      {(status === "open" || status === "in_progress") && (
        <>
          <button type="button" disabled={pending} onClick={() => setClosing("declined")} className={btn}>
            <Label de="Ablehnen" vi="Không làm" />
          </button>
          <button type="button" disabled={pending} onClick={() => setClosing("resolved")} className="rounded-md bg-ok px-2.5 py-1 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60">
            ✓ <Label de="Erledigt" vi="Đã xong" />
          </button>
        </>
      )}
      {(status === "resolved" || status === "declined") && (
        <button type="button" disabled={pending} onClick={() => apply("open")} className={btn}>
          <Label de="Wieder öffnen" vi="Mở lại" />
        </button>
      )}
    </div>
  );
}
