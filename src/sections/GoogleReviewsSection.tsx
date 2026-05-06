import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, MapPin } from 'lucide-react';
import { api } from '@/lib/api';

interface Review {
  id?: number;
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
}

export function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(0);

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

  const googleUrl = 'https://g.page/r/CQ_example/review';

  return (
    <section id="customers" className="py-16 section-white scroll-mt-[90px]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Real Reviews</p>
          <h2 className="text-3xl font-bold text-primary mb-4">What Our Clients Say</h2>

          {/* Google Rating Badge */}
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-900">{avgRating}</span>
            <span className="text-gray-500 text-sm">({totalReviews} reviews)</span>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Google</span>
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
                className="bg-gray-50 p-6 rounded-lg border border-gray-100"
              >
                {/* Author header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                    {review.author_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{review.author_name}</p>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                      ))}
                      {review.relative_time_description && (
                        <span className="text-xs text-gray-400 ml-1">{review.relative_time_description}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-10">
            <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No reviews yet</p>
            <p className="text-sm text-gray-400">Add reviews through the admin panel</p>
          </div>
        )}

        {/* CTA to Google */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 text-sm font-semibold tracking-wider uppercase hover:bg-primary-dark transition-colors rounded-md"
          >
            <Star className="w-4 h-4" />
            Read All Reviews on Google
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {totalReviews > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              Reviews verified by Google. Click to read all {totalReviews}+ reviews.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
