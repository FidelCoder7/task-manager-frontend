import { useEffect, useState } from "react";
import { getTasks, getTaskSummary, deleteTask } from "../api/tasksApi";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

function DashboardPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // null = closed, "create" = new task form, task object = edit form
  const [formState, setFormState] = useState(null);

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
    } catch {}
  }

  useEffect(() => {
    fetchTasks();
  }, [page, status, priority, search]);

  useEffect(() => {
    fetchSummary();
  }, [tasks]);

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

  function handleFormSuccess() {
    setFormState(null);
    fetchTasks();
    fetchSummary();
  }

  return (
    <div className="page">

      {/* ── Header ── */}
      <h1 className="page-title">My Tasks</h1>

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

      {/* ── Filter bar + Create button ── */}
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

        <button
          className="btn-create"
          onClick={() => setFormState("create")}
        >
          + New Task
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* ── Task list ── */}
      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="empty">No tasks found.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => setFormState(t)}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
      />

      {/* ── Task form modal ── */}
      {formState !== null && (
        <TaskForm
          task={formState === "create" ? null : formState}
          onSuccess={handleFormSuccess}
          onCancel={() => setFormState(null)}
        />
      )}
    </div>
  );
}

export default DashboardPage;
