// Self-check for searchGames + entity decoding. Run: node scripts/check-search.mjs
import assert from "node:assert";
import { normalize, searchGames } from "../lib/games.ts";

const g = (id, title, tags) => ({
  id, title, tags, url: "https://x/", thumb: "https://t/x.jpg",
  description: "", instructions: "", category: "Action", width: "8", height: "6",
});

const catalog = [
  g("1", "Bike Race Rush", "running,subway"),
  g("2", "Subway Surfers In Berlin", "runner"),
  g("3", "Subway", "exact"),
  g("4", "Subway Clash 3D", "shooter"),
  g("5", "Temple Run 2", "subway,endless"),
];

const hits = searchGames(catalog, "subway").map((x) => x.id);
// exact title, then prefix, then substring, then tag-only
assert.deepEqual(hits, ["3", "2", "4", "1", "5"], `got ${hits}`);

// empty query returns nothing
assert.deepEqual(searchGames(catalog, "   "), []);
// case-insensitive
assert.equal(searchGames(catalog, "SUBWAY").length, 5);
// no match
assert.deepEqual(searchGames(catalog, "zzzz"), []);

// entity decoding at the trust boundary
const [decoded] = normalize([
  { id: "9", title: "Tom &amp; Jerry &quot;Run&quot;", description: "a &lt;b&gt; c",
    instructions: "&#39;go&#39;", url: "https://x/", thumb: "https://t/x.jpg" },
]);
assert.equal(decoded.title, 'Tom & Jerry "Run"', decoded.title);
assert.equal(decoded.description, "a <b> c");
assert.equal(decoded.instructions, "'go'");

console.log("search + decode: all checks pass");

// --- slug checks ---
import { slugify } from "../lib/games.ts";
assert.equal(slugify("Subway Surfers In Berlin", "1"), "subway-surfers-in-berlin");
assert.equal(slugify("Tom & Jerry Run", "2"), "tom-and-jerry-run");
assert.equal(slugify("  Minecraft - SkyBlock!  ", "3"), "minecraft-skyblock");
assert.equal(slugify("2048", "4"), "2048");
assert.equal(slugify("???", "9"), "game-9");
assert.equal(slugify("", "7"), "game-7");

// duplicate titles must produce distinct slugs
const dup = normalize([
  { id: "1", title: "Car Rush", url: "https://x/", thumb: "https://t/a.jpg" },
  { id: "2", title: "Car Rush", url: "https://x/", thumb: "https://t/b.jpg" },
]);
assert.equal(dup[0].slug, "car-rush");
assert.equal(dup[1].slug, "car-rush-2");
assert.notEqual(dup[0].slug, dup[1].slug);

console.log("slugs: all checks pass");
