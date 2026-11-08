export default function EmptyState({ hasTasks, hasSearch, filter }) {
  let title = 'Nothing on your list yet';
  let message = 'Add a task above and take the first step.';

  if (hasSearch) {
    title = 'No matching tasks';
    message = 'Try another search term or clear your search.';
  } else if (hasTasks && filter === 'active') {
    title = 'All caught up';
    message = 'You have no active tasks right now.';
  } else if (hasTasks && filter === 'completed') {
    title = 'No completed tasks yet';
    message = 'Completed tasks will show up here.';
  }

  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path d="M15 12.5h18a3 3 0 0 1 3 3v23H12v-23a3 3 0 0 1 3-3Z" />
          <path d="M19 12.5v-2a5 5 0 0 1 10 0v2M19 23h10M19 29h10" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
