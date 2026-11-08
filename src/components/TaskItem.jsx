import { useEffect, useState } from 'react';
import { formatDueDate, isOverdue } from '../utils/taskUtils.js';

export default function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [editError, setEditError] = useState('');
  const overdue = isOverdue(task);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(task.title);
    }
  }, [task.title, isEditing]);

  function cancelEdit() {
    setDraftTitle(task.title);
    setEditError('');
    setIsEditing(false);
  }

  function saveEdit(event) {
    event.preventDefault();
    const cleanTitle = draftTitle.trim();
    if (!cleanTitle) {
      setEditError('A task title cannot be empty.');
      return;
    }

    onUpdateTask(task.id, { title: cleanTitle });
    setEditError('');
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      onDeleteTask(task.id);
    }
  }

  return (
    <li className={`task-item${task.completed ? ' is-completed' : ''}${overdue ? ' is-overdue' : ''}`}>
      <label className="completion-control">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(event) => onUpdateTask(task.id, { completed: event.target.checked })}
          aria-label={`${task.completed ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}
        />
        <span className="custom-checkbox" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="m3.5 8.2 3 3 6-6.2" /></svg>
        </span>
      </label>
      <div className="task-main">
        {isEditing ? (
          <form className="edit-form" onSubmit={saveEdit}>
            <label className="visually-hidden" htmlFor={`edit-task-${task.id}`}>Edit task title</label>
            <input
              id={`edit-task-${task.id}`}
              className="text-input edit-input"
              type="text"
              value={draftTitle}
              onChange={(event) => {
                setDraftTitle(event.target.value);
                if (editError) setEditError('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') cancelEdit();
              }}
              aria-invalid={Boolean(editError)}
              aria-describedby={editError ? `edit-error-${task.id}` : undefined}
              autoFocus
            />
            <div className="edit-actions">
              <button className="button button-primary button-small" type="submit">Save</button>
              <button className="button button-quiet button-small" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
            {editError && (
              <span className="form-error edit-error" id={`edit-error-${task.id}`} role="alert">
                {editError}
              </span>
            )}
          </form>
        ) : (
          <>
            <div className="task-title-row">
              <span className="task-title">{task.title}</span>
              {overdue && <span className="overdue-label">Overdue</span>}
            </div>
            <div className="task-meta">
              <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                <span className="priority-dot" aria-hidden="true" />
                {task.priority}
              </span>
              <span className="due-date">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="2.25" y="3.5" width="11.5" height="10.25" rx="2" />
                  <path d="M5 2v3M11 2v3M2.5 6.5h11" />
                </svg>
                {formatDueDate(task.dueDate)}
              </span>
            </div>
          </>
        )}
      </div>
      {!isEditing && (
        <div className="task-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={`Edit ${task.title}`}
            onClick={() => setIsEditing(true)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m12.9 4.1 3 3M4 16l3.6-.8 8.8-8.8a1.4 1.4 0 0 0-2-2l-8.8 8.8L4 16Z" />
            </svg>
          </button>
          <button
            className="icon-button delete-button"
            type="button"
            aria-label={`Delete ${task.title}`}
            onClick={handleDelete}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4.5 6h11M8 6V4.5h4V6m2.5 0-.7 9h-7L6 6m2.5 2.5v4m3-4v4" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
}
