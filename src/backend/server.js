'use strict';

const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const dashboardRouter = require('./routes/dashboard');
const disruptionsRouter = require('./routes/disruptions');
const shipmentsRouter = require('./routes/shipments');
const fleetRouter = require('./routes/fleet');
const coldChainRouter = require('./routes/coldChain');
const routesRouter = require('./routes/routes');
const carriersRouter = require('./routes/carriers');
const scenariosRouter = require('./routes/scenarios');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/disruptions', disruptionsRouter);
app.use('/api/shipments', shipmentsRouter);
app.use('/api/fleet', fleetRouter);
app.use('/api/cold-chain', coldChainRouter);
app.use('/api/routes', routesRouter);
app.use('/api/carriers', carriersRouter);
app.use('/api/scenarios', scenariosRouter);
app.use('/api/ai', aiRouter);

// ── 404 fallthrough ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`ChainGuard AI Backend running on http://localhost:${PORT}`);
});
