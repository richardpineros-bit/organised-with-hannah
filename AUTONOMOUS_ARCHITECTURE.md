Here is the fully autonomous, self-hosted architecture for Organised With Hannah — zero recurring SaaS costs, everything built in-house.

# Full-Stack Architecture: Organised With Hannah

## Philosophy: Zero SaaS Lock-in

| What Others Pay For | Our Solution | Cost |
|---------------------|--------------|------|
| Calendly (booking) | Custom booking API + calendar UI | $0 |
| Contentful/Sanity (CMS) | SQLite database + Admin Dashboard | $0 |
| Clerk/Auth0 (auth) | Custom JWT + bcrypt | $0 |
| Supabase/Firebase (database) | SQLite file | $0 |
| Mailchimp/SendGrid (email) | Nodemailer + Gmail SMTP | $0 |
| Vercel/Netlify (hosting) | Self-hosted VPS or $5/month | $5/mo |
| Cloudinary (images) | Local filesystem | $0 |

**Only unavoidable external service: Stripe** (per-transaction fee only, no monthly cost)

---

## Tech Stack

### Backend
| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Node.js 20 | Proven, fast, ecosystem |
| Framework | Express.js | Minimal, flexible, battle-tested |
| Language | TypeScript | Type safety across full stack |
| Database | SQLite (better-sqlite3) | Zero config, file-based, fast enough |
| Auth | JWT (jsonwebtoken) + bcryptjs | No external auth service |
| Email | Nodemailer + Gmail SMTP | Free tier handles 500 emails/day |
| Payments | Stripe (server-side only) | PCI compliant, per-transaction only |
| File Upload | Multer + local filesystem | No cloud storage needed |
| Validation | Zod | Same validation as frontend |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Calendar | Custom (no library needed) |
| Icons | Lucide React |

### Admin Dashboard
| Feature | Implementation |
|---------|---------------|
| Rich Text Editor | react-quill (open source) |
| Image Upload | Dropzone + direct upload to backend |
| Data Tables | TanStack Table |
| Forms | React Hook Form |
| WYSIWYG | react-quill |

---

## Database Schema (SQLite)

```sql
-- Users (admins and customers)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'customer' CHECK(role IN ('admin', 'customer')),
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content Management (all editable website content)
CREATE TABLE content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,           -- e.g. 'hero', 'about', 'services'
  key TEXT NOT NULL,               -- e.g. 'headline', 'body'
  value TEXT NOT NULL,             -- actual content (supports HTML)
  type TEXT DEFAULT 'text',        -- text, html, image, json
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section, key)
);

-- Services
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  unit TEXT DEFAULT 'hour',        -- hour, session, flat
  min_hours INTEGER DEFAULT 1,
  features TEXT,                   -- JSON array
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

-- Bookings (custom calendar system)
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  service_id INTEGER REFERENCES services(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  deposit_paid BOOLEAN DEFAULT 0,
  total_amount DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Availability (time slots Hannah is available)
CREATE TABLE availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),  -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT 1
);

-- Blocked Dates (Hannah's holidays/unavailable)
CREATE TABLE blocked_dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  reason TEXT,
  UNIQUE(date)
);

-- Testimonials
CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER DEFAULT 5,
  text TEXT NOT NULL,
  image_path TEXT,
  is_featured BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Digital Products
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  file_path TEXT,                  -- for downloadable products
  content TEXT,                    -- for course content (HTML/JSON)
  type TEXT DEFAULT 'ebook' CHECK(type IN ('ebook', 'course', 'template', 'quiz')),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  stripe_payment_intent TEXT,
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'fulfilled', 'refunded')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Questions
CREATE TABLE quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_slug TEXT NOT NULL,
  question TEXT NOT NULL,
  sort_order INTEGER,
  options TEXT NOT NULL  -- JSON: [{"label": "...", "type": "..."}]
);

-- Quiz Results
CREATE TABLE quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_slug TEXT NOT NULL,
  email TEXT,
  answers TEXT NOT NULL,  -- JSON
  result_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images
CREATE TABLE gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  image_path TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1
);

-- Contact Submissions
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings (site-wide configuration)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'string'
);
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create customer account |
| POST | /api/auth/login | Login, returns JWT |
| POST | /api/auth/logout | Invalidate token |
| GET | /api/auth/me | Get current user |

### Content (Admin + Public)
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/content?section=hero | Public |
| PUT | /api/content/:section/:key | Admin JWT |
| POST | /api/content/bulk | Admin JWT |

### Services
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/services | Public |
| POST | /api/services | Admin JWT |
| PUT | /api/services/:id | Admin JWT |
| DELETE | /api/services/:id | Admin JWT |

### Bookings (Custom Calendar)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/bookings/availability?date=YYYY-MM-DD | Public | Get available slots |
| POST | /api/bookings | Public | Create booking request |
| GET | /api/bookings | Admin JWT | List all bookings |
| PUT | /api/bookings/:id/confirm | Admin JWT | Confirm booking |
| PUT | /api/bookings/:id/cancel | Admin JWT | Cancel booking |
| GET | /api/bookings/admin/calendar | Admin JWT | Full calendar view |

### Testimonials
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/testimonials | Public |
| POST | /api/testimonials | Admin JWT |
| PUT | /api/testimonials/:id | Admin JWT |
| DELETE | /api/testimonials/:id | Admin JWT |

### Contact
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/contact | Public |
| GET | /api/contact | Admin JWT |
| PUT | /api/contact/:id/read | Admin JWT |

### Products (Digital)
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/products | Public |
| POST | /api/products | Admin JWT |
| GET | /api/products/:slug | Public |
| POST | /api/orders | Customer JWT |
| GET | /api/orders/my | Customer JWT |

### Payments (Stripe)
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/payments/intent | Public | Create payment intent |
| POST | /api/payments/webhook | Stripe | Handle webhooks |

### Gallery
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/gallery | Public |
| POST | /api/gallery | Admin JWT |
| DELETE | /api/gallery/:id | Admin JWT |

### Quiz
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/quiz/:slug | Public |
| POST | /api/quiz/:slug/submit | Public |
| GET | /api/quiz/results | Admin JWT |

### Settings
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/settings | Public |
| PUT | /api/settings/:key | Admin JWT |

### File Upload
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/upload | Admin JWT |
| GET | /uploads/* | Public |

---

## Admin Dashboard Routes

```
/admin
├── /login                    -- Admin login
├── /dashboard                -- Overview stats
├── /content                  -- Edit all website content
│   ├── /hero                 -- Hero section editor
│   ├── /about                -- About section editor
│   ├── /services             -- Services editor
│   ├── /testimonials         -- Testimonials manager
│   └── /settings             -- Site settings
├── /bookings                 -- Calendar + booking management
│   ├── /calendar             -- Full calendar view
│   └── /list                 -- Table view of all bookings
├── /products                 -- Digital products
│   ├── /list                 -- Manage products
│   └── /orders               -- Order management
├── /quiz                     -- Quiz builder
├── /gallery                  -- Image manager
├── /contacts                 -- Form submissions
└── /users                    -- Customer accounts
```

---

## File Structure

```
/
├── backend/                          -- Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts           -- SQLite connection
│   │   │   └── stripe.ts             -- Stripe setup
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── content.controller.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── service.controller.ts
│   │   │   ├── testimonial.controller.ts
│   │   │   ├── contact.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── quiz.controller.ts
│   │   │   ├── gallery.controller.ts
│   │   │   ├── upload.controller.ts
│   │   │   └── settings.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts     -- JWT validation
│   │   │   ├── admin.middleware.ts    -- Role check
│   │   │   └── error.middleware.ts    -- Error handling
│   │   ├── routes/
│   │   │   ├── index.ts               -- Route aggregator
│   │   │   ├── auth.routes.ts
│   │   │   ├── content.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   ├── service.routes.ts
│   │   │   ├── testimonial.routes.ts
│   │   │   ├── contact.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── quiz.routes.ts
│   │   │   ├── gallery.routes.ts
│   │   │   ├── upload.routes.ts
│   │   │   └── settings.routes.ts
│   │   ├── database/
│   │   │   ├── schema.sql             -- Full schema
│   │   │   ├── seed.ts               -- Default data
│   │   │   └── migrations/           -- Schema versions
│   │   ├── utils/
│   │   │   ├── email.ts              -- Nodemailer setup
│   │   │   └── helpers.ts
│   │   └── server.ts                 -- Entry point
│   ├── uploads/                       -- Image storage
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                          -- React client
│   ├── src/
│   │   ├── main.tsx                    -- Entry point
│   │   ├── App.tsx                     -- Router
│   │   ├── index.css
│   │   ├── sections/                   -- Public sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Booking.tsx             -- NEW: Booking flow
│   │   │   ├── Quiz.tsx                -- NEW: Quiz
│   │   │   └── ProductStore.tsx        -- NEW: Digital store
│   │   ├── admin/                      -- Admin dashboard
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ContentEditor.tsx
│   │   │   ├── BookingManager.tsx
│   │   │   ├── ServiceManager.tsx
│   │   │   ├── TestimonialManager.tsx
│   │   │   ├── ProductManager.tsx
│   │   │   ├── OrderManager.tsx
│   │   │   ├── QuizBuilder.tsx
│   │   │   ├── GalleryManager.tsx
│   │   │   ├── ContactSubmissions.tsx
│   │   │   └── SettingsManager.tsx
│   │   ├── components/
│   │   │   ├── ui/                     -- shadcn components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   ├── PricingCard.tsx
│   │   │   ├── BookingCalendar.tsx     -- NEW
│   │   │   ├── BookingForm.tsx         -- NEW
│   │   │   ├── QuizComponent.tsx       -- NEW
│   │   │   └── ProductCard.tsx         -- NEW
│   │   ├── hooks/
│   │   │   ├── useAuth.ts              -- Auth context
│   │   │   ├── useContent.ts           -- Fetch content from API
│   │   │   ├── useBookings.ts          -- Booking state
│   │   │   └── useApi.ts               -- Generic API hook
│   │   ├── store/
│   │   │   ├── authStore.ts            -- Zustand auth
│   │   │   └── contentStore.ts         -- Zustand content
│   │   ├── types/
│   │   │   └── index.ts                -- Shared types
│   │   └── lib/
│   │       ├── utils.ts
│   │       └── api.ts                  -- Axios/fetch wrapper
│   ├── public/
│   │   └── images/
│   ├── package.json
│   └── vite.config.ts
│
├── database.sqlite                      -- SQLite file (auto-created)
└── README.md
```

---

## Booking System Architecture

### How It Works

```
1. Visitor selects service
   ↓
2. API GET /api/bookings/availability?date=2026-03-15
   ↓
3. Backend calculates available slots:
   - Read availability table (Hannah's working hours)
   - Read blocked_dates table
   - Read existing bookings for that date
   - Return remaining slots: [{start: "09:00", end: "13:00"}]
   ↓
4. Visitor picks slot
   ↓
5. API POST /api/bookings
   {service_id, date, start_time, customer_name, email, phone}
   ↓
6. Backend:
   - Validates slot is still available
   - Creates booking with status "pending"
   - Sends confirmation email (Nodemailer)
   - Sends SMS notification to Hannah (optional: Twilio free tier)
   ↓
7. Hannah gets email, confirms in admin
   PUT /api/bookings/:id/confirm
   ↓
8. Customer gets confirmation email
```

### Calendar Algorithm

```typescript
function getAvailableSlots(date: string): TimeSlot[] {
  const dayOfWeek = new Date(date).getDay();
  
  // Get Hannah's availability for that day
  const availability = db
    .prepare("SELECT * FROM availability WHERE day_of_week = ? AND is_available = 1")
    .all(dayOfWeek);
  
  // Check if date is blocked
  const isBlocked = db
    .prepare("SELECT 1 FROM blocked_dates WHERE date = ?")
    .get(date);
  
  if (isBlocked) return [];
  
  // Get existing bookings
  const existingBookings = db
    .prepare("SELECT start_time, end_time FROM bookings WHERE booking_date = ? AND status != 'cancelled'")
    .all(date);
  
  // Calculate remaining slots
  const slots: TimeSlot[] = [];
  for (const avail of availability) {
    let current = avail.start_time;
    while (current < avail.end_time) {
      const slotEnd = addHours(current, serviceDuration);
      if (isSlotAvailable(current, slotEnd, existingBookings)) {
        slots.push({ start: current, end: slotEnd });
      }
      current = addMinutes(current, 30); // 30-min increments
    }
  }
  
  return slots;
}
```

---

## Email System (Nodemailer)

### Setup
```typescript
// Uses Gmail SMTP (free, 500 emails/day)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,      // hannah@organisedwithhannah.com
    pass: process.env.EMAIL_PASSWORD,   // App-specific password
  }
});
```

### Email Templates
- Booking request received (to customer)
- New booking notification (to Hannah)
- Booking confirmed (to customer)
- Booking reminder (24h before)
- Contact form submission (to Hannah)
- Digital product purchase (to customer with download link)
- Quiz results (to customer)

---

## Admin Dashboard Features

### Content Editor (WordPress-like)
```
+------------------------------------------+
|  Section: Hero                            |
|  ┌─────────────────────────────────────┐  |
|  |  Headline: [Professional Home...  ] |  |
|  |  Subhead:  [Based in Albury...   ] |  |
|  |  CTA Text: [Book Free Consultation]|  |
|  |  CTA Link: [#contact]               |  |
|  |  BG Image: [Upload / Current...   ] |  |
|  └─────────────────────────────────────┘  |
|                                           |
|  [Save Changes] [Preview] [Reset]        |
+------------------------------------------+
```

### Booking Calendar (Google Calendar-like)
```
+------------------------------------------+
|  < March 2026 >                          |
|  Sun Mon Tue Wed Thu Fri Sat             |
|       1   2   3   4   5   6             |
|   7   8   9  10  11  12  13             |
|  14  15  16  17  18 [19] 20  ← Booking  |
|  21  22  23  24  25  26  27             |
|  28  29  30  31                         |
|                                           |
|  Selected: March 19, 2026               |
|  ┌─────────────────────────────────────┐  |
|  |  09:00 - 13:00  Jane D. (Pending) |  |
|  |  [Confirm] [Reschedule] [Cancel]    |  |
|  └─────────────────────────────────────┘  |
+------------------------------------------+
```

---

## Deployment Architecture

### Option 1: Single VPS ($5-10/month)
```
VPS (Ubuntu)
├── Nginx (reverse proxy)
├── PM2 (Node.js process manager)
│   ├── API server (Express, port 3001)
│   └── Frontend (Vite preview or static, port 3000)
├── SQLite database (local file)
├── uploads/ directory
└── SSL (Let's Encrypt, free)
```

### Option 2: Separate Frontend + Backend
```
Frontend: Static hosting (GitHub Pages / Cloudflare Pages = FREE)
Backend: VPS $5/month (API + database + uploads)
Database: SQLite on same VPS
```

### Environment Variables (.env)
```
# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://organisedwithhannah.com.au

# Database
DATABASE_URL=./database.sqlite

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_FROM=hannah@organisedwithhannah.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx  # App-specific password

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Admin
ADMIN_EMAIL=admin@organisedwithhannah.com
ADMIN_PASSWORD_HASH=$2b$10$...  # Pre-hashed
```

---

## Why This Beats WordPress

| Feature | WordPress | Our Solution |
|---------|-----------|-------------|
| Hosting cost | $10-50/mo | $5/mo |
| Plugin fees | $$$ (Elementor Pro, etc) | $0 |
| Page speed | Slow (PHP + plugins) | Fast (static/React) |
| Security | Constant updates needed | Minimal attack surface |
| Custom features | Plugin dependency | Build anything |
| Database bloat | Yes | SQLite, compact |
| Booking system | Paid plugin | Built-in, custom |
| E-commerce | WooCommerce fees | Stripe only |
| Code ownership | No (plugins) | 100% yours |

---

## What Gets Built in Each Phase

### Phase 1: Foundation (Week 1)
- Express API server
- SQLite database + schema
- JWT authentication
- Content API (read/write)
- File upload system
- Admin login + dashboard shell

### Phase 2: Content Management (Week 2)
- Admin content editor (all sections)
- Frontend fetches content from API
- Image upload in admin
- Settings manager
- Seed database with current content

### Phase 3: Booking System (Week 3)
- Availability CRUD in admin
- Calendar algorithm
- Booking form on frontend
- Booking management in admin
- Email notifications
- Blocked dates management

### Phase 4: Public Features (Week 4)
- Contact form (saves to DB + email)
- Testimonials (admin-managed)
- Gallery (admin-managed)
- Quiz builder + frontend quiz

### Phase 5: Commerce (Week 5)
- Product CRUD in admin
- Stripe integration
- Order management
- Digital product delivery
- Customer accounts

### Phase 6: Polish (Week 6)
- SEO meta tags
- Performance optimization
- Mobile testing
- Admin onboarding walkthrough
- Backup system for SQLite

---

## Total Cost Summary

| Item | Cost |
|------|------|
| VPS (DigitalOcean/Linode) | $5-6/month |
| Domain | $12/year |
| SSL (Let's Encrypt) | FREE |
| Email (Gmail) | FREE (500/day) |
| Database (SQLite) | FREE |
| Stripe | 1.75% + 30¢ per transaction |
| **Total Monthly** | **~$5 + Stripe fees** |

---

## Next Step

I will now build this entire system. The output will be:
1. Fully working backend API (Express + SQLite)
2. Admin dashboard (React-based, WordPress-like)
3. Frontend connected to API (dynamic content)
4. Booking system with calendar
5. All content editable via admin panel

Ready to start building?
