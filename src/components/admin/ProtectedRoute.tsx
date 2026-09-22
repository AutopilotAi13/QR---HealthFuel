import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2, AlertTriangle } from 'lucide-react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, authError } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-avocado-400 animate-spin" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-cream-50 text-lg font-bold mb-2">Connection error</h1>
          <p className="text-cream-100/50 text-sm mb-6">
            Unable to reach the authentication service. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-avocado-500 hover:bg-avocado-400 text-cream-50 text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
