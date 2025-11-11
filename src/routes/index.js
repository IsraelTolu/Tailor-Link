import { Router } from 'express';
import authRoutes from './authRoutes.js';
import tailorRoutes from './tailorRoutes.js';
import adminRoutes from './adminRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import chatRoutes from './chatRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import disputeRoutes from './disputeRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Tailor Link API' });
});

router.use('/auth', authRoutes);
router.use('/tailors', tailorRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);
router.use('/chat', chatRoutes);
router.use('/', reviewRoutes);
router.use('/', disputeRoutes);

export default router;