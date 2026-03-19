"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MoviePage() {
  const params = useParams();

  const [movie, setMovie] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 🎬 Movie
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();
      setMovie(data);

      // 🎥 Trailer
      const vidRes = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );

      let vidData = { results: [] };

      try {
        vidData = await vidRes.json();
      } catch (e) {
        console.error("Video API error:", e);
      }

      let trailer: any =
  vidData?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  ) ||
  vidData?.results?.find(
    (v: any) => v.site === "YouTube"
  );

      if (!trailer) {
   trailer = {
    key: encodeURIComponent(`${data.title || "movie"} trailer`),
    isSearch: true,
  };
}

      setVideo(trailer);

      // 👥 Cast + Crew
      const creditRes = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const creditData = await creditRes.json();
      setCredits(creditData);
    };

    fetchData();
  }, [params.id]);

  if (!movie) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-black text-white min-h-screen">

      {/* 🔥 HERO */}
      <div className="relative h-[70vh] w-full overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 z-10" />

        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="w-full h-full object-cover absolute inset-0"
        />

        <div className="absolute bottom-10 left-10 flex gap-8 items-end z-20">

          {/* POSTER */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-[220px] rounded-2xl shadow-2xl"
          />

          {/* INFO */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-2">
              {movie.title}
            </h1>

            <div className="flex gap-4 text-sm text-zinc-300 mb-3">
              <span>⭐ {movie.vote_average}</span>
              <span>📅 {movie.release_date}</span>
              <span>⏱ {movie.runtime} min</span>
            </div>

            <p className="text-zinc-300">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>

      {/* 🔥 MAIN */}
      <div className="px-10 py-10 grid grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="col-span-2">

          {/* 🎥 WHERE TO WATCH */}
          <h2 className="text-xl font-semibold mb-4">
            Where to Watch
          </h2>

          <div className="flex items-center gap-4 mb-8">
            {new Date(movie.release_date) > new Date() ? (
              <div className="flex items-center gap-3 bg-yellow-500/20 px-4 py-2 rounded-lg">
                <span>🎬</span>
                <span className="font-semibold">In Theaters</span>
              </div>
            ) : (
              <a
                href={`https://www.justwatch.com/in/search?q=${movie.title}`}
                target="_blank"
                className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition"
              >
                ▶ Watch Online
              </a>
            )}
          </div>

          {/* 🎭 CAST */}
          <h2 className="text-xl font-semibold mb-4">
            Cast
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {credits?.cast?.slice(0, 10).map((c: any, index: number) => (
              <div
                key={`${c.id}-${index}`}
                className="text-center min-w-[100px]"
              >
                <img
                  src={
                    c.profile_path
                      ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
                      : "/placeholder.png"
                  }
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />

                <p className="text-sm mt-2">{c.name}</p>
                <p className="text-xs text-zinc-500">
                  {c.character}
                </p>
              </div>
            ))}
          </div>

          {/* 🎬 DIRECTOR */}
<h2 className="text-xl font-semibold mt-10 mb-4">
  Director
</h2>

{(() => {
  const director = credits?.crew?.find((c: any) => c.job === "Director");

  if (!director) return <p className="text-zinc-400">N/A</p>;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">

      <div className="text-center min-w-[100px]">

        <img
          src={
            director.profile_path
              ? `https://image.tmdb.org/t/p/w200${director.profile_path}`
              : "/placeholder.png"
          }
          className="w-20 h-20 rounded-full object-cover mx-auto"
        />

        <p className="text-sm mt-2">
          {director.name}
        </p>

        <p className="text-xs text-zinc-500">
          Director
        </p>

      </div>

    </div>
  );
})()}
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl shadow-xl border border-zinc-700">

            <h3 className="mb-5 font-semibold text-lg">
              Details
            </h3>

            <div className="space-y-3 text-sm text-zinc-300">
              <p>🌍 Language: {movie.original_language.toUpperCase()}</p>
              <p>⭐ Rating: {movie.vote_average}</p>
              <p>🔥 Popularity: {Math.round(movie.popularity)}</p>
              <p>👍 Votes: {movie.vote_count}</p>
              <p>📅 Release: {movie.release_date}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 🎥 TRAILER (PRO STYLE) */}
<div className="px-10 pb-16">

  <h2 className="text-2xl font-semibold mb-6">
    Trailer
  </h2>

  <div className="flex justify-center">

    <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-black">

      <iframe
        className="w-full h-full block"
        src={
          video?.isSearch
            ? `https://www.youtube.com/embed?listType=search&list=${video.key}&rel=0`
            : `https://www.youtube.com/embed/${video?.key}?rel=0`
        }
        allowFullScreen
      />

    </div>

  </div>

</div>

      {/* 🎥 MODAL */}
      {open && video && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[90%] max-w-5xl aspect-video relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              ✕
            </button>

            <iframe
              className="w-full h-full rounded-xl"
              src={
                video.isSearch
                  ? `https://www.youtube.com/embed?listType=search&list=${video.key}&autoplay=1`
                  : `https://www.youtube.com/embed/${video.key}?autoplay=1`
              }
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}