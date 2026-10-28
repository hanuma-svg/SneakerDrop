'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/#story', label: 'Story' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-40 px-5 py-5 text-paper md:px-10 md:py-7">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-2" aria-label="SneakerDrop home" onClick={() => setOpen(false)}>
          <span className="flex h-7 w-7 items-center justify-center bg-lime font-mono text-[11px] font-medium text-ink transition-transform group-hover:rotate-6">{'//'}</span>
          <span className="text-[15px] font-bold uppercase tracking-[0.12em]">SneakerDrop</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className="eyebrow text-paper/70 transition-colors hover:text-lime">{link.label}</Link>)}
          <Link href="/admin/login" className="eyebrow border border-paper/30 px-4 py-3 text-paper transition-colors hover:border-lime hover:text-lime">Admin access</Link>
        </nav>
        <button type="button" className="flex h-11 w-11 items-center justify-center border border-paper/30 md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && <div id="mobile-nav" className="mx-auto mt-4 max-w-[1380px] border border-paper/20 bg-ink/95 p-5 backdrop-blur md:hidden">
        <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className="eyebrow text-paper/80" onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link href="/admin/login" className="eyebrow text-lime" onClick={() => setOpen(false)}>Admin access →</Link>
        </nav>
      </div>}
    </header>
  );
}
