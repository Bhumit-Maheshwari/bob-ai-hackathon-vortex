'use strict';

const path = require('path');
const data = require(path.join(__dirname, '../data/scenarios.json'));

// Normalise to array regardless of JSON root shape
const scenarios = Array.isArray(data) ? data : (data.scenarios || []);

/**
 * Return all scenarios.
 */
exports.list = () => scenarios;

/**
 * Find scenarios by tag (e.g. "D_CRITICAL").
 * @param {string} tag
 */
exports.getByTag = (tag) =>
  scenarios.filter((s) =>
    (s.tag && s.tag.toLowerCase() === tag.toLowerCase()) ||
    (s.scenarioTag && s.scenarioTag.toLowerCase() === tag.toLowerCase())
  );
