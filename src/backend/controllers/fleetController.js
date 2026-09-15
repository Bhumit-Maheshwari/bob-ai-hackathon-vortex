'use strict';

const fleetService = require('../services/fleetService');

exports.list = (req, res) => {
  res.json(fleetService.list());
};

exports.utilisation = (req, res) => {
  res.json(fleetService.utilisation());
};

exports.redeployment = (req, res) => {
  res.json(fleetService.redeployment());
};
