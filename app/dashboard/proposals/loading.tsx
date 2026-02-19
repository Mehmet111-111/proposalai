import { SkeletonTable } from "@/components/ui/Skeleton";

export default function ProposalsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-40 bg-slate-100 rounded mb-2" />
          <div className="h-4 w-56 bg-slate-50 rounded" />
        </div>
        <div className="h-10 w-36 bg-slate-100 rounded-lg" />
      </div>
      <SkeletonTable rows={6} />
    </div>
  );
}
