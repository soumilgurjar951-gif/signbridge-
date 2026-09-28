'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Menu, Moon, Sun, X, Upload, LayoutDashboard, History, CreditCard, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useMotionPrefs } from './motion-prefs';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/history', label: 'My Conversions' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { reduceMotion, toggle } = useMotionPrefs();

  useEffect(() => setMounted(true), []);

  const isApp = pathname?.startsWith('/dashboard') || pathname?.startsWith('/history');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-navy-900/80">
      <nav aria-label="Primary" className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 rounded-xl" aria-label="SignBridge home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo to-teal text-white shadow-soft">
            <Hand className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[19px] font-extrabold tracking-tight">SignBridge</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal-deep dark:text-teal-bright">
              ASL • Accessible
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex" role="menubar">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-[15px] font-semibold transition-all duration-300',
                  active
                    ? 'bg-indigo/10 text-indigo dark:bg-white/10 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggle}
            title={reduceMotion ? 'Enable animations' : 'Reduce animations'}
            aria-pressed={reduceMotion}
            aria-label="Toggle reduced motion"
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:scale-105 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <span aria-hidden className="text-sm font-bold">{reduceMotion ? '▶' : '❚❚'}</span>
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:scale-105 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {!mounted ? <Sun className="h-5 w-5" /> : theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-teal px-5 py-3 text-[15px] font-bold text-white shadow-soft transition-all duration-300 hover:scale-[1.03] hover:shadow-glow active:scale-95"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Upload Video
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle color theme"
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-white/10"
          >
            {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-xl bg-indigo text-white"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden border-t border-slate-200/70 md:hidden dark:border-white/10"
          >
            <div className="space-y-1 px-4 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-semibold',
                    pathname === l.href
                      ? 'bg-indigo text-white'
                      : 'bg-slate-50 text-slate-700 dark:bg-white/5 dark:text-slate-200'
                  )}
                >
                  {l.label === 'Dashboard' && <LayoutDashboard className="h-5 w-5" />}
                  {l.label === 'My Conversions' && <History className="h-5 w-5" />}
                  {l.label === 'Pricing' && <CreditCard className="h-5 w-5" />}
                  {l.label === 'Home' && <Hand className="h-5 w-5" />}
                  {l.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-teal px-4 py-4 text-base font-bold text-white"
              >
                <Upload className="h-5 w-5" /> Upload Video & Convert
              </Link>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/5">
                <span>Reduce animations</span>
                <button
                  role="switch"
                  aria-checked={reduceMotion}
                  onClick={toggle}
                  className={cn('h-8 w-14 rounded-full p-1 transition', reduceMotion ? 'bg-teal' : 'bg-slate-300')}
                >
                  <span className={cn('block h-6 w-6 rounded-full bg-white shadow transition-all', reduceMotion ? 'translate-x-6' : 'translate-x-0')} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isApp && (
        <div className="border-t border-slate-200/60 bg-slate-50/80 md:hidden dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2" role="tablist" aria-label="App sections">
            {[
              { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { href: '/history', label: 'My Conversions', icon: History },
              { href: '/pricing', label: 'Plans', icon: CreditCard },
              { href: '/settings', label: 'Settings', icon: Settings },
            ].map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  role="tab"
                  aria-selected={active}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                    active ? 'bg-indigo text-white' : 'text-slate-600 dark:text-slate-300'
                  )}
                >
                  <t.icon className="h-4 w-4" /> {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
