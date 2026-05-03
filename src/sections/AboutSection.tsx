import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';

export function AboutSection() {
  const { getValue } = useContentStore();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="/images/hannah-about.jpg"
              alt="About Hannah"
              className="w-full rounded-lg shadow-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-2">
              {getValue('about', 'title', 'About Hannah')}
            </h2>
            <p className="text-lg text-gray-600 italic mb-6">
              {getValue('about', 'subtitle', 'My Purpose and Passion')}
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              {getValue('about', 'bio', 'My love for organising goes way back to my childhood...')}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {getValue('about', 'bio_second', 'What drives me is my passion for supporting others...')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
