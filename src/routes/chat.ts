import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/chatController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/:conversationId', optionalAuth, getMessages);
router.post('/', optionalAuth, sendMessage);

export default router;

