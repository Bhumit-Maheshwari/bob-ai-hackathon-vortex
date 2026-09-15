'use strict';

const path = require('path');
const shipments = require(path.join(__dirname, '../data/shipments.json'));

/**
 * List shipments with optional filters.
 * @param {Object} filters
 * @param {string} [filters.riskLevel]   - e.g. "critical", "high", "medium", "low"
 * @param {string} [filters.status]      - e.g. "in-transit", "delayed"
 * @param {string} [filters.scenarioTag] - e.g. "D_CRITICAL"
 */
exports.list = ({ riskLevel, status, scenarioTag } = {}) => {
  let result = shipments;

  if (riskLevel) {
    result = result.filter(
      (s) => s.riskLevel && s.riskLevel.toLowerCase() === riskLevel.toLowerCase()
    );
  }

  if (status) {
    result = result.filter(
      (s) => s.status && s.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (scenarioTag) {
    result = result.filter(
      (s) =>
        Array.isArray(s.scenarioTags) &&
        s.scenarioTags.some((t) => t.toLowerCase() === scenarioTag.toLowerCase())
    );
  }

  return result;
};

/**
 * Find a single shipment by ID.
 * @param {string} id
 */
exports.getById = (id) =>
  shipments.find((s) => s.id === id) || null;
