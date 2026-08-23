"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "../../ui-icon";

/**
 * Game player.
 *
 * Full screen/window experience:
 * When the user clicks play, the game enters full window/fullscreen mode (fixed inset-0 z-[999999]),
 * portalled to document.body so it completely escapes parent grid & layout constraints.
 * Uses 100dvh (Dynamic Viewport Height) and theme-color switching so iOS Safari status bar
 * turns black and the game occupies 100% of the screen without cyan bars top or bottom.
 * A floating Poki-style back button (positioned safely for iOS notch/safe-areas) exits play mode.
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
  const [mounted, setMounted] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const enterFullscreen = async () => {
    const el = frameRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else {
        const webkitEl = el as unknown as { webkitRequestFullscreen?: () => void };
        webkitEl.webkitRequestFullscreen?.();
      }
    } catch {
      // Fullscreen API may be blocked/unsupported — portal & fixed dvh handles full screen
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        const webkitDoc = document as unknown as { webkitExitFullscreen?: () => void };
        await webkitDoc.webkitExitFullscreen?.();
      }
    } catch {
      // ignore
    }
  };

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      enterFullscreen();
    }, 50);
  };

  const handleBack = async () => {
    await exitFullscreen();
    setPlaying(false);
  };

  // Manage body scroll, theme color for iPhone status bar, and native fullscreen changes
  useEffect(() => {
    if (playing) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#000000");
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#4fdfe8");
    }

    const onChange = () => {
      const isNativeFs =
        !!document.fullscreenElement ||
        !!(document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement;

      if (!isNativeFs && playing) {
        setPlaying(false);
      }
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#4fdfe8");
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, [playing]);

  // Full-window overlay portalled directly to document.body
  const fullscreenOverlay = playing && mounted && (
    <div
      ref={frameRef}
      className="fixed inset-0 z-[999999] flex flex-col bg-black"
      style={{
        width: "100vw",
        height: "100dvh",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Floating Back Button (Poki Style) with iOS Safe-Area positioning */}
      <button
        type="button"
        onClick={handleBack}
        aria-label="Back to game"
        style={{
          top: "calc(env(safe-area-inset-top, 0px) + 12px)",
          left: "calc(env(safe-area-inset-left, 0px) + 12px)",
        }}
        className="absolute z-[1000000] flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-950 shadow-2xl transition hover:scale-105 active:scale-95 sm:h-11 sm:w-11"
      >
        <Icon name="chevronLeft" className="h-6 w-6" />
      </button>

      {/* Game Frame taking 100% of viewport */}
      <iframe
        src={url}
        title={title}
        allowFullScreen
        allow="autoplay; fullscreen; gamepad; keyboard-map; accelerometer; gyroscope; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"
        className="h-full w-full border-0 bg-black"
      />
    </div>
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_6px_10px_rgba(6,55,59,0.18)]">
      {/* Poster / Start Play View */}
      <div className="relative min-h-0 w-full flex-1 bg-zinc-900">
        <button
          type="button"
          onClick={handlePlay}
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
      </div>

      {/* Info bar when not playing */}
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
          onClick={handlePlay}
          aria-label="Play fullscreen"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 text-teal-700 transition hover:bg-teal-100"
        >
          <Icon name="expand" className="h-5 w-5" />
        </button>
      </div>

      {/* Render full screen overlay directly into body level */}
      {fullscreenOverlay && createPortal(fullscreenOverlay, document.body)}
    </div>
  );
}
