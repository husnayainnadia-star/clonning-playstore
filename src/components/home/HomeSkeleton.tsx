export default function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Banner skeleton */}
      <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-2xl mb-8" />

      {/* Categories skeleton */}
      <div className="mb-8">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
              <div className="h-3 w-14 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Apps section skeleton */}
      {[1, 2, 3].map((s) => (
        <div key={s} className="mb-8">
          <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[120px]">
                <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-2" />
                <div className="h-3 w-full bg-gray-200 rounded mb-1" />
                <div className="h-2.5 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
