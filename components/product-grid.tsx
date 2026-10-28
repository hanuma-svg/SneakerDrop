import Link from 'next/link';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';

export function ProductGrid({ products, error }: { products: Product[]; error?: string | null }) {
  if (error) return <div className="border border-rust/50 bg-rust/10 p-8 text-center"><p className="font-mono text-xs uppercase tracking-[0.14em] text-rust">Catalogue error</p><p className="mt-3 text-lg">{error}</p><Link href="/catalogue" className="mt-6 inline-block border-b border-ink pb-1 font-mono text-[10px] uppercase tracking-[0.14em]">Try again</Link></div>;
  if (products.length === 0) return <div className="border border-ink/15 p-10 text-center"><p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/50">No releases yet</p><p className="mt-3 text-2xl font-bold tracking-[-0.04em]">The desk is quiet for now.</p></div>;
  return <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>;
}
