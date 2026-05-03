import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Check } from 'lucide-react';

export function ContactSubmissions() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const data = await api.get('/contact');
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: number) {
    try {
      await api.put(`/contact/${id}/read`, {});
      loadContacts();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }

  const unreadCount = contacts.filter(c => !c.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white">{unreadCount} unread</Badge>
          )}
        </div>

        {loading ? <p>Loading...</p> : contacts.length === 0 ? (
          <p className="text-gray-500">No submissions yet</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className={!contact.is_read ? 'border-l-4 border-l-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{contact.first_name} {contact.last_name}</CardTitle>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{contact.email}</span>
                        {contact.phone && <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{contact.phone}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{new Date(contact.created_at).toLocaleDateString()}</span>
                      {!contact.is_read && (
                        <Button size="sm" variant="outline" onClick={() => markAsRead(contact.id)}>
                          <Check className="w-4 h-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {contact.subject && <p className="font-medium mb-2">Subject: {contact.subject}</p>}
                  <p className="text-gray-700">{contact.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
