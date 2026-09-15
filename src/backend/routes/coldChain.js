'use strict';

const { Router } = require('express');
const router = Router();
const coldChainController = require('../controllers/coldChainController');

// GET /api/cold-chain           — all cold-chain readings
router.get('/', coldChainController.list);

// GET /api/cold-chain/alerts    — readings where triggerAlert == true
// NOTE: must be declared before /:shipmentId so "alerts" is not treated as a shipmentId
router.get('/alerts', coldChainController.alerts);

// GET /api/cold-chain/:shipmentId  — readings for a specific shipment
router.get('/:shipmentId', coldChainController.getByShipment);

module.exports = router;
