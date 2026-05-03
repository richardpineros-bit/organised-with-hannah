import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function QuizPage() {
  const { slug = 'clutter-personality' } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [slug]);

  async function loadQuiz() {
    try {
      const data = await api.getQuiz(slug);
      setQuiz(data);
    } catch (error) {
      console.error('Failed to load quiz:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(option: any) {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const data = await api.submitQuiz(slug, answers, email);
      setResult(data);
    } catch (error) {
      console.error('Quiz submit failed:', error);
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setEmail('');
  }

  if (loading) {
    return (
      <section className="min-h-screen pt-[70px] bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (result) {
    return (
      <section className="min-h-screen pt-[70px] bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-primary mb-2">Your Result</h2>
            <h3 className="text-xl font-semibold mb-4">{result.result_type === 'emotional' ? 'The Overwhelmed Organiser' : result.result_type === 'action' ? 'The Motivated Organiser' : 'The Unaware Organiser'}</h3>
            <p className="text-gray-700 mb-8">{result.result_description || result.description}</p>
            <a href={result.cta_link || '/booking'} className="inline-block bg-primary text-white px-8 py-4 font-semibold uppercase tracking-wider hover:bg-primary-dark">
              {result.cta_text || 'Book a Consultation'}
            </a>
            <button onClick={restart} className="block mt-6 text-gray-500 hover:text-primary">Take quiz again</button>
          </motion.div>
        </div>
      </section>
    );
  }

  const question = quiz?.questions?.[currentQuestion];
  const isLastQuestion = currentQuestion === (quiz?.questions?.length || 0) - 1;

  return (
    <section className="min-h-screen pt-[70px] bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-2">What&apos;s Your Clutter Personality?</h1>
        <p className="text-center text-gray-600 mb-8">Discover your organising style and get personalised recommendations</p>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {quiz?.questions?.length || 0}</span>
            <span>{Math.round(((currentQuestion + 1) / (quiz?.questions?.length || 1)) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-2 bg-primary rounded transition-all duration-300" style={{ width: `${((currentQuestion + 1) / (quiz?.questions?.length || 1)) * 100}%` }} />
          </div>
        </div>

        {question && (
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 border-2 border-gray-200 text-left hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {isLastQuestion && answers.length === quiz?.questions?.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <p className="text-gray-600 mb-4">Enter your email to receive your personalised result:</p>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSubmit} disabled={submitting} className="bg-primary hover:bg-primary-dark">
                {submitting ? 'Submitting...' : 'Get Results'}
              </Button>
            </div>
            <button onClick={handleSubmit} className="text-sm text-gray-500 mt-2 hover:text-primary">
              Skip email and see results
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
