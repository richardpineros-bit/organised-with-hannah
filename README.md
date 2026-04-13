# Organised with Hannah

A professional organizing services website built with React, TypeScript, and Tailwind CSS.

![Website Preview](./public/images/hero-bg.jpg)

## Features

- **Responsive Design** - Works on all devices
- **Modern Animations** - Smooth scroll animations with Framer Motion
- **SEO Optimized** - Meta tags and semantic HTML
- **Fast Performance** - Built with Vite for optimal loading speeds
- **Customizable** - Easy to modify content and styling

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Sections

1. Hero Section - Full-screen banner with call-to-action
2. Problem Carousel - Client scenario cards
3. About Hannah - Bio and mission statement
4. Why Organise - Benefits and services
5. Why Choose Hannah - Credentials and experience
6. Life Flow Approach - Philosophy
7. Video Introduction - Personal introduction
8. Services - 4-step organizing journey
9. Pricing - Three service packages
10. Testimonials - Customer reviews
11. Gallery - Project showcase
12. Contact Form - Get in touch
13. Certifications - Professional badges
14. Footer - Social links and branding

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/organised-with-hannah.git
cd organised-with-hannah
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#7A9E8E',  // Your brand color
    dark: '#5D7A6E',
    light: '#9AB8AB',
  },
}
```

### Changing Content

Edit `src/App.tsx` to modify:
- Section headings and descriptions
- About section bio
- Pricing packages
- Testimonials
- Navigation menu

### Changing Images

Replace images in `public/images/`:
- `hero-bg.jpg` - Hero background
- `hannah-about.jpg` - About section photo
- `pricing-bg.jpg` - Pricing section background
- `contact-bg.jpg` - Contact section background
- `gallery-1.jpg` to `gallery-6.jpg` - Gallery images
- `org-academy-badge.png` - Certification badge
- `mhfa-badge.png` - Mental Health First Aid badge

## Project Structure

```
├── public/
│   └── images/           # Static images
├── src/
│   ├── components/       # Reusable components
│   │   └── ui/          # shadcn/ui components
│   ├── sections/        # Page sections
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── package.json
```

## Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`

## License

MIT License - feel free to use this for your own projects!

## Credits

- Design inspired by [organisedhannah.com.au](https://organisedhannah.com.au)
- Built with [shadcn/ui](https://ui.shadcn.com) components
- Icons by [Lucide](https://lucide.dev)
