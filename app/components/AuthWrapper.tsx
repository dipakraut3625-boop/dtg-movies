"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      // 🔒 NOT LOGGED IN
      if (!user && pathname !== "/login") {
        router.replace("/login");
      }

      // 🔓 LOGGED IN
      if (user && pathname === "/login") {
        router.replace("/");
      }

      setLoading(false);
    };

    check();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.replace("/login");
        } else {
          router.replace("/");
        }
      }
    );

    return () => sub.subscription.unsubscribe();
  }, [pathname]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return null;
}