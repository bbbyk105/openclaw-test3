const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const allowedOperations = new Set(['add', 'subtract', 'multiply', 'divide']);

function sendValidationError(res, message) {
  return res.status(400).json({
    error: { code: 'VALIDATION_ERROR', message },
  });
}

function calculate(a, b, operation) {
  switch (operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) {
        const error = new Error('Division by zero is not allowed');
        error.code = 'DIVISION_BY_ZERO';
        error.statusCode = 400;
        throw error;
      }
      return a / b;
    default:
      throw new Error('Unsupported operation');
  }
}

router.post(
  '/',
  [
    body('a').isFloat().withMessage('a must be a valid number'),
    body('b').isFloat().withMessage('b must be a valid number'),
    body('operation')
      .isString()
      .custom((value) => allowedOperations.has(value))
      .withMessage('operation must be one of: add, subtract, multiply, divide'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array()[0].msg);
    }

    try {
      const a = Number(req.body.a);
      const b = Number(req.body.b);
      const operation = req.body.operation;
      const result = calculate(a, b, operation);

      return res.status(200).json({
        data: {
          a,
          b,
          operation,
          result,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
