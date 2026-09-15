# ChainGuard AI — Data Dictionary

**Project:** ChainGuard AI — Supply Chain Disruption Assistant & Fleet Utilisation Optimizer  
**Hackathon:** IBM Bob AI Hackathon 2026  
**Data Author:** Rudra (Data & Analytics)  
**Version:** 2.0 — enriched with analytics fields, scenario tags, and integration metadata  
**Last Updated:** 2026-01-20

---

## Overview

This dictionary documents every field in every dataset. It is intended as the authoritative reference for:
- Bhumit's backend and AI engine
- Harshil's frontend data bindings
- Future contributors extending the datasets

All datasets live in `src/backend/data/`. Related docs: `DATA_README.md`, `scenarios.json`, `backend_integration.json`.

---

## 1. `disruptions.json`

**Purpose:** Describes active and monitored supply chain disruption events (strikes, weather, road closures, geopolitical).

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique disruption ID. Format: `DIS-NNN`. |
| `type` | string | ✓ | Broad disruption category: `Port Strike`, `Severe Weather`, `Road Closure`, `Geopolitical Disruption`. |
| `subType` | string | ✓ | Narrower sub-classification. E.g. `Labour Action`, `Cyclonic Storm`, `Road Flooding`, `Maritime Security`. |
| `location` | string | ✓ | Geographic location of the disruption. |
| `severity` | string | ✓ | Qualitative severity: `low`, `medium`, `high`, `critical`. |
| `status` | string | ✓ | `active` — currently operational impact. `monitoring` — elevated risk, no confirmed impact. `resolved` — over. |
| `startTime` | ISO 8601 | ✓ | When the disruption began (`+05:30` IST). |
| `endTime` | ISO 8601 or null | ✓ | Planned end time. `null` = open-ended / unknown. |
| `durationHoursEstimate` | number or null | ✓ | Estimated total duration in hours. `null` if unknown. |
| `affectedRoutes` | string[] | ✓ | List of `RT-xxx` route IDs directly impacted. May be empty `[]`. |
| `affectedCarriers` | string[] | ✓ | List of `CAR-xxx` carrier IDs directly impacted. May be empty `[]`. |
| `description` | string | ✓ | Human-readable description of the event. |
| `impactEstimate` | string | ✓ | Plain-English estimate of operational impact. |
| `source` | string | ✓ | Advisory or source reference ID. |
| `analytics.disruptionSeverityScore` | number | ✓ | 0–100 severity score. Higher = more severe. Used by risk engine. |
| `analytics.operationalImpact` | string | ✓ | `full-block`, `partial-delay`, `monitoring-only`. |
| `analytics.estimatedDelayHours` | number | ✓ | Expected delay in hours for affected shipments. |
| `analytics.affectedShipmentCount` | number | ✓ | Count of shipments currently affected by this disruption. |
| `analytics.resolutionProbability` | string | ✓ | `low`, `medium`, `high`, `unknown`. |
| `analytics.cascadeRisk` | string | ✓ | Likelihood of cascade to other routes/carriers: `low`, `medium`, `high`. |
| `analytics.disruptionTypeCode` | string | ✓ | Machine-readable code for the engine. E.g. `PORT_STRIKE`, `WEATHER_CYCLONE`, `ROAD_CLOSURE_CONSTRUCTION`, `GEOPOLITICAL_MARITIME`. |

### Relationships
- `affectedRoutes[]` → `routes.json[id]`
- `affectedCarriers[]` → `carriers.json[id]`

---

## 2. `shipments.json`

**Purpose:** All active freight shipments. Core entity of the system. Every other dataset relates back to a shipment.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique shipment ID. Format: `SHP-NNN`. |
| `trackingNo` | string | ✓ | Human-readable tracking number in format `TRK-YYYYMMDD-NNN`. |
| `origin` | string | ✓ | Shipment origin hub/port. |
| `destination` | string | ✓ | Final destination hub/warehouse. |
| `currentLocation` | string | ✓ | Last known GPS/checkpoint location. |
| `cargoType` | string | ✓ | Descriptive cargo type and category (e.g. `Pharmaceuticals – Vaccines`). |
| `cargoCategory` | string | ✓ | Machine-readable category: `general`, `pharma`, `industrial`, `hazmat`, `fmcg`, `perishable`. |
| `priority` | string | ✓ | `standard`, `high`, `critical`. Used in risk weighting. |
| `weight` | number | ✓ | Cargo weight in tonnes. |
| `weightUnit` | string | ✓ | Always `tonnes`. |
| `carrier` | string | ✓ | Assigned carrier `CAR-xxx`. FK → `carriers.json[id]`. |
| `currentRoute` | string | ✓ | Current route `RT-xxx`. FK → `routes.json[id]`. |
| `expectedDelivery` | ISO 8601 | ✓ | Planned delivery timestamp (`+05:30` IST). |
| `status` | string | ✓ | `in-transit`, `delayed`, `at-risk`, `pending-dispatch`. |
| `riskLevel` | string | ✓ | `low`, `medium`, `high`, `critical`. |
| `temperatureSensitive` | boolean | ✓ | Whether cargo requires cold-chain monitoring. |
| `requiredTemperatureRange` | object or null | ✓ | `{ min, max, unit }`. Null if not temperature-sensitive. Prototype thresholds only. |
| `description` | string | ✓ | Full human-readable description of the shipment state. |
| `activeDisruption` | string or null | — | `DIS-xxx` ID of the disruption currently affecting this shipment. Null if none. |
| `alternativeRoutes` | string[] | — | Suggested `RT-xxx` IDs for rerouting. Present only when `riskLevel` is `medium`+ and alternatives exist. |
| `alternativeCarriers` | string[] | — | Suggested `CAR-xxx` IDs for carrier swap. Present when primary carrier is disrupted. |
| `suggestedVehicle` | string or null | — | `TR-xxx` ID of suggested fleet asset for emergency redeployment. |
| `scenarioTag` | string | ✓ | Canonical scenario classification: `A_NORMAL`, `B_MEDIUM_RISK`, `C_HIGH_RISK`, `D_CRITICAL`, `E_TEMPERATURE_SENSITIVE`, `F_DELAYED`, `G_DISRUPTION_AFFECTED`, `H_IDLE_REDEPLOYMENT`. |
| `analytics.shipmentPriorityScore` | number | ✓ | 0–100. Derived from `priority` field (standard=20, high=60, critical=90+). |
| `analytics.delayRiskScore` | number | ✓ | 0–100. Risk of delay based on route status and disruption exposure. |
| `analytics.coldChainRisk` | number | ✓ | 0–100. 0 if not temperature-sensitive. Elevated if sensor readings show excursion trend. |
| `analytics.disruptionExposure` | string | ✓ | `none`, `low`, `medium`, `high`, `critical`. |
| `analytics.overallRiskScore` | number | ✓ | 0–100. Composite score. Backend should verify/recalculate dynamically. |
| `analytics.estimatedDelayHours` | number | ✓ | Estimated additional delay hours. 0 if on-time. |
| `analytics.actionRequired` | boolean | ✓ | True if any action (reroute, carrier swap, fleet redeployment, alert) is recommended. |
| `analytics.actionType` | string or null | ✓ | `REROUTE`, `EMERGENCY_REROUTE_AND_CARRIER_SWAP`, `PORT_DIVERSION`, `FLEET_REDEPLOYMENT`, or null. |

### Relationships
- `carrier` → `carriers.json[id]`
- `currentRoute` → `routes.json[id]`
- `activeDisruption` → `disruptions.json[id]`
- `alternativeRoutes[]` → `routes.json[id]`
- `alternativeCarriers[]` → `carriers.json[id]`
- `suggestedVehicle` → `fleet.json[id]`
- Cold-chain readings for a shipment → `coldChain.json` filtered by `shipmentId`

---

## 3. `fleet.json`

**Purpose:** All logistics vehicles (trucks, trailers) with current status, load, and redeployment analytics.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Vehicle ID. Format: `TR-NNN`. |
| `vehicleNo` | string | ✓ | Indian registration number (fictional, format: `XX-NN-XX-NNNN`). |
| `vehicleType` | string | ✓ | `Refrigerated Truck`, `Container Truck`, `Flatbed Truck`, `Box Truck`, `Trailer`. |
| `make` | string | ✓ | Vehicle make and model. |
| `location` | string | ✓ | Current location of the vehicle. |
| `capacity` | number | ✓ | Maximum load capacity in tonnes. |
| `capacityUnit` | string | ✓ | Always `tonnes`. |
| `currentLoad` | number | ✓ | Current cargo load in tonnes. |
| `status` | string | ✓ | `active` (carrying cargo), `idle` (empty and available). |
| `available` | boolean | ✓ | True if vehicle has spare capacity or is idle. |
| `carrier` | string | ✓ | Operating carrier `CAR-xxx`. FK → `carriers.json[id]`. |
| `utilization` | number | ✓ | `(currentLoad / capacity) * 100`. 0–100. |
| `utilizationUnit` | string | ✓ | Always `percent`. |
| `driver` | string | ✓ | Driver name. |
| `lastService` | date | ✓ | Date of last vehicle service (`YYYY-MM-DD`). |
| `coldChainEquipped` | boolean | ✓ | Whether vehicle has refrigeration unit. |
| `temperatureRange` | object or null | ✓ | `{ min, max, unit }` — operating temperature range. Null if not cold-chain. |
| `notes` | string | ✓ | Human-readable current status and deployment notes. |
| `scenarioTag` | string | ✓ | Which demo scenario this vehicle is associated with. |
| `analytics.fleetUtilizationPct` | number | ✓ | Same as `utilization`. Explicit field for analytics pipelines. |
| `analytics.availableCapacityTonnes` | number | ✓ | `capacity - currentLoad`. |
| `analytics.redeploymentPriority` | string | ✓ | `critical`, `medium`, `low`, `none`. |
| `analytics.isRedeploymentCandidate` | boolean | ✓ | True if vehicle has available capacity or is idle. |
| `analytics.redeploymentReason` | string or null | ✓ | Human-readable reason for redeployment candidacy. |
| `analytics.coldChainScore` | number | ✓ | 0–100 cold-chain suitability score. 0 if not equipped. |
| `analytics.proximityToAffectedShipment` | string | ✓ | `near`, `distant`. Based on location relative to SHP-102 disruption point. |

### Relationships
- `carrier` → `carriers.json[id]`

---

## 4. `routes.json`

**Purpose:** Primary and alternative freight corridors by road and rail.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Route ID. Format: `RT-NNN`. |
| `name` | string | ✓ | Human-readable descriptive name including primary/alternative label. |
| `origin` | string | ✓ | Route origin node. |
| `destination` | string | ✓ | Route destination node. |
| `distance` | number | ✓ | Distance in km. |
| `distanceUnit` | string | ✓ | Always `km`. |
| `estimatedTime` | string | ✓ | Human-readable estimated transit time (e.g. `5h 30m`). |
| `estimatedTimeHours` | number | ✓ | Numeric transit time in hours. Use this for calculations. |
| `riskLevel` | string | ✓ | `low`, `medium`, `high`. |
| `capacityAvailable` | number | ✓ | Available capacity in tonnes. `0` = blocked/full. |
| `capacityUnit` | string | ✓ | Always `tonnes`. |
| `cost` | number | ✓ | Cost per trip in INR. |
| `costUnit` | string | ✓ | Always `INR`. |
| `affected` | boolean | ✓ | Whether this route is currently disrupted. |
| `affectedBy` | string or null | ✓ | `DIS-xxx` causing the disruption. Null if not affected. |
| `mode` | string | ✓ | `road` or `rail`. |
| `isPrimary` | boolean | ✓ | True if this is the primary/direct route for its corridor. |
| `alternativeFor` | string or null | ✓ | `RT-xxx` ID of the primary route this is an alternative for. Null if primary. |
| `notes` | string | ✓ | Human-readable current status. |
| `analytics.routeRiskScore` | number | ✓ | 0–100 risk score. Higher = riskier. `95` = fully blocked. |
| `analytics.costPerKm` | number | ✓ | `cost / distance`. Useful for cost comparison. |
| `analytics.isOperational` | boolean | ✓ | True if route can currently accept cargo. False if blocked. |
| `analytics.congestionLevel` | string | ✓ | `clear`, `moderate`, `blocked`. |
| `analytics.reliabilityScore` | number | ✓ | 0–100 route reliability score (historical on-time performance). |
| `analytics.recommendForReroute` | boolean | ✓ | True if this route should be surfaced as a rerouting recommendation. |

### Relationships
- `affectedBy` → `disruptions.json[id]`
- `alternativeFor` → `routes.json[id]` (self-referential)
- Referenced by `shipments.json[currentRoute]`, `shipments.json[alternativeRoutes[]]`
- Referenced by `carriers.json[operatingRoutes[]]`

---

## 5. `carriers.json`

**Purpose:** Logistics carriers available for cargo assignment, with reliability, capacity, and cold-chain capability.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Carrier ID. Format: `CAR-NNN`. |
| `name` | string | ✓ | Company name. |
| `type` | string | ✓ | Carrier category: `3PL`, `Express Courier / Air Freight`, `Surface Transport`, `Cold Chain Specialist`, `Rail Freight`. |
| `headquarters` | string | ✓ | Company headquarters location. |
| `location` | string | ✓ | Current operational base / depot. |
| `availableCapacity` | number | ✓ | Tonnes available for assignment. `0` = no capacity. |
| `availableCapacityUnit` | string | ✓ | Always `tonnes`. |
| `reliability` | number | ✓ | Historical on-time delivery percentage (0–100). |
| `reliabilityUnit` | string | ✓ | Always `percent`. |
| `cost` | number | ✓ | Cost per trip in INR. |
| `costUnit` | string | ✓ | Always `INR/trip`. |
| `status` | string | ✓ | `active` or `disrupted`. |
| `coldChainCapable` | boolean | ✓ | Whether carrier can handle temperature-sensitive cargo. |
| `operatingRoutes` | string[] | ✓ | List of `RT-xxx` IDs the carrier services. |
| `notes` | string | ✓ | Human-readable status notes. |
| `analytics.carrierReliabilityScore` | number | ✓ | Same as `reliability`. Explicit field for analytics. |
| `analytics.capacityUtilizationPct` | number | ✓ | Estimated % of total capacity currently in use. |
| `analytics.isAvailableForAssignment` | boolean | ✓ | True if `status == active AND availableCapacity > 0`. |
| `analytics.disruptionRisk` | string | ✓ | `none`, `low`, `medium`, `critical`. Risk of this carrier becoming unavailable. |
| `analytics.preferenceRank` | number | ✓ | 1 = highest preference for assignment. `99` = unavailable (disrupted). |
| `analytics.coldChainRating` | string | ✓ | `none`, `certified`, `specialist`. |
| `analytics.carrierTypeCode` | string | ✓ | Machine-readable carrier type: `3PL_ROAD`, `EXPRESS_COURIER`, `SURFACE_TRANSPORT`, `COLD_CHAIN_SPECIALIST`, `RAIL_FREIGHT`. |

### Relationships
- `operatingRoutes[]` → `routes.json[id]`
- Referenced by `shipments.json[carrier]`, `shipments.json[alternativeCarriers[]]`
- Referenced by `fleet.json[carrier]`
- Referenced by `disruptions.json[affectedCarriers[]]`

---

## 6. `coldChain.json`

**Purpose:** IoT sensor readings for temperature-sensitive shipments. Time-series data showing temperature and humidity at each checkpoint.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Reading ID. Format: `CC-NNN`. |
| `shipmentId` | string | ✓ | FK → `shipments.json[id]`. Identifies which shipment this reading belongs to. |
| `sensorId` | string | ✓ | Physical sensor identifier on the vehicle (e.g. `SNS-102-A`, `SNS-102-B`). |
| `timestamp` | ISO 8601 | ✓ | Timestamp of reading (`+05:30` IST). |
| `temperature` | number | ✓ | Measured temperature in °C. |
| `humidity` | number | ✓ | Relative humidity percentage. |
| `location` | string | ✓ | Checkpoint or GPS location at time of reading. |
| `status` | string | ✓ | `normal`, `warning`, `high`, `critical`. See thresholds below. |
| `notes` | string | ✓ | Contextual note explaining the reading. |
| `analytics.temperatureDeviationFromMidpoint` | number | ✓ | `temperature - (min + max) / 2`. Negative = cooler than midpoint. |
| `analytics.deviationFromUpperLimit` | number | ✓ | `temperature - requiredRange.max`. Negative = below upper limit (good). Positive = exceeded. |
| `analytics.isExcursion` | boolean | ✓ | True if temperature has exceeded the allowed range. |
| `analytics.excursionDurationMinutes` | number | ✓ | Cumulative minutes of excursion. 0 if no excursion. |
| `analytics.alertLevel` | number | ✓ | `0` = normal, `1` = warning, `2` = high, `3` = critical. |
| `analytics.triggerAlert` | boolean | ✓ | True if alertLevel >= 1. Backend should emit notification. |

### Status Thresholds (prototype assumptions — not regulatory limits)

| Status | Condition | alertLevel |
|--------|-----------|-----------|
| `normal` | Temperature within required range, comfortable margin | 0 |
| `warning` | Within 1°C of upper/lower limit | 1 |
| `high` | Exceeded upper limit, up to ~3°C above | 2 |
| `critical` | More than ~3°C above upper limit, or confirmed sustained excursion | 3 |

### Relationships
- `shipmentId` → `shipments.json[id]`
- Readings sorted by `timestamp` per `shipmentId` give a time-series view
- The backend should read `shipments.json[requiredTemperatureRange]` to compute deviation fields dynamically

---

## 7. `scenarios.json`

**Purpose:** Eight canonical demo scenarios linking shipments, routes, carriers, fleet, and disruptions into coherent narratives. Used by the frontend, demo presentation, and backend AI engine.

### Fields

| Field | Path | Description |
|-------|------|-------------|
| `id` | `scenarios[].id` | Scenario letter A–H. |
| `tag` | `scenarios[].tag` | Matches `scenarioTag` field on all other datasets (e.g. `D_CRITICAL`). |
| `title` | `scenarios[].title` | Short human-readable title. |
| `summary` | `scenarios[].summary` | Description of the scenario. |
| `primaryShipment` | `scenarios[].primaryShipment` | Main `SHP-xxx` for this scenario. |
| `disruption` | `scenarios[].disruption` | `DIS-xxx` or null. |
| `route.current` | `scenarios[].route.current` | `RT-xxx` — current route. |
| `route.alternative` | `scenarios[].route.alternative` | `RT-xxx` or null — recommended alternative. |
| `carrier.assigned` | `scenarios[].carrier.assigned` | `CAR-xxx` — current carrier. |
| `carrier.alternative` | `scenarios[].carrier.alternative` | `CAR-xxx` or null — recommended alternative. |
| `fleet.redeploymentCandidate` | `scenarios[].fleet.redeploymentCandidate` | `TR-xxx` or null. |
| `coldChain.monitored` | `scenarios[].coldChain.monitored` | Boolean. |
| `expectedOutcome` | `scenarios[].expectedOutcome` | What the demo should show. |
| `backendBehaviour` | `scenarios[].backendBehaviour` | Machine-readable expected backend output. |

---

## 8. `backend_integration.json`

**Purpose:** Machine-readable integration spec documenting decision rules, API endpoint map, and recommendation logic for Bhumit's backend.

### Top-Level Keys

| Key | Description |
|-----|-------------|
| `disruption_detection` | Filter rules and current active disruptions list |
| `risk_scoring` | Input fields, weights, and thresholds for the risk engine |
| `route_recommendation` | Selection criteria and all recommended route swaps |
| `carrier_recommendation` | Selection criteria and all recommended carrier swaps |
| `fleet_redeployment` | Idle and partial vehicles, selection criteria, and fleet summary |
| `cold_chain_monitoring` | Alert levels, active alerts, and affected shipments |
| `api_endpoint_map` | All REST endpoints mapped to data files |

---

## Cross-Dataset Reference Map

```
disruptions.json
  ├── affectedRoutes[]       → routes.json[id]
  └── affectedCarriers[]     → carriers.json[id]

routes.json
  ├── affectedBy             → disruptions.json[id]
  └── alternativeFor         → routes.json[id]  (self-ref)

carriers.json
  └── operatingRoutes[]      → routes.json[id]

shipments.json
  ├── carrier                → carriers.json[id]
  ├── currentRoute           → routes.json[id]
  ├── activeDisruption       → disruptions.json[id]
  ├── alternativeRoutes[]    → routes.json[id]
  ├── alternativeCarriers[]  → carriers.json[id]
  └── suggestedVehicle       → fleet.json[id]

fleet.json
  └── carrier                → carriers.json[id]

coldChain.json
  └── shipmentId             → shipments.json[id]

scenarios.json
  ├── primaryShipment        → shipments.json[id]
  ├── disruption             → disruptions.json[id]
  ├── route.current          → routes.json[id]
  ├── route.alternative      → routes.json[id]
  ├── carrier.assigned       → carriers.json[id]
  ├── carrier.alternative    → carriers.json[id]
  └── fleet.redeploymentCandidate → fleet.json[id]
```

---

## `scenarioTag` Values

| Tag | Scenario | Primary Shipment | Disruption |
|-----|----------|-----------------|------------|
| `A_NORMAL` | Normal, on-schedule | SHP-101 | None |
| `B_MEDIUM_RISK` | Medium risk, partial exposure | SHP-107 | None |
| `C_HIGH_RISK` | High risk, active disruption | SHP-110 | DIS-004 |
| `D_CRITICAL` | Critical — port strike + cold-chain excursion | SHP-102 | DIS-001 |
| `E_TEMPERATURE_SENSITIVE` | Cold-chain monitoring active, no excursion | SHP-108 | None |
| `F_DELAYED` | Delayed by weather | SHP-104 | DIS-003 |
| `G_DISRUPTION_AFFECTED` | Rail corridor blocked | SHP-103 | DIS-001 |
| `H_IDLE_REDEPLOYMENT` | Idle fleet available | TR-101 | DIS-001 |

---

## Analytics Field Naming Convention

All `analytics` sub-objects follow this convention:

- **Score fields** (0–100): `*Score` suffix — e.g. `disruptionSeverityScore`, `routeRiskScore`, `shipmentPriorityScore`
- **Boolean flags**: `is*` prefix — e.g. `isOperational`, `isExcursion`, `isRedeploymentCandidate`
- **Percentage fields**: `*Pct` suffix — e.g. `fleetUtilizationPct`, `capacityUtilizationPct`
- **Trigger flags**: `trigger*` prefix — e.g. `triggerAlert`

---

*ChainGuard AI — IBM Bob AI Hackathon 2026*
