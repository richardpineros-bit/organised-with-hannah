import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

export function submitContact(req: Request, res: Response): void {
  try {
    const { first_name, last_name, email, phone, subject, message } = req.body;
    
    if (!first_name || !last_name || !email || !message) {
      res.status(400).json({ error: 'Required fields missing' });
      return;
    }
    
    const db = getDatabase();
    const result = db.prepare(
      'INSERT INTO contacts (first_name, last_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(first_name, last_name, email, phone || null, subject || null, message);
    
    // TODO: Send email notification to Hannah
    
    res.status(201).json({
      id: (result as any).lastInsertRowid,
      message: 'Thank you! Hannah will be in touch soon.'
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

export function getContacts(req: Request, res: Response): void {
  try {
    const { is_read } = req.query;
    const db = getDatabase();
    
    let query = 'SELECT * FROM contacts WHERE 1=1';
    const params: any[] = [];
    
    if (is_read !== undefined) {
      query += ' AND is_read = ?';
      params.push(is_read);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get contacts' });
  }
}

export function markContactRead(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.prepare('UPDATE contacts SET is_read = 1 WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
}
