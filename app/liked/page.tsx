"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import MovieCard from "../components/MovieCard";

export default function LikedPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", user.id);

      if (!data) return;

      // 🔥 fetch movie details from TMDB
      const moviesData = await Promise.all(
        data.map(async (item: any) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          return res.json();
        })
      );

      setMovies(moviesData);
    };

    load();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white pt-24 px-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        ❤️ Liked Movies
      </h1>

      {/* GRID */}
      {movies.length === 0 ? (
        <p className="text-zinc-400">No liked movies yet</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isActive={active === movie.id}
              setActive={setActive}
            />
          ))}
        </div>
      )}

    </div>
  );
}