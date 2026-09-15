# ChainGuard AI — Demo Data README

**Project:** ChainGuard AI — Supply Chain Disruption Assistant & Fleet Utilisation Optimizer
**Hackathon:** IBM Bob AI Hackathon 2026
**Data Author:** Rudra (Data & Analytics)
**Last Updated:** 2026-01-20

---

## Overview

This directory contains all static demo datasets for the ChainGuard AI MVP.
These datasets are designed to support realistic demonstration scenarios for the
IBM Hackathon 2026. They are **not production data** — all values are internally
consistent, India-centric logistics simulations intended for frontend/backend integration.

The datasets are located under `src/backend/data/` and should be served by
Bhumit's backend API at the appropriate REST endpoints.

---

## Files & Endpoints

| File | REST Endpoint | Records | Description |
|------|--------------|---------|-------------|
| `disruptions.json` | `GET /api/disruptions` | 5 | Active supply chain disruption events |
| `shipments.json` | `GET /api/shipments`, `GET /api/shipments/:id` | 12 | Freight shipments across India |
| `fleet.json` | `GET /api/fleet`, `GET /api/fleet/utilisation` | 9 | Trucks and vehicles with utilization data |
| `routes.json` | `GET /api/routes` | 10 | Primary and alternative routes |
| `carriers.json` | `GET /api/carriers` | 7 | Logistics carriers and 3PLs |
| `coldChain.json` | `GET /api/cold-chain`, `GET /api/cold-chain/:shipmentId` | 15 | Temperature/humidity sensor readings |

---

## Dataset Details

### 1. `disruptions.json`

Describes active disruption events affecting the supply chain.

**Key fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique disruption ID (e.g. `DIS-001`) |
| `type` | string | `Port Strike`, `Severe Weather`, `Road Closure`, `Geopolitical Disruption` |
| `location` | string | Geographic location of the disruption |
| `severity` | string | `low`, `medium`, `high`, `critical` |
| `status` | string | `active`, `monitoring`, `resolved` |
| `startTime` | ISO 8601 | When the disruption began |
| `endTime` | ISO 8601 or null | Expected end time; null = open-ended |
| `affectedRoutes` | string[] | Array of `RT-xxx` IDs |
| `affectedCarriers` | string[] | Array of `CAR-xxx` IDs |
| `description` | string | Human-readable description of the event |

**Scenarios covered:**
- `DIS-001`: JNPT Mumbai port strike (critical) — core demo scenario
- `DIS-002`, `DIS-003`: Cyclone weather on Tamil Nadu coast (high/medium)
- `DIS-004`: Road closure, NH-19 Varanasi bypass (medium)
- `DIS-005`: Geopolitical monitoring in Arabian Sea (high, monitoring)

---

### 2. `shipments.json`

Freight shipments with current location, risk status, and routing.

**Key fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique shipment ID (e.g. `SHP-102`) |
| `trackingNo` | string | Human-readable tracking number |
| `origin` | string | Shipment origin |
| `destination` | string | Final destination |
| `currentLocation` | string | Last known GPS/checkpoint location |
| `cargoType` | string | Type and description of cargo |
| `priority` | string | `standard`, `high`, `critical` |
| `weight` | number | Cargo weight in tonnes |
| `carrier` | string | `CAR-xxx` reference |
| `currentRoute` | string | `RT-xxx` reference |
| `expectedDelivery` | ISO 8601 | Planned delivery time |
| `status` | string | `in-transit`, `delayed`, `at-risk`, `pending-dispatch` |
| `riskLevel` | string | `low`, `medium`, `high`, `critical` |
| `temperatureSensitive` | boolean | Whether cargo requires cold chain |
| `requiredTemperatureRange` | object or null | `{ min, max, unit }` — prototype thresholds |
| `alternativeRoutes` | string[] | Suggested RT-xxx alternatives (where applicable) |
| `alternativeCarriers` | string[] | Suggested CAR-xxx alternatives (where applicable) |
| `suggestedVehicle` | string | Suggested TR-xxx vehicle for redeployment (where applicable) |

**Risk distribution:**
- Low risk: SHP-101, SHP-106, SHP-107, SHP-108, SHP-109, SHP-111, SHP-112
- Medium risk: SHP-104, SHP-105
- High risk: SHP-103, SHP-110
- Critical risk: **SHP-102** (primary demo scenario)

**Temperature-sensitive shipments:**
- `SHP-102`: Vaccines (DTP, Hepatitis B) — range 2–8°C — critical excursion at 11.4°C
- `SHP-108`: Insulin — range 2–8°C — normal readings throughout

---

### 3. `fleet.json`

Vehicles across carriers, with utilisation and availability status.

**Key fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Vehicle ID (e.g. `TR-101`) |
| `vehicleNo` | string | Indian registration number |
| `vehicleType` | string | `Refrigerated Truck`, `Container Truck`, `Flatbed Truck`, `Box Truck`, `Trailer` |
| `location` | string | Current location |
| `capacity` | number | Max load in tonnes |
| `currentLoad` | number | Current load in tonnes |
| `status` | string | `active`, `idle` |
| `available` | boolean | Whether the vehicle has spare capacity |
| `carrier` | string | `CAR-xxx` reference |
| `utilization` | number | Percentage of capacity used (0–100) |
| `coldChainEquipped` | boolean | Has refrigeration unit |
| `temperatureRange` | object or null | Operating range `{ min, max, unit }` |

**Utilisation summary:**
- Fully active (≥80%): TR-102, TR-103, TR-105, TR-106, TR-108
- Partially utilised (35–50%): TR-104, TR-107
- **Idle (0%)**: **TR-101** (cold-chain, recommended for SHP-102), **TR-109**

**Key vehicle for demo:**
> **TR-101** — Refrigerated truck, idle at Nhava Sheva ICD. Cold-chain equipped (–20 to +10°C).
> Carrier: CAR-005 (Snowman Logistics). Available immediately for SHP-102 emergency dispatch.

---

### 4. `routes.json`

Primary and alternative freight corridors.

**Key fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Route ID (e.g. `RT-001`) |
| `name` | string | Descriptive route name |
| `origin` | string | Route start node |
| `destination` | string | Route end node |
| `distance` | number | Distance in km |
| `estimatedTime` | string | Estimated transit time |
| `riskLevel` | string | `low`, `medium`, `high` |
| `capacityAvailable` | number | Available capacity in tonnes (0 = blocked) |
| `cost` | number | Cost in INR per trip |
| `affected` | boolean | Currently disrupted |
| `affectedBy` | string or null | `DIS-xxx` reference |
| `mode` | string | `road`, `rail` |

**Primary → Alternative route pairs:**
| Primary (affected) | Alternative (clear) | Reason |
|-------------------|-------------------|--------|
| RT-001 | **RT-002** | Mumbai port strike → Nhava Sheva ICD bypass |
| RT-004 | RT-005 | Cyclone weather → Salem bypass |
| RT-006 | RT-007 | Mumbai rail blocked → Mundra DFC rail |
| RT-008 | RT-009 | Varanasi road closure → Eastern DFC rail |

---

### 5. `carriers.json`

Logistics carriers available for assignment or reassignment.

**Key fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Carrier ID (e.g. `CAR-001`) |
| `name` | string | Company name |
| `type` | string | Carrier category |
| `location` | string | Current operational base |
| `availableCapacity` | number | Available capacity in tonnes |
| `reliability` | number | Historical on-time delivery percentage |
| `cost` | number | Cost in INR per trip |
| `status` | string | `active`, `disrupted` |
| `coldChainCapable` | boolean | Can handle temperature-sensitive cargo |
| `operatingRoutes` | string[] | `RT-xxx` references |

**Key for demo:**
- `CAR-001` (Mahindra Logistics): **Disrupted** — affected by port strike. 0 capacity.
- `CAR-002` (Blue Dart): Active, cold-chain capable, available at Nhava Sheva. **Recommended alternative.**
- `CAR-005` (Snowman Logistics): Active, cold-chain specialist, available at Pune. **Recommended alternative.**

---

### 6. `coldChain.json`

IoT sensor readings for temperature-sensitive shipments. Each record represents one sensor reading event.

**Key fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Reading ID (e.g. `CC-001`) |
| `shipmentId` | string | `SHP-xxx` reference |
| `sensorId` | string | Physical sensor identifier |
| `timestamp` | ISO 8601 | Reading timestamp |
| `temperature` | number | Measured temperature in °C |
| `humidity` | number | Measured relative humidity in % |
| `location` | string | Sensor GPS/checkpoint location |
| `status` | string | `normal`, `warning`, `high`, `critical` |
| `notes` | string | Contextual note for the reading |

**Status thresholds (configurable prototype assumptions — not universal regulatory limits):**
| Status | Condition |
|--------|-----------|
| `normal` | Within required temperature range |
| `warning` | Within 1°C of upper/lower limit |
| `high` | Up to ~3°C above upper limit |
| `critical` | More than ~3°C above upper limit, or confirmed excursion |

**Coverage:**
- `SHP-102` (Vaccines): 9 readings (CC-001 to CC-009). Escalating from normal → warning → high → **critical at 11.4°C**
- `SHP-108` (Insulin): 6 readings (CC-010 to CC-015). Mostly normal with one recovered warning at Krishnagiri.

---

## Cross-Dataset Relationships

```
disruptions.json
  └── affectedRoutes[] → routes.json[id]
  └── affectedCarriers[] → carriers.json[id]

routes.json
  └── affectedBy → disruptions.json[id]

carriers.json
  └── operatingRoutes[] → routes.json[id]

shipments.json
  └── carrier → carriers.json[id]
  └── currentRoute → routes.json[id]
  └── alternativeRoutes[] → routes.json[id]
  └── alternativeCarriers[] → carriers.json[id]
  └── suggestedVehicle → fleet.json[id]

fleet.json
  └── carrier → carriers.json[id]

coldChain.json
  └── shipmentId → shipments.json[id]
```

---

## Primary Demo Scenario

**Trigger:** Mumbai Port Strike (DIS-001) begins at 06:00 IST, 2026-01-20.

**Cascade:**
1. **DIS-001** marks routes `RT-001` and `RT-006` as affected (capacity = 0).
2. **SHP-102** (vaccines, carrier CAR-001) is held at JNPT yard on route RT-001.
3. CAR-001 (Mahindra Logistics) status becomes `disrupted`, available capacity = 0.
4. Cold-chain sensor `SNS-102-A` begins recording temperature escalation:
   - 04:00 → 3.8°C (normal)
   - 07:00 → 6.7°C (warning)
   - 08:00 → 8.9°C (high)
   - **09:00 → 11.4°C (critical)**
5. System identifies:
   - Alternative route: **RT-002** (Nhava Sheva ICD → Pune, low risk, 18t available)
   - Alternative carriers: **CAR-002** (Blue Dart, cold-chain) or **CAR-005** (Snowman, cold-chain)
   - Available vehicle: **TR-101** (cold-chain truck, idle at Nhava Sheva ICD, carrier CAR-005)
6. AI/decision engine (Bhumit's backend) should recommend:
   - **Emergency reroute**: Transfer SHP-102 to TR-101 at Nhava Sheva and dispatch via RT-002 with CAR-005.

**Secondary scenario (Chennai weather):**
- DIS-003 affects RT-004 (Chennai–Bengaluru via NH-48).
- SHP-104 is delayed.
- Alternative RT-005 (via Salem) is clear.
- SHP-108 (insulin) proactively uses RT-005 and is on schedule.

---

## Assumptions & Notes

1. **Temperature thresholds** in `coldChain.json` and `shipments.json` are configurable prototype assumptions.
   They do not represent universal or regulatory cold-chain limits for any specific cargo type.
2. **Costs** are approximate INR figures representative of Indian domestic logistics; not sourced from live market data.
3. **Reliability scores** are synthetic illustrative values.
4. **Timestamps** use ISO 8601 with IST offset (`+05:30`).
5. All vehicle registration numbers follow the Indian format but are fictional.
6. `endTime: null` on a disruption means the event has no confirmed end time.

---

## Integration Notes for Bhumit (Backend / AI Engine)

- The backend should serve all six files as REST JSON endpoints (see table above).
- `GET /api/fleet/utilisation` can be computed from `fleet.json` — aggregate `active`, `idle`, `utilization`.
- `GET /api/cold-chain/alerts` should filter `coldChain.json` for records with `status` in `["warning", "high", "critical"]`.
- `GET /api/cold-chain/:shipmentId` should filter by `shipmentId`.
- The AI recommendation engine should use `affectedRoutes`, `alternativeRoutes`, `alternativeCarriers`, and `suggestedVehicle` fields as its primary signal inputs.
- `coldChain.json` readings are time-ordered per `shipmentId` — the engine can use the latest reading per sensor as the current state.
- For MVP demo, hardcoding the SHP-102 cascade as the primary "live alert" on the dashboard is sufficient.

---

## File Sizes

| File | Records | Approx. Size |
|------|---------|-------------|
| disruptions.json | 5 | ~5 KB |
| shipments.json | 12 | ~14 KB |
| fleet.json | 9 | ~11 KB |
| routes.json | 10 | ~9 KB |
| carriers.json | 7 | ~7 KB |
| coldChain.json | 15 | ~10 KB |

---

*ChainGuard AI — IBM Bob AI Hackathon 2026*
