import { useState } from 'react';
import { api } from '@/lib/api';
import { useContentStore } from '@/store/contentStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

export function ContactSection() {
  const { getValue } = useContentStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitContact(form);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-2">
            {getValue('contact', 'title', 'Contact me')}
          </h2>
          <p className="text-gray-600">
            {getValue('contact', 'subtitle', 'Free 15-minute consultation')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">{getValue('contact', 'phone', '')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{getValue('contact', 'email', '')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">{getValue('contact', 'location', '')}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            {submitted ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center">
                <p className="font-medium">Thank you! Hannah will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} required />
                  <Input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} required />
                </div>
                <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required />
                <Textarea placeholder="Your Message" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={5} required />
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
