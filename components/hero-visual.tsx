'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, PersonStanding, Volume2, Captions, Sparkles, Hand } from 'lucide-react';
import { useMotionPrefs } from './motion-prefs';

/**
 * Side-by-side comparison: speaker <-> avatar, morphs every ~7s
 * Built with pure CSS/SVG so no external assets are needed.
 */
export function HeroVisual() {
  const [side, setSide] = useState<'speak' | 'sign'>('speak');
  const { reduceMotion } = useMotionPrefs();

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setSide((s) => (s === 'speak' ? 'sign' : 'speak')), 7000);
    return () => clearInterval(t);
  }, [reduceMotion]);

  return (
    <div className="relative" role="img" aria-label="Comparison of a person speaking and a 3D avatar signing the same content">
      {/* glow */}
      <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-white/30 via-teal-bright/20 to-lavender-300/30 blur-2xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/90 shadow-lift backdrop-blur dark:border-white/10 dark:bg-navy-800/90">
        {/* top bar */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal" />
          </div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo dark:bg-white/10 dark:text-white">
            <Sparkles className="h-3.5 w-3.5" /> Live conversion preview
          </p>
        </div>

        <div className="grid sm:grid-cols-2">
          {/* LEFT: speaker */}
          <div className="relative min-h-[300px] bg-gradient-to-b from-indigo/90 to-indigo-deep p-6 text-white sm:min-h-[360px]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Original • Spoken</p>
            <div className="mt-6 flex flex-col items-center">
              {/* stylized person */}
              <div className="relative">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-rose-300 text-4xl shadow-lg" aria-hidden>
                  🙂
                </div>
                <motion.span
                  aria-hidden
                  animate={reduceMotion ? {} : { scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="absolute -right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-teal"
                >
                  <Mic className="h-4 w-4 text-white" />
                </motion.span>
              </div>
              <div className="mt-4 w-28 space-y-2" aria-hidden>
                <div className="h-10 rounded-2xl bg-white/25" />
                <div className="mx-auto h-3 w-20 rounded-full bg-white/25" />
              </div>
              {/* waveform */}
              <div className="mt-5 flex h-10 items-center gap-1" aria-hidden>
                {[0.5, 0.9, 0.6, 1, 0.7, 1, 0.5, 0.8, 0.6, 0.95, 0.55, 0.75].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h * 100}%`, animationDelay: `${i * 0.09}s` }}
                    className="eq-bar w-1.5 rounded-full bg-teal-bright"
                  />
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-black/25 px-4 py-2 text-[13px] font-medium">
                <Volume2 className="h-4 w-4" /> “Welcome — every video, accessible…”
              </p>
            </div>
            {/* dim when sign active */}
            <AnimatePresence>
              {side === 'sign' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-navy-900" />
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: avatar */}
          <div className="relative min-h-[300px] bg-gradient-to-b from-teal-soft to-lavender-100 p-6 sm:min-h-[360px] dark:from-navy-700 dark:to-navy-600">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-deep dark:text-teal-bright">
              SignBridge • ASL Avatar
            </p>
            <div className="mt-6 flex flex-col items-center">
              <div className="relative">
                <motion.div
                  aria-hidden
                  animate={reduceMotion ? {} : { y: [0, -6, 0], rotate: [0, 1.2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="grid h-24 w-24 place-items-center rounded-[1.75rem] bg-gradient-to-br from-indigo to-teal-deep text-4xl text-white shadow-lg"
                >
                  <PersonStanding className="h-12 w-12" />
                </motion.div>
                {/* signing hands */}
                <motion.span
                  aria-hidden
                  animate={reduceMotion ? {} : { rotate: [0, 18, -8, 0], y: [0, -4, 2, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                  className="absolute -left-7 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-soft"
                >
                  <Hand className="h-6 w-6 text-indigo" />
                </motion.span>
                <motion.span
                  aria-hidden
                  animate={reduceMotion ? {} : { rotate: [0, -16, 10, 0], y: [0, 3, -3, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: 0.3 }}
                  className="absolute -right-7 top-10 grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-soft"
                >
                  <Hand className="h-6 w-6 -scale-x-100 text-teal-deep" />
                </motion.span>
              </div>
              {/* gloss chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-1.5" aria-hidden>
                {['HELLO', 'WELCOME', 'VIDEO', 'ACCESSIBLE'].map((w, i) => (
                  <motion.span
                    key={w}
                    initial={false}
                    animate={side === 'sign' ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.55 }}
                    transition={{ delay: i * 0.12 }}
                    className="rounded-full bg-indigo px-3 py-1 text-[11px] font-extrabold tracking-wide text-white"
                  >
                    {w}
                  </motion.span>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2 text-[13px] font-semibold text-indigo shadow-sm dark:bg-white/10 dark:text-white">
                <Captions className="h-4 w-4" /> Grammar ✓ Face ✓ Hands ✓
              </p>
            </div>
            <AnimatePresence>
              {side === 'speak' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white" />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* morph progress */}
        <div className="flex items-center justify-between border-t border-slate-200/70 px-5 py-3 dark:border-white/10">
          <div className="flex gap-2" role="tablist" aria-label="Preview toggle">
            {(['speak', 'sign'] as const).map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={side === s}
                onClick={() => setSide(s)}
                className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
                  side === s ? 'bg-indigo text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                }`}
              >
                {s === 'speak' ? '● Speaking' : '◆ Signing'}
              </button>
            ))}
          </div>
          {!reduceMotion && (
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10" aria-hidden>
              <motion.div
                key={side}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 7, ease: 'linear' }}
                className="h-full rounded-full bg-gradient-to-r from-indigo to-teal"
              />
            </div>
          )}
        </div>
      </div>

      {/* floating hand gestures */}
      {!reduceMotion && (
        <>
          <motion.span aria-hidden animate={{ y: [0, -14, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -left-5 -top-5 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-lift dark:bg-navy-700">
            <span className="text-2xl">👋</span>
          </motion.span>
          <motion.span aria-hidden animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 0.8 }} className="absolute -bottom-5 -right-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-lift dark:bg-navy-700">
            <span className="text-2xl">🤟</span>
          </motion.span>
          <motion.span aria-hidden animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 1.4 }} className="absolute -right-6 top-1/3 grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-soft dark:bg-navy-700">
            <span className="text-xl">👌</span>
          </motion.span>
        </>
      )}
    </div>
  );
}
