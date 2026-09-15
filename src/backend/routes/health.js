'use strict';

const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'ChainGuard AI Backend' });
});

module.exports = router;
