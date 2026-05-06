import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { api } from '@/lib/api';

interface Review {
  id?: number;
  author_name: string;
  rating: number;
  text: string;
  location?: string;
}

export function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    api.getTestimonials()
      .then((data: any[]) => {
        if (data && data.length > 0) {
          const mapped = data.map((t: any) => ({
            id: t.id,
            author_name: t.name,
            rating: t.rating || 5,
            text: t.text,
            location: t.location || '',
          }));
          setReviews(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % reviews.length);
  }, [currentIndex, reviews.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + reviews.length) % reviews.length);
  }, [currentIndex, reviews.length, goTo]);

  if (reviews.length === 0) return null;

  const current = reviews[currentIndex];

  return (
    <section id="customers" className="py-20 bg-primary scroll-mt-[90px]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-white/60 text-sm uppercase tracking-wider mb-2">What Our Clients Say</p>
          <h2 className="text-3xl font-bold text-white mb-4">Reviews</h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Quote icon */}
          <Quote className="w-12 h-12 text-white/20 mx-auto mb-6" />

          {/* Review content */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="text-center min-h-[200px] flex flex-col items-center justify-center"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[1,2,3,4,5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= current.rating ? 'text-white fill-white' : 'text-white/30'}`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-white text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              &ldquo;{current.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {current.author_name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-white font-medium">{current.author_name}</p>
                {current.location && (
                  <p className="text-white/60 text-sm">{current.location}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Navigation arrows */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
