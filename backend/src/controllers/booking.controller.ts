import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr).getDay();
}

function addMinutes(timeStr: string, minutes: number): string {
  const [hours, mins] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);
  return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function getAvailability(req: Request, res: Response): void {
  try {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Date parameter required' });
      return;
    }
    const db = getDatabase();
    const blocked = db.prepare('SELECT 1 FROM blocked_dates WHERE date = ?').get(date);
    if (blocked) {
      res.json({ date, slots: [] });
      return;
    }
    const dayOfWeek = getDayOfWeek(date);
    const availability = db.prepare(
      'SELECT start_time, end_time FROM availability WHERE day_of_week = ? AND is_available = 1'
    ).all(dayOfWeek) as any[];
    if (availability.length === 0) {
      res.json({ date, slots: [] });
      return;
    }
    const bookings = db.prepare(
      'SELECT start_time, end_time FROM bookings WHERE booking_date = ? AND status IN ("pending", "confirmed")'
    ).all(date) as any[];
    const defaultDuration = 240;
    const slots: { start: string; end: string }[] = [];
    for (const avail of availability) {
      let current = avail.start_time;
      while (timeToMinutes(current) + defaultDuration <= timeToMinutes(avail.end_time)) {
        const slotEnd = addMinutes(current, defaultDuration);
        let isAvailable = true;
        for (const booking of bookings) {
          if (timeToMinutes(current) < timeToMinutes(booking.end_time) && timeToMinutes(slotEnd) > timeToMinutes(booking.start_time)) {
            isAvailable = false;
            break;
          }
        }
        if (isAvailable) {
          slots.push({ start: current, end: slotEnd });
        }
        current = addMinutes(current, 30);
      }
    }
    res.json({ date, slots });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get availability' });
  }
}

export function createBooking(req: Request, res: Response): void {
  try {
    const { customer_name, customer_email, customer_phone, service_id, booking_date, start_time, notes } = req.body;
    if (!customer_name || !customer_email || !service_id || !booking_date || !start_time) {
      res.status(400).json({ error: 'Required fields missing' });
      return;
    }
    const db = getDatabase();
    const service = db.prepare('SELECT min_hours FROM services WHERE id = ?').get(service_id) as any;
    const duration = service ? service.min_hours * 60 : 240;
    const end_time = addMinutes(start_time, duration);
    const existing = db.prepare(
      'SELECT 1 FROM bookings WHERE booking_date = ? AND start_time = ? AND status IN ("pending", "confirmed")'
    ).get(booking_date, start_time);
    if (existing) {
      res.status(409).json({ error: 'Time slot no longer available' });
      return;
    }
    const result = db.prepare(
      'INSERT INTO bookings (customer_name, customer_email, customer_phone, service_id, booking_date, start_time, end_time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(customer_name, customer_email, customer_phone, service_id, booking_date, start_time, end_time, 'pending', notes || null);
    res.status(201).json({
      id: Number(result.lastInsertRowid),
      status: 'pending',
      message: 'Booking request received'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
}

export function getBookings(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT b.*, s.name as service_name FROM bookings b LEFT JOIN services s ON b.service_id = s.id ORDER BY b.booking_date DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bookings' });
  }
}

export function updateBookingStatus(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDatabase();
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
}

export function getAvailabilitySettings(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM availability ORDER BY day_of_week').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}

export function updateAvailability(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const { start_time, end_time, is_available } = req.body;
    const db = getDatabase();
    db.prepare('UPDATE availability SET start_time = ?, end_time = ?, is_available = ? WHERE id = ?')
      .run(start_time, end_time, is_available ? 1 : 0, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}

export function getBlockedDates(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM blocked_dates ORDER BY date').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}

export function addBlockedDate(req: Request, res: Response): void {
  try {
    const { date, reason } = req.body;
    const db = getDatabase();
    db.prepare('INSERT OR IGNORE INTO blocked_dates (date, reason) VALUES (?, ?)').run(date, reason);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}

export function removeBlockedDate(req: Request, res: Response): void {
  try {
    const { date } = req.params;
    const db = getDatabase();
    db.prepare('DELETE FROM blocked_dates WHERE date = ?').run(date);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}
