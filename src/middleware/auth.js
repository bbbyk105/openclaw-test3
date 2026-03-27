const { verifyAccessToken } = require('../utils/jwt');
const { findById } = require('../models/user');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' },
    });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'User not found' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired access token' },
    });
  }
};
