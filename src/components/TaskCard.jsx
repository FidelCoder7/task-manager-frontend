/**
 * Single task row — displays task info with Edit and Delete buttons.
 */

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <li className="task-item">
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
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
