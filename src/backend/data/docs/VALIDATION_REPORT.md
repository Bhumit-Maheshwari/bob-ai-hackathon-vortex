# ChainGuard AI — Dataset Validation Report

**Project:** ChainGuard AI — IBM Bob AI Hackathon 2026  
**Role:** Rudra — Data & Analytics  
**Validated:** 2026-01-20  
**Status:** ✅ ALL CHECKS PASSED

---

## Summary

| Check | Result | Detail |
|-------|--------|--------|
| JSON Syntax | ✅ PASS | 8 files — 0 parse errors |
| Duplicate IDs | ✅ PASS | 58 IDs across 6 array files — 0 duplicates |
| Cross-References | ✅ PASS | 94 references checked — 0 broken |
| Analytics Blocks | ✅ PASS | 58 records — 100% have `analytics{}` |
| Scenario Tags | ✅ PASS | All 12 shipments + 9 fleet records tagged |
| Cold-Chain Alert Fields | ✅ PASS | All 15 readings have `triggerAlert` field |

---

## File-by-File Results

### JSON Syntax
All 8 files parse without error:

| File | Result |
|------|--------|
| `disruptions.json` | ✅ PASS |
| `shipments.json` | ✅ PASS |
| `fleet.json` | ✅ PASS |
| `routes.json` | ✅ PASS |
| `carriers.json` | ✅ PASS |
| `coldChain.json` | ✅ PASS |
| `scenarios.json` | ✅ PASS |
| `backend_integration.json` | ✅ PASS |

---

### Duplicate IDs

| File | IDs | Result |
|------|-----|--------|
| `disruptions.json` | 5 | ✅ No duplicates |
| `shipments.json` | 12 | ✅ No duplicates |
| `fleet.json` | 9 | ✅ No duplicates |
| `routes.json` | 10 | ✅ No duplicates |
| `carriers.json` | 7 | ✅ No duplicates |
| `coldChain.json` | 15 | ✅ No duplicates |

---

### Cross-References (94 total)

| Reference | Count | Broken |
|-----------|-------|--------|
| `disruptions.affectedRoutes` → `routes` | 8 | 0 |
| `disruptions.affectedCarriers` → `carriers` | 3 | 0 |
| `routes.affectedBy` → `disruptions` | 4 | 0 |
| `routes.alternativeFor` → `routes` | 4 | 0 |
| `carriers.operatingRoutes` → `routes` | 14 | 0 |
| `shipments.carrier` → `carriers` | 12 | 0 |
| `shipments.currentRoute` → `routes` | 12 | 0 |
| `shipments.activeDisruption` → `disruptions` | 5 | 0 |
| `shipments.alternativeRoutes` → `routes` | 8 | 0 |
| `shipments.alternativeCarriers` → `carriers` | 9 | 0 |
| `shipments.suggestedVehicle` → `fleet` | 1 | 0 |
| `fleet.carrier` → `carriers` | 9 | 0 |
| `coldChain.shipmentId` → `shipments` | 15 | 0 |
| **Total** | **94** | **0** |

---

### Analytics Block Coverage

Every record in every dataset carries an `analytics{}` sub-object:

| File | Records | With Analytics |
|------|---------|---------------|
| `disruptions.json` | 5 | 5 (100%) |
| `routes.json` | 10 | 10 (100%) |
| `carriers.json` | 7 | 7 (100%) |
| `shipments.json` | 12 | 12 (100%) |
| `fleet.json` | 9 | 9 (100%) |
| `coldChain.json` | 15 | 15 (100%) |

---

### Cold-Chain Alert Summary

| Status | Count | Reading IDs |
|--------|-------|-------------|
| `normal` | 8 | CC-001, CC-002, CC-003, CC-010, CC-011, CC-012, CC-013, CC-014 |
| `warning` | 3 | CC-004, CC-005, CC-015 |
| `high` | 2 | CC-006, CC-007 |
| `critical` | 2 | **CC-008**, **CC-009** |
| `triggerAlert == true` | 7 | CC-004 through CC-009, CC-015 |

**Primary demo alert:** CC-008 — `SHP-102`, sensor `SNS-102-A`, temperature **11.4°C**, `alertLevel: 3`.

---

### Scenario Tag Distribution

| Tag | Shipments |
|-----|-----------|
| `A_NORMAL` | SHP-101, SHP-106, SHP-109, SHP-111, SHP-112 |
| `B_MEDIUM_RISK` | SHP-107 |
| `C_HIGH_RISK` | SHP-105, SHP-110 |
| `D_CRITICAL` | **SHP-102** |
| `E_TEMPERATURE_SENSITIVE` | SHP-108 |
| `F_DELAYED` | SHP-104 |
| `G_DISRUPTION_AFFECTED` | SHP-103 |
| `H_IDLE_REDEPLOYMENT` | TR-101, TR-109 (fleet) |

---

## Record Counts

| File | Records |
|------|---------|
| disruptions.json | 5 |
| shipments.json | 12 |
| fleet.json | 9 |
| routes.json | 10 |
| carriers.json | 7 |
| coldChain.json | 15 |
| scenarios.json | 8 scenarios |
| backend_integration.json | 1 spec |
| **Total data records** | **58** |

---

## Issues Found

**None.** All 94 cross-references resolve. All records carry analytics blocks. No broken IDs, no syntax errors, no missing scenario tags.

---

*ChainGuard AI — IBM Bob AI Hackathon 2026*
