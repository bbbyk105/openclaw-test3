const jwt = require('../utils/jwt');
const User = require('../models/user');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Access token missing' } });
  }

  jwt.verifyAccessToken(token, (err, userId) => {
    if (err) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Invalid access token' } });
    }

    req.userId = userId;
    next();
  });
}

function authenticateRefreshToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Refresh token missing' } });
  }

  jwt.verifyRefreshToken(token, (err, userId) => {
    if (err) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Invalid refresh token' } });
    }

    req.userId = userId;
    next();
  });
}

module.exports = { authenticateToken, authenticateRefreshToken };
