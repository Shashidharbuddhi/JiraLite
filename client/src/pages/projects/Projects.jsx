import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowRight, FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Input, Select, Textarea } from '../../components/common/FormControls';
import { fetchAdminOverview } from '../../redux/slices/adminSlice';
import { createProject, deleteProject, fetchProjects } from '../../redux/slices/projectSlice';
import { formatDate } from '../../utils/formatters';

const Projects = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { workspaces } = useSelector((state) => state.admin);
  const { projects, loading, saving } = useSelector((state) => state.projects);
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadLine: '',
    workspaceId: ''
  });
  const isPlatformAdmin = user?.role === 'platform_admin';

  useEffect(() => {
    dispatch(fetchProjects());
    if (isPlatformAdmin) {
      dispatch(fetchAdminOverview());
    }
  }, [dispatch, isPlatformAdmin]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    const result = await dispatch(createProject(form));

    if (createProject.fulfilled.match(result)) {
      toast.success('Project created');
      setForm({ title: '', description: '', deadLine: '', workspaceId: '' });
      return;
    }

    toast.error(result.payload || 'Unable to create project');
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteProject(id));
    if (deleteProject.fulfilled.match(result)) toast.success('Project deleted');
    else toast.error(result.payload || 'Unable to delete project');
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="glass-panel rounded-[30px] p-6">
        <p className="eyebrow">Create Project</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Spin up a new workstream</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          This rebuilt projects page focuses on faster workspace creation flows and a cleaner portfolio-style overview of active work.
        </p>

        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          {isPlatformAdmin && (
            <Select label="Workspace" name="workspaceId" value={form.workspaceId} onChange={handleChange}>
              <option value="">Select workspace</option>
              {workspaces.map((workspace) => (
                <option key={workspace._id} value={workspace._id}>
                  {workspace.name}
                </option>
              ))}
            </Select>
          )}
          <Input label="Project Name" name="title" value={form.title} onChange={handleChange} placeholder="Mobile Release 2.1" />
          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="What is this project delivering?"
          />
          <Input label="Deadline" type="date" name="deadLine" value={form.deadLine} onChange={handleChange} />
          <Button type="submit" loading={saving}>
            <FiPlus className="h-4 w-4" />
            Create Project
          </Button>
        </form>
      </section>

      <section className="glass-panel rounded-[30px] p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 className="mt-3 text-3xl font-bold text-white">All workspace projects</h2>
          </div>
          <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            {projects.length} total
          </span>
        </div>

        {loading ? (
          <Loader label="Loading projects" />
        ) : (
          <div className="mt-6 space-y-4">
            {projects.map((project) => (
              <div key={project._id} className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xl font-bold text-white">{project.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <FiCalendar className="h-3.5 w-3.5" />
                        {formatDate(project.deadLine)}
                      </span>
                      <span>{project.members?.length || 0} members</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/projects/${project._id}`}>
                      <Button variant="secondary">
                        View
                        <FiArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="danger" onClick={() => handleDelete(project._id)}>
                      <FiTrash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {!projects.length && <p className="text-sm text-slate-400">No projects yet. Use the create form to start the first one.</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default Projects;
