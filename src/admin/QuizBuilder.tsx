import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function QuizBuilder() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ quiz_slug: 'clutter-personality', question: '', sort_order: 1, options: '' });

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    try {
      const data = await api.getQuiz('clutter-personality');
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Failed to load quiz:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        sort_order: Number(formData.sort_order),
        options: JSON.parse(formData.options || '[]'),
      };
      await api.post('/quiz/questions', payload);
      setFormData({ quiz_slug: 'clutter-personality', question: '', sort_order: 1, options: '' });
      loadQuestions();
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  }

  async function deleteQuestion(id: number) {
    // Note: delete endpoint would need to be added
    alert('Delete functionality requires additional backend endpoint');
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Builder</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add Quiz Question</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Quiz Slug" value={formData.quiz_slug} onChange={e => setFormData({...formData, quiz_slug: e.target.value})} required />
                <Input placeholder="Question" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} required />
                <Input type="number" placeholder="Sort Order" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: Number(e.target.value)})} />
                <Textarea placeholder={`Options (JSON format):
[
  {"label": "Option 1", "type": "emotional", "score": 3},
  {"label": "Option 2", "type": "action", "score": 3}
]`} value={formData.options} onChange={e => setFormData({...formData, options: e.target.value})} rows={8} required />
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Add Question</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle>Question {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-4">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-sm">{opt.label}</span>
                        <Badge className="text-xs">{opt.type}</Badge>
                      </div>
                    ))}
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
