"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  const search = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${query}%`);

    setUsers(data || []);
  };

  return (
    <div className="p-6 pt-24">

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded"
      />

      <button onClick={search} className="ml-2">
        Search
      </button>

      <div className="mt-6 space-y-2">
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => router.push(`/profile/${u.id}`)}
            className="p-3 bg-zinc-800 rounded cursor-pointer"
          >
            {u.username}
          </div>
        ))}
      </div>

    </div>
  );
}