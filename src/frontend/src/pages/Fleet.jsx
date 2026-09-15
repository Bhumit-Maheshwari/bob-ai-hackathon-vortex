import FleetUtilChart from '../components/charts/FleetUtilChart.jsx';
import VehicleCard from '../components/fleet/VehicleCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useFleet, useFleetUtilisation } from '../hooks/useFleet.js';

export default function Fleet() {
  const { data: vehicles, loading: vLoading } = useFleet();
  const { data: util, loading: uLoading } = useFleetUtilisation();

  if (vLoading || uLoading) return <Spinner />;

  return (
    <div>
      <h1 className="page-title">🚛 Fleet</h1>

      {/* Utilisation chart */}
      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Fleet Overview</div>
        <FleetUtilChart util={util} />
      </div>

      {/* Stat row */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card stat-card-accent">
          <div className="stat-card-label">Total Vehicles</div>
          <div className="stat-card-value">{util?.totalVehicles ?? vehicles.length}</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-card-label">Active</div>
          <div className="stat-card-value">{util?.active ?? vehicles.filter(v => v.status === 'Active').length}</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-card-label">Idle</div>
          <div className="stat-card-value">{util?.idle ?? vehicles.filter(v => v.status === 'Idle').length}</div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="stat-card-label">Maintenance</div>
          <div className="stat-card-value">{util?.maintenance ?? vehicles.filter(v => v.status === 'Maintenance').length}</div>
        </div>
      </div>

      {/* Vehicle grid */}
      {vehicles.length === 0 ? (
        <EmptyState icon="🚛" title="No vehicles found" />
      ) : (
        <div className="fleet-grid">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}
