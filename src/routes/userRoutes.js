import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getUserProfile } from '../controllers/userController.js';

const router = Router();

// Authenticated mutual profile viewing
router.get('/:userId/profile', requireAuth, requireRole('customer', 'tailor', 'admin', 'superadmin'), getUserProfile);

export default router;