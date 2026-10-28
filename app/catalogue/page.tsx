import { ProductGrid } from '@/components/product-grid';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Reveal } from '@/components/reveal';
import { getProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function CataloguePage() {
  const { products, error } = await getProducts();
  return <main className="bg-paper">
    <section className="relative bg-ink px-5 pb-20 pt-32 text-paper md:px-10 md:pb-28 md:pt-44"><SiteHeader /><div className="mx-auto max-w-[1380px]"><Reveal><p className="eyebrow text-lime">Catalogue / live selection</p><h1 className="display mt-5 max-w-[8ch] text-6xl font-bold md:text-[8.8rem]">Make room for better.</h1><p className="mt-8 max-w-[42ch] text-base leading-7 text-paper/60">A considered edit of fictional demonstration releases, pulled directly from the SneakerDrop database.</p></Reveal></div><div className="absolute bottom-0 left-0 right-0 border-t border-paper/15" /></section>
    <section className="px-5 py-20 md:px-10 md:py-28"><div className="mx-auto max-w-[1380px]"><div className="mb-10 flex items-center justify-between border-b border-ink/15 pb-5"><p className="eyebrow text-ink/50">{products.length} release records</p><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">Updated from Supabase</p></div><ProductGrid products={products} error={error} /></div></section>
    <SiteFooter />
  </main>;
}
