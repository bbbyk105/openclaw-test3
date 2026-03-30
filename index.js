const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
