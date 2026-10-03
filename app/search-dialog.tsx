"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Icon } from "./ui-icon";

export type SearchGame = { id: string; slug: string; title: string; thumb: string };

const DEBOUNCE_MS = 180;

/**
 * Search popup. Uses native <dialog>.showModal() so focus trapping and the inert
 * background come from the platform. Results are fetched live from /api/search as
 * the user types, so the ~5000-game catalogue never ships to the browser.
 */
export function SearchDialog({ popular }: { popular: SearchGame[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchGame[]>([]);
  const [loading, setLoading] = useState(false);

  const term = query.trim();

  useEffect(() => {
    if (!term) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (res.ok) setResults(await res.json());
      } catch {
        // aborted by the next keystroke, or offline — keep the last results up
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const showing = term ? results : popular;
  const heading = !term
    ? "Popular games"
    : loading
      ? "Searching…"
      : results.length
        ? `Games found: ${results.length}`
        : `No games match "${term}"`;

  return (
    <>
      <button
        type="button"
        aria-label="Search games"
        onClick={() => ref.current?.showModal()}
        className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg bg-zinc-100 text-teal-700 transition hover:bg-teal-100"
      >
        <Icon name="search" className="h-4 w-4" />
      </button>

      <dialog
        ref={ref}
        onClose={() => setQuery("")}
        onKeyDown={(e) => {
          // Native Esc-to-close proved unreliable here: <input type="search">
          // swallows the first Escape to clear itself, and the dialog's cancel
          // event did not fire in testing. Close explicitly instead.
          if (e.key === "Escape") {
            e.preventDefault();
            ref.current?.close();
          }
        }}
        onClick={(e) => {
          const d = ref.current;
          if (!d) return;
          const r = d.getBoundingClientRect();
          const outside =
            e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
          if (outside) d.close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-3xl bg-white p-4 sm:p-6 shadow-2xl backdrop:bg-teal-950/40 backdrop:backdrop-blur-sm"
      >
        <form action="/" onSubmit={() => ref.current?.close()} className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 sm:left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            autoComplete="off"
            placeholder="What games are you looking for?"
            className="w-full rounded-full bg-zinc-100 py-3.5 sm:py-4 pl-12 sm:pl-14 pr-5 text-sm sm:text-base text-zinc-800 outline-none ring-teal-400 placeholder:text-zinc-400 focus:ring-2"
          />
          {/* Keeps Enter submitting to the full results page. */}
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>

        <h2 className="mb-3 mt-4 sm:mt-6 text-base sm:text-lg font-bold text-teal-950">{heading}</h2>

        <div className="grid max-h-[50vh] sm:max-h-[60vh] grid-cols-4 gap-2.5 overflow-y-auto sm:grid-cols-6 items-start p-0.5">
          {showing.map((g) => (
            <Link
              key={g.id}
              href={`/game/${g.slug}`}
              title={g.title}
              onClick={() => ref.current?.close()}
              className="group relative block w-full aspect-square overflow-hidden rounded-xl ring-2 ring-transparent transition hover:ring-teal-400"
            >
              <Image
                src={g.thumb}
                alt={g.title}
                fill
                sizes="(max-width: 640px) 25vw, 15vw"
                className="object-cover transition duration-200 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>

        {term && !loading && results.length > 0 && (
          <Link
            href={`/?q=${encodeURIComponent(term)}`}
            onClick={() => ref.current?.close()}
            className="mt-4 inline-block text-sm font-semibold text-teal-700 hover:underline"
          >
            See all results for &quot;{term}&quot; →
          </Link>
        )}
      </dialog>
    </>
  );
}
