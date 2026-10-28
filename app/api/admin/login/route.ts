import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { adminLoginSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const parsed = adminLoginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Check your credentials.' }, { status: 400 });
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user) return NextResponse.json({ error: 'Email or password was not accepted.' }, { status: 401 });
    const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', data.user.id).maybeSingle();
    if (!admin) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: 'This account is not provisioned for administrator access.' }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unable to sign in right now.' }, { status: 500 });
  }
}
