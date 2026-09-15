'use strict';

const { Router } = require('express');
const router = Router();

const shipments = require('../data/shipments.json');
const disruptions = require('../data/disruptions.json');

// POST /api/ai/recommend — AI recommendations based on highest-risk shipments
// Replace with real watsonx integration when ready.
router.post('/recommend', (req, res) => {
  const actionableShipments = shipments
    .filter((s) => s.analytics && s.analytics.actionRequired)
    .sort((a, b) => (b.analytics.overallRiskScore || 0) - (a.analytics.overallRiskScore || 0))
    .slice(0, 4);

  const recommendations = actionableShipments.map((s, i) => ({
    id: `REC-${String(i + 1).padStart(3, '0')}`,
    priority: s.riskLevel === 'critical' ? 'Critical' : s.riskLevel === 'high' ? 'High' : 'Medium',
    title: `${s.analytics.actionType === 'EMERGENCY_REROUTE_AND_CARRIER_SWAP'
      ? '🚨 Emergency reroute + carrier swap'
      : s.analytics.actionType === 'REROUTE'
        ? '🔀 Reroute recommended'
        : '⚠️ Action required'} — ${s.id}`,
    description: s.description || `Shipment ${s.id} (${s.cargoType}) requires action. Risk score: ${s.analytics.overallRiskScore}/100. Est. delay: ${s.analytics.estimatedDelayHours}h.`,
    action: s.analytics.actionType,
    shipmentId: s.id,
    alternativeRoutes: s.alternativeRoutes || [],
    alternativeCarriers: s.alternativeCarriers || [],
    suggestedVehicle: s.suggestedVehicle || null,
  }));

  // Prepend a critical disruption alert if present
  const criticalDisruption = disruptions.find((d) => d.status === 'active' && d.severity === 'critical');
  if (criticalDisruption) {
    recommendations.unshift({
      id: 'REC-000',
      priority: 'Critical',
      title: `🔴 Active disruption: ${criticalDisruption.type} — ${criticalDisruption.location}`,
      description: `${criticalDisruption.description} Affected routes: ${criticalDisruption.affectedRoutes.join(', ') || 'none'}. Est. delay: ${criticalDisruption.analytics.estimatedDelayHours}h.`,
      action: 'MONITOR',
      disruptionId: criticalDisruption.id,
    });
  }

  res.json({ recommendations });
});

module.exports = router;
