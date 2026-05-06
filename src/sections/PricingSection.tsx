import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useContentStore } from '@/store/contentStore';
import { Check } from 'lucide-react';
import { useSectionBg } from '@/hooks/useSectionBg';

export function PricingSection() {
  const { getValue } = useContentStore();
  const { className, style, hasImage, overlayOpacity } = useSectionBg('pricing', 'gray');
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);
  }, []);

  return (
    <section id="pricing" className={`relative py-20 ${className} ${hasImage ? 'relative' : ''} scroll-mt-[90px]`} style={style}>
      {hasImage && <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />}
      <div className={`max-w-6xl mx-auto px-4 relative z-10 ${hasImage ? 'relative z-10' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{getValue('pricing', 'title', 'Pricing and Inclusions')}</h2>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Packages</h3>
          <p className="text-gray-600">All pricing includes GST</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div key={service.id} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
              <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
              <p className="text-sm text-gray-500 mb-4">{service.min_hours}-hour minimum</p>
              <div className="mb-4"><span className="text-4xl font-bold text-gray-900">${service.price}</span><span className="text-gray-600">/{service.unit}</span></div>
              <ul className="text-left space-y-2 mb-6">
                {(service.features || []).map((f: string, i: number) => (
                  <li key={i} className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-primary mt-0.5 mr-2 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <a href="/booking" className="inline-block bg-primary text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-primary-dark transition-colors">Book Now</a>
            </motion.div>
          ))}
        </div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs text-gray-500 mt-8 max-w-4xl mx-auto">
          *Minimal hourly rates are set, custom and full house packages please contact Hannah. **15% fee applies on shopping purchases, extra charges for excess or large rubbish removal. Travel charges beyond 20km from Thurgoona, NSW will apply. See OWH Service Agreement 2025 for full terms &amp; conditions.
        </motion.p>
      </div>
    </section>
  );
}
