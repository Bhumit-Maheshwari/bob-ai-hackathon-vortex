import StatusBadge from '../ui/StatusBadge.jsx';
import Spinner from '../ui/Spinner.jsx';

const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export default function AiPanel({ recommendations, loading, fetched, onFetch, context }) {
  const sorted = [...recommendations].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
  );

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <span className="ai-panel-icon">🤖</span>
        <span className="ai-panel-title">AI Recommendations</span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--muted)' }}>
          Powered by IBM watsonx
        </span>
      </div>

      {loading && <Spinner />}

      {!loading && !fetched && (
        <button className="ai-trigger-btn" onClick={() => onFetch(context || {})}>
          ✨ Get AI Recommendations
        </button>
      )}

      {!loading && fetched && sorted.length === 0 && (
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No recommendations at this time.</p>
      )}

      {!loading && fetched && sorted.map((rec) => (
        <RecommendationCard key={rec.id} rec={rec} />
      ))}
    </div>
  );
}

export function RecommendationCard({ rec }) {
  const priorityVariant = {
    Critical: 'danger', High: 'warning', Medium: 'info', Low: 'neutral',
  }[rec.priority] || 'neutral';

  return (
    <div className="rec-card">
      <div className="rec-card-header">
        <span className="rec-card-title">{rec.title}</span>
        <StatusBadge status={rec.priority} />
      </div>
      <p className="rec-card-desc">{rec.description}</p>
      {rec.action && (
        <button className="rec-card-action">{rec.action}</button>
      )}
    </div>
  );
}
