import { Request, Response } from 'express';
import { getDatabase } from '../config/database';

function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr).getDay();
}

function addMinutes(timeStr: string, minutes: number): string {
  const [hours, mins] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function getAvailability(req: Request, res: Response): void {
  try {
    const { date } = req.query;
    
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Date parameter required (YYYY-MM-DD)' });
      return;
    }
    
    const db = getDatabase();
    
    // Check if date is blocked
    const blocked = db.prepare('SELECT 1 FROM blocked_dates WHERE date = ?').get(date);
    if (blocked) {
      res.json({ date, slots: [] });
      return;
    }
    
    const dayOfWeek = getDayOfWeek(date);
    
    // Get Hannah's availability for that day
    const availability = db.prepare(
      'SELECT start_time, end_time FROM availability WHERE day_of_week = ? AND is_available = 1'
    ).all(dayOfWeek);
    
    if (availability.length === 0) {
      res.json({ date, slots: [] });
      return;
    }
    
    // Get existing bookings for that date
    const bookings = db.prepare(
      'SELECT start_time, end_time FROM bookings WHERE booking_date = ? AND status IN ("pending", "confirmed")'
    ).all(date);
    
    // Get service durations (default 4 hours for in-person, 1 for virtual)
    const services = db.prepare('SELECT id, slug, min_hours FROM services WHERE is_active = 1').all();
    const defaultDuration = 240; // 4 hours in minutes
    
    const slots: { start: string; end: string }[] = [];
    
    for (const avail of availability) {
      let current = avail.start_time;
      
      while (timeToMinutes(current) + defaultDuration <= timeToMinutes(avail.end_time)) {
        const slotEnd = addMinutes(current, defaultDuration);
        
        // Check if slot conflicts with any booking
        let isAvailable = true;
        for (const booking of bookings) {
          const slotStartMin = timeToMinutes(current);
          const slotEndMin = timeToMinutes(slotEnd);
          const bookingStartMin = timeToMinutes(booking.start_time);
          const bookingEndMin = timeToMinutes(booking.end_time);
          
          if (slotStartMin < bookingEndMin && slotEndMin > bookingStartMin) {
            isAvailable = false;
            break;
          }
        }
        
        if (isAvailable) {
          slots.push({ start: current, end: slotEnd });
        }
        
        current = addMinutes(current, 30); // 30-minute increments
      }
    }
    
    res.json({ date, slots });
  } catch (error) {
    console.error('Get availability error:', error);
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
    
    // Get service details for duration
    const service = db.prepare('SELECT min_hours FROM services WHERE id = ?').get(service_id);
    const duration = service ? service.min_hours * 60 : 240; // minutes
    const end_time = addMinutes(start_time, duration);
    
    // Check if slot is still available
    const existing = db.prepare(
      'SELECT 1 FROM bookings WHERE booking_date = ? AND start_time = ? AND status IN ("pending", "confirmed")'
    ).get(booking_date, start_time);
    
    if (existing) {
      res.status(409).json({ error: 'This time slot is no longer available' });
      return;
    }
    
    const result = db.prepare(
      'INSERT INTO bookings (customer_name, customer_email, customer_phone, service_id, booking_date, start_time, end_time, status, notes) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(customer_name, customer_email, customer_phone, service_id, booking_date, start_time, end_time, 'pending', notes || null);
    
    // TODO: Send confirmation email
    
    res.status(201).json({
      id: result.lastInsertRowid,
      status: 'pending',
      message: 'Booking request received. Hannah will confirm shortly.'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
}

export function getBookings(req: Request, res: Response): void {
  try {
    const { status, date_from, date_to } = req.query;
    const db = getDatabase();
    
    let query = 'SELECT b.*, s.name as service_name FROM bookings b LEFT JOIN services s ON b.service_id = s.id WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }
    if (date_from) {
      query += ' AND b.booking_date >= ?';
      params.push(date_from);
    }
    if (date_to) {
      query += ' AND b.booking_date <= ?';
      params.push(date_to);
    }
    
    query += ' ORDER BY b.booking_date DESC, b.start_time';
    
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
}

export function updateBookingStatus(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const db = getDatabase();
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    
    // TODO: Send status update email to customer
    
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
}

export function getAvailabilitySettings(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM availability ORDER BY day_of_week').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get availability settings' });
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
    res.status(500).json({ error: 'Failed to update availability' });
  }
}

export function getBlockedDates(req: Request, res: Response): void {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM blocked_dates ORDER BY date').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blocked dates' });
  }
}

export function addBlockedDate(req: Request, res: Response): void {
  try {
    const { date, reason } = req.body;
    
    const db = getDatabase();
    db.prepare('INSERT OR IGNORE INTO blocked_dates (date, reason) VALUES (?, ?)').run(date, reason);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add blocked date' });
  }
}

export function removeBlockedDate(req: Request, res: Response): void {
  try {
    const { date } = req.params;
    
    const db = getDatabase();
    db.prepare('DELETE FROM blocked_dates WHERE date = ?').run(date);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove blocked date' });
  }
}
