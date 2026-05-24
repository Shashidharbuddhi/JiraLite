import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiClock, FiFolder, FiList } from 'react-icons/fi';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import StatsCard from '../../components/dashboard/StatsCard';
import Card from '../../components/common/Card';
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

  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const loading = projectsLoading && tasksLoading;

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">A polished pulse on projects, work in motion, and recent changes.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

      <Card hover={false} className="overflow-hidden p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Productivity insight</h2>
            <p className="mt-2 text-sm text-slate-600">
              You completed <span className="font-semibold text-slate-950">{completionRate}%</span> of visible sprint tasks.
            </p>
          </div>
          <div className="w-full lg:max-w-md">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Progress</span>
              <span>{completionRate}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all duration-700" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>
      </Card>

      <ActivityFeed activities={activity} loading={activityLoading} />
    </PageTransition>
  );
};

export default Dashboard;
