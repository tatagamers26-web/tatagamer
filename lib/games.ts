export type Game = {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
};

// Most-played catalog (~5000 games). Payload ~4MB exceeds Next's 2MB
// fetch-cache limit, so cache in module memory instead.
// ponytail: per-instance cache; move to KV/edge cache if serverless cold fetches hurt.
const FEED =
  "https://rss.gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=mostplayed&company=All&amount=All";
const TTL = 60 * 60 * 1000;

/** URL-safe slug from a game title. Falls back to the id when a title has no
 *  usable characters (a few feed titles are pure punctuation or CJK). */
export function slugify(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
  return base || `game-${id}`;
}

// Feed titles arrive HTML-escaped ("Tom &amp; Jerry Run"). JSX renders text
// literally, so decode once here rather than at every render site.
const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'", "#34": '"',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code: string) => {
    const named = ENTITIES[code.toLowerCase()];
    if (named) return named;
    if (code[0] === "#") {
      const n = code[1]?.toLowerCase() === "x"
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return match;
  });
}

/**
 * Orders matches so obvious title hits beat tag-only hits. Without this,
 * searching "subway" surfaced "Bike Race Rush" above "Subway Surfers" because
 * both match on tags. Array#sort is stable, so the feed's most-played order is
 * preserved inside each band.
 */
export function searchGames(games: Game[], query: string): Game[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const band = (g: Game) => {
    const title = g.title.toLowerCase();
    if (title === q) return 0;
    if (title.startsWith(q)) return 1;
    if (title.includes(q)) return 2;
    return 3;
  };
  return games
    .filter((g) => `${g.title} ${g.tags}`.toLowerCase().includes(q))
    .map((g) => ({ g, b: band(g) }))
    .sort((a, b) => a.b - b.b)
    .map(({ g }) => g);
}

// Feed is an external trust boundary: validate shape, drop entries without a
// usable id/https url/https thumb, coerce the rest to strings.
export function normalize(raw: unknown): Game[] {
  if (!Array.isArray(raw)) throw new Error("Feed returned non-array");
  const games: Game[] = [];
  const taken = new Set<string>();
  for (const r of raw as Record<string, unknown>[]) {
    const id = String(r?.id ?? "").trim();
    const url = String(r?.url ?? "");
    const thumb = String(r?.thumb ?? "");
    if (!id || !url.startsWith("https://") || !thumb.startsWith("https://")) continue;
    const title = decodeEntities(String(r.title ?? "").trim()) || "Untitled";
    // Titles repeat across the catalogue, so disambiguate with the id.
    let slug = slugify(title, id);
    if (taken.has(slug)) slug = `${slug}-${id}`;
    taken.add(slug);
    games.push({
      id,
      slug,
      title,
      description: decodeEntities(String(r.description ?? "")),
      instructions: decodeEntities(String(r.instructions ?? "")),
      url,
      category: String(r.category ?? "").trim() || "Other",
      tags: String(r.tags ?? ""),
      thumb,
      width: String(r.width ?? "800"),
      height: String(r.height ?? "600"),
    });
  }
  if (games.length === 0) throw new Error("Feed empty after validation");
  return games;
}

let cache: { games: Game[]; at: number } | null = null;
let inflight: Promise<Game[]> | null = null;

async function fetchGames(): Promise<Game[]> {
  const res = await fetch(FEED, { cache: "no-store" });
  if (!res.ok) throw new Error(`Feed failed: ${res.status}`);
  const games = normalize(await res.json());
  cache = { games, at: Date.now() };
  return games;
}

export function getGames(): Promise<Game[]> {
  if (cache && Date.now() - cache.at < TTL) return Promise.resolve(cache.games);
  if (!inflight) {
    inflight = fetchGames()
      .catch((err) => {
        if (cache) return cache.games; // stale beats broken
        throw err;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function getGame(id: string): Promise<Game | undefined> {
  return (await getGames()).find((g) => g.id === id);
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  return (await getGames()).find((g) => g.slug === slug);
}

export async function getCategories(): Promise<string[]> {
  return [...new Set((await getGames()).map((g) => g.category))].sort();
}
