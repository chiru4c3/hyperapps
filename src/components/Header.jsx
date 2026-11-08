export default function Header({ remainingCount, totalCount, completedCount }) {
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>TaskFlow</h1>
          <p className="brand-subtitle">A calmer way to get things done.</p>
        </div>
      </div>
      <div className="progress-card" aria-label={`${completedCount} of ${totalCount} tasks complete`}>
        <div
          className="progress-ring"
          style={{ '--progress': `${progress}%` }}
          aria-hidden="true"
        >
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-copy">
          <span className="eyebrow">YOUR PROGRESS</span>
          <strong>{completedCount} of {totalCount} complete</strong>
          <span>{remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} left</span>
        </div>
      </div>
    </header>
  );
}
