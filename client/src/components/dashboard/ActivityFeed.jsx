import { FiActivity } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import Loader from '../common/Loader';

const ActivityFeed = ({ activities = [], loading = false }) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <h2 className="text-base font-semibold text-slate-950">Recent activity</h2>
    </div>
    {loading ? (
      <Loader label="Loading activity" />
    ) : activities.length === 0 ? (
      <div className="px-5 py-10 text-center">
        <FiActivity className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-700">No activity yet</p>
      </div>
    ) : (
      <div className="divide-y divide-slate-100">
        {activities.slice(0, 8).map((activity) => (
          <div key={activity._id} className="flex gap-3 px-5 py-4">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
            <div>
              <p className="text-sm text-slate-800">{activity.action}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDate(activity.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

export default ActivityFeed;
