import { Router } from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getTestimonials);
router.post('/', authMiddleware, adminMiddleware, createTestimonial);
router.put('/:id', authMiddleware, adminMiddleware, updateTestimonial);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTestimonial);

export default router;
