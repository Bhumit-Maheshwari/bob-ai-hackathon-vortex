'use strict';

const { Router } = require('express');
const router = Router();
const fleetController = require('../controllers/fleetController');

// GET /api/fleet                — list all vehicles
router.get('/', fleetController.list);

// GET /api/fleet/utilisation    — aggregate utilisation summary
// NOTE: this must be declared before /:id so "utilisation" is not treated as an ID
router.get('/utilisation', fleetController.utilisation);

// GET /api/fleet/redeployment   — vehicles available for redeployment
router.get('/redeployment', fleetController.redeployment);

module.exports = router;
