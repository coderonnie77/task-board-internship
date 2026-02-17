import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

function TaskColumn({ columnId, tasks, onDelete, onEdit }) {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <h3>{columnId.toUpperCase()}</h3>

          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              columnId={columnId}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TaskColumn;
