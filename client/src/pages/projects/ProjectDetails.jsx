import { useEffect } from 'react';
import { FiCalendar, FiCheckSquare, FiUsers } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { fetchProjectById } from '../../redux/slices/projectSlice';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { formatDate } from '../../utils/formatters';

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchTasks({ projectId: id, limit: 50 }));
  }, [dispatch, id]);

  if (loading && !currentProject) {
    return <Loader label="Loading project" />;
  }

  if (!currentProject) {
    return <div className="glass-panel rounded-[30px] p-6 text-sm text-slate-300">Project not found.</div>;
  }

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-[30px] p-6 sm:p-8">
        <p className="eyebrow">Project Detail</p>
        <h1 className="mt-3 text-4xl font-bold text-white">{currentProject.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{currentProject.description}</p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-white/10 px-4 py-2">
            <FiCalendar className="mr-2 inline h-4 w-4" />
            Deadline {formatDate(currentProject.deadLine)}
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">
            <FiUsers className="mr-2 inline h-4 w-4" />
            {currentProject.members?.length || 0} members
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">
            <FiCheckSquare className="mr-2 inline h-4 w-4" />
            {tasks.length} tasks
          </span>
        </div>
      </section>

      <section className="glass-panel rounded-[30px] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Task Snapshot</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Tasks linked to this project</h2>
          </div>
          <Link to="/tasks">
            <Button variant="secondary">Open task board</Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <div key={task._id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-white">{task.title}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{task.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{task.description || 'No description added yet.'}</p>
            </div>
          ))}

          {!tasks.length && <p className="text-sm text-slate-400">No tasks are linked to this project yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
