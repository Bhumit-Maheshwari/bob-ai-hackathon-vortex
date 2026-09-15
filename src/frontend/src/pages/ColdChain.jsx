import { Link } from 'react-router-dom';
import TempGauge from '../components/coldchain/TempGauge.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import AlertBanner from '../components/ui/AlertBanner.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useColdChain, useColdChainAlerts } from '../hooks/useColdChain.js';

export default function ColdChain() {
  const { data: readings, loading } = useColdChain();
  const { data: alerts } = useColdChainAlerts();

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="page-title">❄️ Cold-Chain Monitoring</h1>

      {alerts.length > 0 && (
        <AlertBanner type="danger" icon="🌡️">
          {alerts.length} active temperature breach{alerts.length > 1 ? 'es' : ''} detected across your cold-chain shipments.
        </AlertBanner>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card stat-card-accent">
          <div className="stat-card-label">Total Readings</div>
          <div className="stat-card-value">{readings.length}</div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="stat-card-label">Breaches</div>
          <div className="stat-card-value">{readings.filter(r => r.status === 'breach').length}</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-card-label">Within Range</div>
          <div className="stat-card-value">{readings.filter(r => r.status === 'ok').length}</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-card-label">Shipments Monitored</div>
          <div className="stat-card-value">{new Set(readings.map(r => r.shipmentId)).size}</div>
        </div>
      </div>

      {/* Readings table */}
      {readings.length === 0 ? (
        <EmptyState icon="❄️" title="No cold-chain readings" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Sensor</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Threshold</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r) => (
                <tr
                  key={r.id}
                  className={r.status === 'breach' ? 'row-alert' : ''}
                >
                  <td>
                    <Link
                      to={`/shipments/${r.shipmentId}`}
                      style={{ color: 'var(--accent)', fontWeight: 500 }}
                    >
                      {r.trackingNo || r.shipmentId}
                    </Link>
                  </td>
                  <td>{r.sensor}</td>
                  <td>
                    <TempGauge temperature={r.temperature} threshold={r.threshold} />
                  </td>
                  <td>{r.humidity}%</td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {r.threshold ? `${r.threshold.min}°C – ${r.threshold.max}°C` : '—'}
                  </td>
                  <td style={{ fontSize: 12 }}>{r.timestamp}</td>
                  <td>
                    <StatusBadge status={r.status === 'breach' ? 'Critical' : 'ok'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
