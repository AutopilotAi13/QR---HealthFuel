import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Diagnostic logging — reports ONLY non-sensitive config info.
// NEVER logs the API key value or any user credentials.
const projectRef = supabaseUrl?.match(/https?:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
console.info('[Supabase] Config check:', {
  url: supabaseUrl ?? 'MISSING',
  projectRef: projectRef ?? 'MISSING',
  hasKey: Boolean(supabasePublishableKey),
  keyEnvVar: 'VITE_SUPABASE_PUBLISHABLE_KEY',
});

export const supabase: SupabaseClient | null =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;
