# ChainGuard AI — Test Scenarios

**Project:** ChainGuard AI — IBM Bob AI Hackathon 2026  
**Role:** Rudra — Data & Analytics  
**Purpose:** Eight canonical test scenarios covering the full risk spectrum. Use these to verify each feature of the backend and frontend independently.

---

## How to Use This Document

Each scenario is self-contained. It lists every data entity involved and the single expected business outcome. Use the `scenarioTag` field on shipments, fleet records, and `scenarios.json` to filter dataset records for each scenario during testing.

---

## Scenario 1 — Normal Shipment

**Tag:** `A_NORMAL`  
**Title:** Standard freight moving on an unaffected route

| Entity | Value |
|--------|-------|
| **Shipment** | SHP-101 — Electronics, Mundra → Delhi NCR |
| **Disruption** | None |
| **Route** | RT-010 — Mundra Port → Delhi NCR (NH-48, road, unaffected) |
| **Carrier** | CAR-004 — Spoton Logistics (active, 90% reliability) |
| **Fleet** | TR-103 — Flatbed Truck, 93% utilised |
| **Cold Chain** | None — `temperatureSensitive: false` |

**Current State:**
- Status: `in-transit`
- Risk Level: `low`
- Overall Risk Score: 8 / 100
- Expected Delivery: 2026-01-23T18:00:00+05:30

**Expected Business Outcome:**  
No action required. Dashboard displays shipment as green / on-time. Risk engine produces no recommendation. Fleet is correctly assigned.

**Test Assertions:**
- `analytics.actionRequired == false`
- `analytics.overallRiskScore < 20`
- `analytics.estimatedDelayHours == 0`
- No disruption linked (`activeDisruption` field absent)

**Supporting Shipments with same tag:** SHP-106, SHP-109, SHP-111, SHP-112

---

## Scenario 2 — Medium-Risk Shipment

**Tag:** `B_MEDIUM_RISK`  
**Title:** High-priority FMCG shipment already using an alternative route

| Entity | Value |
|--------|-------|
| **Shipment** | SHP-107 — FMCG Packaged Foods, Nhava Sheva ICD → Pune |
| **Disruption** | None directly — proactively avoiding DIS-001 zone |
| **Route** | RT-002 — Nhava Sheva ICD → Pune via Nashik (alternative, unaffected) |
| **Carrier** | CAR-002 — Blue Dart Express (active, 96% reliability) |
| **Fleet** | TR-108 — Box Truck, 100% loaded |
| **Cold Chain** | None |

**Current State:**
- Status: `in-transit`
- Risk Level: `low` (proactively managed)
- Overall Risk Score: 12 / 100
- Expected Delivery: 2026-01-20T17:00:00+05:30

**Expected Business Outcome:**  
Shipment proceeds without intervention. System should recognise it is already on a safe alternative route. Carrier capacity at Nhava Sheva (8t available on CAR-002) should be shown in fleet utilisation panel.

**Test Assertions:**
- `analytics.actionRequired == false`
- `analytics.overallRiskScore` between 10 and 40
- `currentRoute` points to an unaffected route (`affected == false`)
- Carrier is active with available capacity

---

## Scenario 3 — High-Risk Shipment

**Tag:** `C_HIGH_RISK`  
**Title:** Perishable cargo on a disrupted road corridor

| Entity | Value |
|--------|-------|
| **Shipment** | SHP-110 — Frozen Shrimp, Kolkata → Delhi NCR |
| **Disruption** | DIS-004 — Road Closure, NH-19 Varanasi Bypass (medium severity, score: 48) |
| **Route (current)** | RT-008 — Kolkata Port → Delhi NCR road (affected, `capacityAvailable: 20`) |
| **Route (alternative)** | RT-009 — Kolkata Port → Delhi NCR rail, Eastern DFC (unaffected, score: 16) |
| **Carrier** | CAR-006 — CONCOR, Rail Freight (active, operates both RT-008 and RT-009) |
| **Fleet** | TR-105 — Container Truck, 91% utilised |
| **Cold Chain** | None — `temperatureSensitive: false`, but spoilage risk if delayed >6 hours |

**Current State:**
- Status: `at-risk`
- Risk Level: `high`
- Overall Risk Score: 70 / 100
- Estimated Delay: 5 hours
- Expected Delivery: 2026-01-21T22:00:00+05:30

**Expected Business Outcome:**  
Backend detects RT-008 disruption. Recommends switching to RT-009 (Eastern DFC rail). Same carrier (CAR-006 / CONCOR) can handle both routes — no carrier swap needed. Delay reduced from 5h to ~2h.

**Test Assertions:**
- `analytics.actionRequired == true`
- `analytics.actionType == "REROUTE"`
- `alternativeRoutes` contains `RT-009`
- `routes[RT-009].analytics.isOperational == true`
- `routes[RT-009].analytics.recommendForReroute == true`

---

## Scenario 4 — Critical Shipment

**Tag:** `D_CRITICAL`  
**Title:** Vaccine shipment stranded at JNPT — port strike + cold-chain excursion

> **This is the primary demo scenario. All three response systems activate simultaneously.**

| Entity | Value |
|--------|-------|
| **Shipment** | SHP-102 — Vaccines (DTP, Hepatitis B), Mumbai JNPT → Pune Warehouse |
| **Disruption** | DIS-001 — Port Strike, JNPT Mumbai (critical, score: 95) |
| **Route (current)** | RT-001 — JNPT → Pune, fully blocked (`capacityAvailable: 0`) |
| **Route (alternative)** | RT-002 — Nhava Sheva ICD → Pune via Nashik (clear, score: 12) |
| **Carrier (assigned)** | CAR-001 — Mahindra Logistics (disrupted, `availableCapacity: 0`) |
| **Carrier (alternative)** | CAR-005 — Snowman Logistics (cold-chain specialist, `preferenceRank: 1`) |
| **Fleet** | TR-101 — Refrigerated Truck, idle at Nhava Sheva ICD (`redeploymentPriority: critical`) |
| **Cold Chain** | SHP-102, sensors SNS-102-A and SNS-102-B |

**Cold-Chain Timeline:**

| Time | Reading | Temperature | Status |
|------|---------|-------------|--------|
| 04:00 | CC-001 | 3.8°C | normal |
| 05:00 | CC-002 | 4.2°C | normal |
| 06:00 | CC-003 | 5.1°C | normal (strike starts) |
| 07:00 | CC-004 | 6.7°C | ⚠️ warning |
| 07:30 | CC-005 | 7.4°C | ⚠️ warning |
| 08:00 | CC-006 | 8.9°C | 🔴 high — excursion begins |
| 08:30 | CC-007 | 10.1°C | 🔴 high |
| **09:00** | **CC-008** | **11.4°C** | 🚨 **critical** |
| 09:00 | CC-009 (B) | 11.1°C | 🚨 critical (secondary sensor confirms) |

**Current State:**
- Status: `delayed`
- Risk Level: `critical`
- Overall Risk Score: 97 / 100
- Estimated Delay: 48+ hours
- Required Temperature: 2–8°C (prototype threshold)
- Breach: +3.4°C above upper limit

**Expected Business Outcome:**  
System issues CRITICAL alert. Generates three simultaneous recommendations:
1. **Reroute** via RT-002 (Nhava Sheva ICD → Pune)
2. **Swap carrier** to CAR-005 (Snowman Logistics)
3. **Redeploy vehicle** TR-101 (idle refrigerated truck at Nhava Sheva)

**Test Assertions:**
- `analytics.actionRequired == true`
- `analytics.actionType == "EMERGENCY_REROUTE_AND_CARRIER_SWAP"`
- `analytics.overallRiskScore >= 90`
- `coldChain` latest reading `status == "critical"` for SHP-102
- `coldChain[CC-008].analytics.alertLevel == 3`
- `coldChain[CC-008].analytics.triggerAlert == true`
- `fleet[TR-101].analytics.isRedeploymentCandidate == true`
- `carriers[CAR-005].analytics.isAvailableForAssignment == true`
- `routes[RT-002].analytics.isOperational == true`

---

## Scenario 5 — Disruption-Affected Shipment

**Tag:** `G_DISRUPTION_AFFECTED`  
**Title:** Garment export train halted mid-journey due to port strike blocking rail entry

| Entity | Value |
|--------|-------|
| **Shipment** | SHP-103 — Textiles / Garment Export, Delhi NCR → Mumbai JNPT |
| **Disruption** | DIS-001 — Port Strike, JNPT (critical) |
| **Route (current)** | RT-006 — Delhi–JNPT Rail, blocked (`capacityAvailable: 0`, `routeRiskScore: 92`) |
| **Route (alternative)** | RT-007 — Delhi–Mundra Rail via DFC western arm (clear, `routeRiskScore: 14`) |
| **Carrier (assigned)** | CAR-006 — CONCOR (active on both RT-006 and RT-007) |
| **Carrier (alternative)** | CAR-004 — Spoton Logistics (active, Mundra corridor) |
| **Fleet** | N/A — rail consignment |
| **Cold Chain** | None |

**Current State:**
- Status: `at-risk`
- Risk Level: `high`
- Overall Risk Score: 78 / 100
- Train halted at Kota, Rajasthan
- Estimated Delay: 72 hours

**Expected Business Outcome:**  
Backend detects RT-006 blocked. Recommends port diversion to Mundra via RT-007. Garment export proceeds — adds ~8 hours transit but unblocks an indefinite hold.

**Test Assertions:**
- `analytics.actionRequired == true`
- `analytics.actionType == "REROUTE"`
- `routes[RT-006].affected == true`
- `routes[RT-007].analytics.recommendForReroute == true`

---

## Scenario 6 — Alternative Route Recommendation

**Tag:** `F_DELAYED`  
**Title:** Automotive parts delayed on cyclone-affected highway; Salem bypass available

| Entity | Value |
|--------|-------|
| **Shipment** | SHP-104 — OEM Automotive Parts, Chennai Port → Bengaluru |
| **Disruption** | DIS-003 — Road Flooding, NH-48 Tindivanam (medium, score: 50) |
| **Route (current)** | RT-004 — Chennai → Bengaluru via NH-48 (affected, `routeRiskScore: 55`) |
| **Route (alternative)** | RT-005 — Chennai → Bengaluru via Salem (clear, `routeRiskScore: 10`) |
| **Carrier (assigned)** | CAR-007 — Gati KWE (on-site, constrained by daylight restriction) |
| **Carrier (alternative)** | CAR-003 — VRL Logistics (operates RT-005, 22t available) |
| **Fleet** | TR-106 — Container Truck, carrying SHP-104 at Tindivanam |
| **Cold Chain** | None |

**Current State:**
- Status: `delayed`
- Risk Level: `medium`
- Overall Risk Score: 52 / 100
- Estimated Delay: 5 hours
- NH-48 restricted to daytime trucks only

**Expected Business Outcome:**  
Backend identifies RT-005 (Salem bypass) as lower-risk alternative. Additional 70 km but fully unrestricted. ETA recovered to ~2h delay. Carrier switch to CAR-003 optional — CAR-007 can also use RT-005.

**Test Assertions:**
- `routes[RT-004].affected == true`
- `routes[RT-005].affected == false`
- `routes[RT-005].analytics.isOperational == true`
- `routes[RT-005].analytics.recommendForReroute == true`
- `routes[RT-005].alternativeFor == "RT-004"`

---

## Scenario 7 — Idle Fleet Redeployment

**Tag:** `H_IDLE_REDEPLOYMENT`  
**Title:** Two idle vehicles available; critical cold-chain redeployment required

| Entity | Value |
|--------|-------|
| **Shipment (target)** | SHP-102 — Vaccines requiring cold-chain vehicle |
| **Disruption** | DIS-001 — Port Strike (blocks primary carrier and route) |
| **Fleet Asset 1 (critical)** | TR-101 — Refrigerated Truck, idle at Nhava Sheva ICD, `coldChainEquipped: true` |
| **Fleet Asset 2 (general)** | TR-109 — Container Truck, idle at Jaipur, `coldChainEquipped: false` |
| **Partially Utilised** | TR-104 (45%, Ahmedabad), TR-107 (35%, Delhi NCR) |
| **Carrier** | CAR-005 — Snowman Logistics (operates TR-101, cold-chain specialist) |

**Fleet Utilisation Summary:**

| Vehicle | Status | Utilisation | Cold Chain | Candidate |
|---------|--------|-------------|------------|-----------|
| TR-101 | idle | 0% | ✅ Yes | ✅ Critical redeployment |
| TR-109 | idle | 0% | ❌ No | ✅ General redeployment |
| TR-104 | active | 45% | ❌ No | ✅ Headspace (11t) |
| TR-107 | active | 35% | ❌ No | ✅ Headspace (26t) |
| TR-102 | active | 83% | ✅ Yes | ❌ Committed to SHP-108 |
| TR-103 | active | 93% | ❌ No | ❌ Full |
| TR-105 | active | 91% | ❌ No | ❌ Full |
| TR-106 | active | 88% | ❌ No | ❌ Full |
| TR-108 | active | 100% | ❌ No | ❌ Full |

**Fleet KPI Summary:**
- Total vehicles: 9
- Active: 7 | Idle: 2
- Average utilisation: 59.4%
- Cold-chain vehicles: 2 (TR-101, TR-102)
- Idle cold-chain vehicles: **1 (TR-101)**

**Expected Business Outcome:**  
Backend selects TR-101 as the only idle cold-chain qualified vehicle in proximity to the affected shipment. TR-101 dispatched to JNPT/Nhava Sheva area to collect SHP-102 and proceed via RT-002.

**Test Assertions:**
- `fleet[TR-101].status == "idle"`
- `fleet[TR-101].coldChainEquipped == true`
- `fleet[TR-101].analytics.isRedeploymentCandidate == true`
- `fleet[TR-101].analytics.redeploymentPriority == "critical"`
- `fleet[TR-101].analytics.proximityToAffectedShipment == "near"`

---

## Scenario 8 — Cold-Chain Temperature Excursion

**Tag:** `D_CRITICAL` (SHP-102) + `E_TEMPERATURE_SENSITIVE` (SHP-108 contrast)

### Part A — Critical Excursion (SHP-102, Vaccines)

| Entity | Value |
|--------|-------|
| **Shipment** | SHP-102 — DTP + Hepatitis B Vaccines |
| **Sensor** | SNS-102-A (primary), SNS-102-B (secondary — confirms excursion) |
| **Required Range** | 2–8°C (prototype threshold) |
| **Critical Reading** | CC-008 — 11.4°C at 09:00 IST |
| **Excursion Duration** | 60+ minutes (from CC-006 at 08:00) |
| **Alert Level** | 3 — CRITICAL |
| **Deviation Above Upper Limit** | +3.4°C |

**Escalation Sequence:**

```
04:00  3.8°C  [normal]    Alert Level 0
05:00  4.2°C  [normal]    Alert Level 0
06:00  5.1°C  [normal]    Alert Level 0  ← strike begins
07:00  6.7°C  [warning]   Alert Level 1  ← triggerAlert: true
07:30  7.4°C  [warning]   Alert Level 1  ← triggerAlert: true
08:00  8.9°C  [high]      Alert Level 2  ← isExcursion: true
08:30  10.1°C [high]      Alert Level 2  ← excursionDurationMinutes: 30
09:00  11.4°C [critical]  Alert Level 3  ← excursionDurationMinutes: 60  ← DEMO MOMENT
09:00  11.1°C [critical]  Alert Level 3  ← SNS-102-B confirms
```

**Expected Business Outcome:**  
CC-008 triggers `EMERGENCY_ESCALATION`. Backend combines cold-chain alert with disruption context (DIS-001) to generate compound recommendation: reroute + carrier swap + fleet redeployment. Both sensors agree — alert is validated.

### Part B — Healthy Monitoring (SHP-108, Insulin) — Contrast

| Entity | Value |
|--------|-------|
| **Shipment** | SHP-108 — Insulin Cold Chain |
| **Sensor** | SNS-108-A (primary), SNS-108-B (secondary) |
| **Required Range** | 2–8°C (prototype threshold) |
| **Status** | All readings normal. One transient warning (CC-015) recovered within 20 minutes. |
| **Alert Level** | Max: 1 (warning, transient) |

**Test Assertions (Part A — SHP-102):**
- `coldChain[CC-008].analytics.alertLevel == 3`
- `coldChain[CC-008].analytics.triggerAlert == true`
- `coldChain[CC-008].analytics.isExcursion == true`
- `coldChain[CC-009].analytics.alertLevel == 3` (secondary sensor confirms)
- `coldChain[CC-008].analytics.deviationFromUpperLimit == 3.4`

**Test Assertions (Part B — SHP-108):**
- Latest reading: `status == "normal"`
- `coldChain[CC-015].analytics.alertLevel == 1` (warning — transient)
- `coldChain[CC-015].analytics.isExcursion == false` (recovered, not sustained)
- No reading has `alertLevel >= 2`

---

## Scenario Coverage Matrix

| Scenario | Risk Level | Disruption | Route Action | Carrier Action | Fleet Action | Cold Chain |
|----------|-----------|-----------|--------------|----------------|-------------|------------|
| 1 — Normal | Low | None | None | None | None | None |
| 2 — Medium Risk | Low-Med | Indirect | None | None | Monitor | None |
| 3 — High Risk | High | DIS-004 | Reroute RT-009 | None | None | None |
| 4 — Critical | Critical | DIS-001 | Reroute RT-002 | Swap CAR-005 | Redeploy TR-101 | Critical alert |
| 5 — Disruption Affected | High | DIS-001 | Port diversion RT-007 | Optional | None | None |
| 6 — Alt Route | Medium | DIS-003 | Reroute RT-005 | Optional | None | None |
| 7 — Fleet Redeployment | Critical | DIS-001 | RT-002 | CAR-005 | **TR-101** | Monitor |
| 8 — Cold Chain | Critical | DIS-001 | RT-002 | CAR-005 | TR-101 | **CC-008 alert** |

---

*ChainGuard AI — IBM Bob AI Hackathon 2026*
