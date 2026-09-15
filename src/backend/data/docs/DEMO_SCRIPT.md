# ChainGuard AI — Live Demo Script

**Project:** ChainGuard AI — IBM Bob AI Hackathon 2026  
**Audience:** Judges — IBM Hackathon panel  
**Duration:** ~5 minutes  
**Flow:** Mumbai Port Strike → cascade detection → AI recommendations → resolution

---

## Before You Begin

Ensure the backend is running and serving from `src/backend/data/`.  
Open the frontend dashboard in a browser.  
The system should show **SHP-102** in a critical/delayed state with cold-chain alerts visible.

---

## Step 1 — Open the Dashboard (30 seconds)

> *"This is ChainGuard AI — a real-time supply chain disruption assistant for logistics and port operations."*

**What to show:**
- Dashboard KPI bar at the top
- **Active Disruptions: 1 critical** (DIS-001 — Mumbai Port Strike)
- **Shipments at Risk: 2** (SHP-102 critical, SHP-103 high)
- **Fleet Utilisation: 59.4%** (2 idle vehicles)
- **Cold Chain Alerts: 1 critical** (SHP-102)

> *"Right now, our system has detected a port strike at JNPT Mumbai. Let me show you the cascade."*

---

## Step 2 — Show the Disruption (45 seconds)

Navigate to **Disruptions** panel.

> *"DIS-001 — an indefinite Dock Workers Union strike at Jawaharlal Nehru Port Terminal. All container operations are suspended. 35 vessels at anchor."*

**What to show:**
- `DIS-001` card: type `Port Strike`, severity `critical`, status `active`
- `affectedRoutes: RT-001, RT-006` — two corridors blocked
- `affectedCarriers: CAR-001` — Mahindra Logistics disrupted
- `analytics.disruptionSeverityScore: 95`
- `analytics.estimatedDelayHours: 168` (7 days)

> *"The system immediately identifies which routes and carriers are affected — and which shipments are on those routes."*

---

## Step 3 — Show the Affected Shipment (60 seconds)

Navigate to **Shipments** panel. Filter or click on **SHP-102**.

> *"SHP-102 — a vaccine shipment. DTP and Hepatitis B vaccines, destined for Pune cold storage. Currently held at JNPT yard."*

**What to show:**
- Status: `delayed`, Risk Level: `critical`
- `analytics.overallRiskScore: 97 / 100`
- `carrier: CAR-001` (disrupted)
- `currentRoute: RT-001` (blocked, `capacityAvailable: 0`)
- `temperatureSensitive: true`, range: `2–8°C`

> *"This shipment has three compounding problems simultaneously. The port is on strike. The primary carrier is unavailable. And — critically — the cold chain is failing."*

---

## Step 4 — Cold-Chain Excursion (60 seconds)

Navigate to **Cold Chain** panel. Select **SHP-102**.

> *"Here is the sensor timeline. When the strike began at 06:00, the reefer unit was running on generator power in open yard — ambient temperature 34°C."*

**Walk through the escalation:**

| Time | Temp | Status | Say |
|------|------|--------|-----|
| 04:00 | 3.8°C | normal | *"Normal at arrival."* |
| 07:00 | 6.7°C | ⚠️ warning | *"Warning at 07:00 — approaching upper limit."* |
| 08:00 | 8.9°C | 🔴 high | *"Excursion begins — limit breached."* |
| **09:00** | **11.4°C** | 🚨 critical | *"Critical at 11.4°C. Both sensors confirm. This is our demo moment."* |

**What to show:**
- Temperature chart showing upward curve
- Alert level badge: `CRITICAL`
- `analytics.deviationFromUpperLimit: +3.4°C`
- `analytics.excursionDurationMinutes: 60`

> *"The system doesn't just detect the breach — it already knows the cause. The port strike. And it knows the solution."*

---

## Step 5 — AI Recommendation (60 seconds)

Navigate to **Recommendations** or **AI Panel**.

> *"ChainGuard AI generates three simultaneous recommendations."*

**Recommendation 1 — Reroute:**
> *"Switch from RT-001 (blocked) to RT-002 — Nhava Sheva ICD to Pune, via Nashik. Clear route, 18 tonnes available, risk score 12 vs 95."*

- Show: `routes[RT-002]` — `affected: false`, `capacityAvailable: 18`, `routeRiskScore: 12`

**Recommendation 2 — Carrier Swap:**
> *"Replace the disrupted carrier CAR-001 with CAR-005 — Snowman Logistics. Cold-chain specialist. Preference rank 1. Available now."*

- Show: `carriers[CAR-005]` — `status: active`, `coldChainCapable: true`, `coldChainRating: specialist`, `availableCapacity: 15t`

**Recommendation 3 — Fleet Redeployment:**
> *"Deploy vehicle TR-101. It's the only idle refrigerated truck in the network — and it's already at Nhava Sheva ICD. Exactly where we need it."*

- Show: `fleet[TR-101]` — `status: idle`, `coldChainEquipped: true`, `utilization: 0%`, `location: Nhava Sheva ICD`

> *"One disruption. Three system responses. Automatically."*

---

## Step 6 — Fleet Utilisation (30 seconds)

Navigate to **Fleet** panel.

> *"While SHP-102 is the critical case, ChainGuard AI is also optimising the broader fleet."*

**What to show:**
- Fleet utilisation chart
- 2 idle vehicles flagged (TR-101 and TR-109)
- TR-104 (45%), TR-107 (35%) — partial utilisation, headspace available

> *"TR-109 is idle in Jaipur — available for any standard cargo on the Ahmedabad–Delhi corridor. The system surfaces these opportunities automatically."*

---

## Step 7 — Wrap-Up (30 seconds)

Return to Dashboard overview.

> *"ChainGuard AI connects disruption events to shipment risk, cold-chain integrity, route availability, carrier capacity, and fleet status — in one unified platform. For logistics operators at India's busiest ports, this is the difference between a spoiled vaccine shipment and a safe delivery."*

**Final Dashboard view:**
- 1 critical disruption detected
- 1 critical shipment identified (SHP-102)
- 3 recommendations generated
- 1 idle cold-chain vehicle redeployed
- 1 temperature excursion alerted

---

## Fallback — If Live Backend is Unavailable

The frontend uses mock data from `src/frontend/src/api/mockData.js` as fallback. The demo flow can be narrated against the mock data for:
- Disruptions panel: DIS-001 equivalent
- Shipments: SHP-102 data is pre-populated in shipments.json
- Cold chain chart: temperature curve from CC-001 through CC-008
- Recommendations panel: static recommendations from mockData.js

---

## Key Numbers to Cite

| Metric | Value |
|--------|-------|
| Port strike severity score | 95 / 100 |
| SHP-102 overall risk score | 97 / 100 |
| Peak excursion temperature | 11.4°C (+3.4°C above limit) |
| Excursion confirmed by | 2 sensors (SNS-102-A, SNS-102-B) |
| Alternative route risk score | 12 / 100 (vs 95 blocked) |
| Recommended carrier reliability | 94% (Snowman Logistics) |
| Fleet utilisation | 59.4% average — 2 idle vehicles |
| Time from strike to critical alert | 3 hours |

---

*ChainGuard AI — IBM Bob AI Hackathon 2026*
