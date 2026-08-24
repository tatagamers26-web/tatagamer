/**
 * AdUnit – placeholder ad slots matching Google AdSense standard sizes.
 *
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  HOW TO ACTIVATE REAL ADS                                        ║
 * ║  When you have AdSense approval:                                 ║
 * ║  1. Add the global AdSense <script> to app/layout.tsx once.     ║
 * ║  2. Inside each <AdUnit>, replace the inner <div> (marked below) ║
 * ║     with your <ins class="adsbygoogle"> tag + push script.       ║
 * ║  3. Keep the outer wrapper div — its width/height sizing tells   ║
 * ║     the browser how much space to reserve for the ad slot.       ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 *
 * Standard Google AdSense sizes used:
 *  • leaderboard    728 × 90   (desktop horizontal)
 *  • mobile-banner  320 × 100  (phone, replaces leaderboard)
 *  • medium-rect    300 × 250  (sidebar / in-content)
 *  • large-rect     336 × 280  (in-content wider)
 *  • skyscraper     160 × 600  (left rail, desktop only)
 *  • half-page      300 × 600  (right rail on large screens)
 */

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
  /** When true the placeholder fills its parent container (use for grid rail slots). */
  fill?: boolean;
  className?: string;
}

export function AdUnit({ variant, fill = false, className = "" }: AdUnitProps) {
  const { w, h, label } = SIZES[variant];

  return (
    /**
     * OUTER WRAPPER — keep this even when switching to real ads.
     * If fill=true the wrapper matches the parent container size.
     * Otherwise fixed pixel dimensions reserve the exact layout space Google expects.
     */
    <div
      aria-label="Advertisement"
      className={`ad-unit flex overflow-hidden rounded-xl ${fill ? "w-full h-full shrink-0" : "shrink-0"} ${className}`}
      style={fill ? {} : { width: w, height: h, maxWidth: "100%" }}
    >
      {/* ─────────────────────────────────────────────────────────────────────
          DUMMY PLACEHOLDER — replace everything inside this comment block
          with your real AdSense <ins> tag + push <script> when ready.

          Example replacement:
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: fill ? "100%" : w, height: fill ? "100%" : h }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
            />
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center gap-1 text-center select-none pointer-events-none w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 border border-dashed border-zinc-300 rounded-xl px-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Ad</span>
        <span className="text-[8px] text-zinc-400 leading-tight">{label}</span>
      </div>
      {/* ─────────────────────────────────────────────────────────────────── */}
    </div>
  );
}

/**
 * Responsive horizontal banner.
 * Shows 728×90 leaderboard on md+ screens and 320×100 mobile banner on phones.
 * Drop this wherever you want a horizontal ad row.
 */
export function AdLeaderboard({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      <AdUnit variant="leaderboard" className="hidden md:flex" />
      <AdUnit variant="mobile-banner" className="flex md:hidden" />
    </div>
  );
}
