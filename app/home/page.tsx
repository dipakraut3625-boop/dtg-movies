"use client";

import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

const API = process.env.NEXT_PUBLIC_TMDB_API_KEY;


export default function HomePage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [heroVideo, setHeroVideo] = useState<string | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");


  useEffect(() => {
    const load = async () => {
      const [t, top, up] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API}`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API}`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API}`).then(r => r.json()),
      ]);

      setTrending(t.results || []);
      setTopRated(top.results || []);
      setUpcoming(up.results || []);

      // 🎬 HERO TRAILER
      if (t.results?.[0]) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${t.results[0].id}/videos?api_key=${API}`
        ).then(r => r.json());

        const vid = res.results?.find((v: any) => v.type === "Trailer");
        if (vid) setHeroVideo(vid.key);
      }
    };

    load();
  }, []);

  // 🎯 FILTER LOGIC (simple demo)
  const applyFilter = (list: any[]) => {
    if (filter === "all") return list;
    if (filter === "anime") return list.filter(m => m.original_language === "ja");
    if (filter === "bollywood") return list.filter(m => m.original_language === "hi");
    return list;
  };

  return (
    <main className="px-6 md:px-10 space-y-12 bg-black text-white">

      {/* 🎬 HERO */}
      {trending[0] && (
        <section className="relative h-[70vh] rounded-2xl overflow-hidden">

          {heroVideo ? (
            <iframe
              className="w-full h-full object-cover"
              src={`https://www.youtube.com/embed/${heroVideo}?autoplay=1&mute=1&loop=1&playlist=${heroVideo}&controls=0&showinfo=0`}
              allow="autoplay"
            />
          ) : (
            <img
              src={`https://image.tmdb.org/t/p/original${trending[0].backdrop_path}`}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

          <div className="absolute bottom-10 left-10 max-w-xl">
            <p className="text-orange-500 text-sm mb-2">🔥 Trending</p>

            <h1 className="text-5xl font-bold mb-4">
              {trending[0].title}
            </h1>

            <p className="text-zinc-300 line-clamp-3 mb-6">
              {trending[0].overview}
            </p>

            <div className="flex gap-4">
              <button className="bg-orange-500 text-black px-6 py-2 rounded-lg font-semibold">
                ▶ Play
              </button>

              <button className="bg-zinc-800 px-6 py-2 rounded-lg">
                + Watchlist
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 🎯 FILTERS */}
      <section className="flex gap-3">
        {["all", "hollywood", "bollywood", "anime"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm border ${
              filter === f
                ? "bg-orange-500 text-black border-orange-500"
                : "border-zinc-700 text-zinc-300"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </section>

      {/* 📰 COMPACT NEWS */}
      <section>
        <h2 className="text-lg font-semibold mb-3">📰 Updates</h2>

        <div className="flex gap-3 overflow-x-auto">
          {[...trending.slice(0, 3), ...upcoming.slice(0, 3)].map((m, index) => (
  <a
    key={`${m.id}-${index}`}
    href={`/movie/${m.id}`}
    className="min-w-[240px] h-[120px] relative rounded-xl overflow-hidden border border-zinc-800"
  >
    <img
      src={`https://image.tmdb.org/t/p/w500${m.backdrop_path}`}
      className="w-full h-full object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

    <div className="absolute bottom-2 left-3">
      <p className="text-xs text-orange-400">
        {m.release_date ? "New" : "Upcoming"}
      </p>
      <p className="text-sm font-semibold line-clamp-1">
        {m.title}
      </p>
    </div>
  </a>
))}
        </div>
      </section>

      {/* 🎬 ROWS */}
      <Row title="🔥 Trending" data={applyFilter(trending)} active={active} setActive={setActive} />
      <Row title="⭐ Top Rated" data={applyFilter(topRated)} active={active} setActive={setActive} />
      <Row title="📅 Coming Soon" data={applyFilter(upcoming)} active={active} setActive={setActive} />

    </main>
  );
}

//
// 🎬 ROW WITH SCROLL SNAP
//
function Row({ title, data, active, setActive }: any) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
        {data.map((movie: any) => (
          <div key={movie.id} className="snap-start">
            <MovieCard
              movie={movie}
              isActive={active === movie.id}
              setActive={setActive}
            />
          </div>
        ))}
      </div>
    </section>
  );
}