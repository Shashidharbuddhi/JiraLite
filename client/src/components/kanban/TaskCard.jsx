import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import { priorityStyles, statusStyles } from '../../utils/constants';

const TaskCard = ({ task, compact = false, onEdit, onDelete, onDragStart }) => (
  <article
    draggable={Boolean(onDragStart)}
    onDragStart={(event) => onDragStart?.(event, task)}
    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-slate-950">{task.title}</h3>
        {task.description && <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-500">{task.description}</p>}
      </div>
      {!compact && (
        <div className="flex shrink-0 gap-1">
          <button onClick={() => onEdit?.(task)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Edit task">
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete?.(task._id)} className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700" aria-label="Delete task">
            <FiTrash2 className="h-4 w-4" />
          </button>
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

    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
      <span className="truncate">{task.projectId?.title || 'Project'}</span>
      <span className="inline-flex shrink-0 items-center gap-1">
        <FiCalendar className="h-3.5 w-3.5" />
        {formatDate(task.dueDate)}
      </span>
    </div>
  </article>
);

export default TaskCard;
