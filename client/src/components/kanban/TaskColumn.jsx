import TaskCard from './TaskCard';

const TaskColumn = ({ status, tasks, onDropTask, onEdit, onDelete, onDragStart }) => (
  <section
    onDragOver={(event) => event.preventDefault()}
    onDrop={(event) => onDropTask(event, status)}
    className="flex min-h-[420px] flex-col rounded-lg border border-slate-200 bg-slate-100/70"
  >
    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <h2 className="text-sm font-semibold text-slate-800">{status}</h2>
      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{tasks.length}</span>
    </div>
    <div className="flex flex-1 flex-col gap-3 p-3">
      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 p-4 text-center text-sm text-slate-500">
          Drop tasks here
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} onDragStart={onDragStart} />
        ))
      )}
    </div>
  </section>
);

export default TaskColumn;
