import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { WaitlistForm } from '@/components/waitlist-form';
import { availabilityLabels } from '@/lib/types';
import { getProductBySlug } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { product } = await getProductBySlug(params.slug);
  return { title: product ? `${product.name} — SneakerDrop` : 'Product — SneakerDrop', description: product?.description };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { product, error } = await getProductBySlug(params.slug);
  if (!product && !error) notFound();
  if (!product) return <main className="min-h-screen bg-paper p-10"><p className="font-mono text-sm text-rust">{error ?? 'Product not found.'}</p></main>;
  const isWaitlist = product.availability === 'coming_soon' || product.availability === 'low_stock';
  return <main className="bg-paper"><section className="relative bg-ink px-5 pb-16 pt-28 text-paper md:px-10 md:pb-24 md:pt-36"><SiteHeader /><div className="mx-auto max-w-[1380px]"><Link href="/catalogue" className="eyebrow inline-flex items-center gap-3 text-paper/60 hover:text-lime"><ArrowLeft size={14} /> Back to catalogue</Link><div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-20"><div className="relative aspect-[1.1] overflow-hidden border border-paper/20 bg-graphite"><Image src={product.image_url} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" /></div><div><p className="eyebrow text-lime">Release detail / {product.slug}</p><h1 className="display mt-5 text-6xl font-bold md:text-[7rem]">{product.name}</h1><div className="mt-8 flex items-center gap-5 border-t border-paper/20 pt-5"><span className="font-mono text-2xl">${Number(product.price).toFixed(2)}</span><span className="bg-paper/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-lime">{availabilityLabels[product.availability]}</span></div><p className="mt-7 max-w-[43ch] text-base leading-7 text-paper/60">{product.description}</p></div></div></div></section>
    <section className="px-5 py-16 md:px-10 md:py-24"><div className="mx-auto grid max-w-[1380px] gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-24"><div><p className="eyebrow text-rust">Field note</p><p className="mt-5 max-w-[28ch] text-2xl font-bold leading-tight tracking-[-0.04em]">Good pairs earn their place slowly.</p><Link href="/catalogue" className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-1 font-mono text-[10px] uppercase tracking-[0.14em] hover:text-rust">Explore other releases <ArrowUpRight size={14} /></Link></div><div id="waitlist">{isWaitlist ? <WaitlistForm productId={product.id} productName={product.name} /> : <div className="border border-ink/15 bg-white/30 p-7"><p className="eyebrow text-emerald-700">Available now</p><h2 className="mt-3 text-2xl font-bold tracking-[-0.05em]">This pair is in the current edit.</h2><p className="mt-3 text-sm leading-6 text-ink/60">No waitlist needed right now. Availability is managed by the release desk.</p></div>}</div></div></section><SiteFooter /></main>;
}
