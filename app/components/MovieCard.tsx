"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Bookmark } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useUserData } from "../lib/UserDataProvider";
import { useState } from "react";

export default function MovieCard({
  movie,
  isActive,
  setActive,
}: any) {
  const router = useRouter();

  const {
    likes,
    watchlist,
    setLikes,
    setWatchlist,
    loading,
  } = useUserData();

  const [updating, setUpdating] = useState(false);

  // ⚠️ DON'T hide card — just fallback
  const liked = likes?.includes(movie.id) || false;
  const saved = watchlist?.includes(movie.id) || false;

  // ❤️ LIKE
  const handleLike = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (updating) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return router.push("/login");

    setUpdating(true);

    try {
      if (!liked) {
        setLikes((prev: number[]) => [...prev, movie.id]);

        await supabase.from("likes").insert({
          user_id: user.id,
          movie_id: movie.id,
        });
      } else {
        setLikes((prev: number[]) =>
          prev.filter((id) => id !== movie.id)
        );

        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id);
      }
    } catch (err) {
      console.log("Like error", err);
    } finally {
      setUpdating(false);
    }
  };

  // 🔖 SAVE
  const handleSave = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (updating) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return router.push("/login");

    setUpdating(true);

    try {
      if (!saved) {
        setWatchlist((prev: number[]) => [...prev, movie.id]);

        await supabase.from("watchlist").insert({
          user_id: user.id,
          movie_id: movie.id,
        });
      } else {
        setWatchlist((prev: number[]) =>
          prev.filter((id) => id !== movie.id)
        );

        await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id);
      }
    } catch (err) {
      console.log("Save error", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className="min-w-[180px] cursor-pointer transition hover:scale-105"
      onMouseEnter={() => {
        setActive(movie.id);
        router.prefetch(`/movie/${movie.id}`);
      }}
      onMouseLeave={() => setActive(null)}
    >
      <Link href={`/movie/${movie.id}`}>
        <div className="relative rounded-2xl overflow-hidden">

          {/* IMAGE */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-full h-[260px] object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* ICONS */}
          {isActive && (
            <div className="absolute top-2 right-2 flex gap-2 z-50">

              {/* ❤️ LIKE */}
              <button
                onClick={handleLike}
                className="bg-black/60 p-2 rounded-full backdrop-blur transition hover:scale-110"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-200 ${
                    liked
                      ? "fill-red-500 text-red-500 scale-110 drop-shadow-[0_0_6px_red]"
                      : "text-white"
                  } ${updating ? "opacity-50" : ""}`}
                />
              </button>

              {/* 🔖 SAVE */}
              <button
                onClick={handleSave}
                className="bg-black/60 p-2 rounded-full backdrop-blur transition hover:scale-110"
              >
                <Bookmark
                  className={`w-5 h-5 transition-all duration-200 ${
                    saved
                      ? "fill-white text-white scale-110 drop-shadow-[0_0_6px_white]"
                      : "text-white"
                  } ${updating ? "opacity-50" : ""}`}
                />
              </button>

            </div>
          )}

          {/* INFO */}
          <div className="absolute bottom-0 p-3">
            <p className="text-sm font-semibold">{movie.title}</p>
            <p className="text-xs text-zinc-300">
              ⭐ {movie.vote_average?.toFixed(1)}
            </p>
          </div>

        </div>
      </Link>
    </div>
  );
}