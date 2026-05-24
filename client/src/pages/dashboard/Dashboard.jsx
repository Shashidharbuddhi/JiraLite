import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiClock, FiFolder, FiList } from 'react-icons/fi';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import StatsCard from '../../components/dashboard/StatsCard';
import Loader from '../../components/common/Loader';
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

  if (projectsLoading && tasksLoading) return <Loader label="Loading dashboard" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">A quick pulse on projects, work in motion, and recent changes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Projects" value={projects.length} icon={FiFolder} tone="blue" />
        <StatsCard title="Total Tasks" value={tasks.length} icon={FiList} tone="slate" />
        <StatsCard title="Completed Tasks" value={completed} icon={FiCheckCircle} tone="green" />
        <StatsCard title="Pending Tasks" value={pending} icon={FiClock} tone="amber" />
      </div>

      <ActivityFeed activities={activity} loading={activityLoading} />
    </div>
  );
};

export default Dashboard;
