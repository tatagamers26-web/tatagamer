export const SITE_NAME = "GameBox";
export const SITE_TAGLINE = "Play free games in your browser";

/**
 * Absolute site origin, used for canonical URLs, sitemap and structured data.
 * Set NEXT_PUBLIC_SITE_URL to the live domain before deploying — the fallback is
 * only correct in local development.
 */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function isAllowCrawl(): boolean {
  const raw = (process.env.NEXT_PUBLIC_ALLOW_CRAWL ?? "true").toString().trim().toLowerCase();
  if (["false", "0", "no", "off"].includes(raw)) {
    return false;
  }
  return true;
}

export const CAT_ICON: Record<string, string> = {
  ".IO": "globe",
  "2 Player": "users3",
  "3D": "cube",
  Action: "bolt",
  Adventure: "compass",
  Arcade: "joystick",
  Bejeweled: "diamond",
  Boys: "person",
  Clicker: "pointer",
  Cooking: "pot",
  Fighting: "fist",
  Girls: "dress",
  Hypercasual: "sparkle",
  Multiplayer: "users4",
  Puzzles: "puzzle",
  Racing: "car",
  Shooting: "target",
  Soccer: "ball",
  Sports: "trophy",
  Stickman: "run",
  Other: "dice",
};
