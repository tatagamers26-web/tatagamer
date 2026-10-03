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
import { categorySlug } from "../../category/[slug]/page";

const SIDEBAR = 17;
const MORE = 24;

function getCategoryName(category: string): string {
  const cat = category.trim().toLowerCase();
  if (cat === "puzzles") return "puzzle";
  return cat;
}

function getCategoryFeature(category: string): string {
  const cat = category.trim();
  if (cat.toLowerCase() === "puzzles") return "Puzzle";
  return cat;
}

function getGameObjective(category: string): { main: string; brief: string } {
  const cat = category.trim().toLowerCase();
  switch (cat) {
    case "action":
      return {
        main: "dive into fast-paced challenges, overcome dangerous hurdles, and defeat opponents",
        brief: "experience fast-paced action, defeat opponents, and complete thrilling missions",
      };
    case "racing":
      return {
        main: "take the wheel, navigate challenging tracks, and race to beat the clock",
        brief: "speed through challenging tracks, dodge obstacles, and compete for first place",
      };
    case "puzzles":
    case "puzzle":
      return {
        main: "solve clever puzzles, exercise their logic, and unlock increasingly challenging levels",
        brief: "solve engaging puzzles, test their problem-solving skills, and complete each level",
      };
    case "adventure":
      return {
        main: "explore exciting worlds, overcome unexpected obstacles, and complete rewarding quests",
        brief: "embark on exciting quests, navigate dangerous obstacles, and reach new areas",
      };
    case "arcade":
      return {
        main: "enjoy classic fast-paced action, test their quick reflexes, and set new high scores",
        brief: "test their quick reflexes, avoid hazards, and achieve the highest score possible",
      };
    case "shooting":
      return {
        main: "test their aim, defeat incoming targets, and survive action-packed combat encounters",
        brief: "aim with precision, eliminate hostile targets, and survive intense combat encounters",
      };
    case "hypercasual":
      return {
        main: "jump straight into quick, addictive gameplay, test their reflexes, and beat their high score",
        brief: "enjoy instant, addictive gameplay and test their timing to beat high scores",
      };
    case "sports":
    case "soccer":
      return {
        main: "showcase their athletic skills, outsmart rivals, and score game-winning points",
        brief: "compete in athletic matchups, make decisive plays, and lead their team to victory",
      };
    case "fighting":
      return {
        main: "master powerful combat moves, counter enemy attacks, and emerge victorious in battle",
        brief: "battle tough opponents, unleash powerful combinations, and win the match",
      };
    case "cooking":
      return {
        main: "prepare delicious recipes, manage their kitchen efficiently, and delight hungry customers",
        brief: "cook tasty dishes, follow recipe steps, and manage time to serve customers",
      };
    case "clicker":
      return {
        main: "tap their way to success, unlock exciting upgrades, and maximize their progression",
        brief: "tap to collect resources, unlock powerful upgrades, and maximize their progress",
      };
    case "multiplayer":
    case "2 player":
    case ".io":
      return {
        main: "compete against other players, climb the leaderboards, and dominate the game arena",
        brief: "challenge other players, test their competitive skills, and climb the leaderboard",
      };
    case "3d":
      return {
        main: "navigate immersive 3D environments, conquer tricky obstacles, and complete exciting missions",
        brief: "explore dynamic 3D environments, overcome obstacles, and achieve top results",
      };
    default:
      return {
        main: "test their skills, overcome tricky obstacles, and complete exciting challenges",
        brief: "test their skills, complete engaging objectives, and aim for the top score",
      };
  }
}

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

  const categoryName = getCategoryName(game.category);
  const categoryFeature = getCategoryFeature(game.category);
  const objective = getGameObjective(game.category);

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
        name: `${game.category} Games`,
        item: `${siteUrl()}/category/${categorySlug(game.category)}`,
      },
      { "@type": "ListItem", position: 3, name: game.title },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${game.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${game.title} is an online ${categoryName} game where players can ${objective.brief}.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I play ${game.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Open the game on TataGamer, start the game, and use the available keyboard, mouse, or touch controls to play. Follow the objectives shown in the game to progress.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${game.title} free to play?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${game.title} is available to play online on TataGamer without requiring a separate game installation.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I play ${game.title} on mobile?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Mobile compatibility depends on the game. If the game supports touch controls and mobile browsers, you can play it on a compatible smartphone or tablet.`,
        },
      },
      {
        "@type": "Question",
        name: `Do I need to download ${game.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `No additional download is required when the game is available to play directly through your browser on TataGamer.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-[1854px] px-2.5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd, faqLd]) }}
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
          <Link key={c} href={`/category/${categorySlug(c)}`} className="group">
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
              <Link href={`/category/${categorySlug(game.category)}`} className="hover:underline">{game.category}</Link>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-bold text-teal-950">
              About {game.title}
            </h1>

            <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-600">
              <p>
                {game.title} is an exciting online {categoryName} game where players can {objective.main}. The game combines simple controls with engaging gameplay, making it easy to get started while still providing challenges as you progress. Players need to use their skills, timing, and strategy to complete objectives and achieve better results.
              </p>

              <p>
                During the game, you may need to overcome obstacles, collect items, complete missions, defeat opponents, or reach specific goals depending on the gameplay. Paying attention to your surroundings and learning how the game mechanics work can help you improve your performance.
              </p>

              <figure className="flex justify-center py-3">
                <Image src={game.thumb} alt={`${game.title} gameplay`} width={260} height={195} className="rounded-2xl shadow-[0_6px_10px_rgba(6,55,59,0.18)]" />
              </figure>

              {/* ── AD SLOT 3: Medium Rectangle inside article
                  Google AdSense spec: 300×250 Medium Rectangle ────────── */}
              <div className="flex justify-center py-2">
                <AdUnit variant="medium-rect" />
              </div>

              <p>
                {game.title} is available to play directly in your web browser, so you can start playing without installing additional software. Whether you are looking for a quick game or want to spend more time improving your skills, this {categoryName} game offers an enjoyable browser gaming experience.
              </p>

              <p>
                Play {game.title} on {SITE_NAME} and discover more free online games across different categories.
              </p>

              <h2 className="pt-2 text-xl font-bold text-teal-950">How to Play {game.title}</h2>
              <p>Getting started with {game.title} is simple:</p>
              <ul className="space-y-2 pl-5 list-disc">
                <li>Open the game and wait for it to load completely.</li>
                <li>Start the game using the Play or Start button.</li>
                <li>Use the available controls to move, interact, attack, jump, or perform other actions.</li>
                <li>Follow the objectives and instructions provided during gameplay.</li>
                <li>Avoid obstacles and make careful decisions to progress.</li>
                <li>Complete the level or objective and try to improve your performance.</li>
              </ul>

              <h2 className="pt-2 text-xl font-bold text-teal-950">Controls</h2>
              <ul className="space-y-2 pl-5 list-disc">
                <li><span className="font-semibold text-teal-950">W / A / S / D:</span> Move the character</li>
                <li><span className="font-semibold text-teal-950">Arrow Keys:</span> Move or navigate</li>
                <li><span className="font-semibold text-teal-950">Mouse:</span> Select, aim, or interact</li>
                <li><span className="font-semibold text-teal-950">Spacebar:</span> Jump or perform a special action</li>
                <li><span className="font-semibold text-teal-950">Enter:</span> Start or confirm</li>
              </ul>
              <p className="text-sm text-zinc-500">Note: Controls may vary depending on the game.</p>

              <h2 className="pt-2 text-xl font-bold text-teal-950">Tips &amp; Tricks</h2>
              <ul className="space-y-2 pl-5 list-disc">
                <li>Learn the basic controls before attempting difficult challenges.</li>
                <li>Pay attention to obstacles, enemies, and important objects around you.</li>
                <li>Use power-ups and special abilities at the right moment.</li>
                <li>Take your time to understand the game&apos;s mechanics and objectives.</li>
                <li>Practice regularly to improve your timing, accuracy, and overall performance.</li>
              </ul>

              <h2 className="pt-2 text-xl font-bold text-teal-950">Game Features</h2>
              <ul className="space-y-2 pl-5 list-disc">
                <li>Fun and exciting browser gameplay</li>
                <li>Simple controls that are easy to learn</li>
                <li>Challenging gameplay and objectives</li>
                <li>{categoryFeature} game experience</li>
                <li>Playable directly in a web browser</li>
                <li>No additional game installation required</li>
                <li>Suitable for casual gaming sessions</li>
                <li>More games available to explore on {SITE_NAME}</li>
              </ul>

              <h2 className="pt-2 text-xl font-bold text-teal-950">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-teal-950">What is {game.title}?</h3>
                  <p>{game.title} is an online {categoryName} game where players can {objective.brief}.</p>
                </div>
                <div>
                  <h3 className="font-bold text-teal-950">How do I play {game.title}?</h3>
                  <p>Open the game on {SITE_NAME}, start the game, and use the available keyboard, mouse, or touch controls to play. Follow the objectives shown in the game to progress.</p>
                </div>
                <div>
                  <h3 className="font-bold text-teal-950">Is {game.title} free to play?</h3>
                  <p>Yes. {game.title} is available to play online on {SITE_NAME} without requiring a separate game installation.</p>
                </div>
                <div>
                  <h3 className="font-bold text-teal-950">Can I play {game.title} on mobile?</h3>
                  <p>Mobile compatibility depends on the game. If the game supports touch controls and mobile browsers, you can play it on a compatible smartphone or tablet.</p>
                </div>
                <div>
                  <h3 className="font-bold text-teal-950">Do I need to download {game.title}?</h3>
                  <p>No additional download is required when the game is available to play directly through your browser on {SITE_NAME}.</p>
                </div>
              </div>

              <h2 className="pt-2 text-xl font-bold text-teal-950">Related Games</h2>
              <p>
                If you enjoyed {game.title}, you can also explore other games on {SITE_NAME}. Discover more {categoryName}, action, racing, puzzle, adventure, and casual games and find your next favorite browser game.
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
                <Link key={c} href={`/category/${categorySlug(c)}`} className="text-teal-700 hover:underline">
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
