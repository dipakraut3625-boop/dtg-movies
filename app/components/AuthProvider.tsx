"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";

export default function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    check();
  }, []);

  return (
    <>
      {!user && <AuthModal onClose={() => {}} />}
      {children}
    </>
  );
}