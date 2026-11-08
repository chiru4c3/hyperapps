import TaskFilters from './TaskFilters.jsx';

export default function TaskToolbar({
  activeFilter,
  counts,
  onFilterChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <section className="task-toolbar" aria-label="Task controls">
      <div className="toolbar-top">
        <div className="task-heading">
          <span className="section-overline">YOUR DAY, AT A GLANCE</span>
          <h2>Your tasks <span className="task-total">{counts.all}</span></h2>
        </div>
        <div className="toolbar-fields">
          <label className="search-field">
            <span className="visually-hidden">Search tasks</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.7" cy="8.7" r="5.8" />
              <path d="m13 13 4.1 4.1" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search tasks..."
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                aria-label="Clear search"
                onClick={() => onSearchChange('')}
              >
                ×
              </button>
            )}
          </label>
          <label className="sort-field">
            <span className="visually-hidden">Sort tasks</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 5h12M6.5 10h7M9 15h2" />
            </svg>
            <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
              <option value="dueDate">Due date: soonest</option>
              <option value="priority">Priority: high to low</option>
            </select>
          </label>
        </div>
      </div>
      <TaskFilters
        activeFilter={activeFilter}
        counts={counts}
        onChange={onFilterChange}
      />
    </section>
  );
}
