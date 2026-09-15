'use strict';

const disruptionsService = require('../services/disruptionsService');

exports.list = (req, res) => {
  const { status } = req.query;
  const data = disruptionsService.list({ status });
  res.json(data);
};

exports.getById = (req, res) => {
  const item = disruptionsService.getById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Disruption not found', id: req.params.id });
  res.json(item);
};
