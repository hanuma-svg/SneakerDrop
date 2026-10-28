import type { Metadata } from 'next';
import { DM_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'], display: 'swap' });

export const metadata: Metadata = {
  title: 'SneakerDrop — The next pair starts here.',
  description: 'A fictional release desk for considered sneaker culture.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${space.variable} ${mono.variable}`}>{children}</body></html>;
}
