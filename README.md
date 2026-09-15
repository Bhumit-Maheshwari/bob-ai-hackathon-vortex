# 🌐 ChainGuard AI

> **Supply Chain Disruption Assistant & Fleet Utilisation Optimizer**  
> Built for **IBM Bob AI Hackathon 2026** (Problem Statement: L2)

---

## 📌 Overview

**ChainGuard AI** is an intelligent supply chain management platform designed to predict, detect, and mitigate logistics disruptions while maximizing fleet efficiency and safeguarding temperature-sensitive cargo (cold chain).

### 🚀 Key Capabilities

- **Real-Time KPI Dashboard**: High-level visibility into active shipments, critical disruptions, cold-chain threshold breaches, and fleet utilisation metrics.
- **Supply Chain Disruption Feed**: Severity-categorized alerts (Critical, High, Medium, Low) with automated root-cause detection and affected route tracking.
- **Fleet Utilisation Optimizer**: Interactive vehicle status grids, live load capacities vs. limits, and Recharts utilisation bar charts.
- **Cold-Chain Sensor Monitoring**: Real-time temperature & humidity telemetry with threshold breach alerts and audit logging.
- **IBM watsonx AI Recommendations**: Context-aware AI mitigation actions, alternative routing suggestions, and fleet rebalancing recommendations.
- **Resilient Mock Fallback Architecture**: Automatically switches to rich mock datasets whenever the backend API is offline, ensuring zero downtime for presentations and evaluations.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite 5 |
| **Routing** | React Router DOM v6 |
| **Data Visualisation** | Recharts |
| **HTTP Client** | Axios (with transparent API proxy & mock fallback) |
| **Styling** | Modern CSS custom properties (Dark theme, glassmorphic accents) |
| **AI Integration** | IBM watsonx AI recommendation contract |

---

## 📂 Project Structure

```text
ChainGuard AI/
├── .gitignore
├── README.md
└── src/
    └── frontend/
        ├── public/
        ├── src/
        │   ├── api/          # Axios client, domain API endpoints & mock fallbacks
        │   ├── components/   # Modular UI components (charts, fleet, cold-chain, AI, layout)
        │   ├── hooks/        # Custom React hooks with mock-failover logic
        │   ├── pages/        # Dashboard, Shipments, ShipmentDetail, Disruptions, Fleet, ColdChain
        │   ├── App.jsx       # Route definitions
        │   ├── main.jsx      # React entry point
        │   └── index.css     # Design system & dark theme stylesheet
        ├── package.json
        ├── vite.config.js
        └── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Local Run

1. Navigate to the frontend directory:
   ```bash
   cd src/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port Vite outputs) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🛡️ Hackathon Submission
- **Event**: IBM Bob AI Hackathon 2026
- **Track**: Problem L2 — Supply Chain Disruption Assistant & Fleet Utilisation Optimizer
- **Team**: Vortex
