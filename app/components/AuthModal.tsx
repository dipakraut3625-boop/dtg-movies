"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthModal({ onClose }: any) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔐 SIGNUP
  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    setLoading(false);

    if (error) return alert(error.message);

    alert("Account created 🚀 Now login");
    setMode("login");
  };

  // 🔐 LOGIN
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN:", data, error);

    setLoading(false);

    if (error) return alert("Invalid email or password ❌");

    // ✅ FORCE RELOAD (stable fix)
    setTimeout(() => {
      onClose();
      window.location.href = "/login";
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
      <div className="relative w-[360px] p-8 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl">

        <h2 className="text-xl font-bold text-center mb-6 text-white">
          {mode === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* FORM */}
        <form onSubmit={mode === "login" ? handleLogin : handleSignup}>

          {mode === "signup" && (
            <input
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-3 rounded-lg bg-black border border-zinc-700 text-white"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-3 rounded-lg bg-black border border-zinc-700 text-white"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-5 p-3 rounded-lg bg-black border border-zinc-700 text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:scale-105 transition"
          >
            {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* SWITCH */}
        <p
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
          className="text-center text-sm text-zinc-400 mt-5 cursor-pointer hover:text-white"
        >
          {mode === "login"
            ? "Don't have account? Sign Up"
            : "Already have account? Login"}
        </p>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}