export default function EmptyState({ icon = '📭', title = 'No data', message }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {message && <div>{message}</div>}
    </div>
  );
}
