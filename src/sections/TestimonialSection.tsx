import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useContentStore } from '@/store/contentStore';
import { Star, Quote } from 'lucide-react';

export function TestimonialSection() {
  const { getValue } = useContentStore();
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    api.getTestimonials().then(setTestimonials).catch(console.error);
  }, []);

  const featured = testimonials.filter((t) => t.is_featured);

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-12">
          {getValue('testimonials', 'title', 'What People Say')}
        </h2>

        {featured.length > 0 ? (
          featured.map((t) => (
            <div key={t.id} className="text-white">
              <Quote className="w-12 h-12 mx-auto mb-6 opacity-50" />
              <p className="text-xl leading-relaxed mb-6">{t.text}</p>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-white" />
                ))}
              </div>
              <p className="font-medium">{t.name} — {t.location}</p>
            </div>
          ))
        ) : (
          <p className="text-white/80">No featured testimonials yet.</p>
        )}
      </div>
    </section>
  );
}
