"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);

  const GENRES = [
    "Action", "Drama", "Comedy", "Horror",
    "Sci-Fi", "Romance", "Thriller", "Anime"
  ];

  // 🔥 LOAD PROFILE
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      setProfile(data);
      setName(data?.full_name || "");
      setAvatar(data?.avatar_url || "");
      setBio(data?.bio || "");
      setGenres(data?.favorite_genres || []);
    };

    load();
  }, []);

  // 🎯 AVATAR UPLOAD
  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const filePath = `avatars/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (!error) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatar(data.publicUrl);
    }

    setUploading(false);
  };

  // 💾 SAVE PROFILE
  const updateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("profiles")
      .update({
        full_name: name,
        avatar_url: avatar,
        bio: bio,
        favorite_genres: genres,
      })
      .eq("id", user?.id);

    alert("Profile updated 🚀");
  };

  const toggleGenre = (g: string) => {
    if (genres.includes(g)) {
      setGenres(genres.filter(x => x !== g));
    } else {
      setGenres([...genres, g]);
    }
  };

  return (
    <div className="pt-24 px-6 text-white flex justify-center">

      <div className="w-full max-w-2xl bg-zinc-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Your Profile 🎬
        </h1>

        {/* AVATAR */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatar || "/avatar.png"}
            className="
              w-28 h-28 rounded-full object-cover
              border border-white/20
              shadow-[0_0_30px_rgba(255,115,0,0.4)]
            "
          />

          <label className="mt-3 cursor-pointer text-sm text-orange-400 hover:underline">
            {uploading ? "Uploading..." : "Change Photo"}
            <input type="file" hidden onChange={handleUpload} />
          </label>
        </div>

        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full mb-4 p-3 bg-zinc-800 rounded-xl outline-none"
        />

        {/* BIO */}
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell about your movie taste..."
          className="w-full mb-4 p-3 bg-zinc-800 rounded-xl outline-none"
        />

        {/* GENRES */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-zinc-400">Favorite Genres</p>

          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`
                  px-3 py-1 rounded-full text-sm
                  border transition
                  ${
                    genres.includes(g)
                      ? "bg-orange-500 text-black border-orange-500"
                      : "border-white/20 hover:border-orange-400"
                  }
                `}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* SAVE */}
        <button
          onClick={updateProfile}
          className="
            w-full py-3 rounded-xl font-semibold text-black
            bg-gradient-to-r from-orange-500 to-orange-600
            hover:scale-[1.03]
            transition
          "
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}