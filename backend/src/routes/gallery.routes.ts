import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = Router();

router.get('/', getGallery);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), addGalleryImage);
router.put('/:id', authMiddleware, adminMiddleware, updateGalleryImage);
router.delete('/:id', authMiddleware, adminMiddleware, deleteGalleryImage);

export default router;
