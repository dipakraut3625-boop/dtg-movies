export default function Loading() {
    
  return (
    <div className="bg-black text-white min-h-screen p-10 animate-pulse">

      {/* HERO */}
      <div className="h-[60vh] bg-zinc-800 rounded-xl mb-10" />

      <div className="flex gap-8">
        
        {/* POSTER */}
        <div className="w-[200px] h-[300px] bg-zinc-800 rounded-xl" />

        {/* TEXT */}
        <div className="flex-1 space-y-4">
          <div className="h-6 w-1/2 bg-zinc-700 rounded" />
          <div className="h-4 w-1/3 bg-zinc-700 rounded" />
          <div className="h-4 w-full bg-zinc-700 rounded" />
          <div className="h-4 w-5/6 bg-zinc-700 rounded" />
        </div>

      </div>

    </div>
  );
}