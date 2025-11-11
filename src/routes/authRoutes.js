import { Router } from 'express';
import {
  registerHandler,
  verifyEmailHandler,
  loginHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerHandler);
router.get('/verify-email', verifyEmailHandler);
router.post('/login', loginHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', resetPasswordHandler);

export default router;