import { useState, useEffect, useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import TaskColumn from "./TaskColumn";
import TaskForm from "../TaskForm";
import ActivityLog from "./ActivityLog";
import { AuthContext } from "../context/AuthContext";

const initialData = {
  todo: [],
  doing: [],
  done: [],
};

function TaskBoard() {
  const { logout } = useContext(AuthContext);

  const [board, setBoard] = useState(() => {
    const stored = localStorage.getItem("board");
    return stored ? JSON.parse(stored) : initialData;
  });

  const [logs, setLogs] = useState(() => {
    const stored = localStorage.getItem("logs");
    return stored ? JSON.parse(stored) : [];
  });

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(board));
  }, [board]);

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  const addLog = (text) => {
    setLogs((prev) => [
      { id: uuidv4(), text, time: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  const addTask = (task) => {
    const newTask = { ...task, id: uuidv4(), createdAt: new Date() };
    setBoard((prev) => ({
      ...prev,
      todo: [...prev.todo, newTask],
    }));
    addLog("Task created");
  };

  const deleteTask = (columnId, taskId) => {
    setBoard((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((t) => t.id !== taskId),
    }));
    addLog("Task deleted");
  };

  const editTask = (columnId, updatedTask) => {
    setBoard((prev) => ({
      ...prev,
      [columnId]: prev[columnId].map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      ),
    }));
    addLog("Task edited");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;

    const sourceTasks = [...board[sourceCol]];
    const [moved] = sourceTasks.splice(result.source.index, 1);

    const destTasks = [...board[destCol]];
    destTasks.splice(result.destination.index, 0, moved);

    setBoard({
      ...board,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    });

    addLog("Task moved");
  };

  const resetBoard = () => {
    if (window.confirm("Are you sure?")) {
      setBoard(initialData);
      setLogs([]);
      localStorage.removeItem("board");
      localStorage.removeItem("logs");
    }
  };

  const processTasks = (tasks) => {
    let filtered = tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

    if (priorityFilter !== "All") {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    return filtered;
  };

  return (
    <div>
      <h1>Task Board</h1>
      <button onClick={logout}>Logout</button>
      <button onClick={resetBoard}>Reset Board</button>

      <TaskForm onAdd={addTask} />

      <input
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setPriorityFilter(e.target.value)}>
        <option>All</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <select onChange={(e) => setSortOrder(e.target.value)}>
        <option value="none">No Sort</option>
        <option value="asc">Due Date ↑</option>
        <option value="desc">Due Date ↓</option>
      </select>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {["todo", "doing", "done"].map((col) => (
            <TaskColumn
              key={col}
              columnId={col}
              tasks={processTasks(board[col])}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))}
        </div>
      </DragDropContext>

      <ActivityLog logs={logs} />
    </div>
  );
}

export default TaskBoard;
