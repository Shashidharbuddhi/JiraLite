import { TASK_STATUSES } from '../../utils/constants';
import TaskColumn from './TaskColumn';

const KanbanBoard = ({ tasks, onDropTask, onEdit, onDelete, onDragStart }) => (
  <div className="grid gap-5 xl:grid-cols-4">
    {TASK_STATUSES.map((status) => (
      <TaskColumn
        key={status}
        status={status}
        tasks={tasks.filter((task) => task.status === status)}
        onDropTask={onDropTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onDragStart={onDragStart}
      />
    ))}
  </div>
);

export default KanbanBoard;
