import Image from 'next/image';
import { Reveal } from '@/components/reveal';

export function BrandStory() {
  return <section id="story" className="bg-paper px-5 py-24 md:px-10 md:py-36">
    <div className="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-24">
      <Reveal><div className="relative mx-auto max-w-[430px] md:mx-0"><div className="aspect-[0.8] overflow-hidden bg-[#dcd7ca]"><Image src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85" alt="Close-up of a sneaker sole and texture" fill priority sizes="(max-width: 768px) 100vw, 33vw" className="object-cover grayscale-[0.2]" /></div><p className="absolute -bottom-8 -right-4 max-w-[170px] bg-lime p-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-ink">A release desk for the pairs that stay with you.</p></div></Reveal>
      <Reveal delay={0.08}><div><p className="eyebrow flex items-center gap-3 text-rust"><span className="h-px w-8 bg-rust" />Why SneakerDrop</p><h2 className="display mt-5 max-w-[11ch] text-5xl font-bold md:text-7xl">Less noise. Better pairs.</h2><p className="mt-8 max-w-[50ch] text-lg leading-8 text-ink/65">SneakerDrop is a fictional independent release desk built for people who notice the material, the line, and the reason a shoe exists. We collect small-batch ideas, document the details, and leave the hype at the door.</p><div className="mt-10 grid max-w-[520px] grid-cols-2 gap-6 border-t border-ink/15 pt-5 sm:grid-cols-3"><div><p className="font-mono text-2xl">01</p><p className="mt-2 text-sm text-ink/55">Curated drops</p></div><div><p className="font-mono text-2xl">02</p><p className="mt-2 text-sm text-ink/55">Clear details</p></div><div><p className="font-mono text-2xl">03</p><p className="mt-2 text-sm text-ink/55">No empty hype</p></div></div></div></Reveal>
    </div>
  </section>;
}
