import type { MetadataRoute } from "next";

import { siteUrl, isAllowCrawl } from "./seo";

export default function robots(): MetadataRoute.Robots {
  const crawlAllow = isAllowCrawl();

  if (!crawlAllow) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Filtered and paginated views are the same games in a different order —
        // keep crawl budget on the game pages themselves.
        disallow: ["/api/", "/*?q=", "/*?page=", "/*?cat=", "/*?cat=*&page="],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
