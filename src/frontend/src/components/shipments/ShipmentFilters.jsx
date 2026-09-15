export default function ShipmentFilters({ filters, onChange }) {
  return (
    <div className="filters-bar">
      <input
        className="filter-input"
        placeholder="Search tracking no. or carrier…"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        style={{ minWidth: 220 }}
      />
      <select
        className="filter-select"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="On-Time">On-Time</option>
        <option value="In-Transit">In-Transit</option>
        <option value="Delayed">Delayed</option>
        <option value="Critical">Critical</option>
      </select>
      <select
        className="filter-select"
        value={filters.route}
        onChange={(e) => onChange({ ...filters, route: e.target.value })}
      >
        <option value="">All Routes</option>
        <option value="ASIA-US-WEST">ASIA-US-WEST</option>
        <option value="EU-US-EAST">EU-US-EAST</option>
        <option value="ASIA-EU">ASIA-EU</option>
        <option value="ME-IN">ME-IN</option>
        <option value="ASIA-PACIFIC">ASIA-PACIFIC</option>
      </select>
    </div>
  );
}
