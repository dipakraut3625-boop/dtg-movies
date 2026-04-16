import { supabase } from "./supabase";

export const createProfile = async (user: any) => {
  await supabase.from("profiles").insert({
    id: user.id,
    name: user.user_metadata?.name,
  });
};