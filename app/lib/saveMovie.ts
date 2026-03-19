import { supabase } from "./supabase";

export const saveMovieToDB = async (movie: any) => {
  // 1. Check if movie exists
  const { data: existing } = await supabase
    .from("movies")
    .select("*")
    .eq("tmdb_id", movie.id)
    .single();

  if (existing) {
    return existing.id; // return DB UUID
  }

  // 2. Insert new movie
  const { data: newMovie, error } = await supabase
    .from("movies")
    .insert({
      tmdb_id: movie.id,
      title: movie.title,
      poster_url: movie.poster_path,
      release_date: movie.release_date,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return newMovie.id;
};