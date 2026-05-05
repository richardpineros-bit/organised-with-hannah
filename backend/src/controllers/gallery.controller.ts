import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

export function getGallery(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM gallery WHERE is_active = 1 ORDER BY sort_order, id').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get gallery' });
  }
}

export function addGalleryImage(req: Request, res: Response): void {
  try {
    const { title, category } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;
    if (!image_path) { res.status(400).json({ error: 'Image upload failed' }); return; }
    const db = getDatabase();
    const result = db.prepare('INSERT INTO gallery (title, image_path, category) VALUES (?, ?, ?)').run(title || null, image_path, category || null);
    res.status(201).json({ id: (result as any).lastInsertRowid, image_path });
  } catch (error) { res.status(500).json({ error: 'Failed to add gallery image' }); }
}

export function updateGalleryImage(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const { title, category, sort_order, is_active } = req.body;
    const db = getDatabase();
    db.prepare('UPDATE gallery SET title = ?, category = ?, sort_order = ?, is_active = ? WHERE id = ?').run(title, category, sort_order, is_active ? 1 : 0, id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to update gallery image' }); }
}

export function deleteGalleryImage(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('UPDATE gallery SET is_active = 0 WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete gallery image' }); }
}
