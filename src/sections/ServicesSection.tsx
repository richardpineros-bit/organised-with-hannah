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
          <h2 className="text-3xl font-bold text-primary mb-2">
            {getValue('services', 'title', 'How I Can Help')}
          </h2>
          <p className="text-gray-600">
            {getValue('services', 'subtitle', 'Choose the service that fits your needs')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-3">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="text-3xl font-bold text-primary mb-4">
                ${service.price}<span className="text-sm font-normal">/{service.unit}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {(service.features || []).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="/booking"
                className="block w-full bg-primary text-white text-center py-3 font-semibold uppercase tracking-wider hover:bg-primary-dark transition-colors"
              >
                Book Now
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
