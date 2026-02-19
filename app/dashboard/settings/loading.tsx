export default function SettingsLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-32 bg-slate-100 rounded mb-2" />
        <div className="h-4 w-56 bg-slate-50 rounded" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="h-5 w-40 bg-slate-100 rounded mb-6" />
          <div className="space-y-4">
            <div>
              <div className="h-3 w-20 bg-slate-50 rounded mb-2" />
              <div className="h-10 w-full bg-slate-50 rounded-xl" />
            </div>
            <div>
              <div className="h-3 w-24 bg-slate-50 rounded mb-2" />
              <div className="h-10 w-full bg-slate-50 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
