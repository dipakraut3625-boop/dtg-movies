"use client";

import { useEffect, useState } from "react";
import { getWatchlist, removeMovie } from "@/app/lib/actions";
import Link from "next/link";

export default function WatchlistPage() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const data = await getWatchlist();
    setMovies(data || []);
  };

  const handleRemove = async (id: number) => {
    await removeMovie(id);
    loadMovies();
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">🎬 My Watchlist</h1>
        <p className="text-zinc-400 mt-2">
          Your saved movies
        </p>
      </div>

      {/* EMPTY */}
      {movies.length === 0 && (
        <p className="text-center text-zinc-500 mt-20">
          No movies saved yet
        </p>
      )}

      {/* 🔥 GRID (FIXED UI) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">

        {movies.map((movie: any) => (
          <div
            key={movie.id}
            className="relative group cursor-pointer"
          >

            {/* CLICK */}
            <Link href={`/movie/${movie.movie_id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                className="w-full h-[260px] object-cover rounded-xl transition duration-300 group-hover:scale-105 group-hover:shadow-2xl"
              />
            </Link>

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition rounded-xl flex flex-col justify-end p-3">

              <p className="text-sm font-semibold line-clamp-2">
                {movie.title}
              </p>

              <button
                onClick={() => handleRemove(Number(movie.movie_id))}
                className="mt-2 bg-red-500 text-xs px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}