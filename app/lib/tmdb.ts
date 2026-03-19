const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

export const getTrendingMovies = async () => {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

export const getTopRated = async () => {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

export const getUpcoming = async () => {
  const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

export const searchMovies = async (query: string) => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );
  const data = await res.json();
  return data.results || [];
};