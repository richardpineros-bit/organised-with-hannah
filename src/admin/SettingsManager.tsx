import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, RefreshCw } from 'lucide-react';

export function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await api.getSettings();
      const mapped: Record<string, string> = {};
      for (const [key, value] of Object.entries(data)) {
        mapped[key] = String(value);
      }
      setSettings(mapped);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string) {
    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      await api.put(`/settings/${key}`, { value: settings[key] });
    } catch (error) {
      console.error('Failed to save setting:', error);
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  }

  const settingFields = [
    { key: 'site_name', label: 'Site Name', type: 'text' },
    { key: 'site_tagline', label: 'Site Tagline', type: 'text' },
    { key: 'contact_email', label: 'Contact Email', type: 'text' },
    { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
    { key: 'location', label: 'Service Area', type: 'text' },
    { key: 'current_booking_month', label: 'Current Booking Month', type: 'text' },
    { key: 'booking_notice_hours', label: 'Booking Notice (hours)', type: 'number' },
    { key: 'currency', label: 'Currency', type: 'text' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <Button variant="outline" onClick={loadSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? <p>Loading...</p> : (
          <Card>
            <CardContent className="p-6 space-y-6">
              {settingFields.map((field) => (
                <div key={field.key} className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <Input
                      type={field.type}
                      value={settings[field.key] || ''}
                      onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => saveSetting(field.key)}
                    disabled={saving[field.key]}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    {saving[field.key] ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save</>}
                  </Button>
                </div>
              ))}

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold mb-4">Trust Badges</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings['ndis_provider'] === 'true'}
                      onChange={e => setSettings(prev => ({ ...prev, ndis_provider: String(e.target.checked) }))}
                      className="mr-3 w-5 h-5"
                    />
                    NDIS Certified Provider
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings['mental_health_first_aider'] === 'true'}
                      onChange={e => setSettings(prev => ({ ...prev, mental_health_first_aider: String(e.target.checked) }))}
                      className="mr-3 w-5 h-5"
                    />
                    Mental Health First Aider
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings['insured'] === 'true'}
                      onChange={e => setSettings(prev => ({ ...prev, insured: String(e.target.checked) }))}
                      className="mr-3 w-5 h-5"
                    />
                    Fully Insured
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
