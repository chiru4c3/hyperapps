export default function Loader() {
  return (
    <div className="status-panel" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>Loading your tasks...</span>
    </div>
  );
}
