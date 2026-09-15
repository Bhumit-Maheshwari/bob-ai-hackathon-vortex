'use strict';

const routesService = require('../services/routesService');

exports.list = (req, res) => {
  const { affected, alternativeFor } = req.query;
  res.json(routesService.list({ affected, alternativeFor }));
};

exports.getById = (req, res) => {
  const item = routesService.getById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Route not found', id: req.params.id });
  res.json(item);
};

exports.alternatives = (req, res) => {
  const alts = routesService.alternatives(req.params.id);
  res.json(alts);
};
