import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

export default function FleetUtilChart({ util }) {
  if (!util) return null;

  const data = [
    { name: 'Active',      value: util.active,      fill: '#3b82d4' },
    { name: 'Idle',        value: util.idle,         fill: '#94a3b8' },
    { name: 'Maintenance', value: util.maintenance,  fill: '#f59e0b' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 28, fontWeight: 700 }}>{util.utilisationPct?.toFixed(1)}%</span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          fleet utilisation · {util.active}/{util.totalVehicles} vehicles active
        </span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barSize={36} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v) => [`${v} vehicles`, '']}
            contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
