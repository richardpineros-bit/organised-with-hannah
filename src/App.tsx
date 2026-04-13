import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, ChevronDown, Star, Play, Facebook, Instagram, Youtube,
  Check, ArrowUp, Quote, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Header Component
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'What I do', href: '#what-i-do' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Our Customers', href: '#customers' },
    { label: 'Contact me', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-header' : 'bg-white/95'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <a href="#home" className="flex flex-col items-start">
            <span className="text-lg font-bold tracking-[4px] text-primary">ORGANISED</span>
            <span className="text-[10px] tracking-[2px] text-text-secondary uppercase">WITH HANNAH</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="#book" 
              className="bg-primary text-white px-5 py-2.5 text-sm font-semibold tracking-wider uppercase hover:bg-primary-dark transition-colors duration-200"
            >
              Book now
            </a>
            <a 
              href="#login" 
              className="text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
            >
              log In
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-text-primary hover:text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
                <a 
                  href="#book" 
                  className="bg-primary text-white px-5 py-3 text-sm font-semibold tracking-wider uppercase text-center hover:bg-primary-dark transition-colors duration-200"
                >
                  Book now
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-lg md:text-xl tracking-[3px] mb-4">Declutter | Clean | Transform</p>
          <h1 className="text-hero-mobile md:text-hero font-bold tracking-[4px] md:tracking-[8px] mb-2">
            ORGANISED
          </h1>
          <div className="w-48 md:w-72 h-0.5 bg-white mx-auto mb-4" />
          <p className="text-xl md:text-2xl tracking-[4px] md:tracking-[6px] mb-12">WITH HANNAH</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center max-w-xl"
        >
          <p className="text-xl md:text-2xl font-light italic mb-2">
            "Your home is living space, not storage space."
          </p>
          <p className="text-sm md:text-base">- Francine Jay</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <a 
            href="#contact"
            className="inline-block bg-primary text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-primary-dark transition-colors duration-200"
          >
            Book Free Consultation
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-xs tracking-[2px] mb-2 rotate-90 origin-center translate-y-4">SCROLL</span>
          <ChevronDown className="w-5 h-5 animate-bounce-slow" />
        </motion.div>
      </div>
    </section>
  );
}

// Problem Carousel Section
function ProblemCarousel() {
  const problems = [
    { prefix: "Are you . . .", text: "Navigating Grief or Separation" },
    { prefix: "Do you have…", text: "ADHD, Autism & Executive Dysfunctioning" },
    { prefix: "Are you . . .", text: "An Individual or Family Overwhelmed by Clutter" },
    { prefix: "Do you need …", text: "A New Life Balance or New Habits" },
    { prefix: "I can help you with…", text: "Moving or Downsizing" },
  ];

  return (
    <section className="bg-[#F5F5F5] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <p className="text-sm text-text-secondary mb-2">{problem.prefix}</p>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium text-text-primary">{problem.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <a 
            href="#contact"
            className="inline-block bg-primary text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-primary-dark transition-colors duration-200"
          >
            Book Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="/images/hannah-about.jpg" 
              alt="Hannah organizing" 
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center lg:items-start mb-6">
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mb-4">
                <span className="text-primary text-xl font-bold">O</span>
              </div>
              <h2 className="text-section-mobile md:text-section text-primary text-center lg:text-left">
                About Hannah
              </h2>
            </div>
            
            <h3 className="text-xl text-primary italic mb-6 text-center lg:text-left">
              My Purpose and Passion
            </h3>
            
            <p className="text-text-secondary leading-relaxed mb-6">
              My love for organising goes way back to my childhood, and I've made it my{' '}
              <strong className="text-text-primary">mission to help people</strong> create spaces 
              that truly work for them. With over 10 years of experience, I'm all about making a 
              positive impact in the lives of others. Through Organised With Hannah, I work with 
              individuals and businesses to{' '}
              <strong className="text-text-primary">declutter, organise, and transform their spaces</strong>
              —whether it's a home, office, or commercial space. My goal? To bring{' '}
              <strong className="text-text-primary">function</strong>,{' '}
              <strong className="text-text-primary">purpose</strong>, and{' '}
              <strong className="text-text-primary">joy</strong> to the spaces I work on, helping 
              people live their best, most organised lives.
            </p>
            
            <p className="text-text-secondary leading-relaxed">
              What drives me even more than my love of organising is my passion for{' '}
              <strong className="text-text-primary">supporting</strong>,{' '}
              <strong className="text-text-primary">encouraging</strong>, and{' '}
              <strong className="text-text-primary">educating</strong> others along their life journey. 
              My heart is with the people I work with, and I'm dedicated to helping them build 
              confidence and independence, so they can thrive in every area of their lives.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Why Organise Section
function WhyOrganiseSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <img 
              src="/images/before-after-garage.jpg" 
              alt="Before and after garage organization" 
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-subsection text-primary italic mb-6">
              Why do you need to Organise?
            </h2>
            
            <p className="text-text-secondary leading-relaxed mb-6">
              I believe that organising isn't about creating a Pinterest-perfect life—it's about 
              designing a life flow that <strong className="text-text-primary">makes everything easier and more intentional</strong>. 
              Struggling with life's clutter? That's where <strong className="text-text-primary">you need to get Organised With Hannah</strong>. 
              Whether you're:
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-text-secondary">
                  <strong className="text-text-primary">Moving</strong> house or <strong className="text-text-primary">downsizing</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-text-secondary">
                  <strong className="text-text-primary">Navigating grief</strong> or major <strong className="text-text-primary">life transitions</strong> (death, separation/divorce)
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-text-secondary">
                  Preparing for a <strong className="text-text-primary">newborn</strong> or updating your space for <strong className="text-text-primary">growing children</strong>
                </span>
              </li>
            </ul>
            
            <p className="text-text-secondary leading-relaxed mb-6">
              I provide expert support to help you create a space that truly serves you. I also specialise in:
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-text-secondary">
                  Weekly home <strong className="text-text-primary">refreshes and resets</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-text-secondary">
                  <strong className="text-text-primary">Decluttering</strong> for <strong className="text-text-primary">home staging</strong> before property photos
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-text-secondary">
                  Organising for <strong className="text-text-primary">mental health support</strong> (including ADHD, autism, and other neurodiverse needs)
                </span>
              </li>
            </ul>
            
            <p className="text-text-secondary leading-relaxed">
              My clients all have one thing in common—the desire to bring order to their busy lives 
              and find peace amidst the chaos. Whatever your organising challenge, my{' '}
              <strong className="text-text-primary">compassionate</strong> and{' '}
              <strong className="text-text-primary">practical</strong> approach will help you move 
              forward with clarity and confidence.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Why Choose Section
function WhyChooseSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-subsection text-primary mb-8">
            Why Choose Hannah?
          </h2>
          
          <p className="text-text-secondary leading-relaxed mb-6">
            As a mother of three boys, I understand the chaos of life. But in the midst of it all, 
            I've discovered the <strong className="text-text-primary">power of organisation</strong> and 
            decluttering to create a sense of <strong className="text-text-primary">peace and calm</strong>.
          </p>
          
          <p className="text-text-secondary leading-relaxed mb-6">
            With 10 years of experience as a qualified early childhood teacher (CSU), I recognise 
            the importance of <strong className="text-text-primary">support and education</strong> in 
            developing lasting habits and routines tailored to individuals and families. I'm also a 
            member of <strong className="text-text-primary">The Organising Academy</strong>, a{' '}
            <strong className="text-text-primary">Certified Mental Health First Aider</strong>, and a{' '}
            <strong className="text-text-primary">Verified NDIS Provider</strong>, so I bring both 
            expertise and compassion to every organising journey.
          </p>
          
          <p className="text-text-secondary leading-relaxed">
            My approach is <strong className="text-text-primary">non-judgmental and understanding</strong>, 
            meeting you exactly where you are in your unique needs and life journey.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Life Flow Section
function LifeFlowSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-subsection text-primary italic mb-8 text-center">
            Life Flow Approach
          </h2>
          
          <p className="text-text-secondary leading-relaxed mb-6">
            I believe that a well-organised home isn't about perfection—<strong className="text-text-primary">it's about flow</strong>. 
            Everything has a place, and when your space aligns with your daily rhythms, life feels 
            easier and more intentional. Instead of following strict organising rules, I{' '}
            <strong className="text-text-primary">work with you room by room</strong>, helping you 
            break your home into practical categories—like hobbies, cooking, self-care, life admin, 
            and everyday essentials—so you can tackle clutter in{' '}
            <strong className="text-text-primary">manageable steps</strong>.
          </p>
          
          <p className="text-text-secondary leading-relaxed">
            My approach isn't about extreme minimalism; it's about curating a home filled with things 
            that <strong className="text-text-primary">bring joy and serve a purpose</strong>. I encourage 
            you to ask yourself: Do I truly need this, or am I holding onto it out of habit, guilt, or 
            an outdated belief? By <strong className="text-text-primary">shifting your mindset</strong>, 
            decluttering becomes a powerful tool for transformation—helping you create a space that 
            supports the <strong className="text-text-primary">life you truly deserve</strong>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Video Section
function VideoSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Thumbnail */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gray-200 rounded-full" />
              <button className="absolute inset-0 flex items-center justify-center group">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-text-secondary mb-2">Hey <em className="text-primary font-semibold">Beautiful</em>...</p>
            <h2 className="text-subsection text-primary mb-6">
              I'm Hannah, wife, mama, and <em className="not-italic">coffee enthusiast</em>
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Amongst the chaos of life with three lively boys, I've discovered a deep love for 
              cleaning and decluttering. There's something oddly satisfying about restoring order, 
              in the midst of mayhem...
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const steps = [
    {
      number: 1,
      title: "Free Consultation",
      description: "I begin by getting to know your goals and vision for your space. Once I see the space, I'll suggest steps and practical systems to enhance your environment."
    },
    {
      number: 2,
      title: "Turning Plans into Action",
      description: "Utilising the 4-box method, I'll designate containers to sort through and eliminate items that no longer serve a purpose in your space. Once the decluttering process is complete, we can explore suitable storage solutions tailored to your specific requirements and daily routines."
    },
    {
      number: 3,
      title: "Organisation",
      description: "Utilising either new or existing storage solutions and containers, I will efficiently organise and label the space according to your individual needs."
    },
    {
      number: 4,
      title: "Final Assessment",
      description: "Together, we'll evaluate the effectiveness of the implemented systems and identify any areas that require adjustment or modification."
    }
  ];

  return (
    <section id="what-i-do" className="section-padding bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-text-secondary uppercase tracking-wider mb-2">
              The Core of what I do
            </p>
            <h2 className="text-section-mobile md:text-section text-primary mb-6">
              Decluttering, Cleaning and Organising
            </h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              I help to create space, for clarity and peace, reducing stress and increasing productivity. 
              When organising and decluttering I streamline daily life, making it easier to find what's 
              needed and focus on what truly matters. By cultivating an environment of order and simplicity, 
              I can pave the way for greater efficiency and mental well-being.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mb-8 text-center">
              The Organised With Hannah Journey
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">{step.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <img 
              src="/images/organized-shelves.jpg" 
              alt="Organized shelves" 
              className="w-full h-auto object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const packages = [
    {
      title: "In-Person Organising",
      subtitle: "4 - hour minimum",
      price: "$125",
      unit: "/hr",
      tagline: "Hands-on transformation",
      description: "I come to your home and I physically declutter, organise, and set up a system for your space and life",
      features: [
        "Hands-on decluttering and sorting",
        "Physical organisation and system setup",
        "Basic labeling",
        "Small amount of rubbish removal (rubbish bags only)"
      ],
      cta: "BOOK NOW"
    },
    {
      title: "Virtual Organising",
      subtitle: "1 hr Online",
      price: "$100",
      unit: "/hr",
      tagline: "Virtual",
      description: "Online support for decluttering, organising & home systems",
      subDescription: "Great for those looking to save money and DIY",
      features: [
        "Pre-session planning (I review any photos/info)",
        "Action plan document",
        "Resource links and templates",
        "Email support between sessions",
        "1:1 support from Hannah every step of the way"
      ],
      cta: "BOOK NOW"
    },
    {
      title: "Organised Life Coaching",
      subtitle: "2-hr minimum (including prep)",
      price: "$190",
      unit: "/hr",
      tagline: "Virtual or In-Person",
      description: "Transform your time, habits & daily flow",
      subDescription: "We work on time management, habit building, and navigating life's transitions.",
      features: [
        "Pre-session planning (I review any photos/info)",
        "Action plan document",
        "Resource links and templates",
        "Unlimited email support between sessions"
      ],
      cta: "BOOK NOW"
    }
  ];

  return (
    <section id="pricing" className="relative py-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/pricing-bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-white/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-section-mobile md:text-section text-text-primary mb-2">
            Pricing and Inclusions
          </h2>
          <h3 className="text-2xl font-semibold text-text-primary mb-2">Packages</h3>
          <p className="text-text-secondary">All pricing includes GST</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 text-center"
            >
              <h4 className="font-semibold text-text-primary mb-1">{pkg.title}</h4>
              <p className="text-sm text-text-secondary mb-4">{pkg.subtitle}</p>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-text-primary">{pkg.price}</span>
                <span className="text-text-secondary">{pkg.unit}</span>
              </div>
              
              <p className="text-sm text-text-secondary mb-1">{pkg.tagline}</p>
              <p className="text-sm text-text-secondary mb-2">{pkg.description}</p>
              {pkg.subDescription && (
                <p className="text-sm text-text-secondary mb-4">{pkg.subDescription}</p>
              )}
              
              <ul className="text-left space-y-2 mb-6">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a 
                href="#contact"
                className="inline-block bg-primary text-white px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-primary-dark transition-colors duration-200"
              >
                {pkg.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-text-secondary mt-8 max-w-4xl mx-auto">
          *Minimal hourly rates are set, custom and full house packages please contact Hannah. 
          **15% fee applies on shopping purchases, extra charges for excess or large rubbish removal. 
          Travel charges beyond 20km from Thurgoona, NSW will apply. See OWH Service Agreement 2025 for full terms & conditions.
        </p>
      </div>
    </section>
  );
}

// Testimonial Section
function TestimonialSection() {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Quote className="w-12 h-12 text-white/30 mx-auto mb-6" />
          
          <p className="text-white text-lg md:text-xl leading-relaxed mb-8">
            Hannah's organisational services have truly transformed my home. With her expertise, 
            my pantry, kitchen, and wardrobe are now not only beautifully arranged but also highly 
            functional. Her meticulous attention to detail has delivered outstanding results. I 
            wholeheartedly recommend her services to anyone in search of order, efficiency, and 
            elegance in their living space.
          </p>
          
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-white fill-white" />
            ))}
          </div>
          
          <p className="text-white font-medium">Suzy and Linda — Albury, NSW</p>
        </motion.div>
      </div>
    </section>
  );
}

// Reviews Section
function ReviewsSection() {
  const reviews = [
    {
      quote: "After renovating our kitchen, we temporarily stored items everywhere, in chaos. Hannah assessed our needs, decluttered, and organised everything systematically. She categorised items, advised on what to keep, donate. Hannah organised everything perfectly, its easy to find with labels and a well sorted system. Hannah's expertise is invaluable; we can't wait for her help with our wardrobe next",
      title: "Hannah's expertise is invaluable",
      author: "Hellen",
      location: "Thurgoona"
    },
    {
      quote: "Working with Hannah was delightful; she's friendly, professional, and takes full control of the sorting and organising process. I simply shared my goals for the space and she handled everything else. The outcome not only looks fantastic but is also highly functional. I really look forward to collaborating with her on other projects and highly recommend her services.",
      title: "Working with 'Hannah' was delightful",
      author: "GENLIFE",
      location: "Lavington"
    },
    {
      quote: "Hannah's service exceeded my expectations. My chaotic walk-in wardrobe is now organised. I can maintain it with my new sorted areas and containers. I definitely recommend Hannah's services to anyone seeking decluttering and organising support.",
      title: "Hannah's service exceeded my expectations",
      author: "Laura",
      location: "Wodonga"
    }
  ];

  return (
    <section id="customers" className="bg-primary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-white/80 mb-2">What people say</p>
          <h2 className="text-section-mobile md:text-section text-white mb-4">
            Our Customers' reviews
          </h2>
          <p className="text-white/80">
            Check our customers' experience, Our services are the perfect choice for all walks of life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 shadow-card"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              
              <p className="text-text-secondary text-sm leading-relaxed mb-6 text-center">
                {review.quote}
              </p>
              
              <div className="text-center">
                <p className="font-semibold text-text-primary mb-1">{review.title}</p>
                <p className="text-sm text-text-secondary">by {review.author}, {review.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Gallery Section
function GallerySection() {
  const images = [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
    '/images/gallery-5.jpg',
    '/images/gallery-6.jpg',
  ];

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="relative">
        <div className="flex gap-4 animate-scroll hover:animation-paused">
          {[...images, ...images].map((src, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden"
            >
              <img 
                src={src} 
                alt={`Gallery image ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  return (
    <section id="contact" className="relative py-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/contact-bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-white/60" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 shadow-card"
        >
          <h2 className="text-section-mobile md:text-section text-text-primary mb-8 text-center">
            Contact me
          </h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="text" 
                  required
                  className="w-full border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="text" 
                  required
                  className="w-full border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input 
                type="email" 
                required
                className="w-full border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Phone Number
              </label>
              <Input 
                type="tel"
                className="w-full border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input 
                type="text" 
                required
                className="w-full border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>
              <Textarea 
                required
                rows={5}
                className="w-full border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-sm font-semibold tracking-wider uppercase"
            >
              Send Message
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// Certifications Section
function CertificationsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-wider text-text-secondary mb-8">
            Mental Health First Aid Certified
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
            <div className="w-32 h-32">
              <img 
                src="/images/org-academy-badge.png" 
                alt="The Organising Academy Professional Member" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-32 h-32">
              <img 
                src="/images/mhfa-badge.png" 
                alt="Mental Health First Aider Accredited" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <p className="text-sm text-text-secondary mt-8">
            Mental Health courses Australia & Worldwide, both online and face-to-face
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-white/80 text-sm tracking-wider mb-4">
          Declutter | Clean | Transform
        </p>
        
        <div className="mb-8">
          <span className="text-2xl font-bold tracking-[4px] text-white block">ORGANISED</span>
          <span className="text-xs tracking-[2px] text-white/80 uppercase">WITH HANNAH</span>
        </div>
        
        <div className="flex justify-center space-x-6">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-200"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-200"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-200"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// Scroll to Top Button
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors duration-200 z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Main App
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ProblemCarousel />
        <AboutSection />
        <WhyOrganiseSection />
        <WhyChooseSection />
        <LifeFlowSection />
        <VideoSection />
        <ServicesSection />
        <PricingSection />
        <TestimonialSection />
        <ReviewsSection />
        <GallerySection />
        <ContactSection />
        <CertificationsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
