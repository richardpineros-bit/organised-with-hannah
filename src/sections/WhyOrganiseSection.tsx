import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';
import { useSectionBg } from '@/hooks/useSectionBg';

export function WhyOrganiseSection() {
  const { getValue } = useContentStore();
  const { className, style, hasImage, overlayOpacity, textLight } = useSectionBg('why', 'gray');
  const tc = textLight ? 'text-white' : 'text-primary';
  const tc2 = textLight ? 'text-white/90' : 'text-gray-700';

  return (
    <section className={`py-20 ${className} ${hasImage ? 'relative' : ''}`} style={style}>
      {hasImage && <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />}
      <div className={`max-w-6xl mx-auto px-4 ${hasImage ? 'relative z-10' : ''}`}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="order-2 md:order-1 flex justify-center">
            <img src="/images/before-after-garage.jpg" alt="Before and after garage" className="w-full max-w-md rounded-lg shadow-lg object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="order-1 md:order-2">
            <h2 className={`text-2xl font-bold ${tc} italic mb-6`}>{getValue('why', 'title', 'Why do you need to Organise?')}</h2>
            <p className={`${tc2} leading-relaxed mb-4`}>I believe that organising isn&apos;t about creating a Pinterest-perfect life&mdash;<strong>it&apos;s about flow</strong>. Everything has a place, and when your space aligns with your daily rhythms, life feels easier and more intentional. Struggling with life&apos;s clutter? That&apos;s where <strong>you need to get Organised With Hannah</strong>.</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" /><span className={tc2}><strong>Moving</strong> house or <strong>downsizing</strong></span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" /><span className={tc2}><strong>Navigating grief</strong> or major <strong>life transitions</strong></span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" /><span className={tc2}>Preparing for a <strong>newborn</strong> or updating for <strong>growing children</strong></span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" /><span className={tc2}>Weekly home <strong>refreshes and resets</strong></span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" /><span className={tc2}><strong>Decluttering</strong> for <strong>home staging</strong></span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" /><span className={tc2}>Organising for <strong>mental health support</strong> (ADHD, autism, neurodiverse needs)</span></li>
            </ul>
            <p className={`${tc2} leading-relaxed`}>My approach is <strong>non-judgmental and understanding</strong>, meeting you exactly where you are in your unique needs and life journey.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
