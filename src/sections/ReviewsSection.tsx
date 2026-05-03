import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useContentStore } from '@/store/contentStore';
import { User } from 'lucide-react';

export function ReviewsSection() {
  const { getValue } = useContentStore();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    api.getTestimonials().then((data) => setReviews(data.filter((t: any) => !t.is_featured))).catch(console.error);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section id="customers" className="py-20 bg-primary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-white/80 mb-2">What people say</p>
          <h2 className="text-3xl font-bold text-white mb-4">
            {getValue('testimonials', 'title', 'Our Customers\' Reviews')}
          </h2>
          <p className="text-white/80">
            Check our customers&apos; experience. Our services are the perfect choice for all walks of life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 shadow-lg"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center">{review.text}</p>
              <div className="text-center">
                <p className="font-semibold text-gray-900 mb-1">{review.title || review.name}</p>
                <p className="text-sm text-gray-500">by {review.name}, {review.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
