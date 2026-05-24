import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiClock, FiFolder, FiList } from 'react-icons/fi';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import StatsCard from '../../components/dashboard/StatsCard';
import PageTransition from '../../components/common/PageTransition';
import { StatSkeleton } from '../../components/common/Skeleton';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchActivity, fetchTasks } from '../../redux/slices/taskSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { tasks, loading: tasksLoading, activity, activityLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks({ limit: 100 }));
    dispatch(fetchActivity());
  }, [dispatch]);

  const completed = tasks.filter((task) => task.status === 'Done').length;
  const pending = tasks.length - completed;
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length;

  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const loading = projectsLoading && tasksLoading;

  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-[13px] text-slate-400">A pulse on projects, work in motion, and recent changes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          [1, 2, 3, 4].map((item) => <StatSkeleton key={item} />)
        ) : (
          <>
            <StatsCard title="Total Projects" value={projects.length} icon={FiFolder} tone="blue" />
            <StatsCard title="Total Tasks" value={tasks.length} icon={FiList} tone="slate" />
            <StatsCard title="Completed" value={completed} icon={FiCheckCircle} tone="green" />
            <StatsCard title="Pending" value={pending} icon={FiClock} tone="amber" />
          </>
        )}
      </div>

      {/* Productivity insight */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-[#1e293b] dark:bg-[#111827]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-base font-semibold text-slate-900">Productivity insight</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              <span className="font-semibold text-slate-900">{completionRate}%</span> of sprint tasks completed
              {inProgress > 0 && <> · <span className="font-medium text-blue-600">{inProgress}</span> in progress</>}
            </p>
          </div>
          <div className="w-full lg:max-w-sm">
            <div className="flex justify-between text-[11px] font-medium text-slate-400">
              <span>Progress</span>
              <span>{completionRate}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#18181b]">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <ActivityFeed activities={activity} loading={activityLoading} />
    </PageTransition>
  );
};

export default Dashboard;
