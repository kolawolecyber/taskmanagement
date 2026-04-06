import { useState, useEffect } from "react";
import { createTask } from "../api/tasks";
import { api } from "../api/axios";

export default function TaskForm({ onSuccess }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        if (res.data && Array.isArray(res.data.data)) {
          setUsers(res.data.data);
        } else if (Array.isArray(res.data)) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!assignedTo) return alert("Please select a user");
    setLoading(true);
    try {
      await createTask({ title, description, assignedTo });
      setTitle("");
      setDescription("");
      setAssignedTo("");
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-800 placeholder-stone-400";

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Form header */}
      <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-sm font-medium text-stone-700">Create New Task</span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Title */}
          <input
            placeholder="Task title..."
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Assignee */}
          <select
            className={`${inputClass} cursor-pointer`}
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          >
            <option value="">Assign to someone...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          className={`${inputClass} h-20 resize-none`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-medium rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}