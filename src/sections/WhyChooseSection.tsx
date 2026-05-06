import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';
import { useSectionBg } from '@/hooks/useSectionBg';

export function WhyChooseSection() {
  const { getValue } = useContentStore();
  const bgClass = useSectionBg('whychoose', 'white');

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}>
          <h2 className="text-3xl font-bold text-primary mb-8">{getValue('whychoose', 'title', 'Why Choose Hannah?')}</h2>
          <p className="text-gray-700 leading-relaxed mb-6">As a mother of three boys, I understand the chaos of life. But in the midst of it all, I&apos;ve discovered the <strong>power of organisation</strong> and decluttering to create a sense of <strong>peace and calm</strong>.</p>
          <p className="text-gray-700 leading-relaxed mb-6">With 10 years of experience as a qualified early childhood teacher (CSU), I recognise the importance of <strong>support and education</strong> in developing lasting habits and routines tailored to individuals and families. I&apos;m also a member of <strong>The Organising Academy</strong>, a <strong>Certified Mental Health First Aider</strong>, and a <strong>Verified NDIS Provider</strong>, so I bring both expertise and compassion to every organising journey.</p>
          <p className="text-gray-700 leading-relaxed">My approach is <strong>non-judgmental and understanding</strong>, meeting you exactly where you are in your unique needs and life journey.</p>
        </motion.div>
      </div>
    </section>
  );
}
