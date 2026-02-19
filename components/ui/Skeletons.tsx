export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-80 bg-slate-100 rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-emerald-100 rounded-lg" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="w-10 h-10 bg-slate-100 rounded-lg" />
            <div className="h-7 w-16 bg-slate-200 rounded mt-4" />
            <div className="h-3 w-24 bg-slate-100 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="h-5 w-36 bg-slate-200 rounded" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-slate-200 rounded-full" />
              <div>
                <div className="h-4 w-48 bg-slate-100 rounded" />
                <div className="h-3 w-24 bg-slate-50 rounded mt-1.5" />
              </div>
            </div>
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProposalsTableSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-32 bg-slate-200 rounded-lg" />
          <div className="h-4 w-56 bg-slate-100 rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-emerald-100 rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-slate-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-3 bg-slate-100 rounded" />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-slate-50 last:border-0">
            <div className="h-4 bg-slate-100 rounded col-span-1" />
            <div className="h-4 bg-slate-50 rounded col-span-1" />
            <div className="h-4 bg-slate-50 rounded col-span-1" />
            <div className="h-4 bg-slate-100 rounded col-span-1" />
            <div className="h-4 bg-slate-50 rounded col-span-1" />
            <div className="h-4 bg-slate-50 rounded col-span-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="w-12 h-12 bg-slate-100 rounded-full mb-4" />
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-48 bg-slate-100 rounded mt-2" />
          <div className="h-3 w-24 bg-slate-50 rounded mt-2" />
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-3 w-12 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
