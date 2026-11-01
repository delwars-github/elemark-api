import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/dashboard', optionalAuth, getDashboardAnalytics);

export default router;

