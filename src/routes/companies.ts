import { Router } from 'express';
import { getCompanies, getCompanyById, verifyCompany } from '../controllers/companyController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getCompanies);
router.get('/:id', optionalAuth, getCompanyById);
router.patch('/:id/verify', optionalAuth, verifyCompany);

export default router;

