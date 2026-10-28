import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandStory } from '@/components/brand-story';
import { Hero } from '@/components/hero';
import { ProductGrid } from '@/components/product-grid';
import { Reveal } from '@/components/reveal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { products, error } = await getProducts();
  const featured = products.slice(0, 3);
  return <main>
    <section className="relative"><SiteHeader /><Hero /></section>
    <section className="bg-paper px-5 py-24 md:px-10 md:py-32"><div className="mx-auto max-w-[1380px]"><Reveal><div className="mb-12 flex flex-col justify-between gap-5 border-b border-ink/15 pb-6 sm:flex-row sm:items-end"><div><p className="eyebrow text-rust">Current selection / {String(products.length).padStart(2, '0')} records</p><h2 className="display mt-4 text-5xl font-bold md:text-7xl">Featured pairs.</h2></div><Link href="/catalogue" className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] hover:text-rust">View all releases <ArrowUpRight size={15} /></Link></div></Reveal><ProductGrid products={featured} error={error} /></div></section>
    <BrandStory />
    <section className="bg-lime px-5 py-16 md:px-10 md:py-24"><div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow text-ink/60">The desk is open</p><h2 className="display mt-4 max-w-[10ch] text-5xl font-bold md:text-7xl">Find your next constant.</h2></div><Link href="/catalogue" className="inline-flex min-h-12 items-center justify-center gap-5 border border-ink bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.15em] text-paper transition-transform hover:-translate-y-1">Enter the catalogue <ArrowUpRight size={16} /></Link></div></section>
    <SiteFooter />
  </main>;
}
