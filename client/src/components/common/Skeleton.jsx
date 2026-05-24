const Skeleton = ({ className = '' }) => <div className={`skeleton-shimmer rounded-lg bg-slate-100 ${className}`} />;

export const StatSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-[#1e293b] dark:bg-[#111827]">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="mt-4 h-6 w-14" />
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-[#1e293b] dark:bg-[#111827]">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="mt-3 h-3.5 w-full" />
    <Skeleton className="mt-2 h-3.5 w-5/6" />
    <Skeleton className="mt-5 h-7 w-28" />
  </div>
);

export default Skeleton;
