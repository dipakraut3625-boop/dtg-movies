"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);

  // 🔥 USER + PROFILE + LIVE UPDATE
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(data);
      }
    };

    load();

    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          setProfile(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔥 SCROLL HIDE
  useEffect(() => {
    let last = window.scrollY;

    const handle = () => {
      const cur = window.scrollY;
      setShow(!(cur > last && cur > 80));
      last = cur;
    };

    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className={`fixed top-0 w-full z-50 transition ${show ? "" : "-translate-y-full"}`}>
      <div className="flex justify-between items-center px-8 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10">

        {/* LOGO */}
        <h1
          onClick={() => router.push("/home")}
          className="text-xl font-bold cursor-pointer bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
        >
          DTG<span className="text-white">Movies</span>
        </h1>

        {/* NAV */}
        <div className="flex items-center gap-6 text-sm">

          <span onClick={() => router.push("/home")} className="cursor-pointer hover:text-orange-400">
            Explore
          </span>

          <span onClick={() => router.push("/watchlist")} className="cursor-pointer hover:text-orange-400">
            Watchlist
          </span>

          <span onClick={() => router.push("/liked")} className="cursor-pointer hover:text-orange-400">
            Liked
          </span>

          {/* SEARCH */}
          <div onClick={() => router.push("/search")} className="cursor-pointer p-2 hover:bg-white/10 rounded-full">
            🔍
          </div>

          {/* AVATAR */}
          {user && (
            <div className="relative">
              <img
                src={profile?.avatar_url || "/avatar.png"}
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition"
              />

              {open && (
                <div className="absolute right-0 mt-3 w-52 bg-zinc-900 rounded-xl shadow-xl">
                  <div className="px-4 py-3 text-xs text-zinc-400 border-b border-white/10">
                    {user.email}
                  </div>

                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full text-left px-4 py-3 hover:bg-white/10"
                  >
                    Profile
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}