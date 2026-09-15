const VARIANTS = {
  // shipment statuses (real backend)
  'in-transit':          'info',
  'delayed':             'warning',
  'at-risk':             'warning',
  'pending-dispatch':    'neutral',
  'delivered':           'success',

  // risk / severity levels
  'critical':            'danger',
  'high':                'danger',
  'medium':              'warning',
  'low':                 'info',
  'normal':              'success',

  // disruption / carrier statuses
  'active':              'success',
  'disrupted':           'danger',
  'monitoring':          'warning',
  'resolved':            'success',

  // fleet statuses
  'idle':                'neutral',
  'maintenance':         'warning',

  // cold-chain alert statuses
  'warning':             'warning',
  'breach':              'danger',
  'ok':                  'success',

  // legacy mock compat
  'on-time':             'success',
};

export default function StatusBadge({ status }) {
  const variant = VARIANTS[status?.toLowerCase()] || 'neutral';
  return (
    <span className={`badge badge-${variant}`}>
      {status}
    </span>
  );
}
