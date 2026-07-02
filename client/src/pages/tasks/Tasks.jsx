import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Input, Select, Textarea } from '../../components/common/FormControls';
import { fetchAdminOverview } from '../../redux/slices/adminSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { createTask, deleteTask, fetchTasks, updateTask } from '../../redux/slices/taskSlice';
import { fetchCurrentWorkspace } from '../../redux/slices/workspaceSlice';
import { PRIORITIES, TASK_STATUSES } from '../../utils/constants';

const initialForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Todo',
  projectId: '',
  assignedTo: '',
  dueDate: ''
};

const Tasks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { workspaces } = useSelector((state) => state.admin);
  const { workspace } = useSelector((state) => state.workspace);
  const { tasks, loading, saving, totalTasks, totalPages, currentPage } = useSelector((state) => state.tasks);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 12
  });
  const [form, setForm] = useState(initialForm);
  const isPlatformAdmin = user?.role === 'platform_admin';
  const isWorkspaceAdmin = user?.role === 'workspace_admin';

  useEffect(() => {
    dispatch(fetchProjects());
    if (isPlatformAdmin) {
      dispatch(fetchAdminOverview());
    }
    if (isWorkspaceAdmin) {
      dispatch(fetchCurrentWorkspace());
    }
  }, [dispatch, isPlatformAdmin, isWorkspaceAdmin]);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  const projectOptions = useMemo(() => projects.map((project) => ({ value: project._id, label: project.title })), [projects]);
  const selectedProject = useMemo(
    () => projects.find((project) => project._id === form.projectId),
    [projects, form.projectId]
  );
  const selectedWorkspace = useMemo(() => {
    if (isPlatformAdmin && selectedProject?.workspaceId) {
      return workspaces.find((item) => item._id === selectedProject.workspaceId);
    }

    return workspace;
  }, [isPlatformAdmin, selectedProject?.workspaceId, workspaces, workspace]);
  const assigneeOptions = useMemo(() => {
    return (selectedWorkspace?.members || []).map((member) => ({
      value: member._id,
      label: `${member.name} (${member.role})`
    }));
  }, [selectedWorkspace?.members]);

  const handleCreate = async (event) => {
    event.preventDefault();
    const result = await dispatch(createTask(form));

    if (createTask.fulfilled.match(result)) {
      toast.success('Task created');
      setForm((current) => ({ ...initialForm, projectId: current.projectId }));
      dispatch(fetchTasks(filters));
      return;
    }

    toast.error(result.payload || 'Unable to create task');
  };

  const handleTaskFieldChange = (id, key, value) => {
    const task = tasks.find((item) => item._id === id);
    if (!task) return;

    dispatch(updateTask({ id, payload: { [key]: value } })).then((result) => {
      if (updateTask.fulfilled.match(result)) toast.success('Task updated');
      else toast.error(result.payload || 'Unable to update task');
    });
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) toast.success('Task deleted');
    else toast.error(result.payload || 'Unable to delete task');
  };

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-[30px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Task Workspace</p>
            <h1 className="mt-3 text-3xl font-bold text-white">Manage sprint work with a cleaner surface</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              This page keeps task CRUD working, but the layout has been rebuilt from scratch around quick filtering, status changes, and task creation.
            </p>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            {totalTasks} tasks across {totalPages} pages
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleCreate} className="glass-panel rounded-[30px] p-6 space-y-4">
          <p className="eyebrow">Create Task</p>
          <Input
            label="Title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Ship role-based onboarding"
          />
          <Textarea
            label="Description"
            rows={4}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Describe the expected outcome"
          />
          <Select
            label="Project"
            value={form.projectId}
            onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value, assignedTo: '' }))}
          >
            <option value="">Select project</option>
            {projectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            label="Assign To"
            value={form.assignedTo}
            onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))}
          >
            <option value="">Unassigned</option>
            {assigneeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Priority"
              value={form.priority}
              onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
            <Select
              label="Status"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
          />
          <Button type="submit" loading={saving}>
            <FiPlus className="h-4 w-4" />
            Add Task
          </Button>
        </form>

        <div className="glass-panel rounded-[30px] p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Search"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, page: 1, search: event.target.value }))}
              placeholder="Search by title"
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, page: 1, status: event.target.value }))}
            >
              <option value="">All statuses</option>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <Select
              label="Priority"
              value={filters.priority}
              onChange={(event) => setFilters((current) => ({ ...current, page: 1, priority: event.target.value }))}
            >
              <option value="">All priorities</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
          </div>

          {loading ? (
            <Loader label="Loading tasks" />
          ) : (
            <div className="mt-6 space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-white">{task.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{task.description || 'No description provided.'}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {task.projectId?.title || 'No project'} • {task.priority}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[280px]">
                      <Select value={task.status} onChange={(event) => handleTaskFieldChange(task._id, 'status', event.target.value)}>
                        {TASK_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                      <Select value={task.priority} onChange={(event) => handleTaskFieldChange(task._id, 'priority', event.target.value)}>
                        {PRIORITIES.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </Select>
                      <div className="flex items-center rounded-2xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                        Live update
                      </div>
                      <Button variant="danger" onClick={() => handleDelete(task._id)}>
                        <FiTrash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {!tasks.length && <p className="text-sm text-slate-400">No tasks match the current filters.</p>}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              disabled={currentPage <= 1}
              onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
            >
              Previous
            </Button>
            <p className="text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </p>
            <Button
              variant="secondary"
              disabled={currentPage >= totalPages}
              onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tasks;
