'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LogOut, Plus, Search, Trash2, X } from 'lucide-react';
import type { Availability, Product, WaitlistEntry } from '@/lib/types';
import { availabilityLabels, availabilityLabels as labels } from '@/lib/types';

const emptyDraft = { name: '', slug: '', description: '', price: '0', image_url: '', availability: 'coming_soon' as Availability };
type Draft = typeof emptyDraft;

function toDraft(product?: Product): Draft { return product ? { name: product.name, slug: product.slug, description: product.description, price: String(product.price), image_url: product.image_url, availability: product.availability } : emptyDraft; }

export function AdminDashboard({ initialProducts, initialWaitlist, userEmail }: { initialProducts: Product[]; initialWaitlist: WaitlistEntry[]; userEmail: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [waitlist, setWaitlist] = useState(initialWaitlist);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'products' | 'waitlist'>('products');

  const filteredWaitlist = useMemo(() => waitlist.filter((entry) => `${entry.email} ${entry.products?.name ?? ''}`.toLowerCase().includes(search.toLowerCase())), [waitlist, search]);

  function startEdit(product?: Product) { setFeedback(''); setEditing(product ? product.id : 'new'); setDraft(toDraft(product)); }
  function cancelEdit() { setEditing(null); setDraft(emptyDraft); }
  function changeDraft(key: keyof Draft, value: string) { setDraft((current) => ({ ...current, [key]: value })); }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setFeedback('');
    const endpoint = editing === 'new' ? '/api/admin/products' : `/api/admin/products/${editing}`;
    try {
      const response = await fetch(endpoint, { method: editing === 'new' ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...draft, price: Number(draft.price) }) });
      const payload = await response.json() as { product?: Product; error?: string };
      if (!response.ok || !payload.product) { setFeedback(payload.error ?? 'Could not save product.'); return; }
      const saved = { ...payload.product, price: Number(payload.product.price) };
      setProducts((current) => editing === 'new' ? [saved, ...current] : current.map((item) => item.id === saved.id ? saved : item));
      setFeedback(editing === 'new' ? 'Product added to the live catalogue.' : 'Product changes saved.'); cancelEdit();
    } catch { setFeedback('Connection issue. Try again.'); }
    finally { setSaving(false); }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}? This is only possible when no waitlist records depend on it.`)) return;
    setFeedback('');
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const payload = await response.json() as { error?: string };
      if (!response.ok) { setFeedback(payload.error ?? 'Could not delete product.'); return; }
      setProducts((current) => current.filter((item) => item.id !== product.id)); setFeedback('Product deleted from the live catalogue.');
    } catch { setFeedback('Connection issue. Try again.'); }
  }

  async function logout() { await fetch('/api/admin/logout', { method: 'POST' }); window.location.href = '/'; }

  return <main className="min-h-screen bg-[#e9e5db] text-ink"><header className="border-b border-ink/15 bg-ink px-5 py-5 text-paper md:px-10"><div className="mx-auto flex max-w-[1380px] items-center justify-between gap-5"><Link href="/" className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center bg-lime font-mono text-[11px] text-ink">{'//'}</span><span className="text-[15px] font-bold uppercase tracking-[0.12em]">SneakerDrop / Desk</span></Link><div className="flex items-center gap-4"><span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-paper/45 sm:block">{userEmail}</span><button type="button" onClick={logout} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/70 hover:text-lime"><LogOut size={14} /> Log out</button></div></div></header><div className="mx-auto max-w-[1380px] px-5 py-10 md:px-10 md:py-16"><div className="flex flex-col justify-between gap-7 border-b border-ink/15 pb-8 md:flex-row md:items-end"><div><p className="eyebrow text-rust">Private workspace / live data</p><h1 className="display mt-3 text-5xl font-bold md:text-7xl">The release desk.</h1></div><p className="max-w-[35ch] text-sm leading-6 text-ink/60">Manage the public catalogue and see waitlist entries from the protected Supabase workspace.</p></div><div className="mt-8 flex flex-wrap items-center gap-2"><button type="button" onClick={() => setTab('products')} className={`px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] ${tab === 'products' ? 'bg-ink text-paper' : 'border border-ink/20 text-ink/60'}`}>Products ({products.length})</button><button type="button" onClick={() => setTab('waitlist')} className={`px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] ${tab === 'waitlist' ? 'bg-ink text-paper' : 'border border-ink/20 text-ink/60'}`}>Waitlist ({waitlist.length})</button>{tab === 'products' && <button type="button" onClick={() => startEdit()} className="ml-auto inline-flex items-center gap-2 bg-lime px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink"><Plus size={14} /> Add product</button>}</div><p className="mt-4 min-h-5 text-sm text-rust" aria-live="polite">{feedback}</p>
      {tab === 'products' && <div className="mt-5 grid gap-4">{products.length === 0 ? <div className="border border-ink/15 bg-paper p-10 text-center"><p className="text-xl font-bold">No products yet.</p></div> : products.map((product) => <article key={product.id} className="grid gap-5 border border-ink/15 bg-paper p-5 md:grid-cols-[1fr_auto_auto] md:items-center"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-bold tracking-[-0.04em]">{product.name}</h2><span className="bg-lime px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em]">{availabilityLabels[product.availability]}</span></div><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/45">/{product.slug} · ${Number(product.price).toFixed(2)}</p></div><button type="button" onClick={() => startEdit(product)} className="border-b border-ink pb-1 text-left font-mono text-[10px] uppercase tracking-[0.12em] hover:text-rust">Edit product</button><button type="button" onClick={() => deleteProduct(product)} className="inline-flex items-center gap-2 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-rust hover:text-ink"><Trash2 size={14} /> Delete</button></article>)}</div>}
      {tab === 'waitlist' && <div className="mt-5"><div className="relative max-w-[420px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" /><label htmlFor="waitlist-search" className="sr-only">Search waitlist</label><input id="waitlist-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search email or product" className="min-h-11 w-full border border-ink/20 bg-paper pl-10 pr-4 text-sm focus:border-ink focus:outline-none" /></div><div className="mt-4 overflow-hidden border border-ink/15 bg-paper">{filteredWaitlist.length === 0 ? <p className="p-10 text-center text-sm text-ink/55">No waitlist submissions match this view.</p> : <div className="divide-y divide-ink/10">{filteredWaitlist.map((entry) => <div key={entry.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"><p className="font-mono text-sm">{entry.email}</p><p className="text-sm text-ink/60">{entry.products?.name ?? 'Unknown product'}</p><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">{new Date(entry.created_at).toLocaleString()}</p></div>)}</div>}</div></div>}
    </div>{editing && <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-0 sm:items-center sm:p-6"><div className="max-h-[92vh] w-full max-w-[680px] overflow-auto bg-paper p-6 sm:p-8"><div className="flex items-start justify-between"><div><p className="eyebrow text-rust">{editing === 'new' ? 'New release' : 'Edit release'}</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.05em]">Product details.</h2></div><button type="button" onClick={cancelEdit} aria-label="Close product editor" className="text-ink/60 hover:text-rust"><X size={22} /></button></div><form onSubmit={saveProduct} className="mt-7 grid gap-5"><div><label htmlFor="product-name" className="eyebrow text-ink/55">Name</label><input id="product-name" value={draft.name} onChange={(event) => changeDraft('name', event.target.value)} className="mt-2 min-h-11 w-full border border-ink/20 bg-white/40 px-4 text-sm focus:border-ink focus:outline-none" required /></div><div><label htmlFor="product-slug" className="eyebrow text-ink/55">Slug</label><input id="product-slug" value={draft.slug} onChange={(event) => changeDraft('slug', event.target.value)} className="mt-2 min-h-11 w-full border border-ink/20 bg-white/40 px-4 text-sm focus:border-ink focus:outline-none" required /></div><div><label htmlFor="product-description" className="eyebrow text-ink/55">Description</label><textarea id="product-description" value={draft.description} onChange={(event) => changeDraft('description', event.target.value)} className="mt-2 min-h-28 w-full resize-y border border-ink/20 bg-white/40 px-4 py-3 text-sm leading-6 focus:border-ink focus:outline-none" required /></div><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="product-price" className="eyebrow text-ink/55">Price (USD)</label><input id="product-price" type="number" min="0" step="0.01" value={draft.price} onChange={(event) => changeDraft('price', event.target.value)} className="mt-2 min-h-11 w-full border border-ink/20 bg-white/40 px-4 text-sm focus:border-ink focus:outline-none" required /></div><div><label htmlFor="product-availability" className="eyebrow text-ink/55">Availability</label><select id="product-availability" value={draft.availability} onChange={(event) => changeDraft('availability', event.target.value)} className="mt-2 min-h-11 w-full border border-ink/20 bg-white/40 px-4 text-sm focus:border-ink focus:outline-none">{(Object.keys(labels) as Availability[]).map((value) => <option key={value} value={value}>{labels[value]}</option>)}</select></div></div><div><label htmlFor="product-image" className="eyebrow text-ink/55">Image URL</label><input id="product-image" type="url" value={draft.image_url} onChange={(event) => changeDraft('image_url', event.target.value)} className="mt-2 min-h-11 w-full border border-ink/20 bg-white/40 px-4 text-sm focus:border-ink focus:outline-none" required /></div><div className="flex flex-col-reverse gap-3 border-t border-ink/15 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={cancelEdit} className="min-h-11 border border-ink/20 px-5 font-mono text-[10px] uppercase tracking-[0.12em]">Cancel</button><button type="submit" disabled={saving} className="min-h-11 bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper disabled:opacity-60">{saving ? 'Saving…' : 'Save product'}</button></div></form></div></div>}
  </main>;
}
