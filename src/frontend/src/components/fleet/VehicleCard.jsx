import StatusBadge from '../ui/StatusBadge.jsx';

export default function VehicleCard({ vehicle: v }) {
  // Support real backend schema (vehicleType) and legacy mock (type)
  const vehicleType = v.vehicleType || v.type || 'Unknown';
  const capacity = v.capacity ?? 0;
  const currentLoad = v.currentLoad ?? 0;
  const pct = capacity > 0 ? (currentLoad / capacity) * 100 : 0;
  const fillClass = pct >= 100 ? 'overload' : pct >= 80 ? 'high' : '';

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header">
        <div>
          <div className="vehicle-id">{v.vehicleNo}</div>
          <div className="vehicle-type">{vehicleType}</div>
        </div>
        <StatusBadge status={v.status} />
      </div>
      <div className="vehicle-info">
        <div>📍 {v.location}</div>
        {v.driver && <div>👤 {v.driver}</div>}
        {v.coldChainEquipped && (
          <div style={{ fontSize: 11, color: '#3b82d4', marginTop: 2 }}>❄️ Cold-chain equipped</div>
        )}
        {v.analytics?.redeploymentPriority === 'critical' && (
          <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2 }}>
            ⚡ Redeployment: {v.analytics.redeploymentReason}
          </div>
        )}
      </div>
      <div className="load-bar-wrap">
        <div className="load-bar-label">
          <span>Load</span>
          <span>{currentLoad} / {capacity} t</span>
        </div>
        <div className="load-bar-bg">
          <div
            className={`load-bar-fill${fillClass ? ' ' + fillClass : ''}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
