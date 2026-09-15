import { useState } from 'react';
import DisruptionCard from '../components/disruptions/DisruptionCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useDisruptions } from '../hooks/useDisruptions.js';

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

export default function Disruptions() {
  const { data: disruptions, loading } = useDisruptions();
  const [severity, setSeverity] = useState('All');
  const [showResolved, setShowResolved] = useState(false);

  const filtered = disruptions.filter((d) => {
    const matchSeverity = severity === 'All' || d.severity === severity;
    const matchResolved = showResolved || !d.resolved;
    return matchSeverity && matchResolved;
  });

  return (
    <div>
      <h1 className="page-title">⚠️ Disruptions</h1>

      {/* Severity tabs */}
      <div className="tab-bar">
        {SEVERITIES.map((s) => (
          <button
            key={s}
            className={`tab-btn${severity === s ? ' active' : ''}`}
            onClick={() => setSeverity(s)}
          >
            {s}
            {s !== 'All' && (
              <span style={{ marginLeft: 4, opacity: 0.7 }}>
                ({disruptions.filter((d) => d.severity === s && (showResolved || !d.resolved)).length})
              </span>
            )}
          </button>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8, fontSize: 12.5, cursor: 'pointer', color: 'var(--muted)' }}>
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          Show resolved
        </label>
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No disruptions"
          message="No disruptions match your current filter."
        />
      ) : (
        <div className="disruption-feed">
          {filtered.map((d) => (
            <DisruptionCard key={d.id} disruption={d} />
          ))}
        </div>
      )}
    </div>
  );
}
