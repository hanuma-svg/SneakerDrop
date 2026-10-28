import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { waitlistSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid waitlist submission.' }, { status: 400 });
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.rpc('submit_waitlist', { p_product_id: parsed.data.product_id, p_email: parsed.data.email });
    if (error?.code === '23505') return NextResponse.json({ error: 'That email is already on this product’s waitlist.' }, { status: 409 });
    if (error?.code === 'P0002') return NextResponse.json({ error: 'That product is no longer available.' }, { status: 404 });
    if (error?.code === '22023') return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    if (error) return NextResponse.json({ error: 'We could not save your spot right now.' }, { status: 500 });
    return NextResponse.json({ message: 'You are on the list. We will keep your place for this release.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
