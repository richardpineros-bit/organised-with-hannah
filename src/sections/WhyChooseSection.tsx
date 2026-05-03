import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';

export function WhyChooseSection() {
  const { getValue } = useContentStore();

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-primary mb-6">
            {getValue('whychoose', 'title', 'Why Choose Hannah?')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getValue('whychoose', 'body', 'As a mother of three boys, I understand the chaos of life. My approach is non-judgmental and understanding, meeting you exactly where you are.')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
