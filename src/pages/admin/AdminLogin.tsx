import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg === 'Supabase not configured') {
        setError('Authentication service is not configured. Please contact support.');
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-avocado-500/10 mb-4">
            <Lock className="w-6 h-6 text-avocado-400" />
          </div>
          <h1 className="text-cream-50 text-xl font-bold tracking-tight">
            <span className="text-avocado-400">Health</span>{' '}
            <span className="text-cream-100">Fuel</span>
          </h1>
          <p className="text-cream-100/40 text-sm mt-1.5 font-medium tracking-wider uppercase text-2xs">
            Admin Sign In
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full bg-charcoal-800 border border-charcoal-700/50 rounded-lg px-3.5 py-2.5 text-cream-50 text-sm placeholder-cream-100/30 focus:outline-none focus:border-avocado-500/50 transition-colors"
              placeholder="admin@healthfuel.com"
            />
          </div>
          <div>
            <label className="block text-cream-100/60 text-xs font-semibold tracking-wider uppercase mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-charcoal-800 border border-charcoal-700/50 rounded-lg px-3.5 py-2.5 text-cream-50 text-sm placeholder-cream-100/30 focus:outline-none focus:border-avocado-500/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400/80 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-avocado-500 hover:bg-avocado-400 disabled:opacity-50 text-cream-50 font-semibold text-sm rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link to="/menu" className="text-cream-100/30 hover:text-avocado-400 text-xs font-medium transition-colors">
            Back to menu
          </Link>
        </p>
      </div>
    </div>
  );
}
