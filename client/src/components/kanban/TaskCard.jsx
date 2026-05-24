import { motion } from 'framer-motion';
import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import { priorityStyles, statusStyles } from '../../utils/constants';
import Button from '../common/Button';

const TaskCard = ({ task, compact = false, onEdit, onDelete, onDragStart }) => (
  <motion.article
    layout
    whileHover={{ y: -3, scale: 1.015 }}
    whileTap={{ scale: 0.99 }}
    draggable={Boolean(onDragStart)}
    onDragStart={(event) => onDragStart?.(event, task)}
    className="cursor-grab rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/80 active:cursor-grabbing"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold leading-5 text-slate-950">{task.title}</h3>
        {task.description && <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-500">{task.description}</p>}
      </div>
      {!compact && (
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => onEdit?.(task)} aria-label="Edit task">
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button variant="danger" size="icon" className="h-8 w-8 rounded-xl" onClick={() => onDelete?.(task._id)} aria-label="Delete task">
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
        {task.priority}
      </span>
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[task.status] || statusStyles.Todo}`}>
        {task.status}
      </span>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
      <span className="truncate">{task.projectId?.title || 'Project'}</span>
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
          {(task.assignedTo?.name || task.createdBy?.name || 'U').charAt(0).toUpperCase()}
        </span>
        <span className="inline-flex items-center gap-1">
          <FiCalendar className="h-3.5 w-3.5" />
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  </motion.article>
);

export default TaskCard;
