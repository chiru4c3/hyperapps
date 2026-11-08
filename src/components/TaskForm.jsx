import { useState } from 'react';

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Enter a task title before adding it.');
      return;
    }

    onAddTask({ title: cleanTitle, priority, dueDate });
    setTitle('');
    setPriority('Medium');
    setDueDate('');
    setError('');
  }

  return (
    <section className="panel add-task-panel" aria-labelledby="add-task-heading">
      <div className="section-heading">
        <div className="section-icon add-icon" aria-hidden="true">+</div>
        <div>
          <h2 id="add-task-heading">Add a task</h2>
          <p>Make a little progress, one task at a time.</p>
        </div>
      </div>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <label className="visually-hidden" htmlFor="new-task-title">Task title</label>
        <input
          id="new-task-title"
          className="text-input"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError('');
          }}
          placeholder="What needs to get done?"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'task-form-error' : undefined}
        />
        <label className="visually-hidden" htmlFor="new-task-priority">Priority</label>
        <select
          id="new-task-priority"
          className="text-input select-input"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="Low">Low priority</option>
          <option value="Medium">Medium priority</option>
          <option value="High">High priority</option>
        </select>
        <label className="visually-hidden" htmlFor="new-task-due-date">Due date</label>
        <input
          id="new-task-due-date"
          className="text-input date-input"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          aria-label="Optional due date"
        />
        <button className="button button-primary add-button" type="submit">
          <span aria-hidden="true">+</span>
          Add task
        </button>
      </form>
      {error && <p className="form-error" id="task-form-error" role="alert">{error}</p>}
    </section>
  );
}
