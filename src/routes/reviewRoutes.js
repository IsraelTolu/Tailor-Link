import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createReview, listTailorReviews, listPendingReviews, approveReview, rejectReview } from '../controllers/reviewController.js';

const router = express.Router();

// Customer creates a review for a booking
router.post('/bookings/:bookingId/reviews', requireAuth, requireRole('customer'), createReview);

// Public list of approved reviews for a tailor
router.get('/tailors/:tailorId/reviews', listTailorReviews);

// Admin moderation
router.get('/admin/reviews/pending', requireAuth, requireRole(['admin', 'superadmin']), listPendingReviews);
router.post('/admin/reviews/:reviewId/approve', requireAuth, requireRole(['admin', 'superadmin']), approveReview);
router.delete('/admin/reviews/:reviewId', requireAuth, requireRole(['admin', 'superadmin']), rejectReview);

export default router;