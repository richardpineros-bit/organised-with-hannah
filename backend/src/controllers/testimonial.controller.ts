import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

export function getTestimonials(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare(
      'SELECT * FROM testimonials WHERE is_active = 1 ORDER BY is_featured DESC, created_at DESC'
    ).all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get testimonials' });
  }
}

export function createTestimonial(req: Request, res: Response): void {
  try {
    const { name, location, rating, text, image_path, is_featured } = req.body;
    
    const db = getDatabase();
    const result = db.prepare(
      'INSERT INTO testimonials (name, location, rating, text, image_path, is_featured) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, location || null, rating || 5, text, image_path || null, is_featured ? 1 : 0);
    
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
}

export function updateTestimonial(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const db = getDatabase();
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);
    
    db.prepare(`UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
}

export function deleteTestimonial(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('UPDATE testimonials SET is_active = 0 WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
}
