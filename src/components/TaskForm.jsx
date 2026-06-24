/**
 * Reusable form for creating and editing tasks.
 * When `task` prop is provided, form pre-fills for editing.
 */

import { useState } from "react";
import { createTask, updateTask } from "../api/tasksApi";

function TaskForm({ task = null, onSuccess, onCancel }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "pending");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!task;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = { title, description, status, priority };
      if (isEditing) {
        await updateTask(task.id, data);
      } else {
        await createTask(data);
      }
      onSuccess();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Failed to save task.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="task-form-overlay">
      <form onSubmit={handleSubmit} className="task-form">
        <h2>{isEditing ? "Edit Task" : "New Task"}</h2>

        {error && <p className="error-message">{error}</p>}

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Optional"
        />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="task-form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
