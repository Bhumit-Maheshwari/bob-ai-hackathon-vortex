# ChainGuard AI — Backend Handoff

**For:** Bhumit (Backend + AI/Decision Engine)  
**From:** Rudra (Data & Analytics)  
**Project:** ChainGuard AI — IBM Bob AI Hackathon 2026  
**Purpose:** Everything you need to wire up the five backend engines without re-analysing the datasets.

---

## Quick Reference — Critical Path

The entire MVP demo revolves around this single cascade. Every backend engine has one primary job to do:

```
DIS-001 (Port Strike)
  → blocks RT-001 and RT-006
  → disrupts CAR-001
  → strands SHP-102 at JNPT yard
  → cold-chain sensor SNS-102-A breaches upper limit at 08:00
  → CC-008: 11.4°C at 09:00 (alertLevel 3, both sensors confirm)
  → Recommended action:
      1. Reroute SHP-102 via RT-002
      2. Assign carrier CAR-005 (Snowman Logistics)
      3. Redeploy vehicle TR-101 (idle refrigerated truck, Nhava Sheva ICD)
```

---

## Engine 1 — Disruption Detection

**Data source:** `disruptions.json`

**What to implement:**  
Load all disruptions where `status IN ["active", "monitoring"]`. Surface the `analytics.disruptionSeverityScore` as the signal strength.

**Active disruptions right now:**

| ID | Type | Severity Score | Operational Impact | Affected Routes | Affected Carriers |
|----|------|---------------|-------------------|----------------|------------------|
| **DIS-001** | Port Strike | **95** | full-block | RT-001, RT-006 | CAR-001 |
| DIS-002 | Weather | 72 | partial-delay | RT-004 | — |
| DIS-003 | Flooding | 50 | partial-delay | RT-004 | CAR-007 |
| DIS-004 | Road Closure | 48 | partial-delay | RT-008 | — |
| DIS-005 | Geopolitical | 60 | monitoring-only | — | — |

**Cascade query (pseudo-code):**
```
for each disruption WHERE status == "active":
  affectedRoutes = disruption.affectedRoutes
  affectedShipments = shipments WHERE currentRoute IN affectedRoutes
  for each affectedShipment:
    shipment.activeDisruption = disruption.id
    shipment.riskLevel = "high" or "critical" (based on priority + disruptionSeverityScore)
```

**Field to read:** `analytics.disruptionTypeCode` — machine-readable type for the AI engine:
- `PORT_STRIKE`, `WEATHER_CYCLONE`, `WEATHER_FLOODING`, `ROAD_CLOSURE_CONSTRUCTION`, `GEOPOLITICAL_MARITIME`

---

## Engine 2 — Risk Scoring

**Data sources:** `shipments.json`, `disruptions.json`, `coldChain.json`

**What to implement:**  
Compute `overallRiskScore` per shipment. The datasets include pre-seeded scores in `analytics.overallRiskScore` — use these as baseline values or recompute dynamically.

**Input weights (from `backend_integration.json`):**

| Input Field | Source | Weight |
|-------------|--------|--------|
| `shipmentPriorityScore` | `shipments[].analytics` | 20% |
| `delayRiskScore` | `shipments[].analytics` | 30% |
| `coldChainRisk` | `shipments[].analytics` | 25% |
| `disruptionExposure` | via `activeDisruption → disruptions[].analytics.disruptionSeverityScore` | 25% |

**Score thresholds:**

| Range | Level | Action |
|-------|-------|--------|
| 0–25 | low | None |
| 26–50 | medium | Monitor |
| 51–75 | high | Recommend reroute |
| 76–100 | critical | Emergency action |

**Current shipment risk scores (pre-seeded):**

| Shipment | Priority Score | Delay Risk | Cold Chain Risk | Disruption | Overall |
|----------|---------------|------------|-----------------|------------|---------|
| **SHP-102** | 100 | 95 | 95 | critical | **97** |
| SHP-110 | 65 | 72 | 30 | medium | 70 |
| SHP-103 | 30 | 82 | 0 | high | 78 |
| SHP-104 | 60 | 55 | 0 | medium | 52 |
| SHP-105 | 25 | 55 | 0 | medium | 48 |
| SHP-107 | 55 | 10 | 0 | none | 12 |
| SHP-108 | 90 | 12 | 15 | none | 18 |

---

## Engine 3 — Route Recommendation

**Data source:** `routes.json`

**What to implement:**  
When a shipment's `currentRoute.affected == true`, find alternatives using this filter:

```
routes WHERE alternativeFor == shipment.currentRoute
       AND  analytics.isOperational == true
       AND  capacityAvailable >= shipment.weight
ORDER BY analytics.routeRiskScore ASC
```

**All current recommendations:**

| Blocked Route | Affected Shipments | → Recommended Alternative | Risk Score ↓ | Extra Cost |
|--------------|-------------------|--------------------------|-------------|-----------|
| **RT-001** | **SHP-102** | **RT-002** | 12 (vs 95) | +₹3,500 |
| RT-006 | SHP-103 | RT-007 | 14 (vs 92) | −₹7,000 |
| RT-004 | SHP-104 | RT-005 | 10 (vs 55) | +₹3,500 |
| RT-008 | SHP-105, SHP-110 | RT-009 | 16 (vs 52) | −₹8,000 |

**Fields to read on `routes.json`:**
- `analytics.isOperational` — use this, not `affected`, for the operational check (affected but partial ≠ non-operational)
- `analytics.recommendForReroute` — pre-computed convenience flag
- `capacityAvailable` — always check cargo weight fits
- `estimatedTimeHours` — numeric, use for ETA recalculation
- `cost` — use for cost-benefit display

---

## Engine 4 — Carrier Recommendation

**Data source:** `carriers.json`

**What to implement:**  
When a shipment's carrier is disrupted, find alternatives:

```
carriers WHERE status == "active"
         AND  analytics.isAvailableForAssignment == true
         AND  availableCapacity >= shipment.weight
         AND  operatingRoutes includes recommendedRoute
         AND  (shipment.temperatureSensitive == false OR coldChainCapable == true)
ORDER BY analytics.preferenceRank ASC
```

**Current recommendations:**

| Shipment | Disrupted Carrier | → Rank 1 Alternative | Cold Chain | Reliability |
|----------|------------------|---------------------|------------|-------------|
| **SHP-102** | CAR-001 | **CAR-005 (Snowman)** | ✅ specialist | 94% |
| SHP-102 (backup) | CAR-001 | CAR-002 (Blue Dart) | ✅ certified | 96% |
| SHP-103 | — | CAR-004 (Spoton) | ❌ | 90% |
| SHP-104 | — | CAR-003 (VRL) | ❌ | 88% |

**Key carrier fields:**
- `analytics.preferenceRank` — 1 = best; 99 = disrupted/unavailable
- `analytics.coldChainRating` — `none`, `certified`, `specialist`
- `analytics.isAvailableForAssignment` — pre-computed: `status == active AND availableCapacity > 0`
- `analytics.carrierTypeCode` — for filtering by modality

---

## Engine 5 — Fleet Redeployment

**Data source:** `fleet.json`

**What to implement:**  
When a shipment needs a vehicle and the assigned vehicle/carrier is unavailable:

```
fleet WHERE analytics.isRedeploymentCandidate == true
      AND  analytics.availableCapacityTonnes >= shipment.weight
      AND  (shipment.temperatureSensitive == false OR coldChainEquipped == true)
ORDER BY analytics.redeploymentPriority DESC,
         analytics.coldChainScore DESC
```

**For SHP-102 specifically:** `shipment.weight = 3.2t`, `temperatureSensitive = true`

**Only one vehicle passes all filters:**

| Vehicle | Idle | Cold Chain | Capacity | Priority | Proximity |
|---------|------|------------|---------|---------|-----------|
| **TR-101** | ✅ | ✅ | 8.0t | **critical** | **near** |
| TR-102 | ❌ | ✅ | 2.5t free | low | distant |
| TR-109 | ✅ | ❌ | 20.0t | medium | distant |

→ **TR-101 is the only correct answer.**

**Fleet aggregate (for `/api/fleet/utilisation` endpoint):**

```json
{
  "totalVehicles": 9,
  "activeVehicles": 7,
  "idleVehicles": 2,
  "averageUtilizationPct": 59.4,
  "coldChainVehicles": 2,
  "idleColdChainVehicles": 1,
  "redeploymentCandidates": 4
}
```

Compute this by aggregating `analytics.fleetUtilizationPct` across all fleet records.

---

## Engine 6 — Cold-Chain Monitoring

**Data source:** `coldChain.json`

**What to implement:**

**Alert endpoint** (`GET /api/cold-chain/alerts`):
```
coldChain WHERE analytics.triggerAlert == true
ORDER BY analytics.alertLevel DESC, timestamp DESC
```
Returns 7 records: CC-004, CC-005, CC-006, CC-007, CC-008, CC-009, CC-015.

**Per-shipment readings** (`GET /api/cold-chain/:shipmentId`):
```
coldChain WHERE shipmentId == :shipmentId
ORDER BY timestamp ASC
```

**Alert level actions:**

| Level | Label | Action |
|-------|-------|--------|
| 0 | normal | None |
| 1 | warning | Log and monitor |
| 2 | high | Notify carrier |
| 3 | **critical** | **Emergency escalation → trigger reroute engine** |

**The moment to escalate for SHP-102:**  
Reading `CC-008` — `alertLevel: 3`, `isExcursion: true`, `excursionDurationMinutes: 60`, `deviationFromUpperLimit: 3.4`.  
At this point, the cold-chain engine should **trigger the route recommendation + carrier + fleet engines** for SHP-102 in a compound response.

**Deviation formula the engine can use:**
```
deviationFromUpperLimit = temperature - requiredTemperatureRange.max
isExcursion             = deviationFromUpperLimit > 0
```
(These are pre-computed in each reading's `analytics` block — no re-calculation needed for the MVP.)

---

## API Endpoint Map

All endpoints are documented in `backend_integration.json`. Summary:

| Method | Path | Data File | Notes |
|--------|------|-----------|-------|
| GET | `/api/disruptions` | disruptions.json | Filter `status=active` |
| GET | `/api/disruptions/:id` | disruptions.json | |
| GET | `/api/shipments` | shipments.json | Supports `?riskLevel=`, `?status=`, `?scenarioTag=` |
| GET | `/api/shipments/:id` | shipments.json | |
| GET | `/api/fleet` | fleet.json | |
| GET | `/api/fleet/utilisation` | fleet.json | Aggregate from `analytics.fleetUtilizationPct` |
| GET | `/api/fleet/redeployment` | fleet.json | Filter `isRedeploymentCandidate == true` |
| GET | `/api/routes` | routes.json | Supports `?affected=true|false` |
| GET | `/api/routes/:id/alternatives` | routes.json | Filter `alternativeFor == :id AND isOperational == true` |
| GET | `/api/carriers` | carriers.json | Supports `?coldChainCapable=true`, `?status=active` |
| GET | `/api/cold-chain` | coldChain.json | |
| GET | `/api/cold-chain/:shipmentId` | coldChain.json | Filter + sort by timestamp |
| GET | `/api/cold-chain/alerts` | coldChain.json | Filter `triggerAlert == true` |
| GET | `/api/scenarios` | scenarios.json | |
| GET | `/api/scenarios/:tag` | scenarios.json | e.g. `?tag=D_CRITICAL` |

---

## Data Files Location

```
src/backend/data/
├── disruptions.json
├── shipments.json
├── fleet.json
├── routes.json
├── carriers.json
├── coldChain.json
├── scenarios.json
├── backend_integration.json   ← full machine-readable spec
└── docs/
    ├── VALIDATION_REPORT.md
    ├── TEST_SCENARIOS.md
    ├── DEMO_SCRIPT.md
    ├── DATA_RELATIONSHIPS.md
    ├── BACKEND_HANDOFF.md     ← this file
    └── FRONTEND_HANDOFF.md
```

---

*ChainGuard AI — IBM Bob AI Hackathon 2026*
