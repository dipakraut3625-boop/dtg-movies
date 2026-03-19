"use client";

import { useEffect, useState } from "react";
import {
  getTrendingMovies,
  getTopRated,
  getUpcoming,
  searchMovies,
} from "./lib/tmdb";

import RowSection from "./components/RowSection";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Load default data
  useEffect(() => {
    const loadData = async () => {
      const t = await getTrendingMovies();
      const top = await getTopRated();
      const up = await getUpcoming();

      setTrending(t);
      setTopRated(top);
      setUpcoming(up);
    };

    loadData();
  }, []);

  // 🔥 LIVE SEARCH (Debounce)
  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      const results = await searchMovies(query);
      setMovies(results);
      setLoading(false);
    }, 500); // 500ms delay

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* 🔍 SEARCH BAR */}
        <div className="px-10 mt-6">
  <div className="relative max-w-3xl">

    {/* ICON */}
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">
      🔍
    </span>

    {/* INPUT */}
    <input
      type="text"
      placeholder="Search movies, series..."
      className="
        w-full
        bg-zinc-900/80
        backdrop-blur-md
        text-white
        pl-12 pr-4 py-3
        rounded-xl
        outline-none
        border border-zinc-800
        focus:border-orange-500
        focus:ring-1 focus:ring-orange-500
        transition
      "
    />

  </div>
          {/* LOADING */}
          {loading && (
            <p className="absolute right-4 top-4 text-sm text-orange-400">
              Searching...
            </p>
          )}
        </div>

        {/* 🔍 SEARCH RESULTS */}
        {query && (
          <>
            {loading ? (
              <p className="text-zinc-400">Loading...</p>
            ) : movies.length > 0 ? (
              <RowSection title="🔍 Results" movies={movies} />
            ) : (
              <p className="text-zinc-500">No results found 😢</p>
            )}
          </>
        )}

        {/* 🎬 NORMAL CONTENT */}
        {!query && (
          <>
            <RowSection title="🔥 Trending" movies={trending} />
            <RowSection title="⭐ Top Rated" movies={topRated} />
            <RowSection title="🎬 Upcoming" movies={upcoming} />
          </>
        )}

      </div>
    </div>
  );
}