export default function StatCard({ label, value, sub, variant = 'accent' }) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}
