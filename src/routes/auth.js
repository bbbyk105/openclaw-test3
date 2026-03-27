const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('../utils/jwt');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { code: 'INVALID_INPUT', message: errors.array()[0].msg } });
    }

    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ email, password_hash: hashedPassword, name });
      const accessToken = jwt.generateAccessToken(user.id);
      const refreshToken = jwt.generateRefreshToken(user.id);

      res.status(201).json({ data: { user, accessToken, refreshToken } });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already exists' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { code: 'INVALID_INPUT', message: errors.array()[0].msg } });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
      }

      const accessToken = jwt.generateAccessToken(user.id);
      const refreshToken = jwt.generateRefreshToken(user.id);

      res.status(200).json({ data: { user, accessToken, refreshToken } });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
    }
  }
);

router.get('/me', jwt.authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }

    res.status(200).json({ data: { user } });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

router.post('/refresh', jwt.authenticateRefreshToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }

    const accessToken = jwt.generateAccessToken(user.id);

    res.status(200).json({ data: { accessToken } });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

module.exports = router;
