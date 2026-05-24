import { TASK_STATUSES } from '../../utils/constants';
import TaskColumn from './TaskColumn';

const KanbanBoard = ({ tasks, onDropTask, onEdit, onDelete, onDragStart }) => (
  <div className="-mx-1 overflow-x-auto">
    <div className="grid min-w-[800px] gap-4 px-1 xl:grid-cols-4">
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
  </div>
);

export default KanbanBoard;
