'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Download, Share2, Star, PictureInPicture2, Gauge, Captions,
  CheckCircle2, Languages, Copy, BellRing, Loader2,
} from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import { SAMPLE_GLOSS_FULL, SAMPLE_TRANSCRIPT_FULL } from '@/lib/mock-data';
import { useFeedback } from './feedback-modal';
import dynamic from 'next/dynamic';
import { SigningAvatar } from './signing-avatar';

const HumanAvatar = dynamic(() => import('./human-avatar').then((m) => m.HumanAvatar), { ssr: false });

function ConfettiHands() {
  const pieces = useMemo(
    () =>
      [...Array(26)].map((_, i) => ({
        id: i,
        x: (i * 53) % 320 - 160,
        delay: (i % 7) * 0.06,
        emoji: ['🤟', '👋', '👌', '✨', '💙', '🫶'][i % 6],
        size: 18 + ((i * 7) % 14),
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.5, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: p.x, y: [-10, -90 - (p.id % 5) * 18], scale: 1, rotate: (p.id % 2 ? 24 : -24) }}
          transition={{ duration: 1.8, delay: p.delay, ease: 'easeOut' }}
          style={{ fontSize: p.size, left: '50%', top: '38%', position: 'absolute' }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

const loadImg = (url: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });

export function ResultView({ fileName }: { fileName: string }) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [t, setT] = useState(0);
  const [showGloss, setShowGloss] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
const [avatarMode, setAvatarMode] = useState<'vector' | 'human'>('human');
const [modelUrl, setModelUrl] = useState('/models/Xbot.glb');
const [urlDraft, setUrlDraft] = useState('');
const [showModelForm, setShowModelForm] = useState(false);
const [modelFormError, setModelFormError] = useState<string | null>(null);
const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
const humanCanvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  try {
    const m = localStorage.getItem('sb-avatar-mode');
    if (m === 'vector' || m === 'human') setAvatarMode(m);
    const u = localStorage.getItem('sb-avatar-model');
    if (u) {
      setModelUrl(u);
      setUrlDraft(u);
    }
  } catch { /* private mode */ }
}, []);

const pickAvatarMode = (m: 'vector' | 'human') => {
  setAvatarMode(m);
  try {
    localStorage.setItem('sb-avatar-mode', m);
  } catch { /* ignore */ }
  if (m === 'human') setModelStatus((s) => (s === 'error' ? 'loading' : s));
};

const applyModel = (e?: React.FormEvent) => {
  e?.preventDefault();
  const u = urlDraft.trim();
  if (!/^https?:\/\/.+\.glb(\?.*)?$/i.test(u)) {
    setModelFormError('Paste a direct https link ending in .glb (Ready Player Me gives links like models.readyplayer.me/….glb).');
    return;
  }
  setModelFormError(null);
  setModelUrl(u);
  setModelStatus('loading');
  try {
    localStorage.setItem('sb-avatar-model', u);
  } catch { /* ignore */ }
  setShowModelForm(false);
};

const resetModel = () => {
  setModelUrl('/models/Xbot.glb');
  setUrlDraft('');
  setModelFormError(null);
  setModelStatus('loading');
  try {
    localStorage.removeItem('sb-avatar-model');
  } catch { /* ignore */ }
};
  const [shared, setShared] = useState(false);
  const [recording, setRecording] = useState(false);
  const [etaDone, setEtaDone] = useState(false);
  const { open } = useFeedback();
  const avatarSvgRef = useRef<SVGSVGElement>(null);
  const DUR = 134;
  const raf = useRef<number | null>(null);

  useEffect(() => {
    setEtaDone(true);
    const tm = setTimeout(() => setEtaDone(false), 6000);
    return () => clearTimeout(tm);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((v) => (v + dt * speed >= DUR ? 0 : v + dt * speed));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, speed]);

  const glossWords = SAMPLE_GLOSS_FULL.replace(/\n/g, ' ').split(' ');
  const activeWord = Math.floor((t / DUR) * glossWords.length);

  const downloadGlossFallback = () => {
    const blob = new Blob(
      [`SignBridge ASL export\nSource: ${fileName}\n\nTRANSCRIPT:\n${SAMPLE_TRANSCRIPT_FULL}\n\nGLOSS:\n${SAMPLE_GLOSS_FULL}\n`],
      { type: 'text/plain' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'signbridge-asl-gloss.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  /** Records 8 seconds of the live avatar performance into a real .webm video file. */
  const recordHuman = async () => {
    const canvas = humanCanvasRef.current;
    if (!canvas || typeof MediaRecorder === 'undefined') {
      downloadGlossFallback();
      return;
    }
    setRecording(true);
    const wasPlaying = playing;
    try {
      const stream = canvas.captureStream(30);
      const mime = ['video/webm;codecs=vp9', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      const stopped = new Promise<void>((res) => {
        rec.onstop = () => res();
      });
      rec.start();
      if (!wasPlaying) setPlaying(true);
      await new Promise((r) => setTimeout(r, 8000));
      rec.stop();
      await stopped;
      if (!wasPlaying) setPlaying(false);
      const out = new Blob(chunks, { type: 'video/webm' });
      if (!out.size) throw new Error('empty');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(out);
      a.download = 'signbridge-3d-human-signing.webm';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } catch {
      downloadGlossFallback();
    } finally {
      setRecording(false);
    }
  };

  const recordClip = async () => {
    if (recording) return;
    if (avatarMode === 'human') {
      await recordHuman();
      return;
    }
    const svg = avatarSvgRef.current;
    if (!svg) {
      downloadGlossFallback();
      return;
    }
    if (typeof MediaRecorder === 'undefined') {
      downloadGlossFallback();
      return;
    }
    setRecording(true);
    const wasPlaying = playing;
    try {
      const W = 640, H = 360, FPS = 30, SEC = 8;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no-2d');
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#2A1218');
      bg.addColorStop(1, '#881337');

      const stream = canvas.captureStream(FPS);
      const mime =
        ['video/webm;codecs=vp9', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      const stopped = new Promise<void>((res) => {
        rec.onstop = () => res();
      });
      rec.start();
      if (!wasPlaying) setPlaying(true);

      for (let i = 0; i < FPS * SEC; i++) {
        const xml = new XMLSerializer().serializeToString(svg);
        const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
        try {
          const img = await loadImg(url);
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, W, H);
          ctx.drawImage(img, 0, 0, W, H);
        } finally {
          URL.revokeObjectURL(url);
        }
        await new Promise((r) => setTimeout(r, 1000 / FPS));
      }
      rec.stop();
      await stopped;
      if (!wasPlaying) setPlaying(false);

      const out = new Blob(chunks, { type: 'video/webm' });
      if (!out.size) throw new Error('empty');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(out);
      a.download = 'signbridge-asl-signing.webm';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } catch {
      downloadGlossFallback();
    } finally {
      setRecording(false);
    }
  };

  const share = async () => {
    const link = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'SignBridge signed video', text: fileName, url: link });
      } else {
        await navigator.clipboard.writeText(link);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* user cancelled share sheet — nothing to do */
    }
  };

  return (
    <section aria-labelledby="result-title" className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-navy-800">
      {etaDone && <ConfettiHands />}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal text-white">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 id="result-title" className="font-extrabold leading-tight">Your signed video is ready</h3>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400" title={fileName}>{fileName} → ASL • 1080p</p>
          </div>
        </div>
        <span className="rounded-full bg-teal/15 px-3 py-1.5 text-xs font-extrabold text-teal-deep dark:text-teal-bright">● READY</span>
      </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/70 px-5 py-3 dark:border-white/10">
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-white/10" role="group" aria-label="Avatar style">
          {(['vector', 'human'] as const).map((m) => (
            <button
              key={m}
              onClick={() => pickAvatarMode(m)}
              aria-pressed={avatarMode === m}
              className={cn(
                'rounded-lg px-4 py-2 text-[13px] font-extrabold transition',
                avatarMode === m ? 'bg-white text-indigo shadow dark:bg-navy-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {m === 'vector' ? 'Vector' : '3D Human'}
            </button>
          ))}
        </div>
        {avatarMode === 'human' && (
          <>
            <span className="hidden max-w-[220px] truncate text-xs text-slate-500 sm:block dark:text-slate-400" title={modelUrl}>
              {modelUrl.startsWith('/models/') ? 'Built-in realistic human' : 'Custom avatar'}
            </span>
            <button
              onClick={() => setShowModelForm((v) => !v)}
              aria-expanded={showModelForm}
              className="ml-auto text-xs font-bold text-indigo underline underline-offset-4 dark:text-teal-bright"
            >
              {showModelForm ? 'Close' : 'Use my own face / avatar'}
            </button>
          </>
        )}
      </div>
      {avatarMode === 'human' && showModelForm && (
        <form onSubmit={applyModel} className="border-b border-slate-200/70 px-5 py-3 dark:border-white/10">
          <label htmlFor="rpm-url" className="text-xs font-bold">
            Apna Ready Player Me avatar link paste karo 
            <span className="font-normal text-slate-500">(readyplayer.me par free me selfie se banao)</span>
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="rpm-url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://models.readyplayer.me/abc123.glb"
              inputMode="url"
              spellCheck={false}
              className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-mono text-[13px] text-slate-900 placeholder:font-sans placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
            />
            <div className="flex gap-2">
              <button type="submit" className="h-12 rounded-2xl bg-indigo px-5 text-sm font-bold text-white transition hover:scale-[1.02] active:scale-95">
                Use avatar
              </button>
              <button type="button" onClick={resetModel} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold dark:border-white/15">
                Reset
              </button>
            </div>
          </div>
          {modelFormError && (
            <p role="alert" className="mt-2 text-xs font-semibold text-rose-500">
              {modelFormError}
            </p>
          )}
        </form>
      )}
      <div className="grid gap-5 p-5 lg:grid-cols-[1.5fr_1fr]">
        {/* player */}
        <div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 via-indigo-deep to-teal-deep">
            {/* avatar stage — live animated signer */}
            <div className="relative aspect-video">
              <div aria-hidden className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,#FDA4AF,transparent_45%),radial-gradient(circle_at_75%_70%,#FB7185,transparent_45%)]" />
              {avatarMode === 'human' ? (
                <HumanAvatar
                  ref={humanCanvasRef}
                  playing={playing}
                  beat={activeWord}
                  modelUrl={modelUrl}
                  onReady={() => setModelStatus('ready')}
                  onError={() => setModelStatus('error')}
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <SigningAvatar ref={avatarSvgRef} playing={playing} beat={activeWord} className="absolute inset-0 h-full w-full" />
              )}
              {avatarMode === 'human' && modelStatus !== 'ready' && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="flex items-center gap-2 rounded-2xl bg-black/55 px-4 py-3 text-sm font-bold text-white backdrop-blur">
                    {modelStatus === 'loading' ? (
                      <><Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Loading 3D human…</>
                    ) : (
                      <span>Couldn’t load that 3D model — check the link.</span>
                    )}
                  </div>
                </div>
              )}
              {showOriginal && (
              <div className="absolute bottom-3 left-3 w-32 overflow-hidden rounded-xl border-2 border-white/60 bg-navy-900 shadow-lg sm:w-40">
                <div className="grid aspect-video place-items-center text-3xl" role="img" aria-label="Original video thumbnail">🙂</div>
                <p className="bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Original • {formatTime(t)}</p>
              </div>
              )}
              <div className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {speed}× speed
              </div>
              {showCaptions && (
              <div className="absolute inset-x-3 bottom-3 flex justify-center">
                <p aria-live="polite" className="rounded-xl bg-black/65 px-4 py-2 text-center text-[13px] font-semibold text-white backdrop-blur">
                  {glossWords.slice(Math.max(0, activeWord - 2), activeWord + 3).join(' ') || 'HELLO WELCOME'}
                </p>
              </div>
              )}
            </div>
            {/* transport */}
            <div className="border-t border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
              <div
                className="h-2 cursor-pointer rounded-full bg-white/20"
                role="slider"
                aria-label="Seek signed video"
                aria-valuemin={0}
                aria-valuemax={DUR}
                aria-valuenow={Math.round(t)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') setT((v) => Math.min(DUR, v + 5));
                  if (e.key === 'ArrowLeft') setT((v) => Math.max(0, v - 5));
                }}
                onClick={(e) => {
                  const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setT(DUR * ((e.clientX - r.left) / r.width));
                }}
              >
                <div className="h-full rounded-full bg-gradient-to-r from-teal-bright to-amber-200" style={{ width: `${(t / DUR) * 100}%` }} />
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? 'Pause signed video' : 'Play signed video'}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-white text-navy-900 transition hover:scale-105 active:scale-95"
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <span className="text-xs font-bold tabular-nums text-white/90">{formatTime(t)} / {formatTime(DUR)}</span>
                <div className="flex gap-1.5" role="group" aria-label="Display options">
                  <button
                    onClick={() => setShowOriginal((v) => !v)}
                    aria-pressed={showOriginal}
                    aria-label={showOriginal ? 'Hide original video thumbnail' : 'Show original video thumbnail'}
                    title={showOriginal ? 'Hide original' : 'Show original'}
                    className={cn('grid h-9 w-9 place-items-center rounded-xl transition', showOriginal ? 'bg-teal text-white' : 'bg-white/15 text-white/70 hover:bg-white/25')}
                  >
                    <PictureInPicture2 className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    onClick={() => setShowCaptions((v) => !v)}
                    aria-pressed={showCaptions}
                    aria-label={showCaptions ? 'Hide captions' : 'Show captions'}
                    title={showCaptions ? 'Hide captions' : 'Show captions'}
                    className={cn('grid h-9 w-9 place-items-center rounded-xl transition', showCaptions ? 'bg-teal text-white' : 'bg-white/15 text-white/70 hover:bg-white/25')}
                  >
                    <Captions className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <div className="ml-auto flex flex-wrap gap-2">
                  {[0.75, 1, 1.25].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      aria-pressed={speed === s}
                      className={cn('rounded-xl px-3 py-2 text-xs font-extrabold transition', speed === s ? 'bg-teal text-white' : 'bg-white/15 text-white hover:bg-white/25')}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              onClick={recordClip}
              disabled={recording}
              title="Record an 8-second clip of the avatar signing (.webm video)"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo px-4 py-3.5 text-sm font-bold text-white transition hover:scale-[1.02] active:scale-95 disabled:opacity-70"
            >
              {recording ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
              {recording ? 'Saving…' : 'MP4'}
            </button>
            <button
              onClick={share}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-bold transition hover:border-teal dark:border-white/15"
            >
              {shared ? <CheckCircle2 className="h-4 w-4 text-teal" /> : <Share2 className="h-4 w-4" />}
              {shared ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={() => open('“' + fileName + '” — avatar quality')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-bold transition hover:border-amber-400 dark:border-white/15"
            >
              <Star className="h-4 w-4 text-amber-400" /> Rate
            </button>
            <button
              onClick={() => setShowGloss((v) => !v)}
              aria-pressed={showGloss}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-bold transition hover:border-teal dark:border-white/15"
            >
              <Languages className="h-4 w-4" /> Gloss
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            MP4 button records an 8-second clip of the active avatar (Vector or 3D Human) as a playable video file.
          </p>
        </div>

        {/* side panel */}
        <aside className="flex flex-col gap-4" aria-label="Transcript and gloss">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <h4 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Captions className="h-4 w-4" /> Transcript
            </h4>
            <p className="mt-2 text-[14px] leading-relaxed">{SAMPLE_TRANSCRIPT_FULL}</p>
          </div>
          <AnimatePresence initial={false}>
            {showGloss && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-indigo/20 bg-indigo/[0.06] dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="p-4">
                  <h4 className="flex items-center justify-between text-sm font-extrabold uppercase tracking-wider text-indigo dark:text-teal-bright">
                    <span className="flex items-center gap-2"><Languages className="h-4 w-4" /> ASL Gloss preview</span>
                    <button
                      onClick={() => navigator.clipboard?.writeText(SAMPLE_GLOSS_FULL).catch(() => {})}
                      className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-indigo shadow-sm dark:bg-white/10 dark:text-white"
                      aria-label="Copy gloss to clipboard"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </h4>
                  <p className="mt-2 flex flex-wrap gap-1.5" aria-live="polite">
                    {glossWords.map((w, i) => (
                      <span
                        key={i}
                        className={cn(
                          'rounded-lg px-2 py-1 font-mono text-[13px] font-bold transition-all',
                          i === activeWord
                            ? 'bg-teal text-white shadow'
                            : i < activeWord
                              ? 'bg-teal/15 text-teal-deep dark:text-teal-bright'
                              : 'bg-white text-slate-600 dark:bg-white/10 dark:text-slate-300'
                        )}
                      >
                        {w}
                      </span>
                    ))}
                  </p>
                  <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    <Gauge className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Gloss is the intermediate linguistic representation. Word order differs from English on purpose — that’s ASL grammar.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="rounded-2xl bg-gradient-to-br from-indigo to-teal-deep p-4 text-sm text-white">
            <p className="flex items-center gap-2 font-bold"><BellRing className="h-4 w-4" /> We’ll notify you when ready</p>
            <p className="mt-1 text-white/80">Long videos render in the background. We email + notify in-app the moment your avatar is done.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
