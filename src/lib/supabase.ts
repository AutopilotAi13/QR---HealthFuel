import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Diagnostic logging — reports ONLY non-sensitive config info.
// NEVER logs the API key value or any user credentials.
const projectRef = supabaseUrl?.match(/https?:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
console.info('[Supabase] Config check:', {
  url: supabaseUrl ?? 'MISSING',
  projectRef: projectRef ?? 'MISSING',
  hasKey: Boolean(supabaseAnonKey),
  keyEnvVar: 'VITE_SUPABASE_ANON_KEY',
});

// Gracefully degrade when env vars are missing — the repository
// layer catches errors and falls back to local mock data.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
