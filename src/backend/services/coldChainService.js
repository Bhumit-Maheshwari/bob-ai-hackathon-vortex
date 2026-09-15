'use strict';

const path = require('path');
const readings = require(path.join(__dirname, '../data/coldChain.json'));

/**
 * Return all cold-chain readings.
 */
exports.list = () => readings;

/**
 * Return readings where analytics.triggerAlert == true,
 * sorted by alertLevel descending then timestamp descending.
 */
exports.alerts = () =>
  readings
    .filter((r) => r.analytics && r.analytics.triggerAlert === true)
    .sort((a, b) => {
      const levelDiff =
        (b.analytics.alertLevel || 0) - (a.analytics.alertLevel || 0);
      if (levelDiff !== 0) return levelDiff;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

/**
 * Return readings for a specific shipment, sorted by timestamp ascending.
 * @param {string} shipmentId
 */
exports.getByShipment = (shipmentId) =>
  readings
    .filter((r) => r.shipmentId === shipmentId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
