"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, Bookmark } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function MovieCard({
  movie,
  isActive,
  setActive,
}: any) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🔥 LOAD STATE FROM DB
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const userId = data.user.id;

      const { data: likedData } = await supabase
        .from("likes")
        .select("movie_id")
        .eq("user_id", userId);

      const { data: savedData } = await supabase
        .from("watchlist")
        .select("movie_id")
        .eq("user_id", userId);

      setLiked(
        likedData?.some((m) => Number(m.movie_id) === movie.id)
      );

      setSaved(
        savedData?.some((m) => Number(m.movie_id) === movie.id)
      );
    };

    load();
  }, [movie.id]);

  // ❤️ LIKE
  const handleLike = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !liked;
    setLiked(newState); // instant UI

    const { data } = await supabase.auth.getUser();
    if (!data.user) return alert("Login required");

    const userId = data.user.id;

    if (newState) {
      const { error } = await supabase.from("likes").upsert({
        user_id: userId,
        movie_id: movie.id,
      });

      if (error) console.log("LIKE ERROR:", error);
    } else {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movie.id);
    }
  };

  // 🔖 WATCHLIST
  const handleSave = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !saved;
    setSaved(newState);

    const { data } = await supabase.auth.getUser();
    if (!data.user) return alert("Login required");

    const userId = data.user.id;

    if (newState) {
      const { error } = await supabase.from("watchlist").upsert({
        user_id: userId,
        movie_id: movie.id,
      });

      if (error) console.log("SAVE ERROR:", error);
    } else {
      await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movie.id);
    }
  };

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
            relative rounded-2xl overflow-hidden transition-all duration-300
            ${isActive ? "hover:scale-105 z-50" : "scale-100 z-10"}
          `}
        >
          {/* 🎬 IMAGE */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-full h-full object-cover"
          />

          {/* 🔥 ACTION ICONS */}
          {isActive && (
            <div className="absolute top-2 right-2 flex gap-2 z-50 animate-fadeIn">

              {/* ❤️ LIKE */}
              <button
                onClick={handleLike}
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

              {/* 🔖 SAVE */}
              <button
                onClick={handleSave}
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

          {/* 🎥 POPUP */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-3">
              <p className="text-white text-sm font-semibold">
                {movie.title}
              </p>

              <p className="text-xs text-zinc-300">
                ⭐ {movie.vote_average?.toFixed(1)}
              </p>

              <button className="mt-2 bg-white text-black px-3 py-1 rounded-md text-xs hover:bg-gray-200 transition">
                ℹ More Info
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* TITLE */}
      <p className="mt-2 text-sm text-zinc-400">
        {movie.title}
      </p>
    </div>
  );
}