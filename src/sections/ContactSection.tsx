import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useContentStore } from '@/store/contentStore';
import { useSectionBg } from '@/hooks/useSectionBg';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, MapPin } from 'lucide-react';

export function ContactSection() {
  const { getValue } = useContentStore();
  const bgClass = useSectionBg('contact', 'gray');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.submitContact(form); setSubmitted(true); } catch (err) { alert('Failed to send message.'); }
  };

  return (
    <section id="contact" className={`relative py-20 ${bgClass} scroll-mt-[90px]`}>
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="bg-white p-8 md:p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{getValue('contact', 'title', 'Contact me')}</h2>
          {submitted ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center"><p className="font-medium">Thank you! Hannah will be in touch soon.</p></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name *" value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} required />
                <Input placeholder="Last Name *" value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} required />
              </div>
              <Input type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
              <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
              <Input placeholder="Subject *" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required />
              <Textarea placeholder="Your Message *" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={5} required />
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark py-3">Send Message</Button>
            </form>
          )}
          <div className="mt-8 pt-8 border-t space-y-4">
            <div className="flex items-center gap-4"><Phone className="w-5 h-5 text-primary" /><span className="text-gray-600">{getValue('contact', 'phone', '0412 345 678')}</span></div>
            <div className="flex items-center gap-4"><MessageSquare className="w-5 h-5 text-primary" /><span className="text-gray-600">{getValue('contact', 'email', 'hannah@organisedwithhannah.com')}</span></div>
            <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-primary" /><span className="text-gray-600">{getValue('contact', 'location', 'Albury / Wodonga and surrounds')}</span></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
