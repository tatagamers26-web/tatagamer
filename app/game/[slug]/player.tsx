"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Icon } from "../../ui-icon";

/**
 * Game player. The iframe is not mounted until the visitor clicks play — game
 * bundles run 1-3MB, so loading one on every page view would waste most of it and
 * drag down Core Web Vitals. The poster is the thumbnail we already have.
 */
export function Player({
  url,
  title,
  thumb,
  category,
}: {
  url: string;
  title: string;
  thumb: string;
  category: string;
}) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const goFullscreen = () => {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_6px_10px_rgba(6,55,59,0.18)]">
      <div ref={frameRef} className="relative min-h-0 w-full flex-1 bg-zinc-900">
        {playing ? (
          <iframe
            src={url}
            title={title}
            allowFullScreen
            allow="autoplay; fullscreen; gamepad; keyboard-map; accelerometer; gyroscope; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 grid place-items-center"
          >
            <span className="relative block h-[62%] max-h-72 w-auto overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={thumb}
                alt=""
                width={512}
                height={384}
                className="h-full w-auto object-cover transition duration-300 group-hover:scale-105"
                priority
              />
              <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/10">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-teal-700 shadow-lg transition group-hover:scale-110">
                  <Icon name="play" className="ml-1 h-7 w-7" />
                </span>
              </span>
            </span>
            <span className="absolute bottom-8 text-sm font-bold text-white drop-shadow">
              Click to play
            </span>
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 px-4 py-3">
        <Image
          src={thumb}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-teal-950">{title}</p>
          <p className="truncate text-xs text-zinc-500">{category}</p>
        </div>
        <button
          type="button"
          onClick={goFullscreen}
          aria-label="Play fullscreen"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 text-teal-700 transition hover:bg-teal-100"
        >
          <Icon name="expand" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
