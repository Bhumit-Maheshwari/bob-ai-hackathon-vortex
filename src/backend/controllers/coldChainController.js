'use strict';

const coldChainService = require('../services/coldChainService');

exports.list = (req, res) => {
  res.json(coldChainService.list());
};

exports.alerts = (req, res) => {
  res.json(coldChainService.alerts());
};

exports.getByShipment = (req, res) => {
  const data = coldChainService.getByShipment(req.params.shipmentId);
  res.json(data);
};
