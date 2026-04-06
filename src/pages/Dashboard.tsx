import { useEffect, useState } from "react";
import { getTasks } from "../api/tasks";
import { api } from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Navbar from "../components/navbar";
import { socket, connectSocket } from "../socket/socket";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        if (res.data.success) setUsers(res.data.data);
      } catch (err) {
        console.error("Failed to load users for filter", err);
      }
    };
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTasks({ status, assignedTo, search: searchTerm });
      setTasks(res.data.data);
    } catch (err: any) {
      setError("Failed to load tasks from server");
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
  }, [status, assignedTo]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Derived stats
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  const filterPills = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-stone-400 mt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live updates active
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Tasks", value: total, color: "text-stone-900" },
            { label: "In Progress", value: inProgress, color: "text-amber-600" },
            { label: "Completed", value: completed, color: "text-emerald-600" },
            { label: "Pending", value: pending, color: "text-rose-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-stone-200 px-4 py-3"
            >
              <p className="text-xs text-stone-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── New Task Form (collapsible) ── */}
        {showForm && (
          <div className="mb-6">
            <TaskForm
              onSuccess={() => {
                fetchTasks();
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* ── Filters Row ── */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 1 0 6.65 16.65 7 7 0 0 0 16.65 16.65z" />
              </svg>
              <input
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-800 placeholder-stone-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Assignee filter */}
            <select
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-700 cursor-pointer"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">All Assignees</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            {/* Status pills */}
            <div className="flex gap-1.5 flex-wrap">
              {filterPills.map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setStatus(pill.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    status === pill.value
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-transparent text-stone-500 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Task List ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest">
              Tasks
            </h2>
            <span className="text-xs bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full font-medium">
              {tasks.length} total
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="h-7 w-7 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-stone-400">Syncing tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-stone-200 rounded-2xl bg-white">
              <svg className="w-10 h-10 text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-stone-400 text-sm">No tasks match your filters</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-amber-600 text-sm font-medium hover:underline"
              >
                + Create your first task
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} refresh={fetchTasks} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}