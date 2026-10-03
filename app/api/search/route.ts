import { getGames, searchGames } from "@/lib/games";

const LIMIT = 24;

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return Response.json([]);

  const hits = searchGames(await getGames(), q)
    .slice(0, LIMIT)
    .map((g) => ({ id: g.id, slug: g.slug, title: g.title, thumb: g.thumb }));

  return Response.json(hits);
}
