import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useContentStore } from '@/store/contentStore';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function BookingPage() {
  const { getValue } = useContentStore();
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
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
    }
  }

  async function loadSlots(date: string) {
    if (!date || !selectedService) return;
    setLoading(true);
    try {
      const data = await api.getAvailability(date);
      setSlots(data.slots || []);
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedSlot) return;

    try {
      await api.createBooking({
        ...formData,
        service_id: selectedService.id,
        booking_date: selectedDate,
        start_time: selectedSlot.start,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
  }

  function getTomorrow(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  if (submitted) {
    return (
      <section className="min-h-screen pt-[70px] bg-gray-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Request Received!</h2>
          <p className="text-gray-600 mb-6">
            Thank you {formData.customer_name}. Hannah will review your request and confirm your booking shortly.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to {formData.customer_email}
          </p>
          <a href="/" className="inline-block bg-primary text-white px-8 py-3 font-semibold uppercase tracking-wider">
            Back to Home
          </a>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-[70px] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-2">Book Your Session</h1>
        <p className="text-center text-gray-600 mb-8">
          Currently booking: {getValue('contact', 'current_booking_month', 'This Month')}
        </p>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-semibold mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => { setSelectedService(service); setStep(2); }}
                  className={`p-6 border-2 cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <h3 className="font-semibold mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-primary">${service.price}<span className="text-sm font-normal">/{service.unit}</span></div>
                  <div className="text-xs text-gray-500 mt-1">Min {service.min_hours} {service.unit}s</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => setStep(1)} className="flex items-center text-gray-600 mb-4 hover:text-primary">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>

            <h2 className="text-xl font-semibold mb-2">{selectedService?.name}</h2>
            <p className="text-gray-600 mb-6">Select your preferred date and time</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  min={getTomorrow()}
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); loadSlots(e.target.value); }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading available slots...</p>
            ) : selectedDate && slots.length === 0 ? (
              <p className="text-gray-500">No slots available on this date. Please select another date.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedSlot(slot); setStep(3); }}
                    className={`p-3 border-2 text-center transition-all ${
                      selectedSlot?.start === slot.start
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    <div className="font-medium">{slot.start}</div>
                    <div className="text-xs opacity-80">to {slot.end}</div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Your Details */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => setStep(2)} className="flex items-center text-gray-600 mb-4 hover:text-primary">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>

            <h2 className="text-xl font-semibold mb-2">Your Details</h2>
            <p className="text-gray-600 mb-6">
              {selectedService?.name} on {selectedDate} at {selectedSlot?.start}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <Input
                placeholder="Full Name"
                value={formData.customer_name}
                onChange={e => setFormData({...formData, customer_name: e.target.value})}
                required
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.customer_email}
                onChange={e => setFormData({...formData, customer_email: e.target.value})}
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.customer_phone}
                onChange={e => setFormData({...formData, customer_phone: e.target.value})}
              />
              <Textarea
                placeholder="Any notes or special requirements?"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />

              <div className="bg-gray-100 p-4 rounded">
                <p className="font-medium">Booking Summary</p>
                <p className="text-sm text-gray-600">{selectedService?.name}</p>
                <p className="text-sm text-gray-600">{selectedDate} at {selectedSlot?.start}</p>
                <p className="text-lg font-bold text-primary mt-2">${selectedService?.price}/{selectedService?.unit}</p>
                <p className="text-xs text-gray-500">Minimum {selectedService?.min_hours} hours</p>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark py-4 text-lg">
                Confirm Booking Request
              </Button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  );
}
