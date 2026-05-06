# Changelog

All notable changes to this project will be documented in this file.

## 2026-05-08 (Background Images)

### Added
- **Background image support for ALL sections**
- New `bg_image` content key per section - set any image URL
- New `bg_overlay` content key - 0-100 (percentage darkness over image)
- Auto text color switching: white text when image has >=30% overlay or dark bg
- Sections automatically add `relative` positioning + overlay div when image is set

### How to use background images:
1. Go to `/admin/content-editor`
2. Section: `[section_name]` (e.g. `about`)
3. Key: `bg_image`
4. Value: `/images/hero-bg.jpg` (or any image path/URL)
5. Key: `bg_overlay`
6. Value: `40` (0-100, percentage of black overlay for readability)
7. Save and refresh

### Example combinations:
| Section | bg_color | bg_image | bg_overlay | Result |
|---------|----------|----------|------------|--------|
| About | `none` | `/images/about-bg.jpg` | `40` | Photo background with 40% dimming |
| Reviews | `none` | `/images/hero-bg.jpg` | `50` | Dark photo bg with white text |
| Services | `white` | (empty) | `0` | Solid white background (default) |

### Text auto-adjustment:
- When `bg_overlay >= 30` OR `bg_color` is `primary`/`dark` → text switches to white
- When image is set with low overlay → text stays dark
- All headings, paragraphs, and cards auto-switch colors

## 2026-05-08

### Added
- **Customizable backgrounds for ALL sections** via admin content editor
- New `useSectionBg` hook: reads `bg_color` from content store per section
- Each section can have its background changed independently
- Supported colors: `primary` (green), `white`, `gray`, `warm`, `dark`, `none`

### Sections with customizable backgrounds:
| Section | Default | Content Key |
|---------|---------|-------------|
| Hero | transparent | N/A |
| Problems | gray | `problems.bg_color` |
| About | white | `about.bg_color` |
| Video | white | `video.bg_color` |
| Services | warm | `services.bg_color` |
| Why Organise | gray | `why.bg_color` |
| Why Choose | white | `whychoose.bg_color` |
| Life Flow | warm | `lifeflow.bg_color` |
| Pricing | gray | `pricing.bg_color` |
| Reviews | primary (green) | `reviews.bg_color` |
| Gallery | warm | `gallery.bg_color` |
| Certifications | white | `certs.bg_color` |
| Contact | gray | `contact.bg_color` |

### How to customize:
1. Go to `/admin/content-editor`
2. Section: `[section_name]` (e.g. `reviews`)
3. Key: `bg_color`
4. Value: `primary`, `white`, `gray`, `warm`, `dark`, or `none`
5. Save and refresh the page

## 2026-05-07 (Custom bg)

### Changed
- Reviews section: Green background (bg-primary) with admin-customisable color
- Background can be changed via admin content editor: Section='reviews', Key='bg_color'
- Supported values: 'primary' (green/default), 'white', 'gray', 'warm'
- All text/card colors auto-adjust based on background choice
- Shows current bg color label in admin hint next to CTA button

## 2026-05-07 (Carousel)

### Changed
- Reviews section: Complete rewrite as rotating carousel on GREEN background
- Reviews auto-rotate every 5 seconds with smooth fade/slide animation
- Added left/right arrow navigation buttons
- Added dot indicators at bottom (active dot is wider)
- Pauses autoplay on manual navigation, resumes after 10 seconds
- Added `id="customers"` so scroll spy tracks Reviews menu tab correctly
- Single review displayed at a time with large quote styling
- Fetches reviews from admin-managed database via /api/testimonials
- Removed all old testimonial code (Suzy/Linda duplicates)

## 2026-05-07 (Final)

### Changed
- Old green TestimonialSection (Suzy/Linda duplicate) REMOVED
- GoogleReviewsSection now fetches reviews from admin-managed database via /api/testimonials
- Admin can add/edit/delete reviews at /admin/testimonials
- Reviews display dynamically - shows placeholder if no reviews exist
- "Leave a Review on Google" button links to Google Business profile

### Removed
- TestimonialSection.tsx (green background with duplicate quotes)
- ReviewsSection.tsx (duplicate card layout)

## 2026-05-07 (Fix)

### Removed
- Duplicate ReviewsSection removed from page flow - was causing same testimonial to appear twice (below featured quote and again in cards)
- Review section flow is now: Pricing → Google Reviews → Featured Testimonial → Gallery → Contact

## 2026-05-07

### Added
- Google Reviews section between Pricing and Featured Testimonial
- Google star rating badge (4.9/5 with 47 reviews)
- 3 Google review cards with avatars, star ratings, and review text
- "Read All Reviews on Google" CTA button linking to Google Business profile
- Placeholder for Google Places API integration (set Place ID and API key in admin)
- Static fallback reviews display when API is not configured

### Changed
- Review section flow: Pricing → Google Reviews → Featured Testimonial → All Reviews
- Google Reviews uses alternating white/warm-gray background

## 2026-05-06 (Evening)

### Changed
- Shop button moved from scroll nav to CTA button (next to Book Now) - clearer separation between scroll sections and page links
- Scroll spy improved: Home tab only active when at literal top of page (scrollY < 100)
- Scroll spy keeps last active section when none visible (prevents jumping back to Home)
- IntersectionObserver rootMargin adjusted to `-20%` bottom for better detection

## 2026-05-06

### Added
- Scroll spy navigation: Active menu tab underline follows scroll position via IntersectionObserver
- Transparent header: Starts invisible over hero image, transitions to frosted glass on scroll
- Nav text color adapts: White over hero, dark after scrolling
- Book Now button color adapts: White/green over hero, green/white after scroll
- Mobile hamburger icon color adapts to header state
- Shop link added to navigation
- `useScrollSpy` hook with IntersectionObserver for reliable section detection
- Section background colors: Alternating white/warm-off-white/gray between sections
- Alternating slide animations: Cards enter from left/right alternating on scroll
- `scroll-mt-[90px]` on all anchor sections prevents header overlap

### Fixed
- API URL changed from `localhost:3001` to `/api` for production nginx proxy
- vite.config.ts `base` changed from `./` to `/` for absolute asset paths (fixes admin 404)
- Gallery API 500 error: Removed `created_at` from ORDER BY (column doesn't exist)
- TypeScript unused import errors in ServicesSection and TestimonialSection
- Escaped apostrophes in ServicesSection using template literals

## 2025-05-05

### Added
- Alternating slide animations between sections
- Alternating section background colors

### Fixed
- Build errors and API paths

## 2025-05-03

### Added
- Admin dashboard with 12 management pages
- Full backend API with Express + SQLite
- JWT authentication with bcryptjs
- Content editor, booking manager, service manager
- Testimonial manager, gallery manager, quiz builder
- Contact submissions viewer, settings manager
- Zustand state management for auth and content

### Infrastructure
- Deployed to Hetzner VPS (46.225.171.57)
- Nginx reverse proxy configuration
- PM2 process manager for API
- SPA fallback routing in nginx
