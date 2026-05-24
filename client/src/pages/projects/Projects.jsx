import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiCalendar, FiEdit2, FiFolder, FiPlus, FiTrash2 } from 'react-icons/fi';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PageTransition from '../../components/common/PageTransition';
import { CardSkeleton } from '../../components/common/Skeleton';
import { Input, Textarea } from '../../components/common/FormControls';
import { createProject, deleteProject, fetchProjects, updateProject } from '../../redux/slices/projectSlice';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { formatDate, getProjectDeadline, toInputDate } from '../../utils/formatters';

const ProjectForm = ({ project, saving, onCancel, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      deadline: toInputDate(getProjectDeadline(project))
    }
  });

  useEffect(() => {
    reset({
      title: project?.title || '',
      description: project?.description || '',
      deadline: toInputDate(getProjectDeadline(project))
    });
  }, [project, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Project title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
      <Textarea label="Description" rows="4" error={errors.description?.message} {...register('description', { required: 'Description is required' })} />
      <Input label="Deadline" type="date" {...register('deadline')} />
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>Save project</Button>
      </div>
    </form>
  );
};

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading, saving } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks({ limit: 100 }));
  }, [dispatch]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    [projects]
  );

  const projectMetrics = (projectId) => {
    const projectTasks = tasks.filter((task) => (task.projectId?._id || task.projectId) === projectId);
    const completed = projectTasks.filter((task) => task.status === 'Done').length;
    const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
    return { count: projectTasks.length, progress };
  };

  const openCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const action = editingProject
      ? updateProject({ id: editingProject._id, payload: values })
      : createProject(values);
    const result = await dispatch(action);

    if (createProject.fulfilled.match(result) || updateProject.fulfilled.match(result)) {
      toast.success(editingProject ? 'Project updated' : 'Project created');
      setModalOpen(false);
      return;
    }

    toast.error(result.payload || 'Project save failed');
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteProject(id));
    if (deleteProject.fulfilled.match(result)) toast.success('Project deleted');
    else toast.error(result.payload || 'Delete failed');
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-[13px] text-slate-400">Organize assessment milestones and product work.</p>
        </div>
        <Button onClick={openCreate}>
          <FiPlus className="h-4 w-4" />
          New project
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => <CardSkeleton key={item} />)}
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-card dark:border-[#1e293b] dark:bg-[#111827]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#18181b]">
            <FiFolder className="h-6 w-6 text-slate-400" />
          </div>
          <h2 className="mt-4 font-heading text-lg font-semibold text-slate-800 dark:text-slate-200">No projects yet</h2>
          <p className="mt-1.5 text-[13px] text-slate-400">Start by creating your first workspace project.</p>
          <Button onClick={openCreate} className="mt-5">
            Create project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedProjects.map((project) => {
            const metrics = projectMetrics(project._id);
            return (
              <Card key={project._id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/projects/${project._id}`} className="min-w-0">
                    <h2 className="truncate text-[15px] font-semibold text-slate-800 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400">{project.title}</h2>
                    <p className="mt-1.5 line-clamp-3 text-[13px] leading-6 text-slate-400">{project.description}</p>
                  </Link>
                  <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 [.group:hover_&]:opacity-100">
                    <button
                      type="button"
                      onClick={() => { setEditingProject(project); setModalOpen(true); }}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.06]"
                      aria-label="Edit project"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project._id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                      aria-label="Delete project"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <FiCalendar className="h-3 w-3" />
                    {formatDate(getProjectDeadline(project))}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">{metrics.count} tasks</span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#18181b]">
                  <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${metrics.progress}%` }} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Edit project' : 'Create project'}>
        <ProjectForm project={editingProject} saving={saving} onCancel={() => setModalOpen(false)} onSubmit={handleSubmit} />
      </Modal>
    </PageTransition>
  );
};

export default Projects;
