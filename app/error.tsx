"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-lg font-semibold text-white">
        Couldn&apos;t load games right now.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Try again
      </button>
    </main>
  );
}
