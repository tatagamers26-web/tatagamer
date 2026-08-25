"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "../../ui-icon";

/**
 * Game Player — dual-mode behaviour:
 *
 * DESKTOP (≥ 768px):
 *   - "Click to play" poster → iframe loads inline inside the card (Poki style).
 *   - The expand button in the info bar requests native browser fullscreen.
 *   - No portal / fixed overlay is created.
 *
 * MOBILE (< 768px):
 *   - "Click to play" poster → iframe loads inline too.
 *   - Expand / fullscreen button opens the fixed-inset portal overlay
 *     (fixed inset-0, portalled to document.body) so the game occupies
 *     the entire screen — matching the old behaviour mobile players expect.
 *   - iOS native fullscreen API is tried first; falls back to the portal overlay.
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
  const [mobileFullscreen, setMobileFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Auto-start on desktop — no click-to-play needed
    if (window.innerWidth >= 768) {
      setPlaying(true);
    }
  }, []);

  /* ── Detect mobile (client-side only) ──────────────────────────────────── */
  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

  /* ── Native fullscreen helpers (used on desktop expand, or mobile fallback) */
  const enterNativeFullscreen = async (el: HTMLElement) => {
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else {
        const wk = el as unknown as { webkitRequestFullscreen?: () => void };
        wk.webkitRequestFullscreen?.();
      }
    } catch {
      // API blocked / unsupported
    }
  };

  const exitNativeFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        const wk = document as unknown as { webkitExitFullscreen?: () => void };
        wk.webkitExitFullscreen?.();
      }
    } catch {
      // ignore
    }
  };

  /* ── Play (click on poster) ─────────────────────────────────────────────
     Desktop → inline iframe.
     Mobile  → open fullscreen portal immediately (old behaviour).          */
  const handlePlay = () => {
    if (isMobile()) {
      setMobileFullscreen(true);
    } else {
      setPlaying(true);
    }
  };

  /* ── Expand / Fullscreen button ─────────────────────────────────────────
     Mobile  → open the fixed-portal overlay.
     Desktop → request native browser fullscreen on the inline player div.  */
  const handleExpand = async () => {
    if (isMobile()) {
      setMobileFullscreen(true);
    } else {
      // Try native fullscreen on the inline player container
      const el = frameRef.current;
      if (el) await enterNativeFullscreen(el);
    }
  };

  /* ── Close mobile fullscreen portal ────────────────────────────────────── */
  const handleCloseMobileFs = async () => {
    await exitNativeFullscreen();
    setMobileFullscreen(false);
  };

  /* ── Body scroll / theme-color while mobile portal is open ─────────────── */
  useEffect(() => {
    if (mobileFullscreen) {
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

      if (!isNativeFs && mobileFullscreen) {
        setMobileFullscreen(false);
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
  }, [mobileFullscreen]);

  /* ── Mobile fullscreen portal ───────────────────────────────────────────── */
  const mobilePortal = mobileFullscreen && mounted && (
    <div
      className="fixed inset-0 z-[999999] flex flex-col bg-black"
      style={{ width: "100vw", height: "100dvh", top: 0, left: 0 }}
    >
      {/* Back button — Poki-style, safe-area aware */}
      <button
        type="button"
        onClick={handleCloseMobileFs}
        aria-label="Exit fullscreen"
        style={{
          top: "calc(env(safe-area-inset-top, 0px) + 12px)",
          left: "calc(env(safe-area-inset-left, 0px) + 12px)",
        }}
        className="absolute z-[1000000] flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-950 shadow-2xl transition hover:scale-105 active:scale-95 sm:h-11 sm:w-11"
      >
        <Icon name="chevronLeft" className="h-6 w-6" />
      </button>

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
    <div
      ref={frameRef}
      className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_6px_10px_rgba(6,55,59,0.18)]"
    >
      {/* ── Poster (shown until user clicks play) ───────────────────────── */}
      {!playing && (
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
      )}

      {/* ── Inline iframe (Desktop Poki-style + Mobile before expand) ───── */}
      {playing && (
        <div className="relative min-h-0 w-full flex-1 bg-black">
          <iframe
            src={url}
            title={title}
            allowFullScreen
            allow="autoplay; fullscreen; gamepad; keyboard-map; accelerometer; gyroscope; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"
            className="absolute inset-0 h-full w-full border-0 bg-black"
          />
        </div>
      )}

      {/* ── Info bar (always shown) ──────────────────────────────────────── */}
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
        {/* Expand: on mobile opens portal, on desktop requests native fullscreen */}
        <button
          type="button"
          onClick={playing ? handleExpand : handlePlay}
          aria-label={playing ? "Fullscreen" : `Play ${title}`}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 text-teal-700 transition hover:bg-teal-100 active:scale-95"
        >
          <Icon name="expand" className="h-5 w-5" />
        </button>
      </div>

      {/* ── Mobile fullscreen portal ─────────────────────────────────────── */}
      {mobilePortal && createPortal(mobilePortal, document.body)}
    </div>
  );
}
