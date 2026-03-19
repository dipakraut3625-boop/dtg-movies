"use client";

import Link from "next/link";

export default function MovieCard({
  movie,
  isActive,
  setActive,
}: any) {
  return (
    <div
      className="min-w-[170px] cursor-pointer"
      onMouseEnter={() => setActive(movie.id)}
      onMouseLeave={() => setActive(null)}
    >
      <Link href={`/movie/${movie.id}`}>
        <div
          className={`
            relative rounded-2xl overflow-hidden
            transition-all duration-300
            ${isActive ? "hover:scale-105 hover:z-50 transition-all duration-300 z-50 origin-center" : "scale-100 z-10"}
          `}
        >
          {/* IMAGE */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-full h-full object-cover"
          />

          {/* 🔥 POPUP (ONLY ACTIVE CARD) */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-3">

              <p className="text-white text-sm font-semibold">
                {movie.title}
              </p>

              <p className="text-xs text-zinc-300">
                ⭐ {movie.vote_average?.toFixed(1)}
              </p>

              <button
              className="
              mt-2 flex items-center justify-center gap-1
              bg-white text-black 
              px-3 py-1 rounded-md text-xs font-medium
              hover:bg-gray-200 transition
              ">ℹ More Info</button>
            </div>
          )}
        </div>
      </Link>

      <p className="mt-2 text-sm text-zinc-400">
        {movie.title}
      </p>
    </div>
  );
}