"use client";

import { useEffect } from "react";

type AdVariant =
  | "leaderboard"     // 728×90
  | "mobile-banner"   // 320×100
  | "medium-rect"     // 300×250
  | "large-rect"      // 336×280
  | "skyscraper"      // 160×600
  | "half-page";      // 300×600

const SIZES: Record<AdVariant, { w: number; h: number; label: string }> = {
  "leaderboard":   { w: 728, h: 90,  label: "728 × 90 — Leaderboard" },
  "mobile-banner": { w: 320, h: 100, label: "320 × 100 — Mobile Banner" },
  "medium-rect":   { w: 300, h: 250, label: "300 × 250 — Medium Rectangle" },
  "large-rect":    { w: 336, h: 280, label: "336 × 280 — Large Rectangle" },
  "skyscraper":    { w: 160, h: 600, label: "160 × 600 — Wide Skyscraper" },
  "half-page":     { w: 300, h: 600, label: "300 × 600 — Half Page" },
};

interface AdUnitProps {
  variant: AdVariant;
  /** Google AdSense Slot ID (from your AdSense Dashboard) */
  slotId?: string;
  /** When true the placeholder fills its parent container (use for grid rail slots). */
  fill?: boolean;
  className?: string;
}

export function AdUnit({ variant, slotId, fill = false, className = "" }: AdUnitProps) {
  const { w, h, label } = SIZES[variant];

  useEffect(() => {
    if (slotId && typeof window !== "undefined") {
      try {
        // @ts-expect-error AdSense global push
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [slotId]);

  return (
    <div
      aria-label="Advertisement"
      className={`ad-unit flex overflow-hidden rounded-xl ${fill ? "w-full h-full shrink-0" : "shrink-0"} ${className}`}
      style={fill ? {} : { width: w, height: h, maxWidth: "100%" }}
    >
      {slotId ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: fill ? "100%" : w, height: fill ? "100%" : h }}
          data-ad-client="ca-pub-5036627158328757"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        /* Dummy placeholder fallback when no slotId is provided or during development */
        <div className="flex flex-col items-center justify-center gap-1 text-center select-none pointer-events-none w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 border border-dashed border-zinc-300 rounded-xl px-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Ad</span>
          <span className="text-[8px] text-zinc-400 leading-tight">{label}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Responsive horizontal banner.
 * Shows 728×90 leaderboard on md+ screens and 320×100 mobile banner on phones.
 */
export function AdLeaderboard({ slotId, className = "" }: { slotId?: string; className?: string }) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      <AdUnit variant="leaderboard" slotId={slotId} className="hidden md:flex" />
      <AdUnit variant="mobile-banner" slotId={slotId} className="flex md:hidden" />
    </div>
  );
}
