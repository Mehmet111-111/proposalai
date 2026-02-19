export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-36 bg-slate-100 rounded mb-2" />
        <div className="h-4 w-56 bg-slate-50 rounded" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="w-10 h-10 bg-slate-50 rounded-xl mb-3" />
            <div className="h-7 w-20 bg-slate-100 rounded mb-2" />
            <div className="h-3 w-28 bg-slate-50 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 h-72" />
        <div className="bg-white rounded-2xl border border-slate-100 p-6 h-72" />
      </div>
    </div>
  );
}
