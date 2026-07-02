import { body } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Enter a valid name'),
  body('workspaceName').trim().isLength({ min: 2 }).withMessage('Workspace name must be at least 2 characters'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('A valid email is required')
];

export const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
