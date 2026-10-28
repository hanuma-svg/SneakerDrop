'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(initialError ?? '');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) { setMessage(payload.error ?? 'Unable to sign in.'); return; }
      router.push('/admin'); router.refresh();
    } catch { setMessage('Connection issue. Please try again.'); }
    finally { setLoading(false); }
  }

  return <form onSubmit={submit} className="mt-8 space-y-5" noValidate><div><label htmlFor="admin-email" className="eyebrow text-paper/50">Email address</label><input id="admin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full border border-paper/20 bg-paper/5 px-4 text-sm text-paper placeholder:text-paper/30 focus:border-lime focus:outline-none" placeholder="admin@example.com" required /></div><div><label htmlFor="admin-password" className="eyebrow text-paper/50">Password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full border border-paper/20 bg-paper/5 px-4 text-sm text-paper placeholder:text-paper/30 focus:border-lime focus:outline-none" placeholder="••••••••" required /></div><p className="min-h-5 text-sm text-rust" aria-live="polite">{message}</p><button type="submit" className="min-h-12 w-full bg-lime px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60" disabled={loading}>{loading ? 'Checking access…' : 'Sign in securely'}</button></form>;
}
