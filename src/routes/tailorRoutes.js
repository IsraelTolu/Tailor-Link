import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getMyProfile, upsertProfile, setAvailability, uploadKyc, handleKycUpload, searchTailors, getPublicTailorProfile } from '../controllers/tailorController.js';
import { uploadGallery, handleGalleryUpload, listTailorGallery } from '../controllers/galleryController.js';
import { listMyPlans, createPlan, updatePlan, deletePlan, listTailorPlans } from '../controllers/pricingController.js';

const router = Router();

// Public search and plans
router.get('/search', searchTailors);
router.get('/:userId/plans', listTailorPlans);
router.get('/:userId/profile', getPublicTailorProfile);
router.get('/:userId/gallery', listTailorGallery);

// Authenticated tailor routes
router.use(requireAuth, requireRole('tailor'));

router.get('/me/profile', getMyProfile);
router.post('/me/profile', upsertProfile);
router.post('/me/availability', setAvailability);
router.post('/me/kyc', uploadKyc.single('file'), handleKycUpload);
router.post('/me/gallery', uploadGallery.single('image'), handleGalleryUpload);

// Pricing plans management
router.get('/me/plans', listMyPlans);
router.post('/me/plans', createPlan);
router.put('/me/plans/:planId', updatePlan);
router.delete('/me/plans/:planId', deletePlan);

export default router;