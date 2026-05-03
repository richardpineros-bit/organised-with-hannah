import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Calendar as CalendarIcon } from 'lucide-react';

export function BookingManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const data = await api.get('/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      loadBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  }

  const filtered = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const statusCounts = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Pending', count: statusCounts.pending, color: 'bg-yellow-100 text-yellow-800' },
            { label: 'Confirmed', count: statusCounts.confirmed, color: 'bg-blue-100 text-blue-800' },
            { label: 'Completed', count: statusCounts.completed, color: 'bg-green-100 text-green-800' },
            { label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-gray-100 text-gray-800' },
          ].map((stat) => (
            <button
              key={stat.label}
              onClick={() => setFilter(filter === stat.label.toLowerCase() ? 'all' : stat.label.toLowerCase())}
              className={`p-4 rounded-lg text-left transition-colors ${stat.color} ${
                filter === stat.label.toLowerCase() ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
            >
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-sm">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </Button>
        </div>

        {/* Bookings table */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-500">No bookings found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Date & Time</th>
                      <th className="text-left py-3 px-4">Service</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{booking.customer_name}</div>
                          <div className="text-sm text-gray-500">{booking.customer_email}</div>
                          {booking.customer_phone && (
                            <div className="text-sm text-gray-500">{booking.customer_phone}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                            {booking.booking_date}
                          </div>
                          <div className="text-sm text-gray-500 ml-6">
                            {booking.start_time} - {booking.end_time}
                          </div>
                        </td>
                        <td className="py-3 px-4">{booking.service_name || 'General'}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                              'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateStatus(booking.id, 'confirmed')}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            {booking.status !== 'cancelled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => updateStatus(booking.id, 'cancelled')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
