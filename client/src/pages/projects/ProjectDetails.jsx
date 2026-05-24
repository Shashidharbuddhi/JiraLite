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
    <PageTransition className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200">
        <FiArrowLeft className="h-3.5 w-3.5" />
        Back to projects
      </Link>
      <Card hover={false} className="p-5">
        <h1 className="font-heading text-2xl font-bold text-slate-900">{currentProject.title}</h1>
        <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-400">{currentProject.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
          <FiCalendar className="h-3.5 w-3.5" />
          Deadline {formatDate(getProjectDeadline(currentProject))}
        </span>
      </Card>

      <section>
        <h2 className="font-heading text-base font-semibold text-slate-800 dark:text-slate-200">Project tasks</h2>
        {tasks.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center shadow-card dark:border-[#1e293b] dark:bg-[#111827]">
            <p className="text-[13px] text-slate-400">No tasks have been added to this project yet.</p>
          </div>
        ) : (
          <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
