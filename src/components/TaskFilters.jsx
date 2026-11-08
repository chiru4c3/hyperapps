const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskFilters({ activeFilter, counts, onChange }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          className={`filter-tab${activeFilter === value ? ' is-selected' : ''}`}
          id={`filter-${value}`}
          type="button"
          role="tab"
          aria-selected={activeFilter === value}
          aria-controls="task-list-panel"
          onClick={() => onChange(value)}
        >
          {label}
          <span className="filter-count">{counts[value]}</span>
        </button>
      ))}
    </div>
  );
}
