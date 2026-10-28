import type { Product } from '@/lib/types';
import { createPublicSupabaseClient } from '@/lib/supabase';

export async function getProducts(): Promise<{ products: Product[]; error: string | null }> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) return { products: [], error: 'The catalogue is temporarily unavailable.' };
    return { products: (data ?? []) as Product[], error: null };
  } catch {
    return { products: [], error: 'Supabase is not configured for this environment.' };
  }
}

export async function getProductBySlug(slug: string): Promise<{ product: Product | null; error: string | null }> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
    if (error) return { product: null, error: 'The product could not be loaded.' };
    return { product: (data as Product | null) ?? null, error: null };
  } catch {
    return { product: null, error: 'Supabase is not configured for this environment.' };
  }
}
