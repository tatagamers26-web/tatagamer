import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategories, getGames } from "@/lib/games";
import { Icon } from "../../ui-icon";
import { CAT_ICON, SITE_NAME, siteUrl } from "../../seo";
import { PokiFooter } from "../../footer";
import { SearchDialog } from "../../search-dialog";
import { AdLeaderboard } from "../../ad-unit";

/* ── helpers ──────────────────────────────────────────────────────── */

/** Convert a URL slug back to the category name stored in the feed.
 *  "2-player" → "2 Player", "io" → ".IO", etc. */
function slugToCategory(slug: string, categories: string[]): string | undefined {
  const normalized = slug.toLowerCase().replace(/-/g, " ");
  return categories.find(
    (c) =>
      c.toLowerCase() === normalized ||
      c.toLowerCase().replace(/^\./, "") === normalized ||   // ".IO" → "io"
      c.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );
}

/** Build a canonical URL-safe slug for a category name. */
export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/^\./g, "")         // ".IO" → "IO"
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── static params (build-time) ──────────────────────────────────── */

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: categorySlug(c) }));
}

/* ── metadata ────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = slugToCategory(slug, categories);
  if (!category) return { title: "Category not found" };

  const games = await getGames();
  const count = games.filter((g) => g.category === category).length;
  const url = `/category/${slug}`;

  const title = `Free ${category} Games - Play Online | ${SITE_NAME}`;
  const description = `Play ${count}+ free ${category.toLowerCase()} games online on ${SITE_NAME}. No download, no install, no account needed. Instant browser play on any device.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: `${category} Games on ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-default.png"],
    },
  };
}

/* ── page ─────────────────────────────────────────────────────────── */

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const [categories, games] = await Promise.all([getCategories(), getGames()]);
  const category = slugToCategory(slug, categories);
  if (!category) notFound();

  const categoryGames = games.filter((g) => g.category === category);
  const count = categoryGames.length;

  const searchPopular = games
    .slice(0, 12)
    .map((g) => ({ id: g.id, slug: g.slug, title: g.title, thumb: g.thumb }));

  /* JSON-LD: BreadcrumbList + ItemList */
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: `${category} Games`, item: `${siteUrl()}/category/${slug}` },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Free ${category} Games`,
    description: `Browse ${count} free ${category.toLowerCase()} games on ${SITE_NAME}`,
    numberOfItems: count,
    itemListElement: categoryGames.slice(0, 50).map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: `${siteUrl()}/game/${g.slug}`,
      image: g.thumb,
    })),
  };

  const catIcon = CAT_ICON[category] ?? "joystick";

  return (
    <div className="mx-auto w-full max-w-[1854px] px-2.5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, itemListLd]) }}
      />

      <main>
        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="poki-grid">
          {/* Brand card */}
          <div className="relative">
            <div className="fixed top-[var(--grid-gap)] z-30 flex h-[var(--cell)] w-[var(--cell)] flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white shadow-[0_6px_10px_rgba(6,55,59,0.18)]">
              <Link href="/" className="group flex flex-col items-center justify-center" aria-label={SITE_NAME}>
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
          </div>

          {/* Category pills */}
          {categories.map((c) => {
            const active = c === category;
            return (
              <Link key={c} href={`/category/${categorySlug(c)}`} className="group">
                <span
                  className={`flex h-[var(--cell)] flex-col items-center justify-center gap-1.5 rounded-[20px] px-1 text-center shadow-[0_6px_10px_rgba(6,55,59,0.18)] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_10px_16px_rgba(6,55,59,0.24)] ${
                    active ? "bg-teal-500" : "bg-white"
                  }`}
                >
                  <Icon name={CAT_ICON[c] ?? "joystick"} className={`h-8 w-8 ${active ? "text-white" : "text-teal-950"}`} />
                  <span className={`text-[11px] font-bold uppercase leading-tight ${active ? "text-white" : "text-teal-600"}`}>
                    {c}
                  </span>
                </span>
              </Link>
            );
          })}

          {/* Full-width content area */}
          <div style={{ gridColumn: "1 / -1" }} className="flex flex-col gap-[var(--grid-gap)] w-full my-[var(--grid-gap)] pb-8">

            {/* Hero strip */}
            <div className="w-full rounded-[24px] bg-white p-5 sm:p-8 shadow-sm">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-teal-600">
                <Link href="/" className="hover:underline">{SITE_NAME}</Link>
                <span aria-hidden="true">›</span>
                <span className="text-teal-950">{category} Games</span>
              </nav>

              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                  <Icon name={catIcon} className="h-7 w-7" />
                </span>
                <h1 className="text-2xl font-bold text-teal-950">
                  Free {category} Games - Play Now Online
                </h1>
              </div>
              <p className="text-base leading-relaxed text-zinc-600">
                Browse {count} free {category.toLowerCase()} games and play instantly in your browser.
                No download, no account, no install needed. Works on desktop, tablet and phone.
              </p>
            </div>

            {/* Game grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-[var(--grid-gap)]">
              {categoryGames.map((g) => (
                <Link
                  key={g.id}
                  href={`/game/${g.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-white/40 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Image
                    src={g.thumb}
                    alt={g.title}
                    fill
                    sizes="120px"
                    className="object-cover transition duration-300 group-hover:scale-110"
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                    <span className="text-[10px] font-bold leading-tight text-white line-clamp-2">{g.title}</span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Ad leaderboard */}
            <AdLeaderboard />

            {/* Editorial SEO article */}
            <article className="w-full rounded-[24px] bg-white p-5 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-teal-950 mb-4">About {category} Games on {SITE_NAME}</h2>
              <div className="space-y-3 text-base leading-relaxed text-zinc-600">
                <p>
                  {SITE_NAME} hosts {count} {category.toLowerCase()} games you can play right now, straight
                  in your browser. There is nothing to download and no account to create. Pick any tile,
                  wait a moment for the game to load, and play.
                </p>
                <p>
                  All titles run on desktop, tablet and phone. Games in the {category} category
                  typically work well with touch controls, though some may suggest a keyboard for
                  the best experience — check the instructions shown below the game player.
                </p>
                <p>
                  The {category} selection is sorted by popularity and refreshed regularly, so
                  new titles appear automatically. Use the category bar above to switch to a
                  different genre, or return to the{" "}
                  <Link href="/" className="font-semibold text-teal-700 hover:underline">
                    full games catalogue
                  </Link>.
                </p>
              </div>
            </article>

            {/* Category nav */}
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

            <PokiFooter totalGames={games.length} />
          </div>
        </div>
      </main>
    </div>
  );
}
