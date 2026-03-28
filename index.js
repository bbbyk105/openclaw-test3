const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/subtract', (req, res) => {
  const { a, b } = req.body;

  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }

  const result = a - b;
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});