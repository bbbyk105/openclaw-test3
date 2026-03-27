const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { findByEmail, findById, createUser } = require('../models/user');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const router = express.Router();
const SALT_ROUNDS = 10;

function validationError(res, errors) {
  return res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: errors.array()[0].msg,
    },
  });
}

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return validationError(res, errors);

      const { email, password, name } = req.body;
      const existing = findByEmail(email.toLowerCase());
      if (existing) {
        return res.status(409).json({
          error: { code: 'EMAIL_ALREADY_EXISTS', message: 'Email is already registered' },
        });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = createUser({ email: email.toLowerCase(), passwordHash, name: name.trim() });
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      return res.status(201).json({
        data: { user, accessToken, refreshToken },
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return validationError(res, errors);

      const { email, password } = req.body;
      const existing = findByEmail(email.toLowerCase());
      if (!existing) {
        return res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        });
      }

      const matches = await bcrypt.compare(password, existing.password_hash);
      if (!matches) {
        return res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        });
      }

      const user = findById(existing.id);
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      return res.status(200).json({
        data: { user, accessToken, refreshToken },
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get('/me', authMiddleware, (req, res) => {
  return res.status(200).json({
    data: { user: req.user },
  });
});

router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('refreshToken is required')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationError(res, errors);

    try {
      const { refreshToken } = req.body;
      const payload = verifyRefreshToken(refreshToken);
      if (payload.type !== 'refresh') {
        return res.status(401).json({
          error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' },
        });
      }

      const user = findById(payload.sub);
      if (!user) {
        return res.status(401).json({
          error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' },
        });
      }

      const accessToken = signAccessToken(user);
      const nextRefreshToken = signRefreshToken(user);

      return res.status(200).json({
        data: { accessToken, refreshToken: nextRefreshToken },
      });
    } catch (error) {
      return res.status(401).json({
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token' },
      });
    }
  }
);

module.exports = router;
