import { motion } from 'framer-motion';
import TaskCard from './TaskCard';

const statusDots = {
  Todo: 'bg-slate-400',
  'In Progress': 'bg-blue-500',
  Review: 'bg-violet-500',
  Done: 'bg-emerald-500'
};

const TaskColumn = ({ status, tasks, onDropTask, onEdit, onDelete, onDragStart }) => (
  <motion.section
    layout
    onDragOver={(event) => event.preventDefault()}
    onDrop={(event) => onDropTask(event, status)}
    className="flex min-h-[520px] flex-col rounded-2xl border border-slate-200 bg-slate-100/70 shadow-sm backdrop-blur-md"
  >
    <div className="sticky top-20 z-10 flex items-center justify-between border-b border-slate-200/80 bg-slate-100/90 px-4 py-4 backdrop-blur-md">
      <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className={`h-2.5 w-2.5 rounded-full ${statusDots[status]}`} />
        {status}
      </h2>
      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{tasks.length}</span>
    </div>
    <div className="flex flex-1 flex-col gap-3 p-3.5">
      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 text-center text-sm text-slate-500">
          Drop tasks here
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} onDragStart={onDragStart} />
        ))
      )}
    </div>
  </motion.section>
);

export default TaskColumn;
