"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* 🔥 NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">

        <div className="flex items-center justify-between px-6 py-3">

          {/* 🎬 LOGO */}
          <h1
            onClick={() => router.push("/")}
            className="text-xl font-bold cursor-pointer tracking-wide"
          >
            <span className="text-orange-500">DTG</span>
            <span className="text-white">Movies</span>
            <span className="ml-1">🎬</span>
          </h1>

          {/* 📂 NAV LINKS */}
          <div className="hidden md:flex gap-8 text-sm text-zinc-300">
            <button onClick={() => router.push("/")}>Explore</button>
            <button onClick={() => router.push("/watchlist")}>Watchlist</button>
            <button>Liked</button>
          </div>

          {/* 🔍 + PROFILE */}
          <div className="flex items-center gap-4">

            {/* SEARCH ICON */}
            <button
              onClick={() => setOpenSearch(true)}
              className="text-zinc-300 hover:text-white text-lg"
            >
              🔍
            </button>

            {/* PROFILE */}
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center cursor-pointer">
              👤
            </div>

          </div>
        </div>
      </header>

      {/* 🔥 SEARCH OVERLAY */}
      <AnimatePresence>
        {openSearch && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-start justify-center pt-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            {/* CLICK OUTSIDE CLOSE */}
            <div
              className="absolute inset-0"
              onClick={() => setOpenSearch(false)}
            />

            {/* SEARCH BOX */}
            <motion.div
              className="relative z-10 w-full max-w-2xl"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >

              <div className="relative">

                {/* INPUT */}
                <input
                  autoFocus
                  onChange={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 600);
                  }}
                  placeholder="Search movies..."
                  className="w-full bg-zinc-900 text-white px-6 py-4 rounded-xl outline-none border border-zinc-700 focus:border-orange-500"
                />

                {/* LOADING ANIMATION */}
                {loading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin">
                    ⏳
                  </div>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}