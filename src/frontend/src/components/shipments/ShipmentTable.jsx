import { Link } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge.jsx';

export default function ShipmentTable({ shipments, limit }) {
  const rows = limit ? shipments.slice(0, limit) : shipments;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tracking No.</th>
              <th>Origin → Destination</th>
              <th>Route</th>
              <th>Carrier</th>
              <th>ETA</th>
              <th>Risk</th>
              <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="row-clickable">
              <td>
                <Link to={`/shipments/${s.id}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>
                  {s.trackingNo}
                </Link>
              </td>
              <td style={{ fontSize: 12 }}>
                {s.origin} → {s.destination}
                {s.currentLocation && (
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>📍 {s.currentLocation}</div>
                )}
              </td>
              <td><span style={{ fontSize: 11 }}>{s.currentRoute || s.route}</span></td>
              <td style={{ fontSize: 12 }}>{s.carrier}</td>
              <td style={{ fontSize: 12 }}>
                {s.expectedDelivery || s.eta
                  ? new Date(s.expectedDelivery || s.eta).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short',
                    })
                  : '—'}
              </td>
              <td><StatusBadge status={s.riskLevel || s.status} /></td>
              <td><StatusBadge status={s.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
