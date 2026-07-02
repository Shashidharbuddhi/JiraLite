import express from 'express';
import {
  forgotPassword,
  getMe,
  loginAdmin,
  loginUser,
  registerUser,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/admin/login', loginValidation, loginAdmin);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);
router.get('/me', protect, getMe);

export default router;
