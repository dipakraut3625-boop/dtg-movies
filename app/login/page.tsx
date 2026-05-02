"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [mouseY, setMouseY] = useState(0);

  const posters = [
    "r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
    "5P8SmMzSNYikXpxil6BYzJ16611.jpg",
    "fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg",
    "6ELCZlTA5lGUops70hKdB83WJxH.jpg",
    "uXm6Fp1Yp0tXLKzZf8G1x5M9J3X.jpg",
  ];

  const handleAuth = async () => {
  setLoading(true);
  setMessage("");

  try {
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        router.push("/home");
      }

    } else {
      // ✅ validation
      if (username.length < 3) {
        setMessage("Username too short");
        setLoading(false);
        return;
      }

      // ✅ signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else if (data.user) {

        // ✅ insert profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            username: username,
            full_name: username,
            avatar_url: "",
          });

        if (profileError) {
          setMessage("Signup done, but profile error");
        } else {
          setMessage("Check email 📩");
        }
      }
    }

  } catch (err) {
    console.error(err);
    setMessage("Something went wrong");
  }

  setLoading(false);
};

  return (
    <div
      className="h-screen bg-black text-white flex overflow-hidden"
      onMouseMove={(e) => setMouseY(e.clientY)}
    >

      {/* 🎬 LEFT SIDE POSTERS */}
      <div className="w-1/2 hidden md:flex relative overflow-hidden">

        <div
          className="absolute inset-0 flex flex-col gap-6 animate-scroll"
          style={{
            transform: `translateY(${mouseY * 0.02}px)`,
          }}
        >
          {[...posters, ...posters].map((img, i) => (
            <img
              key={i}
              src={`https://image.tmdb.org/t/p/original/${img}`}
              className="
                w-full h-[300px] object-cover rounded-xl
                transition-all duration-500
                hover:scale-110 hover:brightness-110
                hover:shadow-[0_0_40px_rgba(255,115,0,0.5)]
              "
            />
          ))}
        </div>

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black" />
      </div>

      {/* 🎯 RIGHT SIDE LOGIN */}
      <div className="flex-1 flex items-center justify-center relative">

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          className="
            w-full max-w-md p-8
            bg-white/5 backdrop-blur-xl
            border border-white/10
            rounded-2xl
            shadow-[0_0_80px_rgba(255,115,0,0.3)]
          "
        >

          {/* TOGGLE */}
          <div className="flex mb-6 bg-zinc-800 rounded-lg p-1 relative">
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-orange-500 rounded-md transition-all duration-300 ${
                mode === "login" ? "left-1" : "left-1/2"
              }`}
            />
            <button onClick={() => setMode("login")} className="flex-1 py-2 z-10">
              Login
            </button>
            <button onClick={() => setMode("signup")} className="flex-1 py-2 z-10">
              Signup
            </button>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">
            {mode === "login" ? "Welcome Back 🎬" : "Create Account 🎬"}
          </h1>

          {/* FLOATING INPUT */}
          {mode === "signup" && (
            <div className="relative mb-4">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 bg-zinc-900 rounded-xl outline-none"
              />
              <label className="absolute left-4 top-2 text-xs text-zinc-400 peer-focus:text-orange-500">
                Username
              </label>
            </div>
          )}

          <div className="relative mb-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 bg-zinc-900 rounded-xl outline-none"
            />
            <label className="absolute left-4 top-2 text-xs text-zinc-400 peer-focus:text-orange-500">
              Email
            </label>
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 bg-zinc-900 rounded-xl outline-none"
            />
            <label className="absolute left-4 top-2 text-xs text-zinc-400 peer-focus:text-orange-500">
              Password
            </label>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleAuth}
            className="
              w-full py-3 rounded-xl font-semibold text-black
              bg-gradient-to-r from-orange-500 to-orange-600
              hover:scale-[1.05]
              hover:shadow-[0_0_30px_rgba(255,115,0,0.7)]
              transition-all duration-300
            "
          >
            {loading ? "Loading..." : mode === "login" ? "Login" : "Create Account"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-center text-zinc-400">{message}</p>
          )}

        </motion.div>
      </div>
    </div>
  );
}