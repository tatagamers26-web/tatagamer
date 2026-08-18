# Deploy to Hostinger (Node.js app)

Verified locally: production build clean, all routes 200, ~116MB RAM, 2.5s first request, 0.05s after.

## 1. Upload

Push to a git repo Hostinger can pull, or upload the project folder over SFTP.
Do **not** upload `node_modules/` or `.next/` — both are built on the server.

## 2. Create the Node app

hPanel → **Advanced** → **Node.js** → Create application:

| Field | Value |
|---|---|
| Node version | 20 or 22 (Next 16 needs 20+) |
| Application root | path where you uploaded the project |
| Application URL | your domain |
| Application startup file | `server.js` |

## 3. Install and build

From the app's **Run NPM install** button, then SSH or the **Run JS script** field:

```bash
npm install && npm run build
```

The build must finish before the app starts. `server.js` serves the `.next` folder
and will crash on boot if it is missing.

## 4. Start

Restart the application from hPanel. Hostinger sets `PORT` automatically and
`server.js` reads it.

## Redeploying after code changes

```bash
git pull && npm install && npm run build
```

Then restart the app in hPanel. A restart is required — Next serves the build
output, not the source.

## Notes

- **First request after any restart takes ~2.5s.** The server downloads the 4MB
  GameMonetize feed once, then caches it in memory for an hour. Every later
  request is ~50ms.
- **Memory:** ~116MB steady. Fine on any Hostinger plan with Node support.
- **Feed refresh:** hourly, automatic. New games appear without a redeploy.
- If the feed is ever unreachable, the last good copy keeps serving rather than
  showing an error.

## BEFORE going live — do not skip this

Revenue is attributed by **domain whitelist**, not by anything in the embed code.
The game URLs contain only a game hash, no publisher ID. Impressions from an
unregistered domain attribute to nobody, and there is no documented way to
backfill them later. **Every play you serve before onboarding earns zero,
permanently.**

So complete onboarding first, launch second.

### GameMonetize
1. Register at https://gamemonetize.com/publishers (free, no stated traffic minimum)
2. Dashboard → Publisher → Add Website → submit this domain
3. Add `ads.txt` to the **root domain** — subdomains are rejected outright
   (no `blogspot.com`, `wordpress.com`, etc.)
4. Wait for approval. It is reviewed, not automatic.
5. Share is 45% of *net*, Net 30, $30 minimum payout

### GameDistribution (only if adding it as a second source)
Their licence grants embedding rights **only to registered account holders**.
Embedding without an account is not permitted, and they enforce it: games return
a "blocked for this website" screen that sends your players to their own portal.
Onboarding is: ads.txt → submit domains → accept the Google Ad Manager invite →
add games → they whitelist you in GAM → Google approves the domain.
Share is 33% of net, EUR 100 minimum. Domains do get rejected for "low value content".

### AdSense
Apply for ads on the listing pages — no revenue split. Two hard rules:
- AdSense units go in the **parent page only**, never inside the game iframe.
  Ads in a frame violate policy.
- A site that is mostly embedded third-party iframes falls under Google's
  replicated-content policy, which names framing explicitly. Original written
  content and real curation are required, not optional.
