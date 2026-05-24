import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiCalendar, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { createProject, deleteProject, fetchProjects, updateProject } from '../../redux/slices/projectSlice';
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
      <div>
        <label className="text-sm font-medium text-slate-700">Project title</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows="4"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Deadline</label>
        <input
          type="date"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          {...register('deadline')}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save project'}
        </button>
      </div>
    </form>
  );
};

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading, saving } = useSelector((state) => state.projects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    [projects]
  );

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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Organize assessment milestones and product work.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <FiPlus className="h-4 w-4" />
          New project
        </button>
      </div>

      {loading ? (
        <Loader label="Loading projects" />
      ) : sortedProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-950">No projects yet</h2>
          <p className="mt-2 text-sm text-slate-500">Create your first project to start planning tasks.</p>
          <button onClick={openCreate} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Create project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedProjects.map((project) => (
            <article key={project._id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <Link to={`/projects/${project._id}`} className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-slate-950 hover:text-blue-700">{project.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{project.description}</p>
                </Link>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => { setEditingProject(project); setModalOpen(true); }} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Edit project">
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700" aria-label="Delete project">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                <FiCalendar className="h-4 w-4" />
                {formatDate(getProjectDeadline(project))}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Edit project' : 'Create project'}>
        <ProjectForm project={editingProject} saving={saving} onCancel={() => setModalOpen(false)} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default Projects;
