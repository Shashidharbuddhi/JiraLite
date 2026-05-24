import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiCheckSquare, FiPlus, FiSearch } from 'react-icons/fi';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PageTransition from '../../components/common/PageTransition';
import { CardSkeleton } from '../../components/common/Skeleton';
import { Input, Select, Textarea, fieldClass } from '../../components/common/FormControls';
import { createTask, deleteTask, fetchTasks, updateTask } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { PRIORITIES, TASK_STATUSES } from '../../utils/constants';
import { toInputDate } from '../../utils/formatters';

const TaskForm = ({ task, projects, saving, onCancel, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'Medium',
      status: task?.status || 'Todo',
      projectId: task?.projectId?._id || task?.projectId || projects[0]?._id || '',
      dueDate: toInputDate(task?.dueDate)
    }
  });

  useEffect(() => {
    reset({
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'Medium',
      status: task?.status || 'Todo',
      projectId: task?.projectId?._id || task?.projectId || projects[0]?._id || '',
      dueDate: toInputDate(task?.dueDate)
    });
  }, [projects, reset, task]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Task title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
      <Textarea label="Description" rows="3" {...register('description')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Project" error={errors.projectId?.message} {...register('projectId', { required: 'Project is required' })}>
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>{project.title}</option>
            ))}
        </Select>
        <Input label="Due date" type="date" {...register('dueDate')} />
        <Select label="Priority" {...register('priority')}>
            {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
        </Select>
        <Select label="Status" {...register('status')}>
            {TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </Select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={saving}>Save task</Button>
      </div>
    </form>
  );
};

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, saving } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const [filters, setFilters] = useState({ search: '', priority: '', status: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const query = useMemo(() => {
    const params = { limit: 100 };
    if (filters.search) params.search = filters.search;
    if (filters.priority) params.priority = filters.priority;
    if (filters.status) params.status = filters.status;
    return params;
  }, [filters]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    const timer = window.setTimeout(() => dispatch(fetchTasks(query)), 250);
    return () => window.clearTimeout(timer);
  }, [dispatch, query]);

  const openCreate = () => {
    if (projects.length === 0) {
      toast.error('Create a project before adding tasks');
      return;
    }
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const action = editingTask ? updateTask({ id: editingTask._id, payload: values }) : createTask(values);
    const result = await dispatch(action);

    if (createTask.fulfilled.match(result) || updateTask.fulfilled.match(result)) {
      toast.success(editingTask ? 'Task updated' : 'Task created');
      setModalOpen(false);
      dispatch(fetchTasks(query));
      return;
    }

    toast.error(result.payload || 'Task save failed');
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) toast.success('Task deleted');
    else toast.error(result.payload || 'Delete failed');
  };

  const handleDropTask = async (event, status) => {
    event.preventDefault();
    if (!draggedTask || draggedTask.status === status) return;

    const result = await dispatch(updateTask({ id: draggedTask._id, payload: { status } }));
    if (updateTask.fulfilled.match(result)) toast.success(`Moved to ${status}`);
    else toast.error(result.payload || 'Status update failed');
    setDraggedTask(null);
  };

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Tasks</h1>
          <p className="mt-2 text-sm text-slate-500">Premium Kanban board with backend-powered filtering and status updates.</p>
        </div>
        <Button onClick={openCreate}>
          <FiPlus className="h-4 w-4" />
          New task
        </Button>
      </div>

      <Card hover={false} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={filters.search} onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))} placeholder="Search tasks" className={`${fieldClass} pl-10`} />
        </div>
        <select value={filters.priority} onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))} className={fieldClass}>
          <option value="">All priorities</option>
          {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
        </select>
        <select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))} className={fieldClass}>
          <option value="">All statuses</option>
          {TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
      </Card>

      {loading ? (
        <div className="grid gap-5 xl:grid-cols-4">
          {[1, 2, 3, 4].map((column) => (
            <Card key={column} hover={false} className="space-y-4 p-4">
              <CardSkeleton />
              <CardSkeleton />
            </Card>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card hover={false} className="border-dashed px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
            <FiCheckSquare className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-950">No tasks found</h2>
          <p className="mt-2 text-sm text-slate-500">Create a task or adjust filters to populate the board.</p>
        </Card>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onDragStart={(_, task) => setDraggedTask(task)}
          onDropTask={handleDropTask}
          onEdit={(task) => { setEditingTask(task); setModalOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Edit task' : 'Create task'}>
        <TaskForm task={editingTask} projects={projects} saving={saving} onCancel={() => setModalOpen(false)} onSubmit={handleSubmit} />
      </Modal>
    </PageTransition>
  );
};

export default Tasks;
