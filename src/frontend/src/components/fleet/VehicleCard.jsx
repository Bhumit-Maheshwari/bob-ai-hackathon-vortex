import StatusBadge from '../ui/StatusBadge.jsx';

export default function VehicleCard({ vehicle: v }) {
  const pct = v.capacity > 0 ? (v.currentLoad / v.capacity) * 100 : 0;
  const fillClass = pct >= 100 ? 'overload' : pct >= 80 ? 'high' : '';

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header">
        <div>
          <div className="vehicle-id">{v.vehicleNo}</div>
          <div className="vehicle-type">{v.type}</div>
        </div>
        <StatusBadge status={v.status} />
      </div>
      <div className="vehicle-info">
        <div>📍 {v.location}</div>
        <div>👤 {v.driver}</div>
      </div>
      <div className="load-bar-wrap">
        <div className="load-bar-label">
          <span>Load</span>
          <span>{v.currentLoad} / {v.capacity} t</span>
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
