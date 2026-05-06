import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';
import { useSectionBg } from '@/hooks/useSectionBg';

export function LifeFlowSection() {
  const { getValue } = useContentStore();
  const { className, style, hasImage, overlayOpacity, textLight } = useSectionBg('lifeflow', 'warm');
  const tc = textLight ? 'text-white' : 'text-primary';
  const tc2 = textLight ? 'text-white/90' : 'text-gray-700';

  return (
    <section className={`py-20 ${className} ${hasImage ? 'relative' : ''}`} style={style}>
      {hasImage && <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />}
      <div className={`max-w-4xl mx-auto px-4 ${hasImage ? 'relative z-10' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="text-center">
          <h2 className={`text-3xl font-bold ${tc} italic mb-8`}>{getValue('lifeflow', 'title', 'Life Flow Approach')}</h2>
          <p className={`${tc2} leading-relaxed mb-6`}>I believe that a well-organised home isn&apos;t about perfection&mdash;<strong>it&apos;s about flow</strong>. Everything has a place, and when your space aligns with your daily rhythms, life feels easier and more intentional. Instead of following strict organising rules, I <strong>work with you room by room</strong>, helping you break your home into practical categories&mdash;like hobbies, cooking, self-care, life admin, and everyday essentials&mdash;so you can tackle clutter in <strong>manageable steps</strong>.</p>
          <p className={`${tc2} leading-relaxed`}>My approach isn&apos;t about extreme minimalism; it&apos;s about curating a home filled with things that <strong>bring joy and serve a purpose</strong>. I encourage you to ask yourself: Do I truly need this, or am I holding onto it out of habit, guilt, or an outdated belief? By <strong>shifting your mindset</strong>, decluttering becomes a powerful tool for transformation&mdash;helping you create a space that supports the <strong>life you truly deserve</strong>.</p>
        </motion.div>
      </div>
    </section>
  );
}
