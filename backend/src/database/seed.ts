import bcryptjs from 'bcryptjs';
import { getDatabase } from '../config/database';

export function seedDatabase(): void {
  const db = getDatabase();
  
  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@organisedwithhannah.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminHash = bcryptjs.hashSync(adminPassword, 10);
  
  db.prepare(
    'INSERT OR IGNORE INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
  ).run(adminEmail, adminHash, 'Hannah', 'admin');
  
  console.log(`Admin user: ${adminEmail} / ${adminPassword}`);
  
  // Seed default content
  const defaultContent = [
    // Hero section
    ['hero', 'tagline', 'Declutter | Clean | Transform', 'text'],
    ['hero', 'headline', 'Professional Home Organising for Busy Individuals Who Feel Overwhelmed', 'text'],
    ['hero', 'subheadline', 'Based in Albury/Wodonga, I help busy mums, overwhelmed households, and neurodiverse families reclaim their space—and their peace of mind.', 'text'],
    ['hero', 'quote', '"Your home is living space, not storage space." - Francine Jay', 'text'],
    ['hero', 'cta_primary', 'Book Free Consultation', 'text'],
    ['hero', 'cta_secondary', 'See How It Works', 'text'],
    ['hero', 'social_proof', '50+ happy clients across Albury, Wodonga & surrounds', 'text'],
    
    // About section
    ['about', 'title', 'About Hannah', 'text'],
    ['about', 'subtitle', 'My Purpose and Passion', 'text'],
    ['about', 'bio', `My love for organising goes way back to my childhood, and I've made it my mission to help people create spaces that truly work for them. With over 10 years of experience, I'm all about making a positive impact in the lives of others.`, 'text'],
    ['about', 'bio_second', `What drives me even more than my love of organising is my passion for supporting, encouraging, and educating others along their life journey. My heart is with the people I work with, and I'm dedicated to helping them build confidence and independence.`, 'text'],
    
    // Services overview
    ['services', 'title', 'How I Can Help', 'text'],
    ['services', 'subtitle', 'Choose the service that fits your needs', 'text'],
    
    // Why organise
    ['why', 'title', 'Why do you need to Organise?', 'text'],
    ['why', 'intro', `I believe that organising isn't about creating a Pinterest-perfect life—it's about designing a life flow that makes everything easier and more intentional.`, 'text'],
    
    // Life flow
    ['lifeflow', 'title', 'Life Flow Approach', 'text'],
    ['lifeflow', 'body', `I believe that a well-organised home isn't about perfection—it's about flow. Everything has a place, and when your space aligns with your daily rhythms, life feels easier and more intentional.`, 'text'],
    
    // Why choose
    ['whychoose', 'title', 'Why Choose Hannah?', 'text'],
    ['whychoose', 'body', `As a mother of three boys, I understand the chaos of life. But in the midst of it all, I've discovered the power of organisation and decluttering to create a sense of peace and calm.`, 'text'],
    
    // Testimonials section
    ['testimonials', 'title', 'What People Say', 'text'],
    ['testimonials', 'subtitle', 'Our Customers\' Reviews', 'text'],
    
    // Pricing
    ['pricing', 'title', 'Pricing and Inclusions', 'text'],
    ['pricing', 'subtitle', 'Packages', 'text'],
    ['pricing', 'note', 'All pricing includes GST', 'text'],
    
    // Contact
    ['contact', 'title', 'Contact me', 'text'],
    ['contact', 'subtitle', 'Free 15-minute consultation. No pressure, just a chat about your space.', 'text'],
    ['contact', 'phone', '0412 345 678', 'text'],
    ['contact', 'email', 'hannah@organisedwithhannah.com', 'text'],
    ['contact', 'location', 'Albury / Wodonga and surrounds', 'text'],
    
    // Footer
    ['footer', 'tagline', 'Declutter | Clean | Transform', 'text'],
  ];
  
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO content (section, key, value, type) VALUES (?, ?, ?, ?)'
  );
  
  for (const [section, key, value, type] of defaultContent) {
    stmt.run(section, key, value, type);
  }
  
  // Seed default services
  const services = [
    {
      slug: 'in-person',
      name: 'In-Home Organising',
      description: 'I come to your home and I physically declutter, organise, and set up a system for your space and life',
      long_description: 'Hands-on transformation in your home. I work alongside you to declutter, organise, and create systems that actually work for your lifestyle.',
      price: 125,
      unit: 'hour',
      min_hours: 4,
      features: JSON.stringify([
        'Hands-on decluttering and sorting',
        'Physical organisation and system setup',
        'Basic labeling',
        'Small amount of rubbish removal'
      ]),
      who_for: 'Homeowners, renters, anyone overwhelmed by physical clutter',
      outcome: 'A decluttered, organised space with systems you can maintain',
      sort_order: 1
    },
    {
      slug: 'virtual',
      name: 'Virtual Organising',
      description: 'Online support for decluttering, organising & home systems',
      long_description: 'Perfect if you\'re outside my service area or prefer to DIY with expert guidance. Video calls, action plans, and ongoing support.',
      price: 100,
      unit: 'hour',
      min_hours: 1,
      features: JSON.stringify([
        '1-on-1 video sessions',
        'Custom action plans',
        'Resource templates',
        'Email support between sessions'
      ]),
      who_for: 'Anyone outside Albury/Wodonga, DIY enthusiasts',
      outcome: 'A clear plan and ongoing guidance to organise your own space',
      sort_order: 2
    },
    {
      slug: 'coaching',
      name: 'Organised Life Coaching',
      description: 'Transform your time, habits & daily flow',
      long_description: 'We work on time management, habit building, and navigating life\'s transitions. Go beyond organising to transform how you live.',
      price: 190,
      unit: 'hour',
      min_hours: 2,
      features: JSON.stringify([
        'Habit building systems',
        'Time management coaching',
        'Life transition support',
        'Unlimited email support'
      ]),
      who_for: 'People in life transitions, those needing habit change',
      outcome: 'New habits, routines, and mindset for lasting organisation',
      sort_order: 3
    }
  ];
  
  const serviceStmt = db.prepare(
    'INSERT OR IGNORE INTO services (slug, name, description, long_description, price, unit, min_hours, features, who_for, outcome, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  for (const s of services) {
    serviceStmt.run(s.slug, s.name, s.description, s.long_description, s.price, s.unit, s.min_hours, s.features, s.who_for, s.outcome, s.sort_order);
  }
  
  // Seed testimonials
  const testimonials = [
    {
      name: 'Suzy and Linda',
      location: 'Albury, NSW',
      rating: 5,
      text: "Hannah's organisational services have truly transformed my home. With her expertise, my pantry, kitchen, and wardrobe are now not only beautifully arranged but also highly functional. Her meticulous attention to detail has delivered outstanding results. I wholeheartedly recommend her services to anyone in search of order, efficiency, and elegance in their living space.",
      is_featured: 1
    },
    {
      name: 'Hellen',
      location: 'Thurgoona',
      rating: 5,
      text: "After renovating our kitchen, we temporarily stored items everywhere, in chaos. Hannah assessed our needs, decluttered, and organised everything systematically. She categorised items, advised on what to keep, donate. Hannah organised everything perfectly, its easy to find with labels and a well sorted system. Hannah's expertise is invaluable; we can't wait for her help with our wardrobe next",
      is_featured: 0
    },
    {
      name: 'GENLIFE',
      location: 'Lavington',
      rating: 5,
      text: "Working with Hannah was delightful; she's friendly, professional, and takes full control of the sorting and organising process. I simply shared my goals for the space and she handled everything else. The outcome not only looks fantastic but is also highly functional. I really look forward to collaborating with her on other projects and highly recommend her services.",
      is_featured: 0
    },
    {
      name: 'Laura',
      location: 'Wodonga',
      rating: 5,
      text: "Hannah's service exceeded my expectations. My chaotic walk-in wardrobe is now organised. I can maintain it with my new sorted areas and containers. I definitely recommend Hannah's services to anyone seeking decluttering and organising support.",
      is_featured: 0
    }
  ];
  
  const testimonialStmt = db.prepare(
    'INSERT OR IGNORE INTO testimonials (name, location, rating, text, is_featured) VALUES (?, ?, ?, ?, ?)'
  );
  
  for (const t of testimonials) {
    testimonialStmt.run(t.name, t.location, t.rating, t.text, t.is_featured);
  }
  
  // Seed quiz questions
  const quizQuestions = [
    {
      quiz_slug: 'clutter-personality',
      question: 'When you walk into a messy room, you feel...',
      sort_order: 1,
      options: JSON.stringify([
        { label: 'Overwhelmed and paralyzed', type: 'emotional', score: 3 },
        { label: 'Motivated to fix it', type: 'action', score: 3 },
        { label: "Don't notice it much", type: 'blind', score: 3 }
      ])
    },
    {
      quiz_slug: 'clutter-personality',
      question: 'How often do you buy storage containers hoping they will solve the problem?',
      sort_order: 2,
      options: JSON.stringify([
        { label: 'Often, but they just add to the clutter', type: 'emotional', score: 2 },
        { label: 'Sometimes, when I have a clear plan', type: 'action', score: 2 },
        { label: 'Rarely, I prefer to declutter first', type: 'blind', score: 2 }
      ])
    },
    {
      quiz_slug: 'clutter-personality',
      question: 'What is your biggest organising challenge?',
      sort_order: 3,
      options: JSON.stringify([
        { label: 'Getting started — I feel stuck', type: 'emotional', score: 2 },
        { label: 'Maintaining systems after organising', type: 'action', score: 2 },
        { label: 'Letting go of sentimental items', type: 'emotional', score: 2 }
      ])
    }
  ];
  
  const quizStmt = db.prepare(
    'INSERT OR IGNORE INTO quiz_questions (quiz_slug, question, sort_order, options) VALUES (?, ?, ?, ?)'
  );
  
  for (const q of quizQuestions) {
    quizStmt.run(q.quiz_slug, q.question, q.sort_order, q.options);
  }
  
  // Seed settings
  const settings = [
    { key: 'site_name', value: 'Organised With Hannah', type: 'string' },
    { key: 'site_tagline', value: 'Declutter | Clean | Transform', type: 'string' },
    { key: 'booking_notice_hours', value: '24', type: 'number' },
    { key: 'currency', value: 'AUD', type: 'string' },
    { key: 'contact_email', value: 'hannah@organisedwithhannah.com', type: 'string' },
    { key: 'contact_phone', value: '0412 345 678', type: 'string' },
    { key: 'location', value: 'Albury / Wodonga and surrounds', type: 'string' },
    { key: 'ndis_provider', value: 'true', type: 'boolean' },
    { key: 'mental_health_first_aider', value: 'true', type: 'boolean' },
    { key: 'insured', value: 'true', type: 'boolean' },
    { key: 'current_booking_month', value: 'March 2026', type: 'string' },
  ];
  
  const settingStmt = db.prepare(
    'INSERT OR IGNORE INTO settings (key, value, type) VALUES (?, ?, ?)'
  );
  
  for (const s of settings) {
    settingStmt.run(s.key, s.value, s.type);
  }
  
  console.log('✅ Database seeded with default data');
  console.log(`\nAdmin login:`);
  console.log(`  Email: ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log(`\nAccess admin panel at: http://localhost:5173/admin`);
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}
