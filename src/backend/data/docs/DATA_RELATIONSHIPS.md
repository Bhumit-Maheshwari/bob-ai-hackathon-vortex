# ChainGuard AI — Data Relationships

**Project:** ChainGuard AI — IBM Bob AI Hackathon 2026  
**Role:** Rudra — Data & Analytics  
**Purpose:** Explains how all six datasets connect to each other and how data flows through the system.

---

## Overview

ChainGuard AI uses six interconnected datasets. The core relationship flows from disruption events downward through routes and carriers to shipments, and from shipments outward to fleet vehicles and cold-chain sensor readings.

```
disruptions.json
      │
      │  affects routes and carriers
      ▼
routes.json ◄────────────────────┐
      │                          │
      │  shipments travel on     │ alternativeFor (self-link)
      ▼                          │
shipments.json ──────────────────┘
      │  \  \
      │   \  └──► carriers.json
      │    └────► fleet.json (suggestedVehicle)
      ▼
coldChain.json
(sensor readings per shipmentId)
```

---

## Dataset 1 — `disruptions.json`

**What it is:** The source of all risk in the system. Each record describes one active disruption event (port strike, weather, road closure, geopolitical).

**Key outgoing links:**
| Field | Links to | Meaning |
|-------|----------|---------|
| `affectedRoutes[]` | `routes.json[id]` | Which routes are blocked or degraded |
| `affectedCarriers[]` | `carriers.json[id]` | Which carriers are operationally impacted |

**How it is used:**
- Backend reads `status == "active"` disruptions first
- `analytics.disruptionSeverityScore` (0–100) drives the risk engine's disruption weight
- `affectedRoutes` is the join key connecting disruptions to shipments (via the route they are using)

**Example:**
```
DIS-001 (Port Strike)
  → affectedRoutes: [RT-001, RT-006]
  → affectedCarriers: [CAR-001]
```

---

## Dataset 2 — `routes.json`

**What it is:** Every freight corridor in the network — both primary routes and their pre-identified alternatives.

**Key incoming links:**
| Source | Field | Meaning |
|--------|-------|---------|
| `disruptions.json` | `affectedRoutes[]` | This route is disrupted by a specific event |

**Key outgoing links:**
| Field | Links to | Meaning |
|-------|----------|---------|
| `affectedBy` | `disruptions.json[id]` | The disruption causing the route's affected status |
| `alternativeFor` | `routes.json[id]` | Self-referential — this route is an alternative to another route |

**How it is used:**
- `affected == true` → route is currently disrupted
- `analytics.isOperational == false` → route cannot accept cargo (fully blocked)
- `analytics.recommendForReroute == true` → this is a safe alternative the engine should surface
- `alternativeFor` is the key the backend uses to find alternatives: `WHERE alternativeFor = shipment.currentRoute AND isOperational = true`

**Primary → Alternative pairs:**

| Primary | Blocked By | Alternative | Reason |
|---------|-----------|-------------|--------|
| RT-001 | DIS-001 (Port Strike) | **RT-002** | Nhava Sheva ICD bypass |
| RT-004 | DIS-003 (Weather) | **RT-005** | Salem bypass |
| RT-006 | DIS-001 (Port Strike) | **RT-007** | DFC western arm to Mundra |
| RT-008 | DIS-004 (Road Closure) | **RT-009** | Eastern DFC rail |

---

## Dataset 3 — `shipments.json`

**What it is:** The central entity. Every shipment has a carrier, a current route, and optional links to a disruption, alternative routes, alternative carriers, and a suggested fleet vehicle.

**Key incoming links:**
- None — shipments are the hub, not a leaf

**Key outgoing links:**
| Field | Links to | Meaning |
|-------|----------|---------|
| `carrier` | `carriers.json[id]` | Who is handling this shipment right now |
| `currentRoute` | `routes.json[id]` | Which corridor the shipment is on |
| `activeDisruption` | `disruptions.json[id]` | The disruption currently affecting this shipment |
| `alternativeRoutes[]` | `routes.json[id]` | Safe routes the backend can recommend |
| `alternativeCarriers[]` | `carriers.json[id]` | Carriers available to take over |
| `suggestedVehicle` | `fleet.json[id]` | Idle vehicle suitable for emergency redeployment |

**How it is used:**
- `analytics.overallRiskScore` is the primary sort key for the dashboard shipments list
- `analytics.actionRequired == true` triggers a recommendation
- `temperatureSensitive == true` connects the shipment to `coldChain.json`

**Shipment risk spectrum:**

| Score Range | Level | Shipments |
|-------------|-------|-----------|
| 0–15 | Low | SHP-101, 106, 109, 111, 112 |
| 10–25 | Low-Med | SHP-107, SHP-108 |
| 45–55 | Medium | SHP-104, SHP-105 |
| 70–78 | High | SHP-103, SHP-110 |
| 97 | **Critical** | **SHP-102** |

---

## Dataset 4 — `carriers.json`

**What it is:** All logistics operators in the network — road, rail, express, cold-chain specialist.

**Key incoming links:**
| Source | Field | Meaning |
|--------|-------|---------|
| `disruptions.json` | `affectedCarriers[]` | This carrier is impacted by a disruption |
| `shipments.json` | `carrier` | This carrier is assigned to a shipment |
| `shipments.json` | `alternativeCarriers[]` | This carrier is a recommended alternative |
| `fleet.json` | `carrier` | Fleet vehicles belong to this carrier |

**Key outgoing links:**
| Field | Links to | Meaning |
|-------|----------|---------|
| `operatingRoutes[]` | `routes.json[id]` | Which corridors this carrier services |

**How it is used:**
- `analytics.isAvailableForAssignment == true` → can be recommended
- `coldChainCapable == true` → required for pharmaceutical/temperature-sensitive cargo
- `analytics.preferenceRank` (1 = best) — used to rank alternatives

**Carrier status for demo:**

| Carrier | Status | Cold Chain | Preference |
|---------|--------|------------|------------|
| CAR-001 (Mahindra) | **disrupted** | ✅ | 99 (unavailable) |
| CAR-002 (Blue Dart) | active | ✅ | 1 |
| CAR-003 (VRL) | active | ❌ | 3 |
| CAR-004 (Spoton) | active | ❌ | 2 |
| **CAR-005 (Snowman)** | **active** | ✅ specialist | **1** |
| CAR-006 (CONCOR) | active | ❌ | 4 |
| CAR-007 (Gati KWE) | active | ❌ | 5 |

---

## Dataset 5 — `fleet.json`

**What it is:** All physical vehicles — trucks, trailers — with real-time load, utilisation, and redeployment analytics.

**Key incoming links:**
| Source | Field | Meaning |
|--------|-------|---------|
| `shipments.json` | `suggestedVehicle` | This vehicle is recommended for an emergency |

**Key outgoing links:**
| Field | Links to | Meaning |
|-------|----------|---------|
| `carrier` | `carriers.json[id]` | Which carrier operates this vehicle |

**How it is used:**
- `analytics.isRedeploymentCandidate == true` → surfaced by the fleet redeployment engine
- `analytics.fleetUtilizationPct` → drives the fleet utilisation dashboard chart
- `coldChainEquipped == true` → required filter for pharmaceutical redeployment

**Fleet summary:**

| ID | Type | Utilisation | Cold Chain | Candidate |
|----|------|-------------|------------|-----------|
| **TR-101** | Refrigerated Truck | **0% (idle)** | ✅ | ✅ Critical |
| TR-102 | Refrigerated Truck | 83% | ✅ | ❌ |
| TR-103 | Flatbed | 93% | ❌ | ❌ |
| TR-104 | Box Truck | 45% | ❌ | ✅ Medium |
| TR-105 | Container | 91% | ❌ | ❌ |
| TR-106 | Container | 88% | ❌ | ❌ |
| TR-107 | Trailer | 35% | ❌ | ✅ Medium |
| TR-108 | Box Truck | 100% | ❌ | ❌ |
| **TR-109** | Container | **0% (idle)** | ❌ | ✅ General |

---

## Dataset 6 — `coldChain.json`

**What it is:** IoT sensor time-series data for temperature-sensitive shipments. Each record is one sensor reading at one checkpoint.

**Key incoming links:**
| Source | Field | Meaning |
|--------|-------|---------|
| `shipments.json` | `temperatureSensitive == true` | Shipment is expected to have sensor readings |

**Key outgoing links:**
| Field | Links to | Meaning |
|-------|----------|---------|
| `shipmentId` | `shipments.json[id]` | Which shipment this reading belongs to |

**How it is used:**
- Sort by `timestamp` per `shipmentId` to get time-series
- `analytics.triggerAlert == true` → feed into `/api/cold-chain/alerts`
- `analytics.alertLevel` 0–3 maps to notification severity
- `analytics.isExcursion == true` → confirmed breach, not just a warning
- `analytics.deviationFromUpperLimit` → positive means breach; negative means safe margin

**Monitored shipments:**

| Shipment | Cargo | Sensors | Max Alert | Critical Reading |
|----------|-------|---------|-----------|-----------------|
| **SHP-102** | Vaccines | SNS-102-A, SNS-102-B | **3 — Critical** | **CC-008 (11.4°C)** |
| SHP-108 | Insulin | SNS-108-A, SNS-108-B | 1 — Warning (transient) | CC-015 (6.8°C, recovered) |

---

## Complete Relationship Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        disruptions.json                         │
│  DIS-001 (Port Strike, critical, score 95)                      │
│  DIS-002 (Weather, high, score 72)                              │
│  DIS-003 (Flooding, medium, score 50)                           │
│  DIS-004 (Road Closure, medium, score 48)                       │
│  DIS-005 (Geopolitical, high, monitoring)                       │
└───────┬──────────────────────────────────────┬──────────────────┘
        │ affectedRoutes[]                      │ affectedCarriers[]
        ▼                                       ▼
┌───────────────────────┐           ┌───────────────────────────┐
│      routes.json      │           │       carriers.json        │
│  RT-001 (blocked)     │           │  CAR-001 (disrupted) ◄─┐  │
│  RT-002 (clear) ◄──┐  │           │  CAR-002 (active)      │  │
│  RT-003 (clear)    │  │           │  CAR-003 (active)      │  │
│  RT-004 (affected) │  │           │  CAR-004 (active)      │  │
│  RT-005 (clear) ◄──┘  │           │  CAR-005 (active) ◄──┐ │  │
│  ...                  │           │  CAR-006 (active)    │ │  │
│  alternativeFor ──────┘           │  CAR-007 (active)    │ │  │
└────────────┬──────────┘           └─────────────┬─────────┘ │  │
             │ currentRoute                        │ carrier   │  │
             │                                     │           │  │
             └──────────┬──────────────────────────┘           │  │
                        ▼                                       │  │
             ┌──────────────────────────────────────┐          │  │
             │            shipments.json             │          │  │
             │  SHP-101 (low risk)                   │          │  │
             │  SHP-102 (CRITICAL) ─────────────────────────────┘  │
             │    ├── carrier: CAR-001 ──────────────────────────────┘
             │    ├── currentRoute: RT-001
             │    ├── activeDisruption: DIS-001
             │    ├── alternativeRoutes: [RT-002]
             │    ├── alternativeCarriers: [CAR-002, CAR-005]
             │    └── suggestedVehicle: TR-101 ───────────┐
             │  SHP-103..112 (various risk levels)        │
             └────────────────────────────────────────────┼──┘
                        │ shipmentId                       │
                        ▼                                  ▼
             ┌──────────────────┐            ┌────────────────────┐
             │  coldChain.json  │            │     fleet.json     │
             │  CC-001..CC-009  │            │  TR-101 (idle) ◄───┘
             │  (SHP-102 trace) │            │  TR-102..TR-109    │
             │  CC-008 CRITICAL │            │  carrier → CAR-xxx │
             │  CC-010..CC-015  │            └────────────────────┘
             │  (SHP-108 trace) │
             └──────────────────┘
```

---

## Join Patterns for Backend Queries

### "Which shipments are affected by a disruption?"
```
disruption.affectedRoutes[]
  → routes WHERE id IN affectedRoutes
  → shipments WHERE currentRoute IN routes.id
```

### "What is the best alternative route for a shipment?"
```
routes WHERE alternativeFor == shipment.currentRoute
       AND  analytics.isOperational == true
       AND  capacityAvailable >= shipment.weight
ORDER BY analytics.routeRiskScore ASC
LIMIT 1
```

### "Which carrier can replace the disrupted one for a cold-chain shipment?"
```
carriers WHERE status == "active"
         AND  analytics.isAvailableForAssignment == true
         AND  coldChainCapable == true
         AND  availableCapacity >= shipment.weight
         AND  operatingRoutes includes alternativeRoute
ORDER BY analytics.preferenceRank ASC
```

### "Which idle fleet vehicle can be redeployed for an emergency cold-chain shipment?"
```
fleet WHERE analytics.isRedeploymentCandidate == true
      AND  coldChainEquipped == true
      AND  analytics.availableCapacityTonnes >= shipment.weight
ORDER BY analytics.redeploymentPriority DESC,
         analytics.coldChainScore DESC
LIMIT 1
```

### "What are the active cold-chain alerts?"
```
coldChain WHERE analytics.triggerAlert == true
ORDER BY analytics.alertLevel DESC, timestamp DESC
```

---

*ChainGuard AI — IBM Bob AI Hackathon 2026*
