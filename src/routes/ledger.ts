import { Router } from 'express';
import { getLedgerSummary, getCompanyLedgers, getSellerLedgers, getTransactions, recordManualPayment } from '../controllers/ledgerController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getTransactions);
router.get('/summary', optionalAuth, getLedgerSummary);
router.get('/companies', optionalAuth, getCompanyLedgers);
router.get('/sellers', optionalAuth, getSellerLedgers);
router.get('/transactions', optionalAuth, getTransactions);
router.post('/pay', optionalAuth, recordManualPayment);

export default router;

