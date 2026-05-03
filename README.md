# Organised With Hannah

> **Fully autonomous, self-hosted platform** — zero SaaS subscriptions, complete ownership.

A professional home organising services website with a built-in admin dashboard (like WordPress), custom booking system, quiz builder, and digital product store.

---

## Architecture

| Layer | Technology | Cost |
|-------|-----------|------|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind | $0 |
| **Backend** | Express.js + TypeScript | $0 |
| **Database** | SQLite (better-sqlite3) | $0 |
| **Auth** | JWT + bcryptjs | $0 |
| **Email** | Nodemailer + Gmail SMTP | $0 |
| **File Storage** | Local filesystem | $0 |
| **Payments** | Stripe (per-transaction only) | 1.75% + 30c |
| **Hosting** | VPS (DigitalOcean/Linode) | ~$5/mo |

**Total monthly cost: ~$5 + Stripe fees**

---

## Features

### Public Website
- Homepage with all sections (hero, about, services, pricing, testimonials, contact)
- **Dynamic content** — all text loaded from database via API
- **Booking system** — calendar with time slot selection, no Calendly needed
- **Quiz** — interactive personality quiz with results
- **Digital store** — ready for Stripe integration

### Admin Dashboard (`/admin`)
- **Content Editor** — edit all website text (like WordPress)
- **Booking Manager** — view, confirm, cancel bookings
- **Service Manager** — add/edit services and pricing
- **Testimonial Manager** — add/edit customer reviews
- **Gallery Manager** — upload/delete images
- **Quiz Builder** — add quiz questions
- **Contact Submissions** — view form submissions
- **Settings** — edit site-wide settings

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/richardpineros-bit/organised-with-hannah.git
cd organised-with-hannah
```

### 2. Start Backend
```bash
cd backend
cp .env.example .env
npm install
npx ts-node src/server.ts
# API runs on http://localhost:3001
```

### 3. Start Frontend
```bash
cd ..
npm install
npm run dev
# Site opens on http://localhost:5173
```

### 4. Access Admin
- Go to: http://localhost:5173/admin/login
- Login: `admin@organisedwithhannah.com` / `admin123`

---

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/login | Public |
| GET | /api/content | Public |
| PUT | /api/content/:section/:key | Admin |
| GET | /api/services | Public |
| GET | /api/bookings/availability | Public |
| POST | /api/bookings | Public |
| GET | /api/testimonials | Public |
| POST | /api/contact | Public |
| GET | /api/quiz/:slug | Public |

---

## Why This Beats WordPress

| Feature | WordPress | This Solution |
|---------|-----------|---------------|
| Hosting | $10-50/mo | $5/mo |
| Plugin fees | $$$ | $0 |
| Page speed | Slow (PHP) | Fast (React) |
| Booking system | Paid plugin | Built-in |
| Code ownership | No | 100% yours |
| Database bloat | Yes | Compact SQLite |

---

## Deployment

### Option 1: Single VPS ($5/mo)
```
VPS (Ubuntu)
├── Nginx (reverse proxy)
├── PM2 (Node.js process manager)
│   ├── API server (Express, port 3001)
│   └── Frontend (Vite preview, port 3000)
├── SQLite database (local file)
└── SSL (Let's Encrypt, free)
```

### Option 2: Separate Frontend + Backend
```
Frontend: Static hosting (Cloudflare Pages = FREE)
Backend: VPS $5/month (API + database + uploads)
```

---

## License

MIT — you own everything.
