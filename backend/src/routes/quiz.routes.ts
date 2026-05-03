import { Router } from 'express';
import { getQuiz, submitQuiz, createQuizQuestion, getQuizResults } from '../controllers/quiz.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/:slug', getQuiz);
router.post('/:slug/submit', submitQuiz);
router.post('/questions', authMiddleware, adminMiddleware, createQuizQuestion);
router.get('/results/all', authMiddleware, adminMiddleware, getQuizResults);

export default router;
