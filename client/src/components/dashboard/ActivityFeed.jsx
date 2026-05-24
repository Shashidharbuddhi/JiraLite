import { FiActivity } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import Skeleton from '../common/Skeleton';

const ActivityFeed = ({ activities = [], loading = false }) => (
  <div className="rounded-xl border border-slate-200 bg-white shadow-card dark:border-[#1e293b] dark:bg-[#111827]">
    <div className="border-b border-slate-100 px-5 py-4 dark:border-[#1e293b]">
      <h2 className="font-heading text-base font-semibold text-slate-900">Activity timeline</h2>
      <p className="mt-0.5 text-[12px] text-slate-400">Recent changes across your workspace.</p>
    </div>
    {loading ? (
      <div className="space-y-4 px-5 py-5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    ) : activities.length === 0 ? (
      <div className="px-5 py-12 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#18181b]">
          <FiActivity className="h-5 w-5 text-slate-400" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">No activity yet</p>
        <p className="mt-1 text-[12px] text-slate-400">Task movement and project updates will appear here.</p>
      </div>
    ) : (
      <div className="px-5 py-4">
        {activities.slice(0, 8).map((activity, index) => (
          <div key={activity._id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < Math.min(activities.length, 8) - 1 && (
              <div className="absolute left-3 top-6 h-[calc(100%-8px)] w-px bg-slate-100 dark:bg-[#1e293b]" />
            )}
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-[#18181b]">
              <FiActivity className="h-3 w-3 text-slate-500" />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{activity.action}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{formatDate(activity.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ActivityFeed;
