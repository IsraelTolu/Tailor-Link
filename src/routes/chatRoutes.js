import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { sendMessageHandler, listMessagesHandler } from '../controllers/chatController.js';

const router = Router();

router.post('/:bookingId/messages', requireAuth, sendMessageHandler);
router.get('/:bookingId/messages', requireAuth, listMessagesHandler);

export default router;