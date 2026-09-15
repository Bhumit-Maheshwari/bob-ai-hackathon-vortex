import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import AlertBanner from '../components/ui/AlertBanner.jsx';
import TempGauge from '../components/coldchain/TempGauge.jsx';
import AiPanel from '../components/ai/AiPanel.jsx';
import { useShipmentDetail } from '../hooks/useShipments.js';
import { useAiRecommendations } from '../hooks/useAiRecommendations.js';

export default function ShipmentDetail() {
  const { id } = useParams();
  const { data: shipment, loading, error } = useShipmentDetail(id);
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

  const breaches = shipment.coldChainReadings?.filter((r) => r.status === 'breach') || [];

  return (
    <div>
      <Link to="/shipments" className="back-link">← Back to Shipments</Link>

      {breaches.length > 0 && (
        <AlertBanner type="danger" icon="🌡️">
          {breaches.length} temperature breach{breaches.length > 1 ? 'es' : ''} detected on this shipment.
        </AlertBanner>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{shipment.trackingNo}</h1>
        <StatusBadge status={shipment.status} />
      </div>

      <div className="detail-grid">
        {/* LEFT: meta + timeline + cold-chain */}
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
              <div className="detail-meta-item">
                <label>Carrier</label><span>{shipment.carrier}</span>
              </div>
              <div className="detail-meta-item">
                <label>Route</label><span>{shipment.route}</span>
              </div>
              <div className="detail-meta-item">
                <label>ETA</label><span>{shipment.eta}</span>
              </div>
              <div className="detail-meta-item">
                <label>Cold Chain</label>
                <span>{shipment.hasColdChain ? '❄️ Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 16 }}>Shipment Timeline</div>
            <ul className="timeline">
              {(shipment.timeline || []).map((ev, i) => (
                <li key={i} className="timeline-item">
                  <div className={`timeline-dot${ev.current ? ' current' : i === (shipment.timeline.length - 1) ? ' done' : ' done'}`} />
                  <div className="timeline-text">
                    <div className="timeline-event">{ev.event}</div>
                    <div className="timeline-loc">📍 {ev.location}</div>
                    <div className="timeline-time">{ev.timestamp}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Cold Chain */}
          {shipment.hasColdChain && (
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 12 }}>❄️ Cold-Chain Readings</div>
              <div className="table-wrap" style={{ border: 'none', boxShadow: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Sensor</th>
                      <th>Temperature</th>
                      <th>Humidity</th>
                      <th>Threshold</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(shipment.coldChainReadings || []).map((r) => (
                      <tr key={r.id} className={r.status === 'breach' ? 'row-alert' : ''}>
                        <td>{r.sensor}</td>
                        <td>
                          <TempGauge temperature={r.temperature} threshold={r.threshold} />
                        </td>
                        <td>{r.humidity}%</td>
                        <td style={{ fontSize: 11, color: 'var(--muted)' }}>
                          {r.threshold ? `${r.threshold.min}°C – ${r.threshold.max}°C` : '—'}
                        </td>
                        <td style={{ fontSize: 12 }}>{r.timestamp}</td>
                        <td><StatusBadge status={r.status === 'breach' ? 'Critical' : 'ok'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
