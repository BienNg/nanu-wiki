"use client";

import { useRef } from "react";
import { Label } from "./Bi";

/** A button that shows an image in a modal (not full screen), with a download button.
 *  Closes with Esc, the close button or a click on the dark backdrop. */
export function ImageModal({
  src,
  alt,
  title,
  className,
  children,
}: {
  src: string;
  alt: string;
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const file = src.split("/").pop() ?? "bild.png";

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={className}>
        {children}
      </button>
      <dialog
        ref={ref}
        aria-label={alt}
        onClick={(e) => {
          if (e.target === ref.current) ref.current.close();
        }}
        className="m-auto max-h-[92dvh] w-[min(92vw,640px)] overflow-hidden rounded-xl border border-line bg-white p-0 text-ink shadow-[0_20px_60px_rgba(16,24,40,.25)] backdrop:bg-black/60"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">{title ?? file}</span>
          <a
            href={src}
            download={file}
            className="rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white no-underline hover:bg-accent-dark"
          >
            <Label de="Herunterladen" vi="Tải xuống" />
          </a>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Schließen"
            className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-muted hover:bg-chip"
          >
            ×
          </button>
        </div>
        <div className="flex justify-center bg-side p-3">
          <img src={src} alt={alt} className="block max-h-[calc(92dvh-80px)] max-w-full rounded-lg object-contain" />
        </div>
      </dialog>
    </>
  );
}
