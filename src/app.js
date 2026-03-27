require('dotenv').config();
require('./db/init');

const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ data: { status: 'ok' } });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' },
  });
});

module.exports = app;
