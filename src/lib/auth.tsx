import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
      })
      .catch(() => {
        setAuthError(true);
      })
      .finally(() => {
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const isAdmin = user?.app_metadata?.role === 'admin';

  async function signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('[Auth] signIn error:', {
        message: error.message,
        code: error.code,
        status: error.status,
      });
      throw error;
    }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, authError, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
