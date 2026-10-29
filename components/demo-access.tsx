'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const credentials = [
  { label: 'Email', value: 'sneakerdrop.demo@gmail.com' },
  { label: 'Password', value: 'SneakerDemo#2026' },
] as const;

export function DemoAccess() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyCredential(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  return (
    <aside className="mt-10 border border-lime/35 bg-lime/5 p-5 sm:p-6" aria-labelledby="recruiter-demo-title">
      <p className="eyebrow text-lime">Recruiter access</p>
      <h3 id="recruiter-demo-title" className="display mt-3 text-2xl font-bold text-paper">
        Recruiter Demo Access
      </h3>
      <p className="mt-3 text-sm leading-6 text-paper/60">
        Use the demo credentials below to explore the SneakerDrop admin dashboard.
      </p>

      <div className="mt-5 space-y-3">
        {credentials.map((credential) => {
          const isCopied = copied === credential.label;
          return (
            <div key={credential.label} className="border border-paper/15 bg-paper/[0.04] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow text-paper/45">{credential.label}</span>
                <button
                  type="button"
                  onClick={() => copyCredential(credential.label, credential.value)}
                  className="inline-flex min-h-9 items-center gap-2 border border-paper/20 px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/75 transition-colors hover:border-lime hover:text-lime focus:border-lime focus:outline-none"
                  aria-label={`Copy demo ${credential.label.toLowerCase()}`}
                >
                  {isCopied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="mt-2 block break-all text-sm text-paper">{credential.value}</code>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-paper/40">Demo access is provided for evaluation purposes.</p>
    </aside>
  );
}
