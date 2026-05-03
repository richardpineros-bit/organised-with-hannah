import { useEffect, useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import { AdminLayout } from './AdminLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RefreshCw, Eye } from 'lucide-react';

const sections = [
  {
    id: 'hero',
    label: 'Hero Section',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
      { key: 'quote', label: 'Quote', type: 'text' },
      { key: 'cta_primary', label: 'Primary CTA Button', type: 'text' },
      { key: 'cta_secondary', label: 'Secondary CTA Button', type: 'text' },
      { key: 'social_proof', label: 'Social Proof Text', type: 'text' },
    ]
  },
  {
    id: 'about',
    label: 'About Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'bio', label: 'Bio Paragraph 1', type: 'textarea' },
      { key: 'bio_second', label: 'Bio Paragraph 2', type: 'textarea' },
    ]
  },
  {
    id: 'services',
    label: 'Services Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
    ]
  },
  {
    id: 'why',
    label: 'Why Organise Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'intro', label: 'Introduction', type: 'textarea' },
    ]
  },
  {
    id: 'lifeflow',
    label: 'Life Flow Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
    ]
  },
  {
    id: 'whychoose',
    label: 'Why Choose Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
    ]
  },
  {
    id: 'testimonials',
    label: 'Testimonials Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
    ]
  },
  {
    id: 'pricing',
    label: 'Pricing Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'note', label: 'Note', type: 'text' },
    ]
  },
  {
    id: 'contact',
    label: 'Contact Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'phone', label: 'Phone Number', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
    ]
  },
  {
    id: 'footer',
    label: 'Footer',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'text' },
    ]
  },
];

export function ContentEditor() {
  const { content, fetchContent, updateContent, isLoading } = useContentStore();
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('hero');
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const handleChange = (section: string, key: string, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [`${section}.${key}`]: value,
    }));
  };

  const handleSave = async (section: string, key: string) => {
    const fullKey = `${section}.${key}`;
    const value = editedValues[fullKey];
    if (!value) return;

    setSaving((prev) => ({ ...prev, [fullKey]: true }));
    try {
      await updateContent(section, key, value);
    } finally {
      setSaving((prev) => ({ ...prev, [fullKey]: false }));
    }
  };

  const getValue = (section: string, key: string) => {
    const fullKey = `${section}.${key}`;
    if (editedValues[fullKey] !== undefined) {
      return editedValues[fullKey];
    }
    return content[section]?.[key] || '';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => fetchContent()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </a>
          </div>
        </div>

        <p className="text-gray-600">
          Edit any text on your website below. Changes are saved to the database and appear immediately on the live site.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto gap-2 bg-gray-100 p-2">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">
                  {section.label}
                </h2>

                {section.fields.map((field) => {
                  const fullKey = `${section.id}.${field.key}`;
                  const isSaving = saving[fullKey];
                  const value = getValue(section.id, field.key);

                  return (
                    <div key={field.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        <span className="text-xs text-gray-400 ml-2">({section.id}.{field.key})</span>
                      </label>

                      {field.type === 'textarea' ? (
                        <Textarea
                          value={value}
                          onChange={(e) => handleChange(section.id, field.key, e.target.value)}
                          rows={4}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) => handleChange(section.id, field.key, e.target.value)}
                          className="w-full"
                        />
                      )}

                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleSave(section.id, field.key)}
                          disabled={isSaving || value === content[section.id]?.[field.key]}
                          className="bg-primary hover:bg-primary-dark"
                        >
                          {isSaving ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
