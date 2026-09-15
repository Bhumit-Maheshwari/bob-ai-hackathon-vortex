# ChainGuard AI — Frontend

React + Vite frontend for the **ChainGuard AI** supply chain disruption assistant and fleet utilisation optimizer, built for the **IBM Bob AI Hackathon 2026** (Problem L2).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router DOM v6 |
| HTTP client | Axios |
| Charts | Recharts |
| Styling | Plain CSS with CSS custom properties |

---

## Getting Started

```bash
cd src/frontend
cp .env.example .env        # optional — dev proxy works without it
npm install
npm run dev                 # starts on http://localhost:3000
```

The dev server proxies `/api/*` → `http://localhost:5000` automatically.  
When the backend is not running the app falls back to rich **mock data** so the UI is always functional.

---

## Pages

| Route | Page |
|---|---|
| `/` | Dashboard — KPI cards, disruption feed, fleet chart, AI panel |
| `/shipments` | Shipments — filterable table |
| `/shipments/:id` | Shipment Detail — timeline, cold-chain readings, AI recommendations |
| `/disruptions` | Disruptions — severity-filtered card feed |
| `/fleet` | Fleet — vehicle grid + utilisation chart |
| `/cold-chain` | Cold-Chain Monitoring — sensor readings + breach alerts |

---

## Project Structure

```
src/frontend/src/
├── api/          # Axios client + domain API functions + mock data
├── hooks/        # Custom data-fetching hooks (with mock fallback)
├── components/
│   ├── layout/   # AppShell, Sidebar, TopBar
│   ├── ui/       # StatCard, StatusBadge, AlertBanner, Spinner, EmptyState
│   ├── charts/   # FleetUtilChart
│   ├── shipments/
│   ├── disruptions/
│   ├── fleet/
│   ├── coldchain/
│   └── ai/       # AiPanel, RecommendationCard
└── pages/        # One file per route
```

---

## Backend API Contract

The frontend expects the following endpoints from the backend:

| Method | Path | Description |
|---|---|---|
| GET | `/api/shipments` | List shipments (query: `status`, `route`) |
| GET | `/api/shipments/:id` | Single shipment with timeline + coldChainReadings |
| GET | `/api/disruptions` | List disruptions (query: `severity`, `active`) |
| GET | `/api/fleet` | List vehicles |
| GET | `/api/fleet/utilisation` | Fleet utilisation summary |
| GET | `/api/cold-chain` | All cold-chain readings |
| GET | `/api/cold-chain/alerts` | Breach alerts only |
| POST | `/api/ai/recommend` | AI recommendations `{ shipmentId?, fleetId? }` |

---

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

Set `VITE_API_URL` in your deployment environment to point at the production backend.
