# ChainGuard AI — Frontend Handoff

**For:** Harshil (Frontend)  
**From:** Rudra (Data & Analytics)  
**Project:** ChainGuard AI — IBM Bob AI Hackathon 2026  
**Purpose:** Exact data shapes and sample values your components should receive from Bhumit's API. Use these to verify data binding and UI state.

---

## Dashboard KPIs

These four values should appear in the top `StatCard` row on `Dashboard.jsx`.

| KPI | Value | Source Field | Colour |
|-----|-------|-------------|--------|
| Active Disruptions | **1 critical** | `disruptions` filtered `status=active AND severity=critical` | Red |
| Shipments at Risk | **4** (critical + high) | `shipments` filtered `riskLevel IN [critical, high]` | Orange |
| Fleet Utilisation | **59.4%** | Avg of `fleet[].analytics.fleetUtilizationPct` | Amber |
| Cold-Chain Alerts | **1 critical** | `coldChain` filtered `analytics.alertLevel == 3` | Red |

**Sample `StatCard` data shapes:**
```json
{ "label": "Active Disruptions",  "value": "1",     "unit": "critical",  "variant": "danger"  }
{ "label": "Shipments at Risk",   "value": "4",     "unit": "shipments", "variant": "warning" }
{ "label": "Fleet Utilisation",   "value": "59.4",  "unit": "%",         "variant": "warning" }
{ "label": "Cold-Chain Alerts",   "value": "1",     "unit": "critical",  "variant": "danger"  }
```

---

## Active Disruptions Panel

These records should appear in the `DisruptionCard` component on the **Disruptions** page.

### DIS-001 — Port Strike (primary demo alert)
```json
{
  "id": "DIS-001",
  "type": "Port Strike",
  "subType": "Labour Action",
  "location": "Mumbai Port (JNPT), Maharashtra",
  "severity": "critical",
  "status": "active",
  "startTime": "2026-01-20T06:00:00+05:30",
  "endTime": null,
  "affectedRoutes": ["RT-001", "RT-006"],
  "affectedCarriers": ["CAR-001"],
  "description": "Dock Workers Union strike — all container operations suspended. ~35 vessels at anchor.",
  "analytics": {
    "disruptionSeverityScore": 95,
    "operationalImpact": "full-block",
    "estimatedDelayHours": 168,
    "affectedShipmentCount": 2
  }
}
```
**UI Expectation:** Show red badge `CRITICAL`. Display affected routes and carriers. `endTime: null` → show "Open-ended".

### DIS-002 — Cyclone Weather
```json
{
  "id": "DIS-002",
  "type": "Severe Weather",
  "subType": "Cyclonic Storm",
  "severity": "high",
  "status": "active",
  "analytics": { "disruptionSeverityScore": 72, "estimatedDelayHours": 15 }
}
```

### DIS-003 — Road Flooding
```json
{
  "id": "DIS-003",
  "type": "Severe Weather",
  "subType": "Road Flooding",
  "severity": "medium",
  "status": "active",
  "analytics": { "disruptionSeverityScore": 50, "estimatedDelayHours": 4 }
}
```

### DIS-004 — Road Closure
```json
{
  "id": "DIS-004",
  "type": "Road Closure",
  "severity": "medium",
  "status": "active",
  "analytics": { "disruptionSeverityScore": 48, "estimatedDelayHours": 5 }
}
```

---

## High-Risk Shipments List

These records should appear in the `ShipmentTable` component, sorted by `analytics.overallRiskScore` descending.

### SHP-102 — CRITICAL (primary demo)
```json
{
  "id": "SHP-102",
  "trackingNo": "TRK-20260120-102",
  "origin": "Mumbai Port (JNPT)",
  "destination": "Pune Warehouse",
  "currentLocation": "Mumbai Port (JNPT) – Yard Hold",
  "cargoType": "Pharmaceuticals – Vaccines (DTP, Hepatitis B)",
  "priority": "critical",
  "weight": 3.2,
  "carrier": "CAR-001",
  "currentRoute": "RT-001",
  "expectedDelivery": "2026-01-20T14:00:00+05:30",
  "status": "delayed",
  "riskLevel": "critical",
  "temperatureSensitive": true,
  "requiredTemperatureRange": { "min": 2, "max": 8, "unit": "°C" },
  "activeDisruption": "DIS-001",
  "alternativeRoutes": ["RT-002"],
  "alternativeCarriers": ["CAR-002", "CAR-005"],
  "suggestedVehicle": "TR-101",
  "analytics": {
    "shipmentPriorityScore": 100,
    "overallRiskScore": 97,
    "actionRequired": true,
    "actionType": "EMERGENCY_REROUTE_AND_CARRIER_SWAP",
    "estimatedDelayHours": 48
  }
}
```
**UI Expectation:** Red `CRITICAL` badge. Show cold-chain alert icon. `actionRequired: true` → show recommendation button.

### SHP-103 — HIGH RISK
```json
{
  "id": "SHP-103",
  "currentLocation": "Kota, Rajasthan",
  "cargoType": "Textiles – Garment Export",
  "status": "at-risk",
  "riskLevel": "high",
  "activeDisruption": "DIS-001",
  "analytics": { "overallRiskScore": 78, "actionRequired": true, "actionType": "REROUTE", "estimatedDelayHours": 72 }
}
```

### SHP-110 — HIGH RISK
```json
{
  "id": "SHP-110",
  "currentLocation": "Patna, Bihar",
  "cargoType": "Agricultural Produce – Frozen Shrimp",
  "status": "at-risk",
  "riskLevel": "high",
  "activeDisruption": "DIS-004",
  "analytics": { "overallRiskScore": 70, "actionRequired": true, "actionType": "REROUTE", "estimatedDelayHours": 5 }
}
```

### SHP-104 — MEDIUM RISK (delayed)
```json
{
  "id": "SHP-104",
  "currentLocation": "Tindivanam, Tamil Nadu",
  "cargoType": "Automotive Parts – OEM",
  "status": "delayed",
  "riskLevel": "medium",
  "activeDisruption": "DIS-003",
  "analytics": { "overallRiskScore": 52, "actionRequired": true, "actionType": "REROUTE", "estimatedDelayHours": 5 }
}
```

---

## Fleet Utilisation Panel

Data for `FleetUtilChart.jsx` and `VehicleCard.jsx` components.

### Fleet Summary (for chart)
```json
{
  "totalVehicles": 9,
  "activeVehicles": 7,
  "idleVehicles": 2,
  "averageUtilizationPct": 59.4,
  "coldChainVehicles": 2,
  "idleColdChainVehicles": 1
}
```

### Chart Data (utilisation bar chart)
```json
[
  { "id": "TR-101", "label": "TR-101 (Refrig.)", "utilization": 0,   "status": "idle",   "coldChain": true  },
  { "id": "TR-102", "label": "TR-102 (Refrig.)", "utilization": 83,  "status": "active", "coldChain": true  },
  { "id": "TR-103", "label": "TR-103 (Flatbed)", "utilization": 93,  "status": "active", "coldChain": false },
  { "id": "TR-104", "label": "TR-104 (Box)",     "utilization": 45,  "status": "active", "coldChain": false },
  { "id": "TR-105", "label": "TR-105 (Contain)", "utilization": 91,  "status": "active", "coldChain": false },
  { "id": "TR-106", "label": "TR-106 (Contain)", "utilization": 88,  "status": "active", "coldChain": false },
  { "id": "TR-107", "label": "TR-107 (Trailer)", "utilization": 35,  "status": "active", "coldChain": false },
  { "id": "TR-108", "label": "TR-108 (Box)",     "utilization": 100, "status": "active", "coldChain": false },
  { "id": "TR-109", "label": "TR-109 (Contain)", "utilization": 0,   "status": "idle",   "coldChain": false }
]
```

### Idle Vehicles — Redeployment Candidates (for alert banner)
```json
[
  {
    "id": "TR-101",
    "vehicleType": "Refrigerated Truck",
    "location": "Nhava Sheva ICD, Navi Mumbai",
    "coldChainEquipped": true,
    "analytics": {
      "redeploymentPriority": "critical",
      "redeploymentReason": "SHP-102 cold-chain emergency"
    }
  },
  {
    "id": "TR-109",
    "vehicleType": "Container Truck",
    "location": "Jaipur, Rajasthan",
    "coldChainEquipped": false,
    "analytics": {
      "redeploymentPriority": "medium",
      "redeploymentReason": "Idle – no current assignment"
    }
  }
]
```

---

## Cold-Chain Alerts Panel

Data for `TempGauge.jsx` and `ColdChain.jsx` page.

### Alert List (from `/api/cold-chain/alerts`)
```json
[
  {
    "id": "CC-008",
    "shipmentId": "SHP-102",
    "sensorId": "SNS-102-A",
    "timestamp": "2026-01-20T09:00:00+05:30",
    "temperature": 11.4,
    "humidity": 82,
    "location": "Mumbai Port (JNPT) – Strike Zone Hold",
    "status": "critical",
    "analytics": {
      "alertLevel": 3,
      "triggerAlert": true,
      "isExcursion": true,
      "excursionDurationMinutes": 60,
      "deviationFromUpperLimit": 3.4
    }
  },
  {
    "id": "CC-009",
    "shipmentId": "SHP-102",
    "sensorId": "SNS-102-B",
    "timestamp": "2026-01-20T09:00:00+05:30",
    "temperature": 11.1,
    "status": "critical",
    "analytics": { "alertLevel": 3, "triggerAlert": true, "isExcursion": true }
  },
  {
    "id": "CC-007",
    "shipmentId": "SHP-102",
    "temperature": 10.1,
    "status": "high",
    "analytics": { "alertLevel": 2, "triggerAlert": true }
  },
  {
    "id": "CC-006",
    "shipmentId": "SHP-102",
    "temperature": 8.9,
    "status": "high",
    "analytics": { "alertLevel": 2, "triggerAlert": true }
  },
  {
    "id": "CC-005",
    "shipmentId": "SHP-102",
    "temperature": 7.4,
    "status": "warning",
    "analytics": { "alertLevel": 1, "triggerAlert": true }
  },
  {
    "id": "CC-004",
    "shipmentId": "SHP-102",
    "temperature": 6.7,
    "status": "warning",
    "analytics": { "alertLevel": 1, "triggerAlert": true }
  },
  {
    "id": "CC-015",
    "shipmentId": "SHP-108",
    "temperature": 6.8,
    "status": "warning",
    "analytics": { "alertLevel": 1, "triggerAlert": true, "isExcursion": false }
  }
]
```

### Temperature Gauge Data (SHP-102 time-series for chart)
```json
[
  { "time": "04:00", "temp": 3.8,  "status": "normal"   },
  { "time": "05:00", "temp": 4.2,  "status": "normal"   },
  { "time": "06:00", "temp": 5.1,  "status": "normal"   },
  { "time": "07:00", "temp": 6.7,  "status": "warning"  },
  { "time": "07:30", "temp": 7.4,  "status": "warning"  },
  { "time": "08:00", "temp": 8.9,  "status": "high"     },
  { "time": "08:30", "temp": 10.1, "status": "high"     },
  { "time": "09:00", "temp": 11.4, "status": "critical" }
]
```
**UI Expectation:** Area chart with colour zones: green (2–8°C range), yellow (warning), red (breach). Show horizontal reference line at `max: 8°C`.

---

## Shipment Detail Page

Data shape for `ShipmentDetail.jsx` — SHP-102 example.

```json
{
  "id": "SHP-102",
  "trackingNo": "TRK-20260120-102",
  "origin": "Mumbai Port (JNPT)",
  "destination": "Pune Warehouse",
  "currentLocation": "Mumbai Port (JNPT) – Yard Hold",
  "cargoType": "Pharmaceuticals – Vaccines (DTP, Hepatitis B)",
  "priority": "critical",
  "weight": 3.2,
  "weightUnit": "tonnes",
  "carrier": "CAR-001",
  "currentRoute": "RT-001",
  "expectedDelivery": "2026-01-20T14:00:00+05:30",
  "status": "delayed",
  "riskLevel": "critical",
  "temperatureSensitive": true,
  "requiredTemperatureRange": { "min": 2, "max": 8, "unit": "°C" },
  "activeDisruption": "DIS-001",
  "alternativeRoutes": ["RT-002"],
  "alternativeCarriers": ["CAR-002", "CAR-005"],
  "suggestedVehicle": "TR-101",
  "analytics": {
    "overallRiskScore": 97,
    "actionRequired": true,
    "actionType": "EMERGENCY_REROUTE_AND_CARRIER_SWAP",
    "estimatedDelayHours": 48
  }
}
```

**Recommendations to display alongside:**
```json
[
  {
    "type": "REROUTE",
    "priority": "critical",
    "title": "Reroute via Nhava Sheva ICD (RT-002)",
    "detail": "Primary route RT-001 blocked. Alternative RT-002 is clear. Risk score: 12 vs 95.",
    "route": "RT-002"
  },
  {
    "type": "CARRIER_SWAP",
    "priority": "critical",
    "title": "Switch to Snowman Logistics (CAR-005)",
    "detail": "CAR-001 disrupted. Snowman Logistics is cold-chain specialist, available at Pune. Reliability: 94%.",
    "carrier": "CAR-005"
  },
  {
    "type": "FLEET_REDEPLOY",
    "priority": "critical",
    "title": "Deploy TR-101 — Refrigerated Truck (Nhava Sheva)",
    "detail": "Only idle cold-chain vehicle in the network. Located at Nhava Sheva ICD — adjacent to affected cargo.",
    "vehicle": "TR-101"
  }
]
```

---

## `StatusBadge` Colour Mapping

Use these consistently across all components:

| Value | Badge Colour | Label |
|-------|-------------|-------|
| `critical` | Red | CRITICAL |
| `high` | Orange | HIGH |
| `medium` | Amber | MEDIUM |
| `low` | Green | LOW |
| `normal` | Green | NORMAL |
| `warning` | Yellow | WARNING |
| `delayed` | Orange | DELAYED |
| `at-risk` | Orange | AT RISK |
| `in-transit` | Blue | IN TRANSIT |
| `pending-dispatch` | Grey | PENDING |
| `idle` | Grey | IDLE |
| `active` | Green | ACTIVE |
| `disrupted` | Red | DISRUPTED |

---

## `AlertBanner` Trigger Conditions

Show the top `AlertBanner` on the dashboard when any of these are true:

| Condition | Message |
|-----------|---------|
| Any `coldChain.analytics.alertLevel == 3` | "Critical temperature excursion — SHP-102 vaccines at 11.4°C" |
| Any `disruption.severity == "critical" AND status == "active"` | "Active port strike at JNPT Mumbai — 2 routes blocked" |
| Any `shipment.analytics.overallRiskScore >= 90` | "1 shipment requires immediate action — SHP-102" |

---

## Backend API Base URL

Set in `src/frontend/.env` (or `.env.example`):
```
VITE_API_URL=http://localhost:5000/api
```
The frontend's `axiosClient.js` reads `import.meta.env.VITE_API_URL` and falls back to `/api`.

If the backend isn't running, `mockData.js` serves as fallback — the mock data uses different IDs (`SHP-001` format) so the demo scenario will require the real backend for SHP-102.

---

*ChainGuard AI — IBM Bob AI Hackathon 2026*
