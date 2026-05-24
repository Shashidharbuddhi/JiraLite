import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import TaskCard from '../../components/kanban/TaskCard';
import { fetchProjectById } from '../../redux/slices/projectSlice';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { formatDate, getProjectDeadline } from '../../utils/formatters';

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.projects);
  const { tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchTasks({ projectId: id, limit: 100 }));
  }, [dispatch, id]);

  if (!currentProject || loading) return <Loader label="Loading project" />;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
        <FiArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">{currentProject.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{currentProject.description}</p>
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <FiCalendar className="h-4 w-4" />
          Deadline {formatDate(getProjectDeadline(currentProject))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-950">Project tasks</h2>
        {tasks.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No tasks have been added to this project.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectDetails;
