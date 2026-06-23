/**
 * Dashboard page — the main task management interface.
 *
 * Features:
 *  - Summary strip (total/pending/in_progress/done counts)
 *  - Filter bar (status, priority, search)
 *  - Paginated task list
 *  - Create task button (opens inline form — built in Phase 6)
 */

import { useEffect, useState } from "react";
import { getTasks, getTaskSummary, deleteTask } from "../api/tasksApi";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

function DashboardPage() {
  const { user, logout } = useAuth();

  // ── Task data ──────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Filters ────────────────────────────────────────────────────
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // ── Pagination ─────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ── Fetch tasks ────────────────────────────────────────────────
  async function fetchTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks({ page, pageSize, status, priority, search });
      setTasks(data.items);
      setTotal(data.total);
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSummary() {
    try {
      const data = await getTaskSummary();
      setSummary(data);
    } catch {
      // Non-critical — summary strip is just decorative
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [page, status, priority, search]);

  useEffect(() => {
    fetchSummary();
  }, [tasks]); // Re-fetch summary whenever task list changes

  // ── Handlers ───────────────────────────────────────────────────
  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleFilterChange(setter) {
    return (e) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      fetchTasks();
      fetchSummary();
    } catch {
      setError("Failed to delete task.");
    }
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="page">

      {/* ── Header ── */}
      <header className="dashboard-header">
        <div>
          <h1>My Tasks</h1>
          <p className="welcome">Welcome, {user?.username}</p>
        </div>
        <div className="header-actions">
          {user?.role === "admin" && (
            <a href="/admin" className="admin-link">Admin Panel</a>
          )}
          <button className="btn-logout" onClick={logout}>Log Out</button>
        </div>
      </header>

      {/* ── Summary strip ── */}
      {summary && (
        <div className="summary-strip">
          <div className="summary-card">
            <span className="summary-count">{summary.total}</span>
            <span className="summary-label">Total</span>
          </div>
          <div className="summary-card pending">
            <span className="summary-count">{summary.pending}</span>
            <span className="summary-label">Pending</span>
          </div>
          <div className="summary-card in-progress">
            <span className="summary-count">{summary.in_progress}</span>
            <span className="summary-label">In Progress</span>
          </div>
          <div className="summary-card done">
            <span className="summary-count">{summary.done}</span>
            <span className="summary-label">Done</span>
          </div>
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <select value={status} onChange={handleFilterChange(setStatus)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select value={priority} onChange={handleFilterChange(setPriority)}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* ── Error ── */}
      {error && <p className="error-message">{error}</p>}

      {/* ── Task list ── */}
      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="empty">No tasks found.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <div className="task-meta">
                  <span className={`badge status-${task.status}`}>
                    {task.status.replace("_", " ")}
                  </span>
                  <span className={`badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
              </div>
              <div className="task-actions">
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

export default DashboardPage;
