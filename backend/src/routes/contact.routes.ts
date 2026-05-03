import { Router } from 'express';
import { submitContact, getContacts, markContactRead } from '../controllers/contact.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', submitContact);
router.get('/', authMiddleware, adminMiddleware, getContacts);
router.put('/:id/read', authMiddleware, adminMiddleware, markContactRead);

export default router;
