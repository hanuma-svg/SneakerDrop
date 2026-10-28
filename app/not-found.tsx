import Link from 'next/link';

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-center text-paper"><div><p className="eyebrow text-lime">404 / no release found</p><h1 className="display mt-5 text-6xl font-bold">That pair moved on.</h1><p className="mx-auto mt-6 max-w-[35ch] text-paper/55">The release you are looking for is not in the current SneakerDrop catalogue.</p><Link href="/catalogue" className="mt-8 inline-flex bg-lime px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">Back to catalogue</Link></div></main>;
}
