const Skeleton = ({ className = '' }) => <div className={`skeleton-shimmer rounded-2xl bg-slate-200/70 ${className}`} />;

export const StatSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
    <Skeleton className="h-4 w-28" />
    <Skeleton className="mt-5 h-8 w-16" />
    <Skeleton className="mt-5 h-2 w-full" />
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="mt-4 h-4 w-full" />
    <Skeleton className="mt-2 h-4 w-5/6" />
    <Skeleton className="mt-6 h-8 w-32" />
  </div>
);

export default Skeleton;
