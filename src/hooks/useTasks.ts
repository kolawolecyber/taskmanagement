import { useState, useEffect, useCallback } from "react";
import { api } from "../api/axios";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Separate state for the "Live" input and the "Debounced" filter
  const [searchTerm, setSearchTerm] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // 2. We only send the request with the current state
      const response = await api.get("/tasks", { 
        params: { 
          search: searchTerm, 
          status: statusFilter 
        } 
      });
      setTasks(response.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // 3. This Effect handles the "Timing" (Debouncing)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timer); // Cleanup: Cancel the timer if the user types again
  }, [fetchTasks]);

  return { 
    tasks, 
    loading, 
    setSearchTerm, // Pass these to your UI
    setStatusFilter 
  };
};