import Image from "next/image";
import Link from "next/link";
import { getCategories, getGames, searchGames, type Game } from "@/lib/games";
import { SearchDialog } from "./search-dialog";
import { Icon } from "./ui-icon";
import { CAT_ICON, SITE_NAME } from "./seo";
import { PokiFooter } from "./footer";

const PER_PAGE = 60;
// Poki-style bento: fixed 100px cells, dense flow, tiles span 1-3 cells.
const SPANS = [3, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 3, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1];
const FEATURED_POOL = 60;
const CELL = 100;
const GAP = 17;
// Sections that must span the whole grid width, so every section edge lines up.
const FULL_ROW = { gridColumn: "1 / -1" } as const;


function href(q: string, cat: string, page: number) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (cat) p.set("cat", cat);
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `/?${s}` : "/";
}

function pickRandom<T>(items: T[], n: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function Tile({ game, span }: { game: Game; span: number }) {
  return (
    <Link
      href={`/game/${game.slug}`}
      style={{ gridColumn: `span ${span}`, gridRow: `span ${span}` }}
      className="group relative overflow-hidden rounded-2xl bg-white/40 shadow-sm transition duration-200 hover:z-10 hover:-translate-y-1 hover:shadow-xl"
    >
      <Image
        src={game.thumb}
        alt={game.title}
        fill
        sizes={`${span * (CELL + GAP)}px`}
        className="object-cover transition duration-300 group-hover:scale-110"
      />
      <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
        <span className={`font-bold leading-tight text-white ${span > 1 ? "text-sm" : "text-[10px]"}`}>
          {game.title}
        </span>
      </span>
    </Link>
  );
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim().toLowerCase();
  const cat = typeof sp.cat === "string" ? sp.cat : "";
  const requestedPage = Math.max(1, Math.floor(Number(sp.page)) || 1);

  const [games, categories] = await Promise.all([getGames(), getCategories()]);

  let filtered = games;
  if (cat) filtered = filtered.filter((g) => g.category === cat);
  if (q) filtered = searchGames(filtered, q);

  // Big tiles = random draw from the most-played head, reshuffled every load.
  const bigSlots = SPANS.filter((s) => s > 1).length;
  const featured =
    requestedPage === 1 && !q ? pickRandom(filtered.slice(0, FEATURED_POOL), bigSlots) : [];
  const featuredIds = new Set(featured.map((g) => g.id));
  const rest = filtered.filter((g) => !featuredIds.has(g.id));

  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const pageGames = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const big = [...featured];
  const small = [...pageGames];
  const tiles: { game: Game; span: number }[] = [];
  for (let i = 0; small.length || big.length; i++) {
    const span = SPANS[i % SPANS.length];
    const game = span > 1 ? (big.shift() ?? small.shift()) : (small.shift() ?? big.shift());
    if (!game) break;
    tiles.push({ game, span: big.length || small.length ? span : 1 });
  }

  const searchPopular = games
    .slice(0, 12)
    .map((g) => ({ id: g.id, slug: g.slug, title: g.title, thumb: g.thumb }));


  return (
    <div className="mx-auto w-full max-w-[1854px] px-2.5">
      <main className="poki-grid">
        {/* Brand card. Occupies one 100px cell, but the visible card is fixed so it
            stays pinned while the grid scrolls. Omitting `left` makes the fixed box
            resolve to its static position, i.e. exactly over this placeholder cell. */}
        <div className="relative">
          <div
            className="fixed top-[var(--grid-gap)] z-30 flex h-[var(--cell)] w-[var(--cell)] flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white shadow-[0_6px_10px_rgba(6,55,59,0.18)]"
          >
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
              <Link
                href="/"
                aria-label="Home"
                className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-100 text-teal-700 transition hover:bg-teal-100"
              >
                <Icon name="home" className="h-4 w-4" />
              </Link>
              <SearchDialog popular={searchPopular} />
            </div>
          </div>
        </div>

        {tiles.map(({ game, span }) => (
          <Tile key={game.id} game={game} span={span} />
        ))}

        {categories.map((c) => {
          const active = c === cat;
          return (
            <Link key={c} href={href("", active ? "" : c, 1)} className="group">
              <span
                className={`flex h-[var(--cell)] flex-col items-center justify-center gap-1.5 rounded-[20px] px-1 text-center shadow-[0_6px_10px_rgba(6,55,59,0.18)] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_10px_16px_rgba(6,55,59,0.24)] ${
                  active ? "bg-teal-500" : "bg-white"
                }`}
              >
                <Icon
                  name={CAT_ICON[c] ?? "joystick"}
                  className={`h-8 w-8 ${active ? "text-white" : "text-teal-950"}`}
                />
                <span
                  className={`text-[11px] font-bold uppercase leading-tight ${
                    active ? "text-white" : "text-teal-600"
                  }`}
                >
                  {c}
                </span>
              </span>
            </Link>
          );
        })}

        {/* Full width prose, category navigation, and footer section aligned with grid */}
        <div style={{ gridColumn: "1 / -1" }} className="flex flex-col gap-[var(--grid-gap)] w-full my-[var(--grid-gap)] pb-8">
          {/* Editorial content. Original copy — required for AdSense approval. */}
          <article className="w-full rounded-[24px] bg-white p-5 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-teal-950">
              {SITE_NAME}: Play {games.length.toLocaleString()} Free Games in Your Browser
            </h1>

            <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-600">
              <p>
                Every game here runs straight in your browser. Nothing to download, nothing to
                install, no account to create. Just pick a game, wait a second or two, and play.
                It works the same on a phone, a tablet, a school laptop or a desktop.
              </p>

              <h2 className="pt-3 text-lg font-bold text-teal-950">How {SITE_NAME} works</h2>
              <p>
                The homepage reshuffles its featured games on every visit, so the big tiles are
                never quite the same twice. Below them sits the rest of the catalogue in popularity
                order, newest and most-played first. Use the category boxes to narrow things down,
                or the search box if you already know what you want. It matches both game
                titles and tags, so searching &ldquo;zombie&rdquo; finds games that never mention it
                in the title.
              </p>

              <h2 className="pt-3 text-lg font-bold text-teal-950">What you&apos;ll find here</h2>
              <ul className="space-y-2 pl-5">
                <li className="list-disc">
                  <strong className="text-teal-950">Racing and driving:</strong> street
                  circuits, stunt ramps, parking challenges and truck simulators.
                </li>
                <li className="list-disc">
                  <strong className="text-teal-950">Puzzles:</strong> match-3, jigsaws, block
                  stacking and logic games for when you want to slow down and think.
                </li>
                <li className="list-disc">
                  <strong className="text-teal-950">Action and shooting:</strong> platformers,
                  survival runs, target practice and boss fights.
                </li>
                <li className="list-disc">
                  <strong className="text-teal-950">2 Player:</strong> split-keyboard games
                  you can play with someone next to you, no second device needed.
                </li>
                <li className="list-disc">
                  <strong className="text-teal-950">.IO and multiplayer:</strong> grow,
                  outlast and outmanoeuvre other players in real time.
                </li>
                <li className="list-disc">
                  <strong className="text-teal-950">Hypercasual:</strong> one-button games
                  that take five seconds to learn and a while to put down.
                </li>
              </ul>

              <h2 className="pt-3 text-lg font-bold text-teal-950">Playing on a phone</h2>
              <p>
                Most of the catalogue is built for touch, so tapping and swiping is all you need.
                Games that expect arrow keys or WASD will say so in their instructions on the play
                page, so those are worth saving for a laptop. Turning your phone sideways helps
                on anything that scrolls horizontally, and every game runs full-screen if you want
                the controls out of the way.
              </p>

              <h2 className="pt-3 text-lg font-bold text-teal-950">Common questions</h2>
              <p>
                <strong className="text-teal-950">Do I need to sign up?</strong> No. There are no
                accounts on {SITE_NAME}. Open a game and play.
              </p>
              <p>
                <strong className="text-teal-950">Does it cost anything?</strong> No. Every game
                listed here is free to play.
              </p>
              <p>
                <strong className="text-teal-950">Will it work on my phone?</strong> Most games
                support touch controls. A few are built for a keyboard and play better on a computer;
                those usually say so in their instructions.
              </p>
              <p>
                <strong className="text-teal-950">A game won&apos;t load. What now?</strong> Refresh
                the page first. If it still won&apos;t start, check whether an ad blocker or a strict
                privacy extension is blocking the game frame.
              </p>
              <p>
                <strong className="text-teal-950">Can&apos;t find a game?</strong> Try searching a
                single word from the title, or browse the category boxes above. The catalogue
                is large and titles vary.
              </p>
              <p>
                <strong className="text-teal-950">How often are new games added?</strong> The
                catalogue refreshes automatically every hour, so new titles turn up on their own.
              </p>
              <p>
                <strong className="text-teal-950">Can I play the same game again later?</strong>{" "}
                Yes. Every game has its own page, so bookmarking it takes you straight back.
              </p>
            </div>
          </article>

          <nav className="w-full rounded-[24px] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link href="/" className="font-semibold text-teal-700 hover:underline">
                All Games
              </Link>
              {categories.map((c) => (
                <Link key={c} href={href("", c, 1)} className="text-teal-700 hover:underline">
                  {c} Games
                </Link>
              ))}
            </div>
          </nav>

          <PokiFooter totalGames={games.length} />
        </div>
      </main>
    </div>
  );
}
