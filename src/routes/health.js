const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  return res.status(200).json({
    data: {
      status: 'ok',
      service: 'health-api',
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
