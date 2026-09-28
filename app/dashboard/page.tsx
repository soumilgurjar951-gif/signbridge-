'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, RotateCcw, FileVideo, Sparkles, UploadCloud, Link2, ExternalLink } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { UploadZone } from '@/components/upload-zone';
import { UrlImport, type UrlSource } from '@/components/url-import';
import { PipelineStepper } from '@/components/pipeline-stepper';
import { ResultView } from '@/components/result-view';
import { cn } from '@/lib/utils';

type Phase = 'empty' | 'processing' | 'done';

const STEP_DUR = [2200, 2600, 2400, 3200, 2800];
const TOTAL = STEP_DUR.reduce((a, b) => a + b, 0);

export default function DashboardPage() {
  const [phase, setPhase] = useState<Phase>('empty');
  const [tab, setTab] = useState<'file' | 'url'>('file');
  const [fileName, setFileName] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [urlSrc, setUrlSrc] = useState<UrlSource | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => { window.clearTimeout(t); window.clearInterval(t); });
    timers.current = [];
  };

  useEffect(() => () => {
    clearTimers();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginPipeline = useCallback((displayName: string) => {
    clearTimers();
    setFileName(displayName);
    setPhase('processing');
    setActiveStep(0);
    setProgress(2);
    setEta(Math.ceil(TOTAL / 1000));

    let elapsed = 0;
    STEP_DUR.forEach((d, i) => {
      const at = elapsed;
      elapsed += d;
      const id = window.setTimeout(() => {
        setActiveStep(i);
        setProgress(Math.round((at / TOTAL) * 100));
        setEta(Math.ceil((TOTAL - at) / 1000));
      }, at);
      timers.current.push(id);
    });
    const doneId = window.setTimeout(() => {
      setActiveStep(5);
      setProgress(100);
      setPhase('done');
    }, TOTAL + 400);
    timers.current.push(doneId);

    const tick = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 99) {
          window.clearInterval(tick);
          return p;
        }
        return Math.min(99, p + Math.random() * 1.6);
      });
      setEta((e) => Math.max(0, e - 1));
    }, 900);
    timers.current.push(tick as unknown as number);
  }, []);

  const startConversion = useCallback(
    (f: File) => {
      clearTimers();
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setUrlSrc(null);
      try {
        setVideoUrl(URL.createObjectURL(f));
      } catch {
        setVideoUrl(null);
      }
      beginPipeline(f.name);
    },
    [videoUrl, beginPipeline]
  );

  const importFromUrl = useCallback(
    (src: UrlSource) => {
      clearTimers();
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
      setUrlSrc(src);
      beginPipeline(src.title);
    },
    [videoUrl, beginPipeline]
  );

  const reset = () => {
    clearTimers();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setPhase('empty');
    setProgress(0);
    setActiveStep(0);
    setFileName('');
    setVideoUrl(null);
    setUrlSrc(null);
  };

  return (
    <div className="bg-slate-50 dark:bg-navy-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <AppSidebar active="dashboard" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-teal-deep dark:text-teal-bright">Studio</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Upload & Convert</h1>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Upload a file — or paste a YouTube / Vimeo link — and get fluent ASL avatar signing.
              </p>
            </div>
            {phase !== 'empty' && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold transition hover:border-indigo dark:border-white/15 dark:bg-white/5"
              >
                <RotateCcw className="h-4 w-4" /> Start over
              </button>
            )}
          </div>

          {/* source tabs */}
          <div className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-navy-800" role="tablist" aria-label="Video source">
            {(
              [
                { id: 'file' as const, label: 'Upload file', icon: UploadCloud },
                { id: 'url' as const, label: 'Paste web link', icon: Link2 },
              ]
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-bold transition-all duration-300 sm:px-7',
                  tab === t.id
                    ? 'bg-gradient-to-r from-indigo to-[#9F1239] text-white shadow-soft'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                )}
              >
                <t.icon className="h-5 w-5" aria-hidden />
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {tab === 'file' ? (
              <UploadZone onFile={startConversion} disabled={phase === 'processing'} />
            ) : (
              <UrlImport onImport={importFromUrl} disabled={phase === 'processing'} />
            )}
          </div>

          <AnimatePresence mode="wait">
            {phase === 'empty' && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-6 grid gap-4 sm:grid-cols-3"
              >
                {[
                  ['Files or links', 'MP4, MOV, WebM uploads — or YouTube & Vimeo links.'],
                  ['Linguist reviewed', 'Gloss checked against ASL grammar rules.'],
                  ['Notify when ready', 'We email you the moment rendering finishes.'],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-navy-800">
                    <p className="flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4 text-teal" /> {t}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{d}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {phase !== 'empty' && (
              <motion.div key="work" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
                {/* preview + live card */}
                <div className="space-y-5">
                  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-navy-800">
                    <div className="flex items-center gap-2 border-b border-slate-200/70 px-5 py-3.5 text-sm font-bold dark:border-white/10">
                      <FileVideo className="h-5 w-5 shrink-0 text-indigo dark:text-teal-bright" aria-hidden />
                      <span className="truncate">{fileName || 'your-video.mp4'}</span>
                      {urlSrc && (
                        <a
                          href={urlSrc.pageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-teal/10 px-3 py-1 text-xs font-extrabold text-teal-deep dark:text-teal-bright"
                        >
                          <ExternalLink className="h-3 w-3" aria-hidden /> {urlSrc.label}
                        </a>
                      )}
                    </div>
                    <div className="relative aspect-video bg-navy-900">
                      {urlSrc?.embedUrl ? (
                        <iframe
                          src={urlSrc.embedUrl}
                          title={`Original video: ${urlSrc.title}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full"
                        />
                      ) : urlSrc?.directUrl || videoUrl ? (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video
                          src={urlSrc?.directUrl ?? videoUrl ?? undefined}
                          controls
                          className="h-full w-full object-contain"
                          aria-label="Preview of source video"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-6xl" role="img" aria-label="Video preview placeholder">🎬</div>
                      )}
                      {phase === 'processing' && (
                        <div className="pointer-events-none absolute inset-x-6 bottom-4">
                          <div className="flex h-12 items-center justify-center gap-1 rounded-2xl bg-black/55 backdrop-blur" aria-hidden>
                            {[...Array(36)].map((_, i) => (
                              <span
                                key={i}
                                style={{ height: `${18 + Math.abs(Math.sin(i * 0.7 + progress * 0.2)) * 26}px`, animationDelay: `${(i % 9) * 0.08}s` }}
                                className="eq-bar w-1 rounded-full bg-teal-bright"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.div
                    animate={phase === 'processing' ? { y: [0, -6, 0] } : { y: 0 }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-start gap-3 rounded-[1.5rem] border border-teal/25 bg-teal/[0.08] p-5"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal text-white">
                      <BellRing className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="text-[15px]">
                      {phase === 'processing' ? (
                        <>
                          <p className="font-bold">
                            {urlSrc ? `Reading your ${urlSrc.label} video` : 'Working on it'} — about {eta}s left
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">We’ll notify you when ready. You can keep this tab open or come back later.</p>
                        </>
                      ) : (
                        <>
                          <p className="font-bold">Done! Your avatar video is ready below.</p>
                          <p className="text-slate-600 dark:text-slate-300">Preview, adjust speed, download or share.</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* pipeline */}
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-navy-800">
                  <PipelineStepper
                    activeStep={activeStep}
                    progress={progress}
                    status={phase === 'done' ? 'done' : phase === 'processing' ? 'processing' : 'idle'}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === 'done' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6"
              >
                <ResultView fileName={fileName || 'your-video.mp4'} />
              </motion.div>
            )}
          </AnimatePresence>

          {phase === 'processing' && progress < 12 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3" aria-hidden>
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-24 rounded-2xl" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
