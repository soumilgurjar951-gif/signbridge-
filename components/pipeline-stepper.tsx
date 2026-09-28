'use client';

import { motion } from 'framer-motion';
import { Check, Loader2, AudioLines, Captions, Languages, PersonStanding, Clapperboard } from 'lucide-react';
import { PIPELINE_STEPS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const ICONS: Record<string, typeof AudioLines> = {
  audio: AudioLines,
  text: Captions,
  lang: Languages,
  avatar: PersonStanding,
  video: Clapperboard,
};

export function PipelineStepper({
  activeStep,
  progress,
  status,
}: {
  activeStep: number; // 0..5, 5 = done
  progress: number; // 0..100 overall
  status: 'idle' | 'processing' | 'done';
}) {
  return (
    <div aria-label="Conversion progress" role="status">
      <div className="mb-3 flex items-center justify-between text-sm">
        <p className="font-bold">
          {status === 'done' ? 'Conversion complete' : status === 'processing' ? `Step ${Math.min(activeStep + 1, 5)} of 5 in progress…` : 'Ready when you are'}
        </p>
        <p className="font-extrabold tabular-nums text-teal-deep dark:text-teal-bright" aria-live="polite">
          {Math.round(progress)}%
        </p>
      </div>

      {/* overall bar */}
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Overall conversion progress">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo via-teal to-teal-bright"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.6 }}
        />
      </div>

      <ol className="mt-6 space-y-1">
        {PIPELINE_STEPS.map((s, i) => {
          const Icon = ICONS[s.icon] ?? AudioLines;
          const done = status === 'done' || i < activeStep;
          const active = status === 'processing' && i === activeStep;
          return (
            <li key={s.id} className="relative flex gap-4 pb-5 last:pb-0">
              {/* connector */}
              {i < PIPELINE_STEPS.length - 1 && (
                <span aria-hidden className="absolute left-[22px] top-[48px] h-[calc(100%-44px)] w-[3px] overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  {done && <span className="block h-full w-full bg-teal" />}
                  {active && (
                    <svg className="h-full w-full" preserveAspectRatio="none">
                      <line x1="1.5" y1="0" x2="1.5" y2="100" stroke="#F43F5E" strokeWidth="3" className="trail-line" />
                    </svg>
                  )}
                </span>
              )}
              <span
                className={cn(
                  'grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-2 transition-all duration-500',
                  done
                    ? 'border-teal bg-teal text-white shadow-soft'
                    : active
                      ? 'border-teal bg-white text-teal-deep shadow-glow dark:bg-navy-700 dark:text-teal-bright'
                      : 'border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-white/5'
                )}
              >
                {done ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                    <Check className="h-5 w-5" strokeWidth={3} aria-hidden />
                  </motion.span>
                ) : active ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                ) : (
                  <Icon className="h-5 w-5" aria-hidden />
                )}
              </span>
              <div className={cn('min-w-0 flex-1 rounded-2xl px-3 py-1 transition', active && 'bg-teal/10')}>
                <p className={cn('text-[15px] font-bold', done || active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400')}>
                  {i + 1}. {s.label}
                  {active && <span className="ml-2 animate-pulse text-teal-deep dark:text-teal-bright">● working</span>}
                </p>
                <p className="truncate text-[13px] text-slate-500 dark:text-slate-400">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
