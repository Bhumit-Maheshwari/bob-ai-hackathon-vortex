import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/',            icon: '📊', label: 'Dashboard' },
  { to: '/shipments',   icon: '📦', label: 'Shipments' },
  { to: '/disruptions', icon: '⚠️',  label: 'Disruptions' },
  { to: '/fleet',       icon: '🚛', label: 'Fleet' },
  { to: '/cold-chain',  icon: '❄️',  label: 'Cold Chain' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="6" fill="#3b82d4"/>
          <path d="M8 16 L14 10 L20 16 L14 22 Z" fill="white" opacity="0.9"/>
          <path d="M16 8 L24 16 L16 24 L22 16 Z" fill="white" opacity="0.5"/>
        </svg>
        <div>
          <div className="sidebar-logo-text">ChainGuard AI</div>
          <div className="sidebar-logo-sub">IBM Bob Hackathon 2026</div>
        </div>
      </div>

      <ul className="sidebar-nav">
        {NAV.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={onClose}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        L2 — Supply Chain Disruption Assistant<br />
        &amp; Fleet Utilisation Optimizer
      </div>
    </aside>
  );
}
