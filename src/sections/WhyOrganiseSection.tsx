import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';

export function WhyOrganiseSection() {
  const { getValue } = useContentStore();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1">
            <img src="/images/before-after-garage.jpg" alt="Before and after garage" className="w-full rounded-lg shadow-lg" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
            <h2 className="text-2xl font-bold text-primary italic mb-6">
              {getValue('why', 'title', 'Why do you need to Organise?')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              I believe that organising isn&apos;t about creating a Pinterest-perfect life&mdash;it&apos;s about designing a life flow that <strong>makes everything easier and more intentional</strong>. Struggling with life&apos;s clutter? That&apos;s where <strong>you need to get Organised With Hannah</strong>. Whether you&apos;re:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700"><strong>Moving</strong> house or <strong>downsizing</strong></span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700"><strong>Navigating grief</strong> or major <strong>life transitions</strong> (death, separation/divorce)</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Preparing for a <strong>newborn</strong> or updating your space for <strong>growing children</strong></span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              I provide expert support to help you create a space that truly serves you. I also specialise in:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Weekly home <strong>refreshes and resets</strong></span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700"><strong>Decluttering</strong> for <strong>home staging</strong> before property photos</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Organising for <strong>mental health support</strong> (including ADHD, autism, and other neurodiverse needs)</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              My clients all have one thing in common&mdash;the desire to bring order to their busy lives and find peace amidst the chaos. Whatever your organising challenge, my <strong>compassionate</strong> and <strong>practical</strong> approach will help you move forward with clarity and confidence.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
