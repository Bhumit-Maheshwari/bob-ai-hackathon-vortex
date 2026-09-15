import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Shipments from './pages/Shipments.jsx';
import ShipmentDetail from './pages/ShipmentDetail.jsx';
import Disruptions from './pages/Disruptions.jsx';
import Fleet from './pages/Fleet.jsx';
import ColdChain from './pages/ColdChain.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/"              element={<Dashboard />} />
        <Route path="/shipments"     element={<Shipments />} />
        <Route path="/shipments/:id" element={<ShipmentDetail />} />
        <Route path="/disruptions"   element={<Disruptions />} />
        <Route path="/fleet"         element={<Fleet />} />
        <Route path="/cold-chain"    element={<ColdChain />} />
      </Route>
    </Routes>
  );
}
