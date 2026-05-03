import { Router } from 'express';
import { getSettings, getSetting, updateSetting } from '../controllers/settings.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getSettings);
router.get('/:key', getSetting);
router.put('/:key', authMiddleware, adminMiddleware, updateSetting);

export default router;
