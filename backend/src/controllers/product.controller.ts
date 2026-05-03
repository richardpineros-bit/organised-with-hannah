import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

export function getProducts(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT id, slug, name, description, price, type, is_active FROM products WHERE is_active = 1').all();
    res.json(rows.map((row: any) => ({ ...row, price: Number(row.price) })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to get products' });
  }
}

export function getProduct(req: Request, res: Response): void {
  try {
    const { slug } = req.params;
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM products WHERE slug = ? AND is_active = 1').get(slug);
    
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json({ ...row, price: Number(row.price) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product' });
  }
}

export function createProduct(req: Request, res: Response): void {
  try {
    const { slug, name, description, price, type, content } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;
    
    const db = getDatabase();
    const result = db.prepare(
      'INSERT INTO products (slug, name, description, price, type, content, file_path) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(slug, name, description, price, type, content || null, file_path);
    
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
}

export function updateProduct(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const { name, description, price, type, content, is_active } = req.body;
    
    const db = getDatabase();
    db.prepare(
      'UPDATE products SET name = ?, description = ?, price = ?, type = ?, content = ?, is_active = ? WHERE id = ?'
    ).run(name, description, price, type, content, is_active ? 1 : 0, id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export function getOrders(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare(
      'SELECT o.*, p.name as product_name, u.email as user_email ' +
      'FROM orders o ' +
      'LEFT JOIN products p ON o.product_id = p.id ' +
      'LEFT JOIN users u ON o.user_id = u.id ' +
      'ORDER BY o.created_at DESC'
    ).all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
}

export function getMyOrders(req: any, res: Response): void {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const db = getDatabase();
    const rows = db.prepare(
      'SELECT o.*, p.name as product_name, p.file_path, p.content ' +
      'FROM orders o ' +
      'LEFT JOIN products p ON o.product_id = p.id ' +
      'WHERE o.user_id = ? AND o.status = "paid" ' +
      'ORDER BY o.created_at DESC'
    ).all(userId);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
}
