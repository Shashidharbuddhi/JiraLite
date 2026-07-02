import { body } from 'express-validator';
import { GMAIL_REGEX } from '../utils/emailPolicy.js';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Enter a valid name'),
  body('workspaceName').trim().isLength({ min: 2 }).withMessage('Workspace name must be at least 2 characters'),
  body('email')
    .matches(GMAIL_REGEX)
    .withMessage('Use a valid Gmail address to create an account'),
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
