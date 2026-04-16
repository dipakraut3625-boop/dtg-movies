"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);

  // ✅ AUTH LISTENER (FIXED)
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // 🔍 SEARCH STATE
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);

    if (!q) {
      setResults([]);
      return;
    }

    setLoading(true);

    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${q}`
    );

    const data = await res.json();

    setResults(
      (data.results || []).filter(
        (item: any) => item.media_type === "movie"
      )
    );

    setLoading(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-800 h-16">
        <div className="flex items-center justify-between px-6 h-full">

          {/* LOGO */}
          <h1
            onClick={() => router.push("/")}
            className="text-xl font-bold cursor-pointer"
          >
            <span className="text-orange-500">DTG</span>
            <span className="text-white">Movies</span> 🎬
          </h1>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

            {/* NAV */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">

              <button
                onClick={() => router.push("/")}
                className={pathname === "/" ? "text-white border-b-2 border-orange-500 pb-1" : "text-zinc-400 hover:text-white"}
              >
                🎬 Explore
              </button>

              <button
                onClick={() => router.push("/watchlist")}
                className={pathname === "/watchlist" ? "text-white border-b-2 border-orange-500 pb-1" : "text-zinc-400 hover:text-white"}
              >
                📁 Watchlist
              </button>

              <button
                onClick={() => router.push("/liked")}
                className={pathname === "/liked" ? "text-white border-b-2 border-orange-500 pb-1" : "text-zinc-400 hover:text-white"}
              >
                ❤️ Liked
              </button>

            </div>

            {/* SEARCH */}
            <button onClick={() => setOpen(true)}>🔍</button>

            {/* USER */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {user.user_metadata?.name || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <span className="text-zinc-400">Login</span>
            )}

          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center pt-32">

          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            ✕
          </button>

          <input
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search movies..."
            className="w-full max-w-2xl px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-xl"
          />

          {loading && <p className="mt-4">Searching...</p>}

          <div className="mt-6 w-full max-w-2xl space-y-2">
            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setOpen(false);
                  router.push(`/movie/${item.id}`);
                }}
                className="p-3 bg-zinc-800 rounded cursor-pointer"
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}