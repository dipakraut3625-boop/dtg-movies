"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";

export default function AuthWrapper() {
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setShowAuth(true);
      }
    };

    checkUser();

    // 🔥 listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setShowAuth(!session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!showAuth) return null;

  return <AuthModal onClose={() => setShowAuth(false)} />;
}