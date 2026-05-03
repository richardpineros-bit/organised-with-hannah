import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

export function getQuiz(req: Request, res: Response): void {
  try {
    const { slug } = req.params;
    const db = getDatabase();
    
    const questions = db.prepare(
      'SELECT * FROM quiz_questions WHERE quiz_slug = ? ORDER BY sort_order'
    ).all(slug);
    
    const formatted = questions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.options)
    }));
    
    res.json({ slug, questions: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quiz' });
  }
}

export function submitQuiz(req: Request, res: Response): void {
  try {
    const { slug } = req.params;
    const { email, answers } = req.body;
    
    // Simple scoring logic
    const counts: Record<string, number> = {};
    for (const answer of answers) {
      counts[answer.type] = (counts[answer.type] || 0) + 1;
    }
    
    const resultType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    
    // Map result type to description
    const resultMap: Record<string, { title: string; description: string; cta: string; cta_link: string }> = {
      emotional: {
        title: 'The Overwhelmed Organiser',
        description: 'You feel paralysed by clutter. You need gentle, structured support to take the first step.',
        cta: 'Book a free consultation',
        cta_link: '/booking'
      },
      action: {
        title: 'The Motivated Organiser',
        description: 'You are ready to transform your space. Let us channel that energy effectively.',
        cta: 'See our services',
        cta_link: '/services'
      },
      blind: {
        title: 'The Unaware Organiser',
        description: 'Clutter has become invisible to you. Let me show you the potential of your space.',
        cta: 'View before & after gallery',
        cta_link: '/gallery'
      }
    };
    
    const result = resultMap[resultType] || resultMap.emotional;
    
    const db = getDatabase();
    db.prepare(
      'INSERT INTO quiz_results (quiz_slug, email, answers, result_type, result_title, result_description, cta_text, cta_link) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(slug, email || null, JSON.stringify(answers), resultType, result.title, result.description, result.cta, result.cta_link);
    
    // TODO: Send email with results
    
    res.json({
      result_type: resultType,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
}

export function createQuizQuestion(req: Request, res: Response): void {
  try {
    const { quiz_slug, question, sort_order, options } = req.body;
    
    const db = getDatabase();
    const result = db.prepare(
      'INSERT INTO quiz_questions (quiz_slug, question, sort_order, options) VALUES (?, ?, ?, ?)'
    ).run(quiz_slug, question, sort_order, JSON.stringify(options));
    
    res.status(201).json({ id: (result as any).lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz question' });
  }
}

export function getQuizResults(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM quiz_results ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quiz results' });
  }
}
