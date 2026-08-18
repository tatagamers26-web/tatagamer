// Scans the whole GameMonetize catalog for dead games and broken thumbnails.
// Run: node scripts/check-dead.mjs [concurrency]
//
// Detection rules (verified against the live CDN):
//   game url  -> dead when HTTP 404
//   thumb url -> dead when HTTP 200 but content-type is text/html (soft 404)
import { writeFileSync } from "node:fs";

const FEED =
  "https://rss.gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=mostplayed&company=All&amount=All";
const CONCURRENCY = Number(process.argv[2]) || 24;
const TIMEOUT = 20000;
const OUT = "scripts/dead-games.json";

async function probe(url, method = "HEAD") {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { method, redirect: "follow", signal: ctl.signal });
    return { status: res.status, type: res.headers.get("content-type") || "" };
  } finally {
    clearTimeout(t);
  }
}

// One retry, then fall back to GET in case HEAD is unsupported for that path.
async function probeSafe(url) {
  for (const method of ["HEAD", "GET"]) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await probe(url, method);
      } catch {
        /* try again / fall through to GET */
      }
    }
  }
  return { status: 0, type: "", unreachable: true };
}

async function pool(items, size, worker) {
  const results = [];
  let cursor = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (cursor < items.length) {
        const i = cursor++;
        results[i] = await worker(items[i]);
        if (++done % 250 === 0) {
          process.stdout.write(`  checked ${done}/${items.length}\n`);
        }
      }
    })
  );
  return results;
}

const feed = await (await fetch(FEED)).json();
const games = feed.filter((g) => g && g.id && g.url && g.thumb);
console.log(`feed: ${feed.length} entries, ${games.length} usable`);
console.log(`checking ${games.length * 2} urls at concurrency ${CONCURRENCY}…`);

const rows = await pool(games, CONCURRENCY, async (g) => {
  const [game, thumb] = await Promise.all([probeSafe(g.url), probeSafe(g.thumb)]);
  const gameDead = game.status === 404;
  const thumbDead = thumb.status === 404 || /text\/html/i.test(thumb.type);
  return {
    id: g.id,
    title: g.title,
    url: g.url,
    gameDead,
    thumbDead,
    gameStatus: game.status,
    thumbType: thumb.type.split(";")[0],
    unreachable: game.unreachable || thumb.unreachable,
  };
});

const deadGames = rows.filter((r) => r.gameDead);
const deadThumbs = rows.filter((r) => !r.gameDead && r.thumbDead);
const unreachable = rows.filter((r) => r.unreachable && !r.gameDead && !r.thumbDead);

console.log("\n================ RESULT ================");
console.log(`total games      : ${rows.length}`);
console.log(`dead games (404) : ${deadGames.length}`);
console.log(`broken thumbnails: ${deadThumbs.length}`);
console.log(`unreachable      : ${unreachable.length}  (network, not necessarily dead)`);

for (const r of deadGames.slice(0, 20)) console.log(`  DEAD GAME  ${r.id}  ${r.title}`);
for (const r of deadThumbs.slice(0, 20)) console.log(`  DEAD THUMB ${r.id}  ${r.title}`);

writeFileSync(
  OUT,
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      total: rows.length,
      deadGameIds: deadGames.map((r) => r.id),
      deadThumbIds: deadThumbs.map((r) => r.id),
      unreachableIds: unreachable.map((r) => r.id),
      detail: [...deadGames, ...deadThumbs, ...unreachable],
    },
    null,
    2
  )
);
console.log(`\nwrote ${OUT}`);
