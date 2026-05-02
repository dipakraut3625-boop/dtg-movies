"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ActorPage() {
  const params = useParams();
  const router = useRouter();

  const [actor, setActor] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchActor = async () => {
      // 👤 Actor details
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();
      setActor(data);

      // 🎬 Actor movies
      const movieRes = await fetch(
        `https://api.themoviedb.org/3/person/${params.id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const movieData = await movieRes.json();

      setMovies(
        (movieData.cast || []).sort(
          (a: any, b: any) => b.popularity - a.popularity
        )
      );
    };

    fetchActor();
  }, [params.id]);

  if (!actor) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-black text-white min-h-screen pt-20">

      {/* 🔥 ACTOR HERO */}
      <div className="px-10 max-w-6xl mx-auto flex gap-8 items-center">

        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
              : "/no-avatar.png"
          }
          className="w-[220px] rounded-2xl shadow-2xl"
        />

        <div>
          <h1 className="text-4xl font-bold mb-2">
            {actor.name}
          </h1>

          <p className="text-zinc-400 mb-2">
            🎂 {actor.birthday || "N/A"}
          </p>

          <p className="text-zinc-300 max-w-2xl">
            {actor.biography || "No biography available."}
          </p>
        </div>

      </div>

      {/* 🎬 MOVIES */}
      <div className="px-10 mt-16 max-w-6xl mx-auto">

        <h2 className="text-2xl font-semibold mb-6">
          Popular Movies
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

          {movies.slice(0, 18).map((movie) => (
            <div
              key={movie.id}
              onClick={() => router.push(`/movie/${movie.id}`)}
              className="cursor-pointer hover:scale-105 transition"
            >

              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                className="rounded-xl"
              />

              <p className="text-sm mt-2">
                {movie.title}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}