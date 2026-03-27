const express = require('express');
const calcRoutes = require('./routes/calc');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ data: { status: 'ok' } });
});

app.use('/api/calc', calcRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  res.status(statusCode).json({
    error: { code, message },
  });
});

module.exports = app;
