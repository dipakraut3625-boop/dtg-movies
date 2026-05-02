"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"auth" | "profile">("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // 🔐 AUTH
  const handleAuth = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setUserId(data.user.id);
      setStep("profile");
    }

    setLoading(false);
  };

  // 🔍 USERNAME CHECK
  const checkUsername = async (name: string) => {
    setUsername(name);

    if (name.length < 3) {
      setUsernameError("Too short");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", name)
      .single();

    if (data) {
      setUsernameError("Username already taken");
    } else {
      setUsernameError("");
    }
  };

  // 🖼 UPLOAD AVATAR
  const uploadAvatar = async () => {
    if (!avatarFile || !userId) return null;

    const filePath = `${userId}/${Date.now()}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile);

    if (error) {
      alert(error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // 👤 SAVE PROFILE
  const handleProfile = async () => {
    if (usernameError) return alert("Fix username");

    const avatarUrl = await uploadAvatar();

    await supabase.from("profiles").upsert({
      id: userId,
      username,
      avatar_url: avatarUrl,
    });

    router.push("/home");
  };

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">

      {/* 🎬 LEFT POSTERS */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 flex gap-4 animate-scroll">

          {[
            "q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            "8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
            "rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
          ].map((img, i) => (
            <img
              key={i}
              src={`https://image.tmdb.org/t/p/w500/${img}`}
              className="w-[200px] h-full object-cover rounded-xl opacity-70"
            />
          ))}

        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
      </div>

      {/* 🧾 RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6">

        <div className="w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-800 shadow-xl transition-all duration-300">

          {/* AUTH STEP */}
          {step === "auth" && (
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-bold mb-6">
                Create your account 🎬
              </h1>

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800"
              />

              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-6 px-4 py-3 rounded-lg bg-zinc-800"
              />

              <button
                onClick={handleAuth}
                className="w-full bg-orange-500 py-3 rounded-lg text-black font-semibold"
              >
                {loading ? "Creating..." : "Continue"}
              </button>
            </div>
          )}

          {/* PROFILE STEP */}
          {step === "profile" && (
            <div className="animate-fadeIn">

              <h1 className="text-2xl font-bold mb-6">
                Setup Profile 👤
              </h1>

              {/* AVATAR PREVIEW */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                  {avatarFile ? (
                    <img
                      src={URL.createObjectURL(avatarFile)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>
              </div>

              <input
                type="file"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="mb-4"
              />

              <input
                placeholder="Username"
                value={username}
                onChange={(e) => checkUsername(e.target.value)}
                className="w-full mb-2 px-4 py-3 rounded-lg bg-zinc-800"
              />

              {usernameError && (
                <p className="text-red-400 text-sm mb-4">
                  {usernameError}
                </p>
              )}

              <button
                onClick={handleProfile}
                className="w-full bg-orange-500 py-3 rounded-lg text-black font-semibold"
              >
                Finish Setup
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 🔥 ANIMATIONS */}
      <style jsx>{`
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        @keyframes scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}