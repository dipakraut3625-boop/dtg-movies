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
  
  
  const handleSearch = async (q: string) => {
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

  // only movies (avoid mismatch)
  setResults(
    (data.results || []).filter(
      (item: any) => item.media_type === "movie"
    )
  );

  setLoading(false);
};



  return (
    <>
      {/* 🔥 NAVBAR */}
      <header className="fixed top-0 w-full z-[999] bg-black/90 backdrop-blur-md border-b border-zinc-800 h-16">

        <div className="flex items-center justify-between px-6 h-full">

          {/* 🎬 LOGO */}
          <h1
            onClick={() => router.push("/")}
            className="text-xl font-bold cursor-pointer"
          >
            <span className="text-orange-500">DTG</span>
            <span className="text-white">Movies</span> 🎬
          </h1>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">

            {/* 📂 NAV LINKS */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">

              <button
                onClick={() => router.push("/")}
                className={`flex items-center gap-1 transition ${
                  pathname === "/"
                    ? "text-white border-b-2 border-orange-500 pb-1"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                🎬 Explore
              </button>

              <button
                onClick={() => router.push("/watchlist")}
                className={`flex items-center gap-1 transition ${
                  pathname === "/watchlist"
                    ? "text-white border-b-2 border-orange-500 pb-1"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                📁 Watchlist
              </button>

              <button
                onClick={() => router.push("/liked")}
                className={`flex items-center gap-1 transition ${
                  pathname === "/liked"
                    ? "text-white border-b-2 border-orange-500 pb-1"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                ❤️ Liked
              </button>

            </div>

            {/* 🔍 SEARCH */}
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

      {/* 🔍 SIMPLE SEARCH OVERLAY (OPTIONAL KEEP) */}
      {open && (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center pt-32">

    {/* ❌ CLOSE */}
    <button
      onClick={() => setOpen(false)}
      className="absolute top-6 right-6 text-white text-2xl"
    >
      ✕
    </button>

    {/* 🔍 INPUT */}
    <div className="w-full max-w-2xl px-6">

      <input
        autoFocus
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search movies, series..."
        className="w-full bg-zinc-900/80 backdrop-blur-md text-white px-6 py-4 rounded-2xl outline-none border border-zinc-700 focus:border-orange-500 text-lg"
      />

    </div>

    {/* ⏳ LOADING */}
    {loading && (
      <p className="text-zinc-400 mt-6">Searching...</p>
    )}

    {/* 🎬 RESULTS */}
    <div className="mt-8 w-full max-w-2xl px-6 space-y-3 max-h-[60vh] overflow-y-auto">

      {results.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            setOpen(false);
            router.push(`/movie/${item.id}`);
          }}
          className="flex items-center gap-4 p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl cursor-pointer transition"
        >
          <img
            src={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                : "/placeholder.png"
            }
            className="w-12 h-16 rounded object-cover"
          />

          <div>
            <p className="text-white text-sm font-medium">
              {item.title}
            </p>
            <p className="text-xs text-zinc-400">
              ⭐ {item.vote_average?.toFixed(1)}
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