"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 SEARCH FUNCTION
  const searchMovies = async (q: string) => {
    setQuery(q);

    if (!q) {
      setResults([]);
      return;
    }

    setLoading(true);

    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${q}`
    );

    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">

        <div className="flex items-center justify-between px-6 h-16">

          {/* 🎬 LOGO */}
          <h1
            onClick={() => router.push("/")}
            className="text-xl font-bold cursor-pointer tracking-wide"
          >
            <span className="text-orange-500">DTG</span>
            <span className="text-white">Movies</span> 🎬
          </h1>

          {/* 📂 NAV LINKS */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">

            {/* 🎬 Explore */}
            <button
              onClick={() => router.push("/")}
              className={`flex items-center gap-2 transition ${
                pathname === "/"
                  ? "text-white border-b-2 border-orange-500 pb-1"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🎬 Explore
            </button>

            {/* 📁 Watchlist */}
            <button
              onClick={() => router.push("/watchlist")}
              className={`flex items-center gap-2 transition ${
                pathname === "/watchlist"
                  ? "text-white border-b-2 border-orange-500 pb-1"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              📁 Watchlist
            </button>

            {/* ❤️ Liked */}
            <button
              onClick={() => router.push("/liked")}
              className={`flex items-center gap-2 transition ${
                pathname === "/liked"
                  ? "text-white border-b-2 border-orange-500 pb-1"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ❤️ Liked
            </button>

          </div>

          {/* 🔍 + PROFILE */}
          <div className="flex items-center gap-4">

            {/* 🔍 SEARCH ICON */}
            <button
              onClick={() => setOpen(true)}
              className="text-zinc-300 hover:text-white text-lg"
            >
              🔍
            </button>

            {/* 👤 PROFILE */}
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center cursor-pointer">
              👤
            </div>

          </div>
        </div>
      </header>

      {/* 🔥 SEARCH OVERLAY */}
      {open && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 p-10">

          {/* ❌ CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-xl"
          >
            ✕
          </button>

          {/* 🔍 INPUT */}
          <input
            autoFocus
            value={query}
            onChange={(e) => searchMovies(e.target.value)}
            placeholder="Search movies or series..."
            className="w-full max-w-2xl mx-auto block bg-zinc-900 text-white px-6 py-4 rounded-xl outline-none border border-zinc-700 focus:border-orange-500"
          />

          {/* ⏳ LOADING */}
          {loading && (
            <p className="text-center mt-6 text-zinc-400">
              Searching...
            </p>
          )}

          {/* 🎬 RESULTS */}
          <div className="mt-10 max-w-2xl mx-auto space-y-3">

            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setOpen(false);
                  router.push(`/movie/${item.id}`);
                }}
                className="flex items-center gap-4 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : "/placeholder.png"
                  }
                  className="w-12 h-16 object-cover rounded"
                />

                <div>
                  <p className="text-white text-sm">
                    {item.title || item.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {item.media_type}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </>
  );
}