import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

export function getServices(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order').all();
    
    const services = rows.map((row: any) => ({
      ...row,
      features: row.features ? JSON.parse(row.features) : [],
      price: Number(row.price)
    }));
    
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
}

export function createService(req: Request, res: Response): void {
  try {
    const { slug, name, description, long_description, price, unit, min_hours, features, who_for, outcome } = req.body;
    
    const db = getDatabase();
    const result = db.prepare(
      'INSERT INTO services (slug, name, description, long_description, price, unit, min_hours, features, who_for, outcome) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(slug, name, description, long_description, price, unit, min_hours, 
          JSON.stringify(features || []), who_for, outcome);
    
    res.status(201).json({ id: (result as any).lastInsertRowid, slug, name });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
}

export function updateService(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const db = getDatabase();
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'features') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id);
    
    db.prepare(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    res.json({ success: true });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
}

export function deleteService(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('UPDATE services SET is_active = 0 WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
}
