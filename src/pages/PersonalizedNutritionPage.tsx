import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, BarChart3, UtensilsCrossed, ArrowLeft, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';

type Goal = 'Weight Loss' | 'Weight Gain' | 'Maintenance' | 'General Fitness';

const goals: Goal[] = ['Weight Loss', 'Weight Gain', 'Maintenance', 'General Fitness'];

export default function PersonalizedNutritionPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState<Goal | ''>('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !age.trim() || !gender || !goal) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError('Please enter a valid age.');
      return;
    }

    setSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('personalized_nutrition_early_access')
        .insert({
          name: name.trim(),
          email: email.trim(),
          age: ageNum,
          gender,
          goal,
          phone: phone.trim() || null,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This email is already registered for early access.');
        } else {
          setError('Could not submit your request. Please try again.');
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Could not submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const points = [
    { icon: Target, text: 'Tailored to your goals' },
    { icon: BarChart3, text: 'Backed by nutrition data' },
    { icon: UtensilsCrossed, text: 'Only Health Fuel menu items' },
  ];

  const inputClass =
    'w-full bg-charcoal-700/60 border border-charcoal-600/40 rounded-xl px-3.5 py-2.5 text-cream-50 text-sm placeholder-cream-100/30 focus:outline-none focus:border-avocado-500/50 transition-colors';
  const labelClass =
    'block text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-1.5';

  return (
    <div className="min-h-screen">
      <Header showBack />

      <main className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Banner header */}
        <div className="relative overflow-hidden rounded-2xl border border-avocado-500/20 bg-gradient-to-br from-charcoal-700/60 via-charcoal-800/80 to-charcoal-900 mb-8 animate-fade-in">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-avocado-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative p-5 sm:p-8">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-avocado-500/15 border border-avocado-500/30 text-avocado-300 text-2xs font-bold tracking-[0.15em] uppercase">
                <Sparkles className="w-3 h-3" />
                Coming Soon
              </span>
            </div>
            <h1 className="text-cream-50 text-2xl sm:text-4xl font-bold tracking-tight">
              Personalized Nutrition
            </h1>
            <p className="text-avocado-400 text-base sm:text-lg font-semibold mt-1">
              Your food. Your goal.
            </p>
            <p className="text-cream-100/50 text-sm sm:text-base mt-2 leading-relaxed max-w-lg">
              Get personalized Health Fuel meal recommendations based on your goal.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-5 mt-5">
              {points.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.text} className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-avocado-500/15 border border-avocado-500/20 flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-avocado-400" strokeWidth={1.5} />
                    </span>
                    <span className="text-cream-100/60 text-xs sm:text-sm font-medium">
                      {p.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-avocado-500/15 border border-avocado-500/30 mb-6">
              <CheckCircle2 className="w-8 h-8 text-avocado-400" />
            </div>
            <h2 className="text-cream-50 text-xl sm:text-2xl font-bold text-center">
              Thank you!
            </h2>
            <p className="text-cream-100/50 text-sm sm:text-base mt-2 text-center max-w-sm">
              We'll let you know when Personalized Nutrition is ready.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 text-avocado-400 hover:text-avocado-300 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to menu
            </Link>
          </div>
        ) : (
          <div className="max-w-lg animate-slide-up">
            <h2 className="text-cream-50 text-lg sm:text-xl font-bold mb-1">
              Get Early Access
            </h2>
            <p className="text-cream-100/40 text-sm mb-6">
              Be the first to know when we launch. Fill in your details below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className={labelClass}>Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={inputClass}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Goal *</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as Goal)}
                    className={inputClass}
                  >
                    <option value="">Select goal</option>
                    {goals.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </div>

              {error && (
                <p className="text-red-300/80 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-avocado-500 hover:bg-avocado-400 disabled:opacity-50 text-cream-50 font-semibold text-sm rounded-xl py-3 transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Submitting...' : 'Get Early Access'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
