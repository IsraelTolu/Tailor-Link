import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createDispute, listMyDisputes, listOpenDisputes, resolveDispute, rejectDispute } from '../controllers/disputeController.js';

const router = express.Router();

// Participant (customer/tailor) creates a dispute for a booking
router.post('/bookings/:bookingId/disputes', requireAuth, requireRole(['customer', 'tailor']), createDispute);

// Participant lists disputes they raised
router.get('/me/disputes', requireAuth, listMyDisputes);

// Admin moderation of disputes
router.get('/admin/disputes', requireAuth, requireRole(['admin', 'superadmin']), listOpenDisputes);
router.post('/admin/disputes/:disputeId/resolve', requireAuth, requireRole(['admin', 'superadmin']), resolveDispute);
router.post('/admin/disputes/:disputeId/reject', requireAuth, requireRole(['admin', 'superadmin']), rejectDispute);

export default router;