import { body, validationResult } from 'express-validator';

const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validatePlayer = [
  body('name').isString().notEmpty().withMessage('Name is required'),
];

const validateMatch = [
  body('playerAId').isNumeric().withMessage('Player A ID is required'),
  body('playerBId').isNumeric().withMessage('Player B ID is required'),
  body('winnerId').isNumeric().withMessage('Winner ID is required'),
];

const validateLogin = [
  body('username').isString().notEmpty().withMessage('Valid username is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
  validateRequest
];

const validateRegistration = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('username').isString().notEmpty().withMessage('Username is required'),
  validateRequest
];


export { 
  validatePlayer, 
  validateMatch, 
  validateRequest,
  validateLogin,
  validateRegistration 
};