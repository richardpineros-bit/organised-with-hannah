import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useSectionBg } from '@/hooks/useSectionBg';

export function VideoSection() {
  const bgClass = useSectionBg('video', 'white');

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gray-200 rounded-full" />
              <button className="absolute inset-0 flex items-center justify-center group">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}>
            <p className="text-xl text-gray-600 mb-2">Hey <em className="text-primary font-semibold">Beautiful</em>...</p>
            <h2 className="text-2xl font-bold text-primary mb-6">I&apos;m Hannah, wife, mama, and <em className="not-italic">coffee enthusiast</em></h2>
            <p className="text-gray-700 leading-relaxed">Amongst the chaos of life with three lively boys, I&apos;ve discovered a deep love for cleaning and decluttering. There&apos;s something oddly satisfying about restoring order, in the midst of mayhem...</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
