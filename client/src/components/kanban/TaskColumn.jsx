import TaskCard from './TaskCard';

const statusDots = {
  Todo: 'bg-slate-400',
  'In Progress': 'bg-blue-500',
  Review: 'bg-violet-500',
  Done: 'bg-emerald-500'
};

const TaskColumn = ({ status, tasks, onDropTask, onEdit, onDelete, onDragStart }) => (
  <section
    onDragOver={(event) => event.preventDefault()}
    onDrop={(event) => onDropTask(event, status)}
    className="flex min-h-[480px] flex-col"
  >
    {/* Column header */}
    <div className="flex items-center gap-2 pb-3 pt-1">
      <span className={`h-2 w-2 rounded-full ${statusDots[status]}`} />
      <h2 className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{status}</h2>
      <span className="text-[12px] font-medium text-slate-400">{tasks.length}</span>
    </div>

    {/* Cards area */}
    <div className="flex flex-1 flex-col gap-2">
      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center dark:border-[#1e293b]">
          <p className="text-[12px] text-slate-400">No tasks</p>
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
