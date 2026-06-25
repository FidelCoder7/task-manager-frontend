/**
 * Admin page — visible only to users with role === "admin".
 *
 * Shows:
 *  - All registered users
 *  - All tasks across all users, paginated
 */

import { useEffect, useState } from "react";
import { getAllTasks, getAllUsers } from "../api/tasksApi";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

function AdminPage() {
  const { user } = useAuth();

  // ── Users ──────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  // ── Tasks ──────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");

  async function fetchUsers() {
    setUsersLoading(true);
    setUsersError("");
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setUsersError("Failed to load users.");
    } finally {
      setUsersLoading(false);
    }
  }

  async function fetchTasks() {
    setTasksLoading(true);
    setTasksError("");
    try {
      const data = await getAllTasks({ page, pageSize });
      setTasks(data.items);
      setTotal(data.total);
    } catch {
      setTasksError("Failed to load tasks.");
    } finally {
      setTasksLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { fetchTasks(); }, [page]);

  return (
    <div className="page">

      {/* ── Header ── */}
      <h1 className="page-title">Admin Panel</h1>

      {/* ── Users section ── */}
      <section className="admin-section">
        <h2>All Users <span className="section-count">({users.length})</span></h2>

        {usersError && <p className="error-message">{usersError}</p>}

        {usersLoading ? (
          <p className="loading">Loading users...</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge role-${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.is_active ? "✓" : "✗"}</td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Tasks section ── */}
      <section className="admin-section">
        <h2>All Tasks <span className="section-count">({total})</span></h2>

        {tasksError && <p className="error-message">{tasksError}</p>}

        {tasksLoading ? (
          <p className="loading">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks in the system.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Owner ID</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>
                      <span className={`badge status-${t.status}`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <span className={`badge priority-${t.priority}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>{t.user_id}</td>
                    <td>{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}

export default AdminPage;
