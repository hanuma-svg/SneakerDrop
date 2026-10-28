'use client';

import { useState } from 'react';
import { waitlistSchema } from '@/lib/validation';

export function WaitlistForm({ productId, productName }: { productId: string; productName: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = waitlistSchema.safeParse({ product_id: productId, email });
    if (!parsed.success) { setState('error'); setMessage(parsed.error.issues[0]?.message ?? 'Enter a valid email.'); return; }
    setState('loading'); setMessage('');
    try {
      const response = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const payload = await response.json() as { message?: string; error?: string };
      if (!response.ok) { setState('error'); setMessage(payload.error ?? 'Could not save your spot.'); return; }
      setState('success'); setMessage(payload.message ?? 'You are on the list.'); setEmail('');
    } catch { setState('error'); setMessage('Connection issue. Please try again.'); }
  }

  return <form onSubmit={submit} className="border border-ink/15 bg-white/30 p-5 sm:p-7" noValidate>
    <p className="eyebrow text-ink/50">Release alert</p>
    <h2 className="mt-3 text-2xl font-bold tracking-[-0.05em]">Keep your place for {productName}.</h2>
    <p className="mt-3 text-sm leading-6 text-ink/60">Leave your email and we’ll hold your spot in the release queue. No confirmation email is sent from this demo.</p>
    <label htmlFor="waitlist-email" className="mt-6 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">Email address</label>
    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
      <input id="waitlist-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="min-h-12 flex-1 border border-ink/20 bg-paper px-4 text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none" disabled={state === 'loading'} aria-describedby="waitlist-feedback" />
      <button type="submit" className="min-h-12 bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-rust disabled:cursor-wait disabled:opacity-60" disabled={state === 'loading'}>{state === 'loading' ? 'Saving…' : 'Join list'}</button>
    </div>
    <p id="waitlist-feedback" aria-live="polite" className={`mt-3 min-h-5 text-sm ${state === 'success' ? 'text-emerald-700' : 'text-rust'}`}>{message}</p>
  </form>;
}
