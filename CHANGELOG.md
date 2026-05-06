# Changelog

All notable changes to this project will be documented in this file.

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
