'use strict';

const path = require('path');
const carriers = require(path.join(__dirname, '../data/carriers.json'));

/**
 * List carriers with optional filters.
 * @param {Object} filters
 * @param {string} [filters.status]              - e.g. "active"
 * @param {string} [filters.coldChainCapable]    - "true" | "false"
 */
exports.list = ({ status, coldChainCapable } = {}) => {
  let result = carriers;

  if (status) {
    result = result.filter(
      (c) => c.status && c.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (coldChainCapable !== undefined) {
    const val = coldChainCapable === 'true';
    result = result.filter((c) => c.coldChainCapable === val);
  }

  return result;
};

/**
 * Find a single carrier by ID.
 * @param {string} id
 */
exports.getById = (id) =>
  carriers.find((c) => c.id === id) || null;
