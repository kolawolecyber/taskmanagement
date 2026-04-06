import { useState } from "react";
import { createTask } from "../api/tasks";

export default function TaskForm({ onSuccess }: any) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createTask({ title, assignedTo });

      setTitle("");
      setAssignedTo("");

      onSuccess(); // refresh tasks
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex gap-2"
    >
      <input
        placeholder="Task title"
        className="border p-2 rounded w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        placeholder="Assign user ID"
        className="border p-2 rounded w-full"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        required
      />

      <button className="bg-black text-white px-4 rounded">
        Add
      </button>
    </form>
  );
}