import { useState } from "react";
import { updateTask, deleteTask } from "../api/tasks";

export default function TaskCard({ task, refresh }: any) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    setLoading(true);

    try {
      const nextStatus =
        task.status === "pending"
          ? "in-progress"
          : task.status === "in-progress"
          ? "completed"
          : "pending";

      await updateTask(task._id, { status: nextStatus });
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteTask(task._id);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-3 rounded shadow">
      <h2 className="font-semibold">{task.title}</h2>
      <p className="text-sm">Status: {task.status}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleStatusChange}
          disabled={loading}
          className={`px-2 py-1 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          {loading ? "Updating..." : "Update Status"}
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className={`px-2 py-1 rounded text-white ${
            loading ? "bg-gray-400" : "bg-red-500"
          }`}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}