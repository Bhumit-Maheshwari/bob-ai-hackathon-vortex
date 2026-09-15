'use strict';

const { Router } = require('express');
const router = Router();
const disruptionsController = require('../controllers/disruptionsController');

// GET /api/disruptions          — list all (supports ?status= filter)
router.get('/', disruptionsController.list);

// GET /api/disruptions/:id      — single disruption by ID
router.get('/:id', disruptionsController.getById);

module.exports = router;
