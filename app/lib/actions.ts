import { supabase } from "./supabase";

export async function addToWatchlist(movie: any) {
  try {
    const { error } = await supabase.from("watchlist").insert([
      {
        movie_id: movie.movie_id,
        title: movie.title,
        poster: movie.poster,
      },
    ]);

    if (error) {
      console.log("Watchlist error:", error.message);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
}


// ✅ LIKE MOVIE
export async function likeMovie(movie: any) {
  try {
    const { error } = await supabase.from("likes").insert([
      {
        movie_id: movie.movie_id,
      },
    ]);

    if (error) {
      console.log("Like error:", error.message);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
}


// ✅ GET WATCHLIST (for your watchlist page)
export async function getWatchlist() {
  const { data, error } = await supabase.from("watchlist").select("*");

  if (error) {
    console.log(error.message);
    return [];
  }

  return data;
}
export async function removeMovie(movie_id: number) {
  try {
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("movie_id", movie_id);

    if (error) {
      console.log("Remove error:", error.message);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
}