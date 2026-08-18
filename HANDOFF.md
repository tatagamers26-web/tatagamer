# GameBox — Session Handoff

Everything an AI assistant needs to continue this project cold. Read this first.

---

## 1. What this is

A Poki.com-style browser games portal. Grid of game thumbnails, click one, it plays
in an iframe. Games come from a third-party feed — we host no game files.

**Location:** `D:\Product\game`
**Owner:** solo developer, India. Domain purchased (name not yet given to the assistant).
**Status:** feature-complete MVP, verified working locally, NOT yet deployed, NOT yet
committed to git.

---

## 2. Stack

| Thing | Version / choice |
|---|---|
| Next.js | 16.3.0, App Router, Turbopack |
| React | 19.2.8 |
| Tailwind | v4 (`@tailwindcss/postcss`) |
| TypeScript | v5 |
| Node (local) | v22.22.2 |
| Database | none — the feed is the database |

**Read `AGENTS.md` before writing Next.js code.** This Next version has breaking changes
versus most training data. Docs are in `node_modules/next/dist/docs/`.

---

## 3. File map

| File | Purpose |
|---|---|
| `lib/games.ts` | Feed fetch, validation, 1-hour in-memory cache, `getGames` / `getGame` / `getCategories` |
| `app/page.tsx` | Home — bento grid, search, category filter, pagination, category cards, footer |
| `app/game/[id]/page.tsx` | Play page — iframe, instructions, description, related games |
| `app/error.tsx` | Error boundary with retry |
| `app/globals.css` | Teal gradient background (Tailwind rejected the arbitrary multi-gradient class, so it lives here) |
| `app/layout.tsx` | Metadata, fonts |
| `next.config.ts` | Allows remote images from `img.gamemonetize.com` |
| `server.js` | Startup file for Hostinger — `next start` will not work there |
| `scripts/check.mjs` | Assert-based self-check for `normalize()`. Run: `node scripts/check.mjs` |
| `DEPLOY.md` | Hostinger deploy steps + pre-launch monetization checklist |

---

## 4. The game feed — hard-won details

**Feed URL (in `lib/games.ts`):**
```
https://rss.gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=mostplayed&company=All&amount=All
```

Facts discovered by probing live, not from docs:

- **`popularity=mostplayed`, NOT `mostpopular`.** GameMonetize's own RSS-builder page
  documents `mostpopular`, which returns an empty array `[]`. The real values were read
  out of the builder's `<select>` options: `newest`, `mostplayed`, `hotgames`,
  `bestgames`, `exclusivegames`, `editorpicks`, `branding`.
- `gamemonetize.com/rssfeed.php` 302-redirects to `rss.gamemonetize.com`. Use the latter.
- Returns **5,001 games**, **~3.8MB**. This exceeds Next's 2MB fetch-cache limit, which is
  why the cache is a module-level variable rather than `next: { revalidate }`.
- Per-game fields: `id`, `title`, `description`, `instructions`, `url`, `category`,
  `tags`, `thumb`, `width`, `height`.
- **No video field.** `img.gamemonetize.com/{hash}/video.mp4` returns HTML (soft 404).
  Game pages have no `<video>`. Hover-video previews are impossible from this source.
- Thumb variants that exist: `512x384` (the one in the feed), `512x512`, `512x340`.
  `1280x720` and `220x124` return soft 404s.
- 20 categories: .IO, 2 Player, 3D, Action, Adventure, Arcade, Bejeweled, Boys, Clicker,
  Cooking, Fighting, Girls, Hypercasual, Multiplayer, Puzzles, Racing, Shooting, Soccer,
  Sports, Stickman.
- A `name=` / `links=` param does nothing — game URLs come back byte-identical. There is
  **no publisher ID in the embed URL.** This matters enormously; see section 7.

### GameDistribution (evaluated, NOT integrated — deliberately)
Public catalog API, no key: `https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?format=json&amount=2`
~21K games, sharper `1280x720` thumbs, finer categories. Also no video field.
**Do not integrate without reading section 7 first** — embedding it without an account is
not permitted and is actively blocked.

---

## 5. Design decisions

Replicating Poki's look, verified against screenshots the user supplied.

- **Bento grid:** `grid-template-columns: repeat(auto-fill, 94px)`, `grid-auto-rows: 94px`,
  `grid-auto-flow: row dense`, 10px gap. Tiles span 1, 2, or 3 cells via a repeating
  `SPANS` pattern. Spans are set with **inline styles, not Tailwind classes** — Tailwind's
  JIT scanner cannot see dynamically built class names.
- Logo card and search card are grid items inside the bento (2x2 and 3x2), same as Poki.
- **Featured games reshuffle on every page load** — random draw from the 60 most-played,
  filling the big tiles. Verified: three fetches return three different orders. Small tiles
  stay in stable feed order so pagination stays coherent. No duplicates between the two sets.
- 60 games/page, ~84 pages.
- Category cards section below the grid, emoji icons per category.
- Hover: scale + title reveal + play badge. **Not video** — no source exists.

---

## 6. Bugs already found and fixed — do not reintroduce

A 16-agent adversarial review ran over this code. Five confirmed bugs, all fixed:

1. **Fractional page params.** `?page=2.5` produced misaligned slice offsets and links to
   `?page=1.5`. Fixed with `Math.floor`.
2. **Unvalidated feed.** A 200 response with a non-array body got cached for the full hour,
   500ing the whole site. Fixed: `normalize()` validates shape, coerces types, drops entries
   lacking id / https url / https thumb, throws on non-array or all-junk.
3. **`category.trim()` on missing field** crashed every render. Fixed by normalizing at the
   trust boundary instead of at each call site.
4. **No iframe sandbox.** Added the same sandbox flag set Poki uses.
5. **Thundering herd.** Concurrent cold requests each downloaded the 3.8MB feed. Fixed by
   caching the in-flight promise, not just the resolved value.

Also: stale cache is served if a refetch fails, rather than erroring.

---

## 7. Monetization reality — verified against actual contracts

This was researched from the real Terms of Service documents, not marketing pages. It
changes what you should build.

**Revenue is attributed by DOMAIN WHITELIST.** The embed URL is
`https://html5.gamemonetize.co/{hash}/` — game hash only, no publisher ID, no tracking
param. Impressions from an unregistered domain attribute to nobody, and **no backfill path
is documented.** Traffic served before onboarding earns zero, permanently.

→ **Onboard before launch, not after.**

| | GameMonetize | GameDistribution |
|---|---|---|
| Account cost | Free | Free |
| Publisher share | 45% of net | 33% of net |
| Minimum payout | $30 | EUR 100 |
| Payout terms | Net 30 | up to 60 days |
| Embedding without account | **Terms are silent** — not permitted, just not prohibited in writing | **Not permitted.** Licence covers registered account holders only |
| Traffic minimum | Undocumented | None stated |

**GameDistribution enforces this technically.** Unregistered domains get a block screen
inside the game frame directing players to agame.com — a portal owned by their own parent
company (Azerion). Every game breaks at once. They publish a support article about it.

**Both platforms** can change terms unilaterally, terminate without notice, and remove games
(which you're then obliged to pull). GameDistribution can additionally withhold payment and
claw back money already paid over "invalid traffic," judged solely by them.

**AdSense constraints — this shapes the roadmap:**
- Their in-frame ads coexisting with your AdSense is explicitly allowed.
- Your own AdSense units must be in the **parent page only**. Ads inside an iframe violate policy.
- A site that is mostly embedded third-party iframes falls under Google's replicated-content
  policy, which names "framing" outright, plus the rule against auto-generated content
  without curation. **Original written content and real curation are required for approval,
  not optional polish.**

**Genuinely unknown — do not invent numbers:**
- Realistic eCPM for India-weighted traffic. The widely-quoted "$1–3 tier-3" figure traces
  to vendor content marketing with no methodology. No credible measured figure exists.
- Feed churn rate. No published data. Build dead-embed detection rather than trusting the feed.

---

## 8. Deploy target: Hostinger Node.js app

Plan supports 5 Node apps. Long-running process, so the in-memory cache is already optimal —
no serverless changes needed.

Verified on a real production build: build clean, all routes HTTP 200, **~116MB RAM**,
**2.5s first request** (downloads the feed once), **~50ms** thereafter.

Critical: Hostinger's panel wants a **startup file**, not an npm script — hence `server.js`.
`npm run build` must complete before the app starts, or `server.js` crashes on boot.
Full steps in `DEPLOY.md`.

---

## 9. State of the repo

```
Branch: master   Remote: NONE   Commits: 1 (create-next-app scaffold)
```

**All work is uncommitted.** Modified: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`,
`next.config.ts`. Untracked: `app/error.tsx`, `app/game/`, `lib/`, `scripts/`, `server.js`,
`DEPLOY.md`, this file.

Also present and should probably be gitignored: `ruvector.db`, `game-updated.zip`, `.claude/`.

**First action on the new machine: commit this work and add a git remote.**

---

## 10. Decisions already made — don't relitigate

- GameMonetize only for launch. GameDistribution deferred (33% vs 45%, harsher onboarding,
  nastier failure mode).
- No database. The feed is the source of truth.
- No hover video. No source provides it; Poki records their clips in-house.
- Hostinger Node hosting, not Vercel.

## 11. Open items

1. **Onboard with GameMonetize before launch** — register domain, `ads.txt` on the **root**
   domain (subdomains are rejected outright).
2. **Original content layer** — own-words game descriptions, editorial category pages. This
   gates AdSense approval and SEO, and it's the single highest-value remaining work.
3. **Dead-embed detection** — games get pulled from the feed with no notice or tombstone flag.
4. **SEO** — metadata, canonical URLs, sitemap for game pages. Blocked on knowing the domain.
5. Deploy.

---

## 12. Corrections made during this session

Recorded so they aren't repeated:

- The assistant initially said GameDistribution needed "no account to list games" because its
  API is open. **Wrong** — an open endpoint is not a licence grant. Their agreement covers
  registered holders only.
- The assistant initially advised signing up for revenue share *after* going live. **Wrong** —
  there is no retroactive attribution, so pre-launch traffic earns nothing forever.
- CrazyGames was suggested as a game source. **Wrong** — they have no publisher/embed program
  for site owners at all. Their developer portal is for publishing games *onto* CrazyGames.

## 13. Working style the user prefers

Terse output, no filler. Minimal solutions over elaborate ones — smallest change that works,
no speculative abstractions. Verify claims against live sources rather than asserting from
memory; the user's decisions here involve real money.
