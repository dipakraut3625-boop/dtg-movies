export default function Sidebar() {
  const movies = [
    {
      title: "Avengers",
      interest: "30K",
      poster: "https://image.tmdb.org/t/p/w200/6ELCZlTA5lGUops70hKdB83WJxH.jpg",
    },
    {
      title: "Dune",
      interest: "25K",
      poster: "https://image.tmdb.org/t/p/w200/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    },
    {
      title: "Batman",
      interest: "20K",
      poster: "https://image.tmdb.org/t/p/w200/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 rounded-2xl shadow-lg border border-zinc-800 hover:shadow-orange-500/10">

      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
        🔥 Most Interested
      </h2>

      <div className="space-y-4">
        {movies.map((movie, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition"
          >
            {/* Rank */}
            <span className="text-xl font-bold text-zinc-400 w-6">
              {i + 1}
            </span>

            {/* Poster */}
            <img
              src={movie.poster}
              className="w-10 h-14 rounded-md object-cover"
            />

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium">{movie.title}</p>
              <p className="text-xs text-orange-400">
                {movie.interest} interested
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}