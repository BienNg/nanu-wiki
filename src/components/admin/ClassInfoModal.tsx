"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Label } from "@/components/Bi";
import { copyImageToClipboard } from "@/components/ImageModal";
import { MODE_LABEL, shortDate } from "@/lib/classes";
import { hasStarted, type AssignableClass } from "@/lib/messenger/classes";

function Row({ de, vi, children }: { de: string; vi: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[13px]">
      <span className="flex-none text-muted">
        <Label de={de} vi={vi} />
      </span>
      <span className="min-w-0 text-right font-medium">{children}</span>
    </div>
  );
}

/**
 * Everything about one class from Notion: the marketing image (served through
 * /api/classes/{id}/image, so Notion's expiring links never break) with a copy button to paste it
 * into Messenger, dates, how many students signed up, and the link to the Notion page.
 */
export function ClassInfoModal({ c, onClose }: { c: AssignableClass; onClose: () => void }) {
  const [copyState, setCopyState] = useState<"idle" | "busy" | "done" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const begin = c.begin ? shortDate(c.begin) : null;
  const end = c.end ? shortDate(c.end) : null;
  const copy = () => {
    setCopyState("busy");
    copyImageToClipboard(`/api/classes/${c.id}/image`)
      .then(() => setCopyState("done"))
      .catch(() => setCopyState("failed"))
      .finally(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopyState("idle"), 2000);
      });
  };

  // Portal to <body>: a sticky or transformed parent would otherwise trap the dialog under sticky headings.
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={c.name} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="anim-fade relative flex max-h-[85dvh] w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <header className="flex flex-none items-start gap-2 border-b border-line px-4 py-3">
          <h2 className="m-0 min-w-0 flex-1 text-[15px] font-semibold leading-snug">{c.name}</h2>
          <button type="button" onClick={onClose} aria-label="Schließen" className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-[16px] text-muted hover:bg-hover">
            ×
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {c.hasImage && (
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- streamed from Notion through our proxy */}
              <img src={`/api/classes/${c.id}/image?w=800`} alt={c.name} loading="lazy" className="w-full rounded-xl border border-line bg-[#F7F8FA] object-contain" />
              <button
                type="button"
                disabled={copyState === "busy"}
                onClick={copy}
                className="mt-2 w-full rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:bg-hover disabled:opacity-50"
              >
                {copyState === "done" ? (
                  <Label de="✓ Bild kopiert" vi="✓ Đã sao chép ảnh" />
                ) : copyState === "failed" ? (
                  <Label de="Kopieren fehlgeschlagen" vi="Sao chép thất bại" />
                ) : copyState === "busy" ? (
                  "…"
                ) : (
                  <Label de="Bild kopieren" vi="Sao chép ảnh" />
                )}
              </button>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            {c.level && (
              <Row de="Level" vi="Trình độ">
                {c.level}
              </Row>
            )}
            {c.mode && (
              <Row de="Ort" vi="Nơi học">
                <Label de={MODE_LABEL[c.mode].de} vi={MODE_LABEL[c.mode].vi} />
              </Row>
            )}
            {c.time && (
              <Row de="Uhrzeit" vi="Giờ học">
                {c.time}
              </Row>
            )}
            <Row de="Start" vi="Khai giảng">
              {begin ? (
                <>
                  <Label de={begin.de} vi={begin.vi} />
                  {hasStarted(c) && (
                    <span className="ml-1.5 rounded-full bg-[#F1F2F4] px-1.5 py-px text-[10.5px] font-medium text-muted">
                      <Label de="Läuft" vi="Đang học" />
                    </span>
                  )}
                </>
              ) : (
                <Label de="Noch offen" vi="Chưa có ngày" />
              )}
            </Row>
            {end && (
              <Row de="Ende" vi="Kết thúc">
                <Label de={end.de} vi={end.vi} />
              </Row>
            )}
            {/* "#Students" counts the distinct Kunde of the class's Zahlungen: the Notion integration must be able to read both databases. */}
            {typeof c.students === "number" && (
              <Row de="Angemeldete Schüler" vi="Học viên đã đăng ký">
                {c.students}
                {c.full && (
                  <span className="ml-1.5 rounded-full bg-[#FDF1E2] px-1.5 py-px text-[10.5px] font-medium text-[#9A5B13]">
                    <Label de="Voll" vi="Đã đầy" />
                  </span>
                )}
              </Row>
            )}
          </div>
          {c.notionUrl && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12.5px] font-medium">
              {/* The notion:// scheme hands the page to the Notion desktop app; without the app installed it does nothing. */}
              <a
                href={`notion://www.notion.so/${c.id.replace(/-/g, "")}`}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-accent-soft px-3 py-1.5 text-accent hover:opacity-90"
              >
                <Label de="In Notion-App öffnen" vi="Mở bằng app Notion" />
              </a>
              <a
                href={c.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-ink hover:bg-hover"
              >
                <Label de="Im Browser öffnen" vi="Mở trên trình duyệt" /> ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
