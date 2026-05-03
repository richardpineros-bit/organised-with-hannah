import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useContentStore } from '@/store/contentStore';
import { Check } from 'lucide-react';

export function ServicesSection() {
  const { getValue } = useContentStore();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);
  }, []);

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">The Core of what I do</p>
          <h2 className="text-3xl font-bold text-primary">
            {getValue('services', 'title', 'Decluttering, Cleaning and Organising')}
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            I help to create space, for clarity and peace, reducing stress and increasing productivity. When organising and decluttering I streamline daily life, making it easier to find what&apos;s needed and focus on what truly matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-semibold text-center mb-8">The Organised With Hannah Journey</h3>
            <div className="grid grid-cols-2 gap-8">
              {[
                { number: 1, title: 'Free Consultation', desc: 'I begin by getting to know your goals and vision for your space. Once I see the space, I\'ll suggest steps and practical systems to enhance your environment.' },
                { number: 2, title: 'Turning Plans into Action', desc: 'Utilising the 4-box method, I\'ll designate containers to sort through and eliminate items that no longer serve a purpose in your space.' },
                { number: 3, title: 'Organisation', desc: 'Utilising either new or existing storage solutions and containers, I will efficiently organise and label the space according to your individual needs.' },
                { number: 4, title: 'Final Assessment', desc: 'Together, we\'ll evaluate the effectiveness of the implemented systems and identify any areas that require adjustment or modification.' },
              ].map((step) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-24">
            <img src="/images/organized-shelves.jpg" alt="Organized shelves" className="w-full rounded-lg shadow-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
