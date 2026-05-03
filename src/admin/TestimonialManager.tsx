import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

export function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', location: '', rating: 5, text: '', is_featured: false });

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    try {
      const data = await api.getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = { ...formData, rating: Number(formData.rating) };
      if (editing) {
        await api.put(`/testimonials/${editing.id}`, payload);
      } else {
        await api.post('/testimonials', payload);
      }
      setEditing(null);
      setFormData({ name: '', location: '', rating: 5, text: '', is_featured: false });
      loadTestimonials();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  }

  function editTestimonial(t: any) {
    setEditing(t);
    setFormData({ name: t.name, location: t.location || '', rating: t.rating, text: t.text, is_featured: t.is_featured === 1 });
  }

  async function deleteTestimonial(id: number) {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      loadTestimonials();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Customer Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <Input placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <Input type="number" min={1} max={5} placeholder="Rating (1-5)" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} />
                <Textarea placeholder="Testimonial Text" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} rows={4} required />
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="mr-2" />
                  Featured (show on homepage)
                </label>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                  {editing ? 'Update' : 'Create'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 gap-4">
            {testimonials.map((t) => (
              <Card key={t.id} className={t.is_featured ? 'border-2 border-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{t.name}</CardTitle>
                      <p className="text-sm text-gray-500">{t.location}</p>
                    </div>
                    <div className="flex gap-2">
                      {t.is_featured && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                      <Button size="sm" variant="outline" onClick={() => editTestimonial(t)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteTestimonial(t.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{t.text}</p>
                  <div className="flex mt-2">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
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
