const VARIANTS = {
  'on-time':     'success',
  'in-transit':  'info',
  'delayed':     'warning',
  'critical':    'danger',
  'high':        'danger',
  'medium':      'warning',
  'low':         'info',
  'active':      'success',
  'idle':        'neutral',
  'maintenance': 'warning',
  'resolved':    'success',
  'ok':          'success',
  'breach':      'danger',
};

export default function StatusBadge({ status }) {
  const variant = VARIANTS[status?.toLowerCase()] || 'neutral';
  return (
    <span className={`badge badge-${variant}`}>
      {status}
    </span>
  );
}
