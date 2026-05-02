"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Bookmark } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();

  const [movie, setMovie] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);

  const [user, setUser] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [selected, setSelected] = useState("timepass");
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const load = async () => {
      // 🎬 Movie
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();
      setMovie(data);

      // 👤 User
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // 🎥 Trailer
      let trailer: any = null;
      try {
        const vidRes = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const vidData = await vidRes.json();

        trailer =
          vidData?.results?.find(
            (v: any) => v.type === "Trailer" && v.site === "YouTube"
          ) ||
          vidData?.results?.find((v: any) => v.site === "YouTube");
      } catch {}

      if (!trailer && data?.title) {
        trailer = {
          key: encodeURIComponent(`${data.title} trailer`),
          isSearch: true,
        };
      }

      setVideo(trailer);

      // 🎭 CAST
      const creditRes = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      setCredits(await creditRes.json());

      // ❤️ LIKE + WATCHLIST
      if (user) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("movie_id")
          .eq("user_id", user.id)
          .eq("movie_id", params.id)
          .single();

        const { data: saveData } = await supabase
          .from("watchlist")
          .select("movie_id")
          .eq("user_id", user.id)
          .eq("movie_id", params.id)
          .single();

        setLiked(!!likeData);
        setSaved(!!saveData);
      }

      // 🔥 REVIEWS
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("movie_id", params.id)
        .order("created_at", { ascending: false });

      setReviews(reviewData || []);
    };

    load();
  }, [params.id]);

  if (!movie) return <p className="p-6">Loading...</p>;

  const timeAgo = (date: string) => {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="bg-black text-white min-h-screen mt-[-4rem] pt-16">

      {/* HERO */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 z-10" />

        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="w-full h-full object-cover absolute inset-0"
        />

        <div className="absolute bottom-10 left-10 flex gap-8 items-end z-20">

          {/* ❤️ 🔖 */}
          <div className="absolute top-24 right-10 flex gap-3 z-30">

            <button
              onClick={async () => {
                if (!user) return alert("Login required");

                if (!liked) {
                  setLiked(true);
                  await supabase.from("likes").insert({
                    user_id: user.id,
                    movie_id: movie.id,
                  });
                } else {
                  setLiked(false);
                  await supabase
                    .from("likes")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("movie_id", movie.id);
                }
              }}
              className="p-2 rounded-full bg-black/50"
            >
              <Heart className={`w-6 h-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </button>

            <button
              onClick={async () => {
                if (!user) return alert("Login required");

                if (!saved) {
                  setSaved(true);
                  await supabase.from("watchlist").insert({
                    user_id: user.id,
                    movie_id: movie.id,
                  });
                } else {
                  setSaved(false);
                  await supabase
                    .from("watchlist")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("movie_id", movie.id);
                }
              }}
              className="p-2 rounded-full bg-black/50"
            >
              <Bookmark className={`w-6 h-6 ${saved ? "fill-white text-white" : ""}`} />
            </button>

          </div>

          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-[220px] rounded-2xl shadow-2xl"
          />

          <div className="max-w-xl">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-3 text-zinc-300">{movie.overview}</p>
          </div>

        </div>
      </div>

      {/* 🎬 TRAILER */}
      <div className="px-10 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Trailer</h2>

        <div className="relative group rounded-xl overflow-hidden">
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-500 blur-xl opacity-30 group-hover:opacity-60 transition" />

          {video ? (
            <iframe
              className="relative w-full aspect-video rounded-xl"
              src={
                video?.isSearch
                  ? `https://www.youtube.com/embed?listType=search&list=${video.key}`
                  : `https://www.youtube.com/embed/${video.key}`
              }
              allowFullScreen
            />
          ) : (
            <div className="w-full aspect-video bg-zinc-800 rounded-xl animate-pulse" />
          )}
        </div>
      </div>

      {/* 🎭 CAST */}
      <div className="px-10 pb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Cast</h2>

        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {credits?.cast?.slice(0, 12).map((actor: any) => (
            <div
              key={actor.id}
              onClick={() => router.push(`/actor/${actor.id}`)}
              className="min-w-[120px] text-center cursor-pointer hover:scale-105 transition"
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "/no-avatar.png"
                }
                className="w-[100px] h-[100px] object-cover rounded-full mx-auto mb-2"
              />
              <p className="text-sm">{actor.name}</p>
              <p className="text-xs text-zinc-400">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ REVIEW INPUT (FIXED) */}
      <div className="px-10 py-10 max-w-2xl mx-auto">
        <div className="flex gap-2 mb-4">
          {["skip", "timepass", "go", "perfect"].map((r) => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`px-4 py-2 rounded-full ${
                selected === r
                  ? "bg-yellow-400 text-black"
                  : "bg-zinc-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full border-b border-zinc-700 bg-transparent p-2"
        />

        <button
          onClick={async () => {
            if (!user) return alert("Login required");

            await supabase.from("reviews").insert({
              movie_id: params.id,
              reaction: selected,
              review: reviewText,
              user_id: user.id,
            });

            const { data } = await supabase
              .from("reviews")
              .select("*")
              .eq("movie_id", params.id)
              .order("created_at", { ascending: false });

            setReviews(data || []);
            setReviewText("");
          }}
          className="mt-4 bg-white text-black px-5 py-2 rounded-full"
        >
          Post Review
        </button>
      </div>

      {/* 🔥 REVIEW FEED */}
      <div className="px-10 pb-20 max-w-2xl mx-auto space-y-6">
        {reviews.map((r, i) => {
          const name = r.user_id?.slice(0, 6) || "User";

          return (
            <div key={i} className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  {name[0]}
                </div>

                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-zinc-400">
                    {timeAgo(r.created_at)}
                  </p>
                </div>

                <span className="ml-auto text-xs bg-yellow-400 text-black px-3 py-1 rounded-full">
                  {r.reaction}
                </span>
              </div>

              <p className="text-zinc-300 text-sm">{r.review}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}