import { Link } from 'react-router-dom';
import StatCard from '../components/ui/StatCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import AlertBanner from '../components/ui/AlertBanner.jsx';
import DisruptionCard from '../components/disruptions/DisruptionCard.jsx';
import ShipmentTable from '../components/shipments/ShipmentTable.jsx';
import FleetUtilChart from '../components/charts/FleetUtilChart.jsx';
import AiPanel from '../components/ai/AiPanel.jsx';
import { useShipments } from '../hooks/useShipments.js';
import { useDisruptions } from '../hooks/useDisruptions.js';
import { useFleetUtilisation } from '../hooks/useFleet.js';
import { useColdChainAlerts } from '../hooks/useColdChain.js';
import { useAiRecommendations } from '../hooks/useAiRecommendations.js';

export default function Dashboard() {
  const { data: shipments, loading: shipLoading } = useShipments();
  const { data: disruptions, loading: disLoading } = useDisruptions();
  const { data: util, loading: utilLoading } = useFleetUtilisation();
  const { data: coldAlerts, loading: coldLoading } = useColdChainAlerts();
  const ai = useAiRecommendations();

  const criticalDisruptions = disruptions.filter(
    (d) => d.severity?.toLowerCase() === 'critical' && d.status !== 'resolved'
  );
  const atRisk = shipments.filter(
    (s) => s.riskLevel === 'critical' || s.riskLevel === 'high'
  ).length;

  const loading = shipLoading || disLoading || utilLoading || coldLoading;

  if (loading) return <Spinner />;

  return (
    <div>
      {criticalDisruptions.length > 0 && (
        <AlertBanner type="danger" icon="🚨">
          {criticalDisruptions.length} critical disruption{criticalDisruptions.length > 1 ? 's' : ''} active —{' '}
          <Link to="/disruptions" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}>
            View all disruptions
          </Link>
        </AlertBanner>
      )}

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Shipments at Risk"
          value={atRisk}
          sub={`of ${shipments.length} total shipments`}
          variant="warning"
        />
        <StatCard
          label="Active Disruptions"
          value={disruptions.filter((d) => d.status === 'active' || d.status === 'monitoring').length}
          sub={`${criticalDisruptions.length} critical`}
          variant="danger"
        />
        <StatCard
          label="Fleet Utilisation"
          value={util ? `${util.utilisationPct?.toFixed(1)}%` : '—'}
          sub={util ? `${util.active} / ${util.totalVehicles} vehicles active` : ''}
          variant="success"
        />
        <StatCard
          label="Cold-Chain Alerts"
          value={coldAlerts.length}
          sub={coldAlerts.filter((a) => a.analytics?.alertLevel === 3).length > 0
            ? `${coldAlerts.filter((a) => a.analytics?.alertLevel === 3).length} critical`
            : 'temp breach events'}
          variant="danger"
        />
      </div>

      {/* Middle row: Disruptions + Fleet Chart */}
      <div className="dash-row" style={{ marginBottom: 24 }}>
        {/* Disruptions */}
        <div className="card card-pad">
          <div className="section-header">
            <span className="section-title">⚠️ Recent Disruptions</span>
            <Link to="/disruptions" className="section-link">View all →</Link>
          </div>
          <div className="disruption-feed">
            {disruptions.filter((d) => d.status !== 'resolved').slice(0, 3).map((d) => (
              <DisruptionCard key={d.id} disruption={d} />
            ))}
          </div>
        </div>

        {/* Fleet Utilisation */}
        <div className="card card-pad">
          <div className="section-header">
            <span className="section-title">🚛 Fleet Utilisation</span>
            <Link to="/fleet" className="section-link">View fleet →</Link>
          </div>
          <FleetUtilChart util={util} />
        </div>
      </div>

      {/* Bottom row: Shipments + AI */}
      <div className="dash-row">
        {/* Recent Shipments */}
        <div>
          <div className="section-header">
            <span className="section-title">📦 Recent Shipments</span>
            <Link to="/shipments" className="section-link">View all →</Link>
          </div>
          <ShipmentTable shipments={shipments} limit={5} />
        </div>

        {/* AI Panel */}
        <div className="card card-pad">
          <AiPanel
            recommendations={ai.data}
            loading={ai.loading}
            fetched={ai.fetched}
            onFetch={ai.fetch}
            context={{}}
          />
        </div>
      </div>
    </div>
  );
}
