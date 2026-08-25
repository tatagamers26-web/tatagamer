import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { getCategories, getGame, getGameBySlug, getGames } from "@/lib/games";
import { Icon } from "../../ui-icon";
import { CAT_ICON, SITE_NAME, siteUrl } from "../../seo";
import { Player } from "./player";
import { PokiFooter } from "../../footer";
import { SearchDialog } from "../../search-dialog";
import { AdUnit, AdLeaderboard } from "../../ad-unit";

const SIDEBAR = 17;
const MORE = 24;

async function resolve(slug: string) {
  const bySlug = await getGameBySlug(slug);
  if (bySlug) return { game: bySlug, redirectTo: null as string | null };
  if (/^\d+$/.test(slug)) {
    const byId = await getGame(slug);
    if (byId) return { game: byId, redirectTo: `/game/${byId.slug}` };
  }
  return { game: undefined, redirectTo: null };
}

export async function generateMetadata({
  params,
}: PageProps<"/game/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { game } = await resolve(slug);
  if (!game) return { title: "Game not found" };

  const description =
    game.description.trim().slice(0, 155) ||
    `Play ${game.title} free in your browser on ${SITE_NAME}. No download, no install.`;
  const url = `/game/${game.slug}`;

  return {
    title: `${game.title} | Play Free Online`,
    description,
    keywords: [game.title, game.category, ...game.tags.split(",").map((t) => t.trim())]
      .filter(Boolean)
      .slice(0, 12),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${game.title} | Play Free Online | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: [{ url: game.thumb, width: 512, height: 384, alt: game.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} | Play Free Online`,
      description,
      images: [game.thumb],
    },
  };
}

export default async function GamePage({ params }: PageProps<"/game/[slug]">) {
  const { slug } = await params;
  const { game, redirectTo } = await resolve(slug);
  if (redirectTo) permanentRedirect(redirectTo);
  if (!game) notFound();

  const [games, categories] = await Promise.all([getGames(), getCategories()]);
  const sameCategory = games.filter((g) => g.category === game.category && g.id !== game.id);
  const sidebar = sameCategory.slice(0, SIDEBAR);
  const more = sameCategory.slice(SIDEBAR, SIDEBAR + MORE);

  const searchPopular = games
    .slice(0, 12)
    .map((g) => ({ id: g.id, slug: g.slug, title: g.title, thumb: g.thumb }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description || `Play ${game.title} free online.`,
    url: `${siteUrl()}/game/${game.slug}`,
    image: game.thumb,
    genre: game.category,
    keywords: game.tags,
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: game.category,
        item: `${siteUrl()}/?cat=${encodeURIComponent(game.category)}`,
      },
      { "@type": "ListItem", position: 3, name: game.title },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-[1854px] px-2.5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }}
      />

      {/* Main poki-grid */}
      <main className="poki-grid">

        {/* ── Brand card ─────────────────────────────────────────────────── */}
        <div className="flex h-[var(--cell)] w-[var(--cell)] flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white shadow-[0_6px_10px_rgba(6,55,59,0.18)]">
          <Link
            href="/"
            className="group flex flex-col items-center justify-center"
            aria-label={SITE_NAME}
          >
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              width={52}
              height={52}
              className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>
          <div className="flex gap-1.5">
            <Link href="/" aria-label="Home" className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-100 text-teal-700 transition hover:bg-teal-100">
              <Icon name="home" className="h-4 w-4" />
            </Link>
            <SearchDialog popular={searchPopular} />
          </div>
        </div>

        {/* ── Game player + right-side ad (flex row) ────────────────────────── */}
        <div className="game-player flex items-start gap-[var(--grid-gap)]">
          {/* Player fills all remaining width */}
          <div className="flex-1 min-w-0 self-stretch">
            <Player url={game.url} title={game.title} thumb={game.thumb} category={game.category} />
          </div>

          {/* AD SLOT 4: Right of game box — 160×600 Wide Skyscraper
              Shown on xl+ (≥1280px) matching the left skyscraper size.
              Google AdSense spec: 160×600 Wide Skyscraper ────────── */}
          <div className="hidden xl:flex shrink-0 flex-col items-center justify-center h-full">
            <AdUnit variant="skyscraper" />
          </div>
        </div>

        {/* ── AD SLOT 2: Leaderboard directly BELOW the game player
            Desktop: grid-column 4–end (same span as .game-player)
            Mobile: full width
            Google AdSense spec: 728×90 / 320×100 ─────────────────────── */}
        <div className="ad-below-player">
          <AdLeaderboard />
        </div>

        {/* ── AD SLOT 1: Left skyscraper — cols 1–2 beside the game player
            Grid-row 2–8 = same height band as the player (6 rows × 100px)
            Desktop only; hidden on mobile.
            Google AdSense spec: 160×600 Wide Skyscraper ───────────────── */}
        <div className="ad-skyscraper">
          <AdUnit variant="skyscraper" />
        </div>

        {/* ── Sidebar thumbnails (same-category) ────────────────────────── */}
        {sidebar.map((g) => (
          <Link
            key={g.id}
            href={`/game/${g.slug}`}
            title={g.title}
            className="group relative overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <Image src={g.thumb} alt={g.title} fill sizes="120px" className="object-cover transition duration-300 group-hover:scale-110" />
          </Link>
        ))}

        {/* ── More same-category games ───────────────────────────────────── */}
        {more.map((g) => (
          <Link
            key={g.id}
            href={`/game/${g.slug}`}
            title={g.title}
            className="group relative overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <Image src={g.thumb} alt={g.title} fill sizes="120px" className="object-cover transition duration-300 group-hover:scale-110" />
          </Link>
        ))}

        {/* ── Category pills ─────────────────────────────────────────────── */}
        {categories.map((c) => (
          <Link key={c} href={`/?cat=${encodeURIComponent(c)}`} className="group">
            <span
              className={`flex h-[var(--cell)] flex-col items-center justify-center gap-1.5 rounded-[20px] px-1 text-center shadow-[0_6px_10px_rgba(6,55,59,0.18)] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_10px_16px_rgba(6,55,59,0.24)] ${
                c === game.category ? "bg-teal-500" : "bg-white"
              }`}
            >
              <Icon name={CAT_ICON[c] ?? "joystick"} className={`h-8 w-8 ${c === game.category ? "text-white" : "text-teal-950"}`} />
              <span className={`text-[11px] font-bold uppercase leading-tight ${c === game.category ? "text-white" : "text-teal-600"}`}>
                {c}
              </span>
            </span>
          </Link>
        ))}

        {/* ── Full-width article + footer (spans all grid columns) ──────── */}
        <div style={{ gridColumn: "1 / -1" }} className="flex flex-col gap-[var(--grid-gap)] w-full my-[var(--grid-gap)] pb-8">
          <article className="w-full rounded-[24px] bg-white p-5 sm:p-8 shadow-sm">
            <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-teal-600">
              <Link href="/" className="hover:underline">{SITE_NAME}</Link>
              <span aria-hidden="true">›</span>
              <Link href={`/?cat=${encodeURIComponent(game.category)}`} className="hover:underline">{game.category}</Link>
            </nav>

            <h1 className="text-2xl font-bold text-teal-950">
              {game.title}{" "}
              <Link href="/" className="text-lg font-semibold text-teal-500 transition hover:text-teal-700 hover:underline">
                on {SITE_NAME}
              </Link>
            </h1>

            <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-600">
              {game.description && <p>{game.description}</p>}

              <figure className="flex justify-center py-3">
                <Image src={game.thumb} alt={`${game.title} gameplay`} width={260} height={195} className="rounded-2xl shadow-[0_6px_10px_rgba(6,55,59,0.18)]" />
              </figure>

              {/* ── AD SLOT 3: Medium Rectangle inside article
                  Google AdSense spec: 300×250 Medium Rectangle ────────── */}
              <div className="flex justify-center py-2">
                <AdUnit variant="medium-rect" />
              </div>

              {game.instructions && (
                <>
                  <h2 className="pt-2 text-lg font-bold text-teal-950">How to play {game.title}</h2>
                  <p>{game.instructions}</p>
                </>
              )}

              <h2 className="pt-2 text-lg font-bold text-teal-950">Features of {game.title}</h2>
              <ul className="space-y-2 pl-5">
                <li className="list-disc">Plays instantly in the browser. No download, no install, no account needed.</li>
                <li className="list-disc">Free to play, with no time limit and no locked levels.</li>
                <li className="list-disc">
                  A {game.category.toLowerCase()} game, so it sits alongside{" "}
                  <Link href={`/?cat=${encodeURIComponent(game.category)}`} className="font-semibold text-teal-700 hover:underline">
                    every other {game.category} title
                  </Link>{" "}
                  on {SITE_NAME}.
                </li>
                {game.instructions && <li className="list-disc">Controls: {game.instructions.toLowerCase()}</li>}
                <li className="list-disc">Runs on desktop, tablet and phone, and expands to full screen from the button under the player.</li>
              </ul>

              <h2 className="pt-2 text-lg font-bold text-teal-950">Playing {game.title} on {SITE_NAME}</h2>
              <p>
                {game.title} runs directly in your browser. There is nothing to download and no account to create. Press play above and the game loads in place. Prefer something similar? Every game in the{" "}
                <Link href={`/?cat=${encodeURIComponent(game.category)}`} className="font-semibold text-teal-700 hover:underline">
                  {game.category} category
                </Link>{" "}
                is one click away, and the thumbnails around the player are all from that same category.
              </p>

              {game.tags && (
                <p className="pt-2 text-sm text-zinc-500">
                  <span className="font-semibold text-teal-950">Tags: </span>{game.tags}
                </p>
              )}
            </div>
          </article>

          <nav className="w-full rounded-[24px] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link href="/" className="font-semibold text-teal-700 hover:underline">All Games</Link>
              {categories.map((c) => (
                <Link key={c} href={`/?cat=${encodeURIComponent(c)}`} className="text-teal-700 hover:underline">
                  {c} Games
                </Link>
              ))}
            </div>
          </nav>

          {/* ── AD SLOT 5: Leaderboard above footer
              Google AdSense spec: 728×90 / 320×100 ────────────────────── */}
          <AdLeaderboard />

          <PokiFooter totalGames={games.length} />
        </div>
      </main>
    </div>
  );
}
