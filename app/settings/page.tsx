'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { useTheme } from 'next-themes';
import { Moon, Sun, Bell, PersonStanding, Gauge, Languages, Save, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMotionPrefs } from '@/components/motion-prefs';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { reduceMotion, toggle } = useMotionPrefs();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [avatar, setAvatar] = useState('Maya');
  const [speed, setSpeed] = useState('1× — natural');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-slate-50 dark:bg-navy-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <AppSidebar active="settings" />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Settings</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">Avatar personality, signing speed & access preferences.</p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <section aria-labelledby="avatar-h" className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-navy-800">
              <h2 id="avatar-h" className="flex items-center gap-2 font-extrabold"><PersonStanding className="h-5 w-5 text-teal" /> Signing avatar</h2>
              <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Choose avatar">
                {[
                  { n: 'Maya', e: '👩🏽', d: 'Warm & expressive' },
                  { n: 'Jordan', e: '🧑🏻', d: 'Calm & clear' },
                  { n: 'Alex', e: '🧑🏿', d: 'Energetic' },
                ].map((a) => (
                  <button
                    key={a.n}
                    role="radio"
                    aria-checked={avatar === a.n}
                    onClick={() => setAvatar(a.n)}
                    className={cn('rounded-2xl border-2 p-4 text-center transition hover:scale-[1.02]', avatar === a.n ? 'border-teal bg-teal/10 shadow-soft' : 'border-slate-200 dark:border-white/10')}
                  >
                    <span className="text-4xl" aria-hidden>{a.e}</span>
                    <span className="mt-2 block font-bold">{a.n}</span>
                    <span className="block text-xs text-slate-500">{a.d}</span>
                  </button>
                ))}
              </div>

              <h3 className="mt-6 flex items-center gap-2 font-extrabold"><Gauge className="h-5 w-5 text-teal" /> Default signing speed</h3>
              <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Signing speed">
                {['0.75× — clear', '1× — natural', '1.25× — brisk'].map((s) => (
                  <button
                    key={s}
                    role="radio"
                    aria-checked={speed === s}
                    onClick={() => setSpeed(s)}
                    className={cn('flex-1 rounded-2xl border-2 px-3 py-3 text-sm font-bold transition', speed === s ? 'border-indigo bg-indigo/10' : 'border-slate-200 dark:border-white/10')}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <h3 className="mt-6 flex items-center gap-2 font-extrabold"><Languages className="h-5 w-5 text-teal" /> Sign language</h3>
              <p className="mt-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/5">
                <strong>ASL</strong> active · BSL, LSQ & Auslan in beta — <span className="text-slate-500">join the waitlist from Pricing →</span>
              </p>
            </section>

            <section aria-labelledby="access-h" className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-navy-800">
              <h2 id="access-h" className="font-extrabold">Appearance & motion</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5 dark:bg-white/5">
                  <span className="flex items-center gap-2 font-bold">{mounted && theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} Dark mode</span>
                  <button role="switch" aria-checked={mounted && theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark mode" className={cn('h-8 w-14 rounded-full p-1 transition', theme === 'dark' ? 'bg-indigo' : 'bg-slate-300')}>
                    <span className={cn('block h-6 w-6 rounded-full bg-white shadow transition-all', mounted && theme === 'dark' ? 'translate-x-6' : '')} />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5 dark:bg-white/5">
                  <span className="font-bold">Reduce animations</span>
                  <button role="switch" aria-checked={reduceMotion} onClick={toggle} aria-label="Toggle reduced motion" className={cn('h-8 w-14 rounded-full p-1 transition', reduceMotion ? 'bg-teal' : 'bg-slate-300')}>
                    <span className={cn('block h-6 w-6 rounded-full bg-white shadow transition-all', reduceMotion ? 'translate-x-6' : '')} />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5 dark:bg-white/5">
                  <span className="flex items-center gap-2 font-bold"><Bell className="h-5 w-5" /> Email when ready</span>
                  <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-bold text-teal-deep dark:text-teal-bright">ON</span>
                </div>
              </div>
              <button
                onClick={save}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal py-4 font-bold text-white transition hover:shadow-glow active:scale-[0.98]"
              >
                {saved ? <CheckCircle2 className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                {saved ? 'Saved!' : 'Save preferences'}
              </button>
              <p aria-live="polite" className="mt-2 min-h-[20px] text-center text-sm text-slate-500">
                {saved ? `Avatar ${avatar} · ${speed} will be used for new conversions.` : ''}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
