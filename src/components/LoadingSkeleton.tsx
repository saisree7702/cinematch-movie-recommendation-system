export default function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-cin-card border border-cin-border animate-pulse">
          <div className="aspect-[2/3] bg-cin-border" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-cin-border rounded w-3/4" />
            <div className="h-3 bg-cin-border rounded w-1/2" />
            <div className="h-3 bg-cin-border rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
