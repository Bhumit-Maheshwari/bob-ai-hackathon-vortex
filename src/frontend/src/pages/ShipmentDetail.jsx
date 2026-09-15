import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import AlertBanner from '../components/ui/AlertBanner.jsx';
import TempGauge from '../components/coldchain/TempGauge.jsx';
import AiPanel from '../components/ai/AiPanel.jsx';
import { useShipmentDetail } from '../hooks/useShipments.js';
import { useColdChainByShipment } from '../hooks/useColdChain.js';
import { useAiRecommendations } from '../hooks/useAiRecommendations.js';

export default function ShipmentDetail() {
  const { id } = useParams();
  const { data: shipment, loading, error } = useShipmentDetail(id);
  const { data: coldReadings, loading: coldLoading } = useColdChainByShipment(id);
  const ai = useAiRecommendations();

  if (loading) return <Spinner />;

  if (error || !shipment) {
    return (
      <div>
        <Link to="/shipments" className="back-link">← Back to Shipments</Link>
        <AlertBanner type="danger" icon="❌">{error || 'Shipment not found'}</AlertBanner>
      </div>
    );
  }

  // Normalise fields — support both real backend and legacy mock shapes
  const hasColdChain = shipment.temperatureSensitive ?? shipment.hasColdChain ?? false;
  const route = shipment.currentRoute || shipment.route || '—';
  const eta = shipment.expectedDelivery || shipment.eta;
  const etaDisplay = eta
    ? new Date(eta).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';

  // Merge: prefer live hook readings, fall back to embedded (mock)
  const readings = coldReadings.length > 0
    ? coldReadings
    : (shipment.coldChainReadings || []);

  const criticalReadings = readings.filter(
    (r) => r.analytics?.alertLevel >= 2 || r.status === 'breach' || r.status === 'critical'
  );

  return (
    <div>
      <Link to="/shipments" className="back-link">← Back to Shipments</Link>

      {criticalReadings.length > 0 && (
        <AlertBanner type="danger" icon="🌡️">
          {criticalReadings.length} temperature breach{criticalReadings.length > 1 ? 'es' : ''} detected on this shipment.
        </AlertBanner>
      )}

      {shipment.activeDisruption && (
        <AlertBanner type="warning" icon="⚠️">
          Active disruption <strong>{shipment.activeDisruption}</strong> is affecting this shipment.
          {shipment.analytics?.estimatedDelayHours
            ? ` Estimated delay: ${shipment.analytics.estimatedDelayHours}h.`
            : ''}
        </AlertBanner>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{shipment.trackingNo}</h1>
        <StatusBadge status={shipment.status} />
        {shipment.riskLevel && shipment.riskLevel !== shipment.status && (
          <StatusBadge status={shipment.riskLevel} />
        )}
      </div>

      <div className="detail-grid">
        {/* LEFT: meta + cold-chain */}
        <div>
          {/* Meta */}
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>Shipment Details</div>
            <div className="detail-meta">
              <div className="detail-meta-item">
                <label>Origin</label><span>{shipment.origin}</span>
              </div>
              <div className="detail-meta-item">
                <label>Destination</label><span>{shipment.destination}</span>
              </div>
              {shipment.currentLocation && (
                <div className="detail-meta-item">
                  <label>Current Location</label><span>📍 {shipment.currentLocation}</span>
                </div>
              )}
              <div className="detail-meta-item">
                <label>Carrier</label><span>{shipment.carrier}</span>
              </div>
              <div className="detail-meta-item">
                <label>Route</label><span>{route}</span>
              </div>
              <div className="detail-meta-item">
                <label>ETA</label><span>{etaDisplay}</span>
              </div>
              {shipment.cargoType && (
                <div className="detail-meta-item">
                  <label>Cargo</label><span>{shipment.cargoType}</span>
                </div>
              )}
              {shipment.weight && (
                <div className="detail-meta-item">
                  <label>Weight</label><span>{shipment.weight} {shipment.weightUnit || 't'}</span>
                </div>
              )}
              <div className="detail-meta-item">
                <label>Cold Chain</label>
                <span>{hasColdChain ? '❄️ Yes' : 'No'}</span>
              </div>
              {hasColdChain && shipment.requiredTemperatureRange && (
                <div className="detail-meta-item">
                  <label>Temp Range</label>
                  <span>{shipment.requiredTemperatureRange.min}°C – {shipment.requiredTemperatureRange.max}°C</span>
                </div>
              )}
            </div>
          </div>

          {/* Risk & Recommendations summary */}
          {shipment.analytics?.actionRequired && (
            <div className="card card-pad" style={{ marginBottom: 16, borderLeft: '3px solid var(--danger)' }}>
              <div className="section-title" style={{ marginBottom: 8 }}>⚡ Action Required</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
                Risk score: <strong>{shipment.analytics.overallRiskScore}/100</strong> ·
                Type: <code style={{ fontSize: 11 }}>{shipment.analytics.actionType}</code>
              </p>
              {shipment.alternativeRoutes?.length > 0 && (
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  🔀 Alternative routes: {shipment.alternativeRoutes.join(', ')}
                </div>
              )}
              {shipment.alternativeCarriers?.length > 0 && (
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  🚚 Alternative carriers: {shipment.alternativeCarriers.join(', ')}
                </div>
              )}
              {shipment.suggestedVehicle && (
                <div style={{ fontSize: 12 }}>
                  🚛 Suggested vehicle: <strong>{shipment.suggestedVehicle}</strong>
                </div>
              )}
            </div>
          )}

          {/* Cold Chain Readings */}
          {hasColdChain && (
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 12 }}>
                ❄️ Cold-Chain Readings {coldLoading && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>loading…</span>}
              </div>
              {readings.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>No readings recorded.</p>
              ) : (
                <div className="table-wrap" style={{ border: 'none', boxShadow: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Sensor</th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readings.map((r) => {
                        const isBreach = r.analytics?.isExcursion || r.status === 'breach' || r.status === 'critical' || r.status === 'high';
                        const threshold = r.threshold || shipment.requiredTemperatureRange;
                        return (
                          <tr key={r.id} className={isBreach ? 'row-alert' : ''}>
                            <td style={{ fontSize: 11 }}>{r.sensorId || r.sensor}</td>
                            <td>
                              <TempGauge temperature={r.temperature} threshold={threshold} />
                            </td>
                            <td>{r.humidity != null ? `${r.humidity}%` : '—'}</td>
                            <td style={{ fontSize: 11 }}>
                              {r.timestamp
                                ? new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                                : '—'}
                            </td>
                            <td><StatusBadge status={isBreach ? 'critical' : r.status || 'normal'} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: AI Panel */}
        <div className="card card-pad">
          <AiPanel
            recommendations={ai.data}
            loading={ai.loading}
            fetched={ai.fetched}
            onFetch={ai.fetch}
            context={{ shipmentId: id }}
          />
        </div>
      </div>
    </div>
  );
}
