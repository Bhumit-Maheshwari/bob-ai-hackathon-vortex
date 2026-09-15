import StatusBadge from '../ui/StatusBadge.jsx';

const SEVERITY_ICONS = {
  Critical: '🔴', High: '🟠', Medium: '🟡', Low: '🔵',
};

export default function DisruptionCard({ disruption: d }) {
  return (
    <div className={`disruption-card severity-${d.severity?.toLowerCase()}`}>
      <span className="disruption-icon">{SEVERITY_ICONS[d.severity] || '⚪'}</span>
      <div className="disruption-body">
        <div className="disruption-title">{d.type}</div>
        <div className="disruption-desc">{d.description}</div>
        <div className="disruption-meta">
          <StatusBadge status={d.severity} />
          {d.resolved && <StatusBadge status="Resolved" />}
          {d.affectedRoutes?.map((r) => (
            <span key={r} className="route-pill">{r}</span>
          ))}
          <span>· {d.detectedAt}</span>
        </div>
      </div>
    </div>
  );
}
