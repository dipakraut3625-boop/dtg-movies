"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; // ✅ FIX
import { Heart, Bookmark } from "lucide-react"; // ✅ FIX

export default function MovieCard({
  movie,
  isActive,
  setActive,
}: any) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div
      className="min-w-[170px] cursor-pointer"
      onMouseEnter={() => {
        setActive(movie.id);
        router.prefetch(`/movie/${movie.id}`);
      }}
      onMouseLeave={() => setActive(null)}
    >
      <Link href={`/movie/${movie.id}`}>
        <div
          className={`
            relative rounded-2xl overflow-hidden will-change-transform
            transition-all duration-300
            ${
              isActive
                ? "hover:scale-105 transform-gpu hover:z-50 z-50 origin-center"
                : "scale-100 z-10"
            }
          `}
        >
          {/* IMAGE */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-full h-full object-cover"
          />

          {/* 🔥 ICONS */}
          <div className="absolute top-2 right-2 flex gap-2 z-50">
            
            {/* 🔥 ICONS (ONLY ON ACTIVE CARD) */}
{isActive && (
  <div className="absolute top-2 right-2 flex gap-2 z-50 animate-fadeIn">
    
    {/* ❤️ LIKE */}
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
      }}
      className="p-1.5 rounded-full bg-black/60 backdrop-blur hover:scale-110 transition"
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${
          liked
            ? "fill-red-500 text-red-500 drop-shadow-[0_0_10px_red] scale-110"
            : "text-white"
        }`}
      />
    </button>

    {/* 🔖 WATCHLIST */}
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved(!saved);
      }}
      className="p-1.5 rounded-full bg-black/60 backdrop-blur hover:scale-110 transition"
    >
      <Bookmark
        className={`w-5 h-5 transition-all duration-200 ${
          saved
            ? "fill-white text-white drop-shadow-[0_0_10px_white] scale-110"
            : "text-white"
        }`}
      />
    </button>

  </div>
)}
          </div>

          {/* 🔥 POPUP */}
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
                "
              >
                ℹ More Info
              </button>
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