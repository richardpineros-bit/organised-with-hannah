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
        <Quote className="w-12 h-12 text-white/30 mx-auto mb-6" />
        
        {featured.length > 0 ? (
          featured.map((t) => (
            <div key={t.id} className="text-white">
              <p className="text-xl md:text-2xl leading-relaxed mb-8">
                {t.text}
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-white fill-white" />
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
