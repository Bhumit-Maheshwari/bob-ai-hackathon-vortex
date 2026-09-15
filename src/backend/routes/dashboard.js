'use strict';

const { Router } = require('express');
const router = Router();

const disruptions = require('../data/disruptions.json');
const shipments = require('../data/shipments.json');
const fleet = require('../data/fleet.json');
const coldChain = require('../data/coldChain.json');

// GET /api/dashboard — aggregated KPI summary
router.get('/', (req, res) => {
  const activeDisruptions = disruptions.filter(
    (d) => d.status === 'active' || d.status === 'monitoring'
  );
  const criticalDisruptions = activeDisruptions.filter((d) => d.severity === 'critical');

  const shipmentsAtRisk = shipments.filter(
    (s) => s.riskLevel === 'critical' || s.riskLevel === 'high'
  );
  const actionRequired = shipments.filter((s) => s.analytics && s.analytics.actionRequired);

  const utilizationValues = fleet.map(
    (v) => (v.analytics ? v.analytics.fleetUtilizationPct : v.utilization)
  ).filter((n) => typeof n === 'number');
  const averageUtilizationPct =
    utilizationValues.length > 0
      ? Math.round((utilizationValues.reduce((a, b) => a + b, 0) / utilizationValues.length) * 10) / 10
      : 0;

  const coldAlerts = coldChain.filter((r) => r.analytics && r.analytics.triggerAlert === true);
  const criticalColdAlerts = coldAlerts.filter((r) => r.analytics.alertLevel === 3);

  res.json({
    disruptions: {
      total: disruptions.length,
      active: activeDisruptions.length,
      critical: criticalDisruptions.length,
    },
    shipments: {
      total: shipments.length,
      atRisk: shipmentsAtRisk.length,
      actionRequired: actionRequired.length,
    },
    fleet: {
      totalVehicles: fleet.length,
      active: fleet.filter((v) => v.status === 'active').length,
      idle: fleet.filter((v) => v.status === 'idle').length,
      averageUtilizationPct,
    },
    coldChain: {
      totalAlerts: coldAlerts.length,
      critical: criticalColdAlerts.length,
    },
  });
});

module.exports = router;
