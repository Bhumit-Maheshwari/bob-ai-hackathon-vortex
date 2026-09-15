'use strict';

const path = require('path');
const data = require(path.join(__dirname, '../data/disruptions.json'));

// Normalise to array regardless of JSON root shape
const disruptions = Array.isArray(data) ? data : (data.disruptions || []);

/**
 * List disruptions with optional status filter.
 * @param {Object} filters
 * @param {string} [filters.status] - e.g. "active", "monitoring"
 */
exports.list = ({ status } = {}) => {
  if (!status) return disruptions;
  return disruptions.filter(
    (d) => d.status && d.status.toLowerCase() === status.toLowerCase()
  );
};

/**
 * Find a single disruption by ID.
 * @param {string} id
 */
exports.getById = (id) =>
  disruptions.find((d) => d.id === id) || null;
