export default function SkeletonCard() {
  return (
    <div className="min-w-[180px] h-[260px] rounded-2xl overflow-hidden bg-zinc-900 animate-pulse relative">

      {/* fake image */}
      <div className="w-full h-full bg-zinc-800" />

      {/* shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent animate-[shimmer_1.5s_infinite]" />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

    </div>
  );
}