import { Draggable } from "react-beautiful-dnd";

function TaskCard({ task, index, columnId, onDelete }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: 10,
            margin: 10,
            border: "1px solid gray",
            ...provided.draggableProps.style,
          }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Due: {task.dueDate}</p>

          <button onClick={() => onDelete(columnId, task.id)}>
            Delete
          </button>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
