import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { availabilityLabels } from '@/lib/types';

const statusStyles = {
  in_stock: 'bg-lime text-ink',
  low_stock: 'bg-rust text-paper',
  coming_soon: 'bg-graphite text-paper',
  sold_out: 'bg-black/10 text-ink/55',
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return <article className="product-card group border-t border-ink/15 pt-4">
    <Link href={`/products/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e6e1d6]">
        <Image src={product.image_url} alt={product.name} fill priority={index < 3} sizes="(max-width: 768px) 100vw, 33vw" className="product-image object-cover" />
        <span className="absolute left-3 top-3 bg-paper/90 px-2 py-1 font-mono text-[10px] text-ink">0{index + 1}</span>
        <span className={`absolute right-3 top-3 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${statusStyles[product.availability]}`}>{availabilityLabels[product.availability]}</span>
        <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center bg-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={17} /></span>
      </div>
      <div className="flex items-start justify-between gap-5 pt-4">
        <div>
          <h3 className="text-xl font-bold tracking-[-0.04em]">{product.name}</h3>
          <p className="mt-1 max-w-[27ch] text-sm leading-6 text-ink/60">{product.description}</p>
        </div>
        <span className="font-mono text-sm">${Number(product.price).toFixed(2)}</span>
      </div>
    </Link>
    {product.availability !== 'in_stock' && product.availability !== 'sold_out' && <Link href={`/products/${product.slug}#waitlist`} className="mt-4 inline-flex border-b border-ink pb-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-rust hover:text-rust">Join the waitlist</Link>}
  </article>;
}
