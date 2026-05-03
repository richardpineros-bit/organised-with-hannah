import { Router } from 'express';
import { getContent, updateContent, bulkUpdateContent } from '../controllers/content.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getContent);
router.put('/:section/:key', authMiddleware, adminMiddleware, updateContent);
router.post('/bulk', authMiddleware, adminMiddleware, bulkUpdateContent);

export default router;
