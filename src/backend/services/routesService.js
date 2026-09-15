'use strict';

const path = require('path');
const routes = require(path.join(__dirname, '../data/routes.json'));

/**
 * List all routes with optional filters.
 * @param {Object} filters
 * @param {string} [filters.affected]       - "true" | "false"
 * @param {string} [filters.alternativeFor] - route ID e.g. "RT-001"
 */
exports.list = ({ affected, alternativeFor } = {}) => {
  let result = routes;

  if (affected !== undefined) {
    const val = affected === 'true';
    result = result.filter((r) => r.affected === val);
  }

  if (alternativeFor) {
    result = result.filter((r) =>
      Array.isArray(r.alternativeFor)
        ? r.alternativeFor.includes(alternativeFor)
        : r.alternativeFor === alternativeFor
    );
  }

  return result;
};

/**
 * Find a single route by ID.
 * @param {string} id
 */
exports.getById = (id) =>
  routes.find((r) => r.id === id) || null;

/**
 * Get operational alternatives for a given route ID.
 * @param {string} routeId
 */
exports.alternatives = (routeId) =>
  routes.filter((r) => {
    const altFor = Array.isArray(r.alternativeFor)
      ? r.alternativeFor.includes(routeId)
      : r.alternativeFor === routeId;
    return altFor && r.analytics && r.analytics.isOperational === true;
  }).sort((a, b) => (a.analytics.routeRiskScore || 99) - (b.analytics.routeRiskScore || 99));
