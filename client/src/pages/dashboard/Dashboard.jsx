import { useEffect } from 'react';
import { FiActivity, FiArrowUpRight, FiBriefcase, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchActivity, fetchTasks } from '../../redux/slices/taskSlice';
import { formatDate } from '../../utils/formatters';
import AdminConsole from '../admin/AdminConsole';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects, loading: projectLoading } = useSelector((state) => state.projects);
  const { tasks, activity, loading: taskLoading, activityLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (user?.role === 'platform_admin') {
      return;
    }
    dispatch(fetchProjects());
    dispatch(fetchTasks({ limit: 6 }));
    dispatch(fetchActivity());
  }, [dispatch, user?.role]);

  if (user?.role === 'platform_admin') {
    return <AdminConsole />;
  }

  if (projectLoading && taskLoading) {
    return <Loader label="Loading your workspace overview" />;
  }

  const doneTasks = tasks.filter((task) => task.status === 'Done').length;
  const inFlightTasks = tasks.filter((task) => task.status === 'In Progress').length;
  const reviewTasks = tasks.filter((task) => task.status === 'Review').length;

  const metrics = [
    { label: 'Projects', value: projects.length, icon: FiBriefcase, tone: 'text-cyan-300' },
    { label: 'Tasks In Progress', value: inFlightTasks, icon: FiClock, tone: 'text-amber-300' },
    { label: 'Tasks In Review', value: reviewTasks, icon: FiActivity, tone: 'text-violet-300' },
    { label: 'Completed', value: doneTasks, icon: FiCheckCircle, tone: 'text-emerald-300' }
  ];

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-[30px] p-6 sm:p-8">
        <p className="eyebrow">Overview</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white text-balance">
              {user?.role === 'platform_admin' ? 'Platform control cockpit' : 'Your delivery workspace at a glance'}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              The frontend has been rebuilt around a more product-like command center. From here you can review project health, current workload, and the latest activity without the old dashboard framing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/projects">
              <Button variant="primary">
                Open Projects
                <FiArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tasks">
              <Button variant="secondary">Review Tasks</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-tile">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">{metric.label}</p>
              <metric.icon className={`h-5 w-5 ${metric.tone}`} />
            </div>
            <p className="mt-6 text-4xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[30px] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Recent Projects</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Active workstreams</h2>
            </div>
            <Link to="/projects" className="text-sm font-semibold text-cyan-300">
              See all
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {projects.slice(0, 4).map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="block rounded-[24px] border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{project.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{project.description}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {project.members?.length || 0} members
                  </span>
                </div>
              </Link>
            ))}

            {!projects.length && <p className="text-sm text-slate-400">No projects yet. Create one from the Projects page.</p>}
          </div>
        </div>

        <div className="glass-panel rounded-[30px] p-6">
          <p className="eyebrow">Activity Feed</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Latest activity</h2>

          {activityLoading ? (
            <Loader label="Loading activity" />
          ) : (
            <div className="mt-6 space-y-3">
              {activity.slice(0, 6).map((item) => (
                <div key={item._id} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-slate-100">{item.action}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
              ))}
              {!activity.length && <p className="text-sm text-slate-400">Activity will appear here once tasks start moving.</p>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
