import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getProducts, getProduct, createProduct, updateProduct, getOrders, getMyOrders } from '../controllers/product.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = Router();

router.get('/', getProducts);
router.get('/orders', authMiddleware, adminMiddleware, getOrders);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:slug', getProduct);
router.post('/', authMiddleware, adminMiddleware, upload.single('file'), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);

export default router;
