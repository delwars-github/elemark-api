import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProductById);
router.post('/', optionalAuth, createProduct);
router.put('/:id', optionalAuth, updateProduct);
router.delete('/:id', optionalAuth, deleteProduct);

export default router;

