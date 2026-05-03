import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function ServiceManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    slug: '', name: '', description: '', long_description: '', price: '',
    unit: 'hour', min_hours: '', features: '', who_for: '', outcome: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        min_hours: parseInt(formData.min_hours),
        features: formData.features.split('\n').filter(f => f.trim()),
      };

      if (editing) {
        await api.put(`/services/${editing.id}`, payload);
      } else {
        await api.post('/services', payload);
      }

      setEditing(null);
      setFormData({ slug: '', name: '', description: '', long_description: '', price: '',
        unit: 'hour', min_hours: '', features: '', who_for: '', outcome: '' });
      loadServices();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  }

  function editService(service: any) {
    setEditing(service);
    setFormData({
      slug: service.slug,
      name: service.name,
      description: service.description || '',
      long_description: service.long_description || '',
      price: String(service.price),
      unit: service.unit,
      min_hours: String(service.min_hours),
      features: Array.isArray(service.features) ? service.features.join('\n') : service.features || '',
      who_for: service.who_for || '',
      outcome: service.outcome || '',
    });
  }

  async function deleteService(id: number) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Slug (URL-friendly name)" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                <Input placeholder="Service Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <Textarea placeholder="Short Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <Textarea placeholder="Long Description" value={formData.long_description} onChange={e => setFormData({...formData, long_description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" placeholder="Price ($)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  <Input placeholder="Unit (hour/session)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
                </div>
                <Input type="number" placeholder="Minimum Hours" value={formData.min_hours} onChange={e => setFormData({...formData, min_hours: e.target.value})} />
                <Textarea placeholder="Features (one per line)" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} rows={4} />
                <Input placeholder="Who is this for?" value={formData.who_for} onChange={e => setFormData({...formData, who_for: e.target.value})} />
                <Input placeholder="Outcome description" value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})} />
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                  {editing ? 'Update Service' : 'Create Service'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{service.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editService(service)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteService(service.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <div className="text-2xl font-bold text-primary">${service.price}<span className="text-sm font-normal">/{service.unit}</span></div>
                  <div className="text-sm text-gray-500">Min: {service.min_hours} {service.unit}s</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
