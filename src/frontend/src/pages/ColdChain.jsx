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

  // Normalise each reading's status for display
  const isBreach = (r) =>
    r.analytics?.isExcursion === true ||
    r.analytics?.alertLevel >= 2 ||
    r.status === 'breach' ||
    r.status === 'critical' ||
    r.status === 'high';

  const breachCount = readings.filter(isBreach).length;
  const normalCount = readings.filter((r) => !isBreach(r)).length;
  const shipmentSet = new Set(readings.map((r) => r.shipmentId));

  const criticalAlerts = alerts.filter((a) => a.analytics?.alertLevel === 3);

  return (
    <div>
      <h1 className="page-title">❄️ Cold-Chain Monitoring</h1>

      {criticalAlerts.length > 0 && (
        <AlertBanner type="danger" icon="🌡️">
          {criticalAlerts.length} critical temperature excursion{criticalAlerts.length > 1 ? 's' : ''} detected —{' '}
          {criticalAlerts.map((a) => (
            <Link
              key={a.id}
              to={`/shipments/${a.shipmentId}`}
              style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline', marginRight: 6 }}
            >
              {a.shipmentId}
            </Link>
          ))}
        </AlertBanner>
      )}

      {alerts.length > 0 && criticalAlerts.length === 0 && (
        <AlertBanner type="warning" icon="🌡️">
          {alerts.length} temperature alert{alerts.length > 1 ? 's' : ''} across your cold-chain shipments.
        </AlertBanner>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card stat-card-accent">
          <div className="stat-card-label">Total Readings</div>
          <div className="stat-card-value">{readings.length}</div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="stat-card-label">Breaches / Alerts</div>
          <div className="stat-card-value">{breachCount}</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-card-label">Within Range</div>
          <div className="stat-card-value">{normalCount}</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-card-label">Shipments Monitored</div>
          <div className="stat-card-value">{shipmentSet.size}</div>
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
                <th>Location</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r) => {
                const breach = isBreach(r);
                // Threshold: prefer embedded threshold, then requiredTemperatureRange from reading data
                const threshold = r.threshold || r.requiredTemperatureRange || null;
                const statusLabel = breach
                  ? (r.analytics?.alertLevel === 3 ? 'critical' : r.status || 'high')
                  : (r.status || 'normal');
                const tsDisplay = r.timestamp
                  ? new Date(r.timestamp).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })
                  : '—';

                return (
                  <tr key={r.id} className={breach ? 'row-alert' : ''}>
                    <td>
                      <Link
                        to={`/shipments/${r.shipmentId}`}
                        style={{ color: 'var(--accent)', fontWeight: 500 }}
                      >
                        {r.trackingNo || r.shipmentId}
                      </Link>
                    </td>
                    <td style={{ fontSize: 11 }}>{r.sensorId || r.sensor}</td>
                    <td>
                      <TempGauge temperature={r.temperature} threshold={threshold} />
                    </td>
                    <td>{r.humidity != null ? `${r.humidity}%` : '—'}</td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {threshold ? `${threshold.min}°C – ${threshold.max}°C` : '—'}
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {r.location || '—'}
                    </td>
                    <td style={{ fontSize: 12 }}>{tsDisplay}</td>
                    <td>
                      <StatusBadge status={statusLabel} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
