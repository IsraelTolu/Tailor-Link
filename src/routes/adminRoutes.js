import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listPendingTailors, approveTailor, rejectTailor, getAdminStats, listUsers, updateUserStatus, updateUserRole, listEscrow, releaseEscrowTx, refundEscrowTx, getTailorDetail, downloadKycDoc } from '../controllers/adminController.js';
import { listKycRequirements, createKycRequirement, updateKycRequirement, deleteKycRequirement } from '../controllers/settingsController.js';

const router = Router();

router.use(requireAuth, requireRole('admin', 'superadmin'));

router.get('/tailors/pending', listPendingTailors);
router.post('/tailors/:userId/approve', approveTailor);
router.post('/tailors/:userId/reject', rejectTailor);
router.get('/tailors/:userId', getTailorDetail);
router.get('/tailors/:userId/kyc/:docId/download', downloadKycDoc);

// Admin stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', listUsers);
router.patch('/users/:userId/status', updateUserStatus);
router.patch('/users/:userId/role', updateUserRole);

// Escrow management
router.get('/escrow', listEscrow);
router.post('/escrow/:txId/release', releaseEscrowTx);
router.post('/escrow/:txId/refund', refundEscrowTx);

// Site settings: KYC requirements
router.get('/settings/kyc', listKycRequirements);
router.post('/settings/kyc', createKycRequirement);
router.patch('/settings/kyc/:id', updateKycRequirement);
router.delete('/settings/kyc/:id', deleteKycRequirement);

export default router;