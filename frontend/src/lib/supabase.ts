import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use dummy values if env vars are placeholders to prevent crash
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('http');
const safeUrl = isValidUrl ? supabaseUrl : 'https://placeholder.supabase.co';
const safeKey = isValidUrl ? supabaseAnonKey : 'placeholder-key';

/**
 * Creates and exports a Supabase client instance configured with
 * environment variables.
 *
 * This client can be imported and used throughout the application for
 * authentication and database operations.
 */
export const supabase: SupabaseClient = createClient(
  safeUrl,
  safeKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);

