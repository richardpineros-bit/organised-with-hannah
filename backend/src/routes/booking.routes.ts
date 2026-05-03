import { Router } from 'express';
import { 
  getAvailability, createBooking, getBookings, updateBookingStatus,
  getAvailabilitySettings, updateAvailability, getBlockedDates, addBlockedDate, removeBlockedDate
} from '../controllers/booking.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/availability', getAvailability);
router.post('/', createBooking);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getBookings);
router.put('/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);
router.get('/admin/availability', authMiddleware, adminMiddleware, getAvailabilitySettings);
router.put('/admin/availability/:id', authMiddleware, adminMiddleware, updateAvailability);
router.get('/admin/blocked', authMiddleware, adminMiddleware, getBlockedDates);
router.post('/admin/blocked', authMiddleware, adminMiddleware, addBlockedDate);
router.delete('/admin/blocked/:date', authMiddleware, adminMiddleware, removeBlockedDate);

export default router;
