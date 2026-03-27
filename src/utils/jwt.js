const jwt = require('jsonwebtoken');

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

function getAccessSecret() {
  return process.env.JWT_ACCESS_SECRET || 'change-me-access-secret';
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || 'change-me-refresh-secret';
}

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, getAccessSecret(), {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, type: 'refresh' }, getRefreshSecret(), {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, getAccessSecret());
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret());
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
