"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function FollowButton({ targetUserId }: any) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .maybeSingle();

      setIsFollowing(!!data);
    };

    load();
  }, [targetUserId]);

  const toggleFollow = async () => {
    if (!user) return alert("Login required");

    setIsFollowing(!isFollowing);

    if (!isFollowing) {
      await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: targetUserId,
      });
    } else {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      className={`px-4 py-1 rounded ${
        isFollowing
          ? "bg-zinc-700 text-white"
          : "bg-orange-500 text-black"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}