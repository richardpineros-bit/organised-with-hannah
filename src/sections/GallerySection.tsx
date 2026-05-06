import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useSectionBg } from '@/hooks/useSectionBg';

export function GallerySection() {
  const [images, setImages] = useState<any[]>([]);
  const bgClass = useSectionBg('gallery', 'warm');

  useEffect(() => {
    api.getGallery().then(setImages).catch(console.error);
  }, []);

  const defaultImages = ['/images/gallery-1.jpg', '/images/gallery-2.jpg', '/images/gallery-3.jpg', '/images/gallery-4.jpg', '/images/gallery-5.jpg', '/images/gallery-6.jpg'];
  const displayImages = images.length > 0 ? images.map((img) => `http://46.225.171.57:3001${img.image_path}`) : defaultImages;

  return (
    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={`py-12 ${bgClass} overflow-hidden`}>
      <div className="relative">
        <div className="flex gap-4 animate-scroll hover:animation-paused">
          {[...displayImages, ...displayImages].map((src, index) => (
            <div key={index} className="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden">
              <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
