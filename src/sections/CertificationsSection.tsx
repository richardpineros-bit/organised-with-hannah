import { motion } from 'framer-motion';
import { useSectionBg } from '@/hooks/useSectionBg';

export function CertificationsSection() {
  const { className, style, hasImage, overlayOpacity } = useSectionBg('certs', 'white');

  return (
    <section className={`py-16 ${className} ${hasImage ? 'relative' : ''}`} style={style}>
      {hasImage && <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />}
      <div className={`max-w-4xl mx-auto px-4 text-center ${hasImage ? 'relative z-10' : ''}`}>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm uppercase tracking-wider text-gray-500 mb-8">Mental Health First Aid Certified</motion.p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="w-32 h-32">
            <img src="/images/org-academy-badge.png" alt="The Organising Academy Professional Member" className="w-full h-full object-contain" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="w-32 h-32">
            <img src="/images/mhfa-badge.png" alt="Mental Health First Aider Accredited" className="w-full h-full object-contain" />
          </motion.div>
        </div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm text-gray-500 mt-8">Mental Health courses Australia &amp; Worldwide, both online and face-to-face</motion.p>
      </div>
    </section>
  );
}
