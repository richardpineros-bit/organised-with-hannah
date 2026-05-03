import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const { getValue } = useContentStore();

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-center">
          <p className="text-lg md:text-xl tracking-[3px] mb-4">{getValue('hero', 'tagline', 'Declutter | Clean | Transform')}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            {getValue('hero', 'headline', 'Professional Home Organising for Busy Individuals Who Feel Overwhelmed')}
          </h1>
          <p className="text-xl md:text-2xl mb-2 max-w-2xl mx-auto">
            {getValue('hero', 'subheadline', 'Based in Albury/Wodonga, I help busy mums, overwhelmed households, and neurodiverse families reclaim their space—and their peace of mind.')}
          </p>
          <p className="text-lg italic mb-8">{getValue('hero', 'quote', '"Your home is living space, not storage space." - Francine Jay')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row gap-4">
          <a href="/booking" className="bg-primary text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-primary-dark transition-colors">
            {getValue('hero', 'cta_primary', 'Book Free Consultation')}
          </a>
          <a href="#services" className="border-2 border-white text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-white hover:text-black transition-colors">
            {getValue('hero', 'cta_secondary', 'See How It Works')}
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-xs tracking-[2px] mb-2 rotate-90 origin-center translate-y-4">SCROLL</span>
          <ChevronDown className="w-5 h-5 animate-bounce-slow" />
        </motion.div>
      </div>
    </section>
  );
}
