import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';

const PAGE_TITLES = {
  '/':            'Dashboard',
  '/shipments':   'Shipments',
  '/disruptions': 'Disruptions',
  '/fleet':       'Fleet',
  '/cold-chain':  'Cold-Chain Monitoring',
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title =
    location.pathname.startsWith('/shipments/') ? 'Shipment Detail' :
    PAGE_TITLES[location.pathname] || 'ChainGuard AI';

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-area">
        <TopBar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
