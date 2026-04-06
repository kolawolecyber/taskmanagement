import { updateTask, deleteTask } from "../api/tasks";

export default function TaskCard({ task, refresh }: any) {
  const handleStatusChange = async () => {
    const nextStatus =
      task.status === "pending"
        ? "in-progress"
        : task.status === "in-progress"
        ? "completed"
        : "pending";

    await updateTask(task._id, { status: nextStatus });
    refresh();
  };

  const handleDelete = async () => {
    await deleteTask(task._id);
    refresh();
  };

  return (
    <div className="border p-3 rounded shadow">
      <h2 className="font-semibold">{task.title}</h2>
      <p className="text-sm">Status: {task.status}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleStatusChange}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Update Status
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}