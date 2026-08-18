// Run: node scripts/check.mjs  (Node 24 strips TS types natively)
import assert from "node:assert";
import { normalize } from "../lib/games.ts";

const ok = {
  id: 1,
  title: " X ",
  url: "https://g.example/x/",
  thumb: "https://img.example/x.jpg",
};

// coerces, trims, defaults
const [g] = normalize([ok]);
assert.equal(g.id, "1");
assert.equal(g.title, "X");
assert.equal(g.category, "Other");

// drops junk entries, keeps good ones
assert.equal(
  normalize([ok, { id: 2 }, { ...ok, id: 3, url: "javascript:alert(1)" }, null]).length,
  1
);

// non-array and all-junk feeds throw
assert.throws(() => normalize({ error: "rate limited" }));
assert.throws(() => normalize([{ id: "x" }]));

console.log("normalize: all checks pass");
