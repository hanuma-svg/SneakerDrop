import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function isCurrentUserAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', userData.user.id).maybeSingle();
  return Boolean(data);
}

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect('/admin/login');
  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', userData.user.id).maybeSingle();
  if (!admin) redirect('/admin/login?error=not-authorized');
  return { user: userData.user, supabase };
}
