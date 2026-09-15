'use strict';

const { Router } = require('express');
const router = Router();
const scenariosController = require('../controllers/scenariosController');

// GET /api/scenarios                 — list all (supports ?tag=D_CRITICAL)
router.get('/', scenariosController.list);

// GET /api/scenarios/:tag            — scenarios by tag
router.get('/:tag', scenariosController.getByTag);

module.exports = router;
