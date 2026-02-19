import { SkeletonTable, SkeletonCard } from "@/components/ui/Skeleton";

export default function InvoicesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-36 bg-slate-100 rounded mb-2" />
          <div className="h-4 w-52 bg-slate-50 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonTable rows={5} />
    </div>
  );
}
