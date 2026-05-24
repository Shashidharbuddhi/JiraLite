import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import PageTransition from '../../components/common/PageTransition';
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
    <PageTransition className="space-y-8">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
        <FiArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>
      <Card hover={false} className="p-6">
        <h1 className="text-3xl font-bold text-slate-950">{currentProject.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{currentProject.description}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
          <FiCalendar className="h-4 w-4" />
          Deadline {formatDate(getProjectDeadline(currentProject))}
        </div>
      </Card>

      <section>
        <h2 className="text-xl font-semibold text-slate-950">Project tasks</h2>
        {tasks.length === 0 ? (
          <Card hover={false} className="mt-4 border-dashed p-10 text-center text-sm text-slate-500">
            No tasks have been added to this project.
          </Card>
        ) : (
          <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} compact />
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default ProjectDetails;
