import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import { initDatabase } from './config/database';
import { seedDatabase } from './database/seed';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Initialize database
initDatabase();
seedDatabase();

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api', routes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  POST http://localhost:${PORT}/api/auth/login`);
  console.log(`  GET  http://localhost:${PORT}/api/content`);
  console.log(`  GET  http://localhost:${PORT}/api/services`);
  console.log(`  GET  http://localhost:${PORT}/api/bookings/availability?date=2026-03-15`);
  console.log(`  GET  http://localhost:${PORT}/api/testimonials`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`\nFrontend should be running at: ${FRONTEND_URL}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
