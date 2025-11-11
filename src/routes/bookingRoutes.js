import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createBookingHandler, updateBookingStatusHandler, fundEscrowHandler, releaseEscrowHandler, listMyBookingsHandler } from '../controllers/bookingController.js';
import { initiateDeliveryHandler, updateDeliveryStatusHandler } from '../controllers/deliveryController.js';

const router = Router();

// Customers create bookings
router.post('/', requireAuth, requireRole('customer'), createBookingHandler);
router.get('/mine', requireAuth, listMyBookingsHandler);

// Both parties can update status according to rules
router.post('/:bookingId/status', requireAuth, updateBookingStatusHandler);

// Customer funding callback/verification
router.post('/:bookingId/escrow/fund', requireAuth, requireRole('customer'), fundEscrowHandler);

// Admin releases escrow (or automatic later)
router.post('/:bookingId/escrow/release', requireAuth, requireRole('admin', 'superadmin'), releaseEscrowHandler);

// Tailor initiates delivery and updates status
router.post('/:bookingId/delivery/initiate', requireAuth, requireRole('tailor'), initiateDeliveryHandler);
router.post('/:bookingId/delivery/status', requireAuth, requireRole('tailor', 'admin', 'superadmin'), updateDeliveryStatusHandler);

export default router;