import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { productSchema } from '@/lib/validation';

async function requireApiAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { supabase, response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };
  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', userData.user.id).maybeSingle();
  if (!admin) return { supabase, response: NextResponse.json({ error: 'Administrator access required.' }, { status: 403 }) };
  return { supabase, response: null };
}

export async function POST(request: Request) {
  const { supabase, response } = await requireApiAdmin();
  if (response) return response;
  try {
    const parsed = productSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid product.' }, { status: 400 });
    const { data, error } = await supabase.from('products').insert(parsed.data).select('*').single();
    if (error?.code === '23505') return NextResponse.json({ error: 'That slug is already in use.' }, { status: 409 });
    if (error) return NextResponse.json({ error: 'Product could not be created.' }, { status: 500 });
    return NextResponse.json({ product: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
