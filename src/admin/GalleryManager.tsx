import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Upload } from 'lucide-react';

export function GalleryManager() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const data = await api.getGallery();
      setImages(data);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        await api.post('/gallery', { title: file.name, image_path: data.url });
        loadImages();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(id: number) {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      loadImages();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <div>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="gallery-upload" />
            <label htmlFor="gallery-upload">
              <Button className="bg-primary hover:bg-primary-dark cursor-pointer" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <Card key={img.id} className="overflow-hidden">
                <img src={`http://localhost:3001${img.image_path}`} alt={img.title} className="w-full h-40 object-cover" />
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate">{img.title || 'Untitled'}</p>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => deleteImage(img.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
