import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, MapPin, Palette } from 'lucide-react';
import { api } from '@/lib/api';
import { useContentStore } from '@/store/contentStore';
import { useSectionBg } from '@/hooks/useSectionBg';

interface Review {
  id?: number;
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
}

export function GoogleReviewsSection() {
  const { getValue } = useContentStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(0);

  const bgClass = useSectionBg('reviews', 'primary'); // default: green
  const isGreen = bgClass === 'bg-primary';
  const textColor = isGreen ? 'text-white' : 'text-primary';

  const cardBg = isGreen ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-100';
  const badgeBg = isGreen ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200';
  const avatarBg = isGreen ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary';
  const starEmpty = isGreen ? 'text-white/30' : 'text-gray-200';

  useEffect(() => {
    api.getTestimonials()
      .then((data: any[]) => {
        if (data && data.length > 0) {
          const mapped = data.map((t: any) => ({
            id: t.id,
            author_name: t.name,
            rating: t.rating || 5,
            text: t.text,
            relative_time_description: t.location || '',
          }));
          setReviews(mapped);
          setTotalReviews(data.length);
          const avg = mapped.reduce((sum: number, r: Review) => sum + r.rating, 0) / mapped.length;
          setAvgRating(Math.round(avg * 10) / 10);
        }
      })
      .catch(() => {});
  }, []);

  const googleUrl = getValue('reviews', 'google_url', 'https://g.page/r/CQ_example/review');

  return (
    <section id="customers" className={`py-16 ${bgClass} scroll-mt-[90px]`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className={`${subTextColor} text-sm uppercase tracking-wider mb-2`}>What Our Clients Say</p>
          <h2 className={`text-3xl font-bold ${textColor} mb-4`}>Reviews</h2>

          {/* Google Rating Badge */}
          <div className={`inline-flex items-center gap-3 ${isGreen ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} rounded-full px-6 py-3 shadow-sm border`}>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : isGreen ? 'text-white/30' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className={`font-bold ${isGreen ? 'text-white' : 'text-gray-900'}`}>{avgRating}</span>
            <span className={`${isGreen ? 'text-white/60' : 'text-gray-500'} text-sm`}>({totalReviews} reviews)</span>
            <div className={`w-px h-5 ${isGreen ? 'bg-white/20' : 'bg-gray-200'} mx-1`} />
            <MapPin className={`w-4 h-4 ${isGreen ? 'text-white/60' : 'text-gray-400'}`} />
            <span className={`text-sm ${isGreen ? 'text-white/60' : 'text-gray-500'}`}>Google</span>
          </div>
        </motion.div>

        {/* Review Cards */}
        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {reviews.slice(0, 3).map((review, index) => (
              <motion.div
                key={review.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${cardBg} p-6 rounded-lg border`}
              >
                {/* Author header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center font-semibold text-sm`}>
                    {review.author_name.charAt(0)}
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${isGreen ? 'text-white' : 'text-gray-900'}`}>{review.author_name}</p>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : isGreen ? 'text-white/30' : 'text-gray-200'}`} />
                      ))}
                      {review.relative_time_description && (
                        <span className={`text-xs ${isGreen ? 'text-white/60' : 'text-gray-400'} ml-1`}>{review.relative_time_description}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <p className={`text-sm ${quoteColor} leading-relaxed`}>
                  &ldquo;{review.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-10">
            <Star className={`w-12 h-12 ${isGreen ? 'text-white/30' : 'text-gray-200'} mx-auto mb-4`} />
            <p className={isGreen ? 'text-white/60' : 'text-gray-500'}>No reviews yet</p>
            <p className={`text-sm ${isGreen ? 'text-white/60' : 'text-gray-500'}`}>Add reviews through the admin panel</p>
          </div>
        )}

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 ${isGreen ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-white hover:bg-primary-dark'} px-8 py-3.5 text-sm font-semibold tracking-wider uppercase transition-colors rounded-md`}
          >
            <Star className="w-4 h-4" />
            Read All Reviews on Google
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Admin hint */}
          <span className={`text-xs ${isGreen ? 'text-white/60' : 'text-gray-400'} flex items-center gap-1`}>
            <Palette className="w-3 h-3" />
            BG: primary (customisable)
          </span>
        </motion.div>
      </div>
    </section>
  );
}
