'use strict';

const { Router } = require('express');
const router = Router();
const carriersController = require('../controllers/carriersController');

// GET /api/carriers                  — list all (supports ?status=active, ?coldChainCapable=true)
router.get('/', carriersController.list);

// GET /api/carriers/:id              — single carrier by ID
router.get('/:id', carriersController.getById);

module.exports = router;
