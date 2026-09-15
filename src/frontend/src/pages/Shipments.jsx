import { useState } from 'react';
import ShipmentTable from '../components/shipments/ShipmentTable.jsx';
import ShipmentFilters from '../components/shipments/ShipmentFilters.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useShipments } from '../hooks/useShipments.js';

export default function Shipments() {
  const { data: shipments, loading } = useShipments();
  const [filters, setFilters] = useState({ search: '', status: '', route: '' });

  const filtered = shipments.filter((s) => {
    const q = filters.search.toLowerCase();
    const matchSearch =
      !q ||
      s.trackingNo.toLowerCase().includes(q) ||
      s.carrier.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q);
    const matchStatus = !filters.status || s.status === filters.status;
    const matchRoute = !filters.route || s.route === filters.route;
    return matchSearch && matchStatus && matchRoute;
  });

  return (
    <div>
      <h1 className="page-title">📦 Shipments</h1>
      <ShipmentFilters filters={filters} onChange={setFilters} />
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No shipments found"
          message="Try adjusting your filters."
        />
      ) : (
        <ShipmentTable shipments={filtered} />
      )}
    </div>
  );
}
