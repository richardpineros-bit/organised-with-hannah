import { Router } from 'express';
import authRoutes from './auth.routes';
import contentRoutes from './content.routes';
import serviceRoutes from './service.routes';
import bookingRoutes from './booking.routes';
import testimonialRoutes from './testimonial.routes';
import contactRoutes from './contact.routes';
import galleryRoutes from './gallery.routes';
import productRoutes from './product.routes';
import quizRoutes from './quiz.routes';
import settingsRoutes from './settings.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact', contactRoutes);
router.use('/gallery', galleryRoutes);
router.use('/products', productRoutes);
router.use('/quiz', quizRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);

export default router;
