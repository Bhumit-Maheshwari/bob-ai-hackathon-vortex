'use strict';

const shipmentsService = require('../services/shipmentsService');

exports.list = (req, res) => {
  const { riskLevel, status, scenarioTag } = req.query;
  const data = shipmentsService.list({ riskLevel, status, scenarioTag });
  res.json(data);
};

exports.getById = (req, res) => {
  const item = shipmentsService.getById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Shipment not found', id: req.params.id });
  res.json(item);
};
