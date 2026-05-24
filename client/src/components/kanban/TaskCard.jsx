import { motion } from 'framer-motion';
import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import { priorityStyles } from '../../utils/constants';

const TaskCard = ({ task, compact = false, onEdit, onDelete, onDragStart }) => (
  <motion.article
    layout
    layoutId={task._id}
    draggable={Boolean(onDragStart)}
    onDragStart={(event) => onDragStart?.(event, task)}
    className="group cursor-grab rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-card transition-all duration-150 hover:-translate-y-px hover:shadow-card-hover active:cursor-grabbing dark:border-[#1e293b] dark:bg-[#18181b] dark:hover:border-slate-600"
  >
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-[13px] font-medium leading-5 text-slate-800 dark:text-slate-200">{task.title}</h3>
      {!compact && (
        <div className="flex shrink-0 gap-0.5">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.06]"
            aria-label="Edit task"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task._id)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            aria-label="Delete task"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>

    {task.description && (
      <p className="mt-1.5 line-clamp-3 text-[12px] leading-[18px] text-slate-400">{task.description}</p>
    )}

    <div className="mt-3 flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
        {task.priority}
      </span>
    </div>

    <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-[#1e293b]">
      <span className="truncate text-[11px] text-slate-400">{task.projectId?.title || 'Project'}</span>
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-500 dark:bg-[#111827]">
          {(task.assignedTo?.name || task.createdBy?.name || 'U').charAt(0).toUpperCase()}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <FiCalendar className="h-3 w-3" />
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  </motion.article>
);

export default TaskCard;
