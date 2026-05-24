import express from 'express';

import {
  registerUser,
  loginUser,
  getMe
} from '../controllers/authController.js';

import protect
from '../middlewares/authMiddleware.js';

import {
  registerValidation,
  loginValidation
} from '../validators/authValidator.js';

const router = express.Router();

router.post(
  '/register',
  registerValidation,
  registerUser
);

router.post(
  '/login',
  loginValidation,
  loginUser
);

router.get('/me', protect, getMe);

export default router;