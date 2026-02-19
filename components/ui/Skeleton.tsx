export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 animate-pulse">
      <div className="w-10 h-10 bg-slate-100 rounded-lg mb-4" />
      <div className="h-7 w-20 bg-slate-100 rounded mb-2" />
      <div className="h-4 w-28 bg-slate-50 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="h-5 w-40 bg-slate-100 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`flex items-center gap-4 px-6 py-4 ${i < rows - 1 ? "border-b border-slate-50" : ""}`}>
          <div className="w-2 h-2 bg-slate-100 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-slate-100 rounded" />
            <div className="h-3 w-32 bg-slate-50 rounded" />
          </div>
          <div className="h-4 w-16 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-56 bg-slate-100 rounded mb-2" />
          <div className="h-4 w-72 bg-slate-50 rounded" />
        </div>
        <div className="h-10 w-32 bg-slate-100 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <SkeletonTable />
    </div>
  );
}
