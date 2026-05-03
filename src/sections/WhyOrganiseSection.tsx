import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';

export function WhyOrganiseSection() {
  const { getValue } = useContentStore();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="/images/before-after-garage.jpg" alt="Before and after" className="w-full rounded-lg shadow-lg" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-primary italic mb-6">
              {getValue('why', 'title', 'Why do you need to Organise?')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {getValue('why', 'intro', 'I believe that organising is about designing a life flow that makes everything easier.')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
