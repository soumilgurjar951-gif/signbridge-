'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Download, Share2, Star, RotateCcw, Search, LayoutGrid, List, Eye } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { MOCK_CONVERSIONS, type ConversionStatus } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useFeedback } from '@/components/feedback-modal';

function StatusBadge({ status, progress }: { status: ConversionStatus; progress?: number }) {
  if (status === 'ready')
    return <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-extrabold text-teal-deep dark:text-teal-bright">● READY</span>;
  if (status === 'processing')
    return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">◐ {progress ?? 0}% PROCESSING</span>;
  return <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">● NEEDS RETRY</span>;
}

function Thumb({ hue, title }: { hue: number; title: string }) {
  return (
    <div
      className="relative aspect-video overflow-hidden rounded-2xl"
      style={{ background: 'linear-gradient(135deg, #2a1218 0%, #9f1239 100%)' }}
      role="img"
      aria-label={`Avatar thumbnail for ${title}`}
    >
      <div aria-hidden className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_25%,white,transparent_45%)]" />
      <div className="absolute inset-0 grid place-items-center text-5xl" aria-hidden>🧑‍🦰</div>
      <div className="absolute bottom-2 right-2 flex gap-1.5" aria-hidden>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/90 text-lg shadow">🤟</span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/90 text-lg shadow">👋</span>
      </div>
      <span className="absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur">
        <Play className="h-4 w-4" aria-hidden />
      </span>
    </div>
  );
}

export default function HistoryPage() {
  const [q, setQ] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | ConversionStatus>('all');
  const { open } = useFeedback();

  const items = MOCK_CONVERSIONS.filter(
    (c) =>
      (filter === 'all' || c.status === filter) &&
      c.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-navy-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <AppSidebar active="history" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-teal-deep dark:text-teal-bright">Library</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">My Conversions</h1>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{MOCK_CONVERSIONS.length} videos · 5.2 GB · all captioned + signed</p>
            </div>
            <Link href="/dashboard" className="rounded-2xl bg-teal px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:scale-[1.03]">
              + New conversion
            </Link>
          </div>

          {/* toolbar */}
          <div className="mt-6 flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-white/10 dark:bg-navy-800">
            <label className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
              <span className="sr-only">Search conversions</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, e.g. keynote…"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-[15px] text-slate-900 dark:text-slate-100 dark:border-white/10 dark:bg-white/5"
              />
            </label>
            <div className="flex gap-2" role="tablist" aria-label="Filter by status">
              {(['all', 'ready', 'processing', 'failed'] as const).map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-xl px-4 py-2.5 text-sm font-bold capitalize transition',
                    filter === f ? 'bg-indigo text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/10" role="group" aria-label="View mode">
              <button onClick={() => setView('grid')} aria-pressed={view === 'grid'} aria-label="Grid view" className={cn('grid h-10 w-10 place-items-center rounded-lg', view === 'grid' && 'bg-white shadow dark:bg-navy-700')}>
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button onClick={() => setView('list')} aria-pressed={view === 'list'} aria-label="List view" className={cn('grid h-10 w-10 place-items-center rounded-lg', view === 'list' && 'bg-white shadow dark:bg-navy-700')}>
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {items.length === 0 && (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 p-12 text-center dark:border-white/15">
              <p className="text-lg font-bold">No conversions match “{q}”</p>
              <p className="mt-1 text-slate-500">Try a different search or filter.</p>
            </div>
          )}

          <div className={view === 'grid' ? 'mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'mt-6 space-y-4'}>
            {items.map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.45 }}
                whileHover={{ y: -5 }}
                className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-soft transition-shadow hover:shadow-lift dark:border-white/10 dark:bg-navy-800"
              >
                <div className="p-3 pb-0"><Thumb hue={c.thumbnailHue} title={c.title} /></div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-[16px] font-extrabold leading-snug">{c.title}</h2>
                  </div>
                  <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                    {c.duration} · {c.createdAt} {c.views > 0 && <>· <Eye className="inline h-3.5 w-3.5" /> {c.views}</>}
                  </p>
                  <div className="mt-2.5"><StatusBadge status={c.status} progress={c.progress} /></div>
                  {c.status === 'processing' && (
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10" role="progressbar" aria-valuenow={c.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Processing ${c.title}`}>
                      <div className="skeleton h-full rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  )}
                  <p className="mt-3 line-clamp-2 rounded-xl bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600 dark:bg-white/5 dark:text-slate-300" title={c.gloss}>
                    {c.gloss}
                  </p>
                  <div className="mt-4 flex gap-1.5">
                    {c.status === 'ready' && (
                      <>
                        <button aria-label={`Play ${c.title}`} className="grid h-11 flex-1 place-items-center rounded-xl bg-indigo text-white transition hover:scale-[1.03] active:scale-95"><Play className="h-5 w-5" /></button>
                        <button aria-label={`Download ${c.title}`} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 transition hover:border-teal dark:border-white/15"><Download className="h-5 w-5" /></button>
                        <button aria-label={`Share ${c.title}`} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 transition hover:border-teal dark:border-white/15"><Share2 className="h-5 w-5" /></button>
                        <button onClick={() => open(`“${c.title}” — avatar quality`)} aria-label={`Rate ${c.title}`} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 transition hover:border-amber-400 dark:border-white/15"><Star className="h-5 w-5 text-amber-400" /></button>
                      </>
                    )}
                    {c.status === 'failed' && (
                      <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 text-sm font-bold text-white">
                        <RotateCcw className="h-4 w-4" /> Retry conversion
                      </button>
                    )}
                    {c.status === 'processing' && (
                      <Link href="/dashboard" className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold dark:bg-white/10">
                        View live progress →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
