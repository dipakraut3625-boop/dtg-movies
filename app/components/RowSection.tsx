"use client";

import { useRef, useState } from "react";
import MovieCard from "./MovieCard";

export default function RowSection({ title, movies }: any) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;

    rowRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-10 px-6 relative group overflow-visible">

      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {/* LEFT BUTTON */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
        bg-black/60 px-3 py-6 opacity-0 group-hover:opacity-100"
      >
        ◀
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
        bg-black/60 px-3 py-6 opacity-0 group-hover:opacity-100"
      >
        ▶
      </button>

      {/* MOVIES */}
      <div ref={rowRef} className="flex gap-5 overflow-x-auto overflow-y-visible pb-10 pt-4">
        {movies?.map((movie: any) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isActive={activeId === movie.id}
            setActive={setActiveId}
          />
        ))}
      </div>
    </div>
  );
}