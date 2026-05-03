import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';

export function LifeFlowSection() {
  const { getValue } = useContentStore();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold text-primary italic mb-6">
            {getValue('lifeflow', 'title', 'Life Flow Approach')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {getValue('lifeflow', 'body', 'A well-organised home is not about perfection—it is about flow. Everything has a place, and when your space aligns with your daily rhythms, life feels easier.')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
