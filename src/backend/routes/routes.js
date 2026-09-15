'use strict';

const { Router } = require('express');
const router = Router();
const routesController = require('../controllers/routesController');

// GET /api/routes                    — list all (supports ?affected=true|false, ?alternativeFor=RT-001)
router.get('/', routesController.list);

// GET /api/routes/:id/alternatives   — operational alternatives for a route
// NOTE: must be declared before /:id
router.get('/:id/alternatives', routesController.alternatives);

// GET /api/routes/:id                — single route by ID
router.get('/:id', routesController.getById);

module.exports = router;
