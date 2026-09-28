'use client';

import Link from 'next/link';
import { Hand, Heart, Mail, ShieldCheck, Accessibility } from 'lucide-react';

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-navy-800" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo to-teal text-white">
                <Hand className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-lg font-extrabold">SignBridge</span>
            </div>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              Made for the Deaf and hard-of-hearing community. We celebrate sign language as a rich,
              visual language — never an afterthought.
            </p>
            <div className="mt-5 flex items-center gap-1.5" aria-label="Sign language alphabet decoration">
              {ALPHABET.map((ch, i) => (
                <span
                  key={ch}
                  style={{ animationDelay: `${i * 0.35}s` }}
                  className="grid h-9 w-9 animate-float place-items-center rounded-xl bg-white text-sm font-extrabold text-indigo shadow-soft dark:bg-white/10 dark:text-teal-bright"
                >
                  {ch}
                </span>
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-[13px] font-semibold text-teal-deep dark:text-teal-bright">
              <Heart className="h-4 w-4" aria-hidden /> Built with Deaf community feedback
            </p>
          </div>

          <nav aria-label="Company">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] font-medium">
              <li><Link className="rounded hover:underline" href="/#how-it-works">About</Link></li>
              <li><Link className="rounded hover:underline" href="/pricing">Partner with us</Link></li>
              <li><Link className="rounded hover:underline" href="/dashboard">Start converting</Link></li>
              <li><Link className="rounded hover:underline" href="/history">My conversions</Link></li>
            </ul>
          </nav>

          <nav aria-label="Trust">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trust</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] font-medium">
              <li><Link className="rounded hover:underline" href="/accessibility">Accessibility Statement</Link></li>
              <li><Link className="rounded hover:underline" href="/accessibility#privacy">Privacy</Link></li>
              <li><Link className="rounded hover:underline" href="/accessibility#contact">Contact</Link></li>
              <li><Link className="rounded hover:underline" href="/accessibility#wcag">WCAG 2.1 AA</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Stay in touch</h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Accessibility updates, ASL linguistics notes, no spam.</p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo to-teal text-white transition hover:scale-105 active:scale-95"
              >
                <Mail className="h-5 w-5" aria-hidden />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-white/10"><ShieldCheck className="h-3.5 w-3.5 text-teal" /> SOC 2</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-white/10"><Accessibility className="h-3.5 w-3.5 text-teal" /> WCAG AA</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row dark:border-white/10 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SignBridge. Empowering access, with respect.</p>
          <p className="font-medium">ASL is a complete language. Captions are a floor, not a ceiling.</p>
        </div>
      </div>
    </footer>
  );
}
