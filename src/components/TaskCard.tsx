import { useState } from "react";
import { updateTask, deleteTask } from "../api/tasks";

// Helper: initials from a name string
function initials(name: string = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Helper: avatar bg color based on name
const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];
function avatarColor(name: string = "") {
  const i = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[i];
}

const statusConfig: Record<string, { label: string; classes: string; dotColor: string }> = {
  pending: {
    label: "Pending",
    classes: "text-amber-700 bg-amber-50 border-amber-200",
    dotColor: "bg-amber-400",
  },
  "in-progress": {
    label: "In Progress",
    classes: "text-blue-700 bg-blue-50 border-blue-200",
    dotColor: "bg-blue-400",
  },
  completed: {
    label: "Completed",
    classes: "text-emerald-700 bg-emerald-50 border-emerald-200",
    dotColor: "bg-emerald-400",
  },
};

export default function TaskCard({ task, refresh }: any) {
  const [loading, setLoading] = useState(false);

  const isCompleted = task.status === "completed";
  const assigneeName = task.assignedTo?.name || "Unassigned";
  const cfg = statusConfig[task.status] || statusConfig["pending"];

  const handleStatusChange = async () => {
    if (isCompleted || loading) return;
    setLoading(true);
    try {
      const nextStatus =
        task.status === "pending" ? "in-progress" : "completed";
      await updateTask(task._id, { status: nextStatus });
      refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setLoading(true);
    try {
      await deleteTask(task._id);
      refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`group bg-white rounded-xl border transition-all ${
        isCompleted
          ? "border-stone-200 opacity-75"
          : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4 px-4 py-3.5">
        {/* Status toggle circle */}
        <button
          onClick={handleStatusChange}
          disabled={loading || isCompleted}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500"
              : "border-stone-300 hover:border-amber-500"
          }`}
          title={isCompleted ? "Completed" : "Advance status"}
        >
          {isCompleted && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              isCompleted ? "text-stone-400 line-through" : "text-stone-900"
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-stone-400 mt-0.5 truncate">
              {task.description}
            </p>
          )}
        </div>

        {/* Assignee */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${avatarColor(assigneeName)}`}
          >
            {initials(assigneeName)}
          </div>
          <span className="text-xs text-stone-500 max-w-[80px] truncate">
            {assigneeName}
          </span>
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.classes}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
            {cfg.label}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {!isCompleted && (
            <button
              onClick={handleStatusChange}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Advance"}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}