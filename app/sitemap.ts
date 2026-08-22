import type { MetadataRoute } from "next";

import { getCategories, getGames } from "@/lib/games";
import { siteUrl } from "./seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [games, categories] = await Promise.all([getGames(), getCategories()]);

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/faq`,     changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "monthly" as const, priority: 0.5 },
    ...categories.map((c) => ({
      url: `${base}/?cat=${encodeURIComponent(c)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...games.map((g) => ({
      url: `${base}/game/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
