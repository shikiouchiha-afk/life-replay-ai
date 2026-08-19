import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/config';

const supabaseUrl = config.supabase.url;
const supabasePublishableKey = config.supabase.publishableKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = getSupabaseClient();

export function requireSupabaseClient(): SupabaseClient {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.');
  }

  return client;
}

export async function getAuthenticatedUser() {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    console.error('Error fetching authenticated user:', error);
    return null;
  }

  return user;
}

export async function getSession() {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }

  return session;
}

export default supabase;
