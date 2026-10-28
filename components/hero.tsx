import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/reveal';

export function Hero() {
  return <section className="noise relative overflow-hidden bg-ink text-paper">
    <div className="mx-auto grid min-h-[720px] max-w-[1380px] items-end gap-10 px-5 pb-16 pt-32 md:min-h-[820px] md:grid-cols-[1fr_0.88fr] md:gap-16 md:px-10 md:pb-20">
      <div className="relative z-10">
        <Reveal><p className="eyebrow mb-7 flex items-center gap-3 text-lime"><span className="h-px w-8 bg-lime" />Independent release desk / 001</p></Reveal>
        <Reveal delay={0.06}><h1 className="display max-w-[8ch] text-[clamp(4.6rem,11vw,10.8rem)] font-bold">The next pair starts here.</h1></Reveal>
        <Reveal delay={0.12}><div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center"><Link href="/catalogue" className="inline-flex min-h-12 items-center justify-center gap-5 bg-lime px-5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink transition-transform hover:-translate-y-1">Explore the catalogue <ArrowUpRight size={16} /></Link><Link href="#story" className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-paper/70 hover:text-lime">Read the story <ArrowDownRight size={15} /></Link></div></Reveal>
      </div>
      <Reveal delay={0.16} className="relative md:pb-5">
        <div className="relative ml-auto aspect-[0.82] w-full max-w-[520px] overflow-hidden border border-paper/25 bg-graphite/40">
          <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=88" alt="Red sneaker on a warm studio surface" fill priority sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-paper/80">Field note 01<br /><span className="text-paper/50">Motion / form / surface</span></p><span className="font-mono text-[10px] text-lime">DROP_001</span></div>
        </div>
        <div className="absolute -left-3 top-10 hidden -rotate-90 font-mono text-[9px] uppercase tracking-[0.3em] text-paper/40 md:block">Built for the considered step</div>
      </Reveal>
    </div>
    <div className="absolute bottom-0 left-0 right-0 border-t border-paper/15 px-5 py-4 md:px-10"><div className="mx-auto flex max-w-[1380px] items-center justify-between"><span className="eyebrow text-paper/40">Scroll to explore</span><span className="font-mono text-[10px] text-paper/40">28.10.26 / 14:21</span></div></div>
  </section>;
}
