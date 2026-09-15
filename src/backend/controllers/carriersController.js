'use strict';

const carriersService = require('../services/carriersService');

exports.list = (req, res) => {
  const { status, coldChainCapable } = req.query;
  res.json(carriersService.list({ status, coldChainCapable }));
};

exports.getById = (req, res) => {
  const item = carriersService.getById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Carrier not found', id: req.params.id });
  res.json(item);
};
