import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useSectionBg } from '@/hooks/useSectionBg';

const problemList = [
  { prefix: "Are you...", text: "Navigating Grief or Separation" },
  { prefix: "Do you have...", text: "ADHD, Autism & Executive Dysfunctioning" },
  { prefix: "Are you...", text: "An Individual or Family Overwhelmed by Clutter" },
  { prefix: "Do you need...", text: "A New Life Balance or New Habits" },
  { prefix: "I can help...", text: "Moving or Downsizing" },
];

export function ProblemCarousel() {
  const { className, style, hasImage, overlayOpacity } = useSectionBg('problems', 'gray');

  return (
    <section className={`py-16 ${className} ${hasImage ? 'relative' : ''}`} style={style}>
      {hasImage && <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />}
      <div className={`max-w-6xl mx-auto px-4 ${hasImage ? 'relative z-10' : ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {problemList.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.4, delay: i * 0.08 }} className="bg-white p-6 shadow hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-2">{p.prefix}</p>
              <div className="flex items-start"><Check className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" /><p className="text-sm font-medium">{p.text}</p></div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <a href="/booking" className="inline-block bg-primary text-white px-8 py-4 font-semibold uppercase tracking-wider hover:bg-primary-dark transition-colors">Book Free Consultation</a>
        </motion.div>
      </div>
    </section>
  );
}
