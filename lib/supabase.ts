import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_KEY;
  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured.');
  }
  return { url, key };
}

export function createPublicSupabaseClient(): SupabaseClient {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key);
}

export function createBrowserSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  return createBrowserClient(url, key);
}

export function createServerSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, { ...options, sameSite: 'none', secure: true }));
        } catch {
          // Server Components cannot always mutate cookies. Middleware handles refresh writes.
        }
      },
    },
  });
}
