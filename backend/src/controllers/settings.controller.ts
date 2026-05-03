import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

export function getSettings(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT key, value, type FROM settings').all();
    
    const settings: Record<string, any> = {};
    for (const row of rows as any[]) {
      settings[row.key] = row.type === 'json' ? JSON.parse(row.value) : row.value;
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
}

export function getSetting(req: Request, res: Response): void {
  try {
    const { key } = req.params;
    const db = getDatabase();
    const row = db.prepare('SELECT value, type FROM settings WHERE key = ?').get(key);
    
    if (!row) {
      res.status(404).json({ error: 'Setting not found' });
      return;
    }
    
    const value = (row as any).type === 'json' ? JSON.parse((row as any).value) : (row as any).value;
    res.json({ key, value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get setting' });
  }
}

export function updateSetting(req: Request, res: Response): void {
  try {
    const { key } = req.params;
    const { value, type = 'string' } = req.body;
    
    const db = getDatabase();
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    db.prepare(
      'INSERT INTO settings (key, value, type) VALUES (?, ?, ?) ' +
      'ON CONFLICT(key) DO UPDATE SET value = ?, type = ?'
    ).run(key, valueToStore, type, valueToStore, type);
    
    res.json({ success: true, key });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
}
