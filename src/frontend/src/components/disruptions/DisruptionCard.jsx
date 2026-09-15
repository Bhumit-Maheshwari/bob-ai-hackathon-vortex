import StatusBadge from '../ui/StatusBadge.jsx';

const SEVERITY_ICONS = {
  critical: '🔴', high: '🟠', medium: '🟡', low: '🔵',
};

export default function DisruptionCard({ disruption: d }) {
  const sev = d.severity?.toLowerCase();
  const isResolved = d.status === 'resolved' || d.resolved === true;
  const detectedAt = d.startTime || d.detectedAt
    ? new Date(d.startTime || d.detectedAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div className={`disruption-card severity-${sev}`}>
      <span className="disruption-icon">{SEVERITY_ICONS[sev] || '⚪'}</span>
      <div className="disruption-body">
        <div className="disruption-title">{d.type}{d.subType ? ` — ${d.subType}` : ''}</div>
        {d.location && <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>📍 {d.location}</div>}
        <div className="disruption-desc">{d.description}</div>
        <div className="disruption-meta">
          <StatusBadge status={d.severity} />
          {isResolved && <StatusBadge status="resolved" />}
          {d.affectedRoutes?.map((r) => (
            <span key={r} className="route-pill">{r}</span>
          ))}
          {detectedAt && <span>· {detectedAt}</span>}
          {d.analytics?.estimatedDelayHours && (
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              · ~{d.analytics.estimatedDelayHours}h delay
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
