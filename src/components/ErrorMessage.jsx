export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-panel" role="alert">
      <div>
        <strong>We couldn&apos;t load your tasks</strong>
        <p>{message}</p>
      </div>
      <button className="button button-secondary" type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
