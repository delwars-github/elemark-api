import { Router } from 'express';
import { getOrders, getOrderById, createOrder, updateOrderStatus, payOrderDue } from '../controllers/orderController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getOrders);
router.get('/:id', optionalAuth, getOrderById);
router.post('/', optionalAuth, createOrder);
router.patch('/:id/status', optionalAuth, updateOrderStatus);
router.post('/:id/pay-due', optionalAuth, payOrderDue);

export default router;

