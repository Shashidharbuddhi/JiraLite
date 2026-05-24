import { FiActivity } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import Skeleton from '../common/Skeleton';

const ActivityFeed = ({ activities = [], loading = false }) => (
  <Card hover={false} className="overflow-hidden">
    <div className="border-b border-slate-100 px-6 py-5">
      <h2 className="text-xl font-semibold text-slate-950">Activity timeline</h2>
      <p className="mt-1 text-sm text-slate-500">Recent changes across your workspace.</p>
    </div>
    {loading ? (
      <div className="space-y-4 px-6 py-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    ) : activities.length === 0 ? (
      <div className="px-6 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <FiActivity className="h-7 w-7" />
        </div>
        <p className="mt-4 text-lg font-medium text-slate-900">No activity yet</p>
        <p className="mt-1 text-sm text-slate-500">Task movement and project updates will appear here.</p>
      </div>
    ) : (
      <div className="px-6 py-5">
        {activities.slice(0, 8).map((activity) => (
          <div key={activity._id} className="relative flex gap-4 pb-5 last:pb-0">
            <div className="absolute left-4 top-8 h-full w-px bg-slate-100 last:hidden" />
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25">
              <FiActivity className="h-4 w-4" />
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-800">{activity.action}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDate(activity.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default ActivityFeed;
