'use strict';

const { Router } = require('express');
const router = Router();
const shipmentsController = require('../controllers/shipmentsController');

// GET /api/shipments            — list all (supports ?riskLevel= ?status= ?scenarioTag= filters)
router.get('/', shipmentsController.list);

// GET /api/shipments/:id        — single shipment by ID
router.get('/:id', shipmentsController.getById);

module.exports = router;
