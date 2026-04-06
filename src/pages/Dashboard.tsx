import { useEffect, useState } from "react";
import { getTasks } from "../api/tasks";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { socket, connectSocket } from "../socket/socket";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Filters
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getTasks({
        status,
        assignedTo,
      });

      setTasks(res.data.data);
    } catch (err: any) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    connectSocket();

    socket.on("taskCreated", fetchTasks);
    socket.on("taskUpdated", fetchTasks);
    socket.on("taskDeleted", fetchTasks);

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [status, assignedTo]); // ✅ refetch on filter change

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Task Dashboard
      </h1>

      {/* 🔍 FILTERS */}
      <div className="flex gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          placeholder="Filter by User ID"
          className="border p-2 rounded"
          value={assignedTo}
          onChange={(e) =>
            setAssignedTo(e.target.value)
          }
        />
      </div>

      <TaskForm onSuccess={fetchTasks} />

      {/* ⚠️ ERROR */}
      {error && (
        <p className="text-red-500 mb-2">{error}</p>
      )}

      {/* ⏳ LOADING */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                refresh={fetchTasks}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}