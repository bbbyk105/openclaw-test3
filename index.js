const express = require('express');
const app = express();
const port = 3000;

app.get('/time', (req, res) => {
  res.json({ time: new Date() });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});