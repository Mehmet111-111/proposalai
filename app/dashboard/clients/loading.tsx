export default function ClientsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-32 bg-slate-100 rounded mb-2" />
          <div className="h-4 w-52 bg-slate-50 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full mb-4" />
            <div className="h-5 w-32 bg-slate-100 rounded mb-2" />
            <div className="h-3 w-40 bg-slate-50 rounded mb-1" />
            <div className="h-3 w-48 bg-slate-50 rounded" />
            <div className="flex gap-4 mt-4 pt-4 border-t border-slate-50">
              <div className="h-3 w-20 bg-slate-50 rounded" />
              <div className="h-3 w-16 bg-slate-50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
