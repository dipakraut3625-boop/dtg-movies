"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const UserDataContext = createContext<any>(null);

export function UserDataProvider({ children }: any) {
  const [likes, setLikes] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const [likedRes, savedRes] = await Promise.all([
        supabase
          .from("likes")
          .select("movie_id")
          .eq("user_id", user.id),

        supabase
          .from("watchlist")
          .select("movie_id")
          .eq("user_id", user.id),
      ]);

      if (!mounted) return;

      setLikes(likedRes.data?.map((m) => m.movie_id) || []);
      setWatchlist(savedRes.data?.map((m) => m.movie_id) || []);
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        likes,
        watchlist,
        setLikes,
        setWatchlist,
        loading,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = () => useContext(UserDataContext);