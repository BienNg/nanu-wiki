"use client";

import { useState } from "react";
import { youtubeId } from "@/lib/youtube";

/** YouTube explainer video. Loads the player only after a click
 *  (privacy-friendly youtube-nocookie domain, faster pages). */
export function VideoEmbed({ url, captionDe, captionVi }: { url: string; captionDe?: string; captionVi?: string }) {
  const id = youtubeId(url);
  const [playing, setPlaying] = useState(false);

  if (!id) {
    return (
      <figure className="my-1 flex aspect-video items-center justify-center rounded-xl border border-dashed border-line bg-side px-6 text-center text-[13px] text-muted">
        <span>
          <span className="block font-medium text-body">Video-URL fehlt · Chưa có link video</span>
          {captionDe ? <span className="mt-1 block">{captionDe}</span> : null}
        </span>
      </figure>
    );
  }

  return (
    <figure className="my-1">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={captionDe || "YouTube-Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Video abspielen: ${captionDe ?? ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover opacity-90" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent shadow-lg transition group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {(captionDe || captionVi) && (
        <figcaption className="mt-2 text-[13px] text-muted">
          <span className="de">{captionDe}</span>
          {captionVi ? <span className="vi">{captionVi}</span> : null}
        </figcaption>
      )}
    </figure>
  );
}
