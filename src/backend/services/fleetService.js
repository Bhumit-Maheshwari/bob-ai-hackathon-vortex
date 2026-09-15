'use strict';

const path = require('path');
const vehicles = require(path.join(__dirname, '../data/fleet.json'));

/**
 * Return all fleet vehicles.
 */
exports.list = () => vehicles;

/**
 * Compute aggregate utilisation summary across the fleet.
 * Returns shape compatible with the frontend's useFleetUtilisation hook.
 */
exports.utilisation = () => {
  const total = vehicles.length;
  const active = vehicles.filter((v) => v.status === 'active').length;
  const idle = vehicles.filter((v) => v.status === 'idle').length;
  const maintenance = vehicles.filter((v) => v.status === 'maintenance').length;

  const utilizationValues = vehicles
    .map((v) => (v.analytics ? v.analytics.fleetUtilizationPct : v.utilization))
    .filter((n) => typeof n === 'number');

  const averageUtilizationPct =
    utilizationValues.length > 0
      ? Math.round(
          (utilizationValues.reduce((a, b) => a + b, 0) / utilizationValues.length) * 10
        ) / 10
      : 0;

  return {
    totalVehicles: total,
    active,
    idle,
    maintenance,
    // utilisationPct — frontend Dashboard reads this exact key
    utilisationPct: averageUtilizationPct,
  };
};

/**
 * Return vehicles flagged as redeployment candidates.
 */
exports.redeployment = () =>
  vehicles.filter(
    (v) => v.analytics && v.analytics.isRedeploymentCandidate === true
  );
