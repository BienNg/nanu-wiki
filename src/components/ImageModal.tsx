"use client";

import { useRef, useState } from "react";
import { Label } from "./Bi";

/** Puts the image on the clipboard as PNG so it can be pasted into Messenger. */
export function copyImageToClipboard(src: string) {
  const png = fetch(src)
    .then((r) => {
      if (!r.ok) throw new Error("image");
      return r.blob();
    })
    .then((blob) => (blob.type === "image/png" ? blob : blobToPng(blob)));
  return navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
}

function blobToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((out) => (out ? resolve(out) : reject(new Error("png"))), "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}

/** A button that shows an image in a modal (not full screen), with copy and download.
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
  const [copied, setCopied] = useState(false);
  const file = src.split("/").pop() ?? "bild.png";

  async function copy() {
    await copyImageToClipboard(src);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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
          <button
            type="button"
            onClick={copy}
            className="rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-accent-dark"
          >
            {copied ? <Label de="Kopiert ✓" vi="Đã sao chép ✓" /> : <Label de="Kopieren" vi="Sao chép" />}
          </button>
          <a
            href={src}
            download={file}
            className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink no-underline hover:bg-chip"
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
