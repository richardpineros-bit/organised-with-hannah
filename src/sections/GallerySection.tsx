import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function GallerySection() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    api.getGallery().then(setImages).catch(console.error);
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold text-center">Gallery</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4">
        {images.map((img) => (
          <img
            key={img.id}
            src={`http://46.225.171.57:3001${img.image_path}`}
            alt={img.title || 'Gallery image'}
            className="h-64 w-64 object-cover rounded-lg flex-shrink-0"
          />
        ))}
      </div>
    </section>
  );
}
