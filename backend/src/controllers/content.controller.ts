import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

export function getContent(req: Request, res: Response): void {
  try {
    const { section } = req.query;
    const db = getDatabase();
    
    let rows;
    if (section) {
      rows = db.prepare('SELECT section, key, value, type FROM content WHERE section = ?').all(section);
    } else {
      rows = db.prepare('SELECT section, key, value, type FROM content').all();
    }
    
    // Group by section for easier frontend use
    const grouped: Record<string, Record<string, any>> = {};
    for (const row of rows as Array<{ section: string; key: string; value: string; type: string }>) {
      if (!grouped[row.section]) grouped[row.section] = {};
      grouped[row.section][row.key] = row.type === 'json' ? JSON.parse(row.value) : row.value;
    }
    
    res.json(grouped);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
}

export function updateContent(req: Request, res: Response): void {
  try {
    const { section, key } = req.params;
    const { value, type = 'text' } = req.body;
    
    if (!value) {
      res.status(400).json({ error: 'Value is required' });
      return;
    }
    
    const db = getDatabase();
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    
    db.prepare(
      'INSERT INTO content (section, key, value, type, updated_at) VALUES (?, ?, ?, ?, datetime("now")) ' +
      'ON CONFLICT(section, key) DO UPDATE SET value = ?, type = ?, updated_at = datetime("now")'
    ).run(section, key, valueToStore, type, valueToStore, type);
    
    res.json({ success: true, section, key, updated: true });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
}

export function bulkUpdateContent(req: Request, res: Response): void {
  try {
    const updates = req.body; // { section: { key: value, ... }, ... }
    const db = getDatabase();
    
    const stmt = db.prepare(
      'INSERT INTO content (section, key, value, type, updated_at) VALUES (?, ?, ?, ?, datetime("now")) ' +
      'ON CONFLICT(section, key) DO UPDATE SET value = ?, type = ?, updated_at = datetime("now")'
    );
    
    db.transaction(() => {
      for (const [section, keys] of Object.entries(updates)) {
        for (const [key, value] of Object.entries(keys as Record<string, any>)) {
          const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
          stmt.run(section, key, valueToStore, 'text', valueToStore, 'text');
        }
      }
    })();
    
    res.json({ success: true, updated: Object.keys(updates).length });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Failed to bulk update' });
  }
}
