import { createClient } from '@supabase/supabase-js';

/*
 * Supabase client factory
 *
 * This file centralises the initialisation of your Supabase client.  It reads
 * the project URL and anon key from environment variables and creates a
 * configured client instance.  Import the exported `supabase` object in
 * your API routes instead of directly talking to a local JSON file.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);