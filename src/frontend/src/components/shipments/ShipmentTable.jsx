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
            <th>Origin</th>
            <th>Destination</th>
            <th>Route</th>
            <th>Carrier</th>
            <th>ETA</th>
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
              <td>{s.origin}</td>
              <td>{s.destination}</td>
              <td><span style={{ fontSize: 11 }}>{s.route}</span></td>
              <td>{s.carrier}</td>
              <td>{s.eta}</td>
              <td><StatusBadge status={s.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
