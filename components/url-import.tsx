'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Loader2, AlertCircle, CheckCircle2, Play,
  ExternalLink, RotateCcw, Clapperboard, Sparkles,
} from 'lucide-react';

export interface UrlSource {
  platform: 'youtube' | 'vimeo' | 'direct';
  label: string;
  pageUrl: string;
  title: string;
  author: string;
  thumbnail: string | null;
  embedUrl: string | null;
  directUrl?: string;
}

type Props = {
  onImport: (src: UrlSource) => void;
  disabled?: boolean;
};

function parseUrl(raw: string): { platform: UrlSource['platform']; id?: string } | null {
  const url = raw.trim();
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return { platform: 'youtube', id: yt[1] };
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { platform: 'vimeo', id: vm[1] };
  if (/\.(mp4|webm|mov)(\?|#|$)/i.test(url) && /^https?:\/\//i.test(url)) return { platform: 'direct' };
  return null;
}

const PLATFORM_LABEL: Record<UrlSource['platform'], string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  direct: 'Direct video link',
};

export function UrlImport({ onImport, disabled }: Props) {
  const [value, setValue] = useState('');
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [src, setSrc] = useState<UrlSource | null>(null);

  const fetchLink = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (disabled || fetching) return;
    const raw = value.trim();
    if (!raw) {
      setError('Please paste a video link first.');
      return;
    }
    const parsed = parseUrl(raw);
    if (!parsed) {
      setError('That link isn’t supported yet. Try a YouTube, Vimeo, or direct MP4 / WebM / MOV link.');
      return;
    }
    setError(null);
    setSrc(null);
    setFetching(true);
    try {
      if (parsed.platform === 'direct') {
        const name = decodeURIComponent(raw.split('/').pop()?.split('?')[0] || 'Linked video');
        setSrc({
          platform: 'direct',
          label: PLATFORM_LABEL.direct,
          pageUrl: raw,
          title: name,
          author: new URL(raw).hostname,
          thumbnail: null,
          embedUrl: null,
          directUrl: raw,
        });
      } else if (parsed.platform === 'youtube' && parsed.id) {
        const canonical = `https://www.youtube.com/watch?v=${parsed.id}`;
        const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(canonical)}&format=json`);
        if (!res.ok) throw new Error('oembed');
        const meta = await res.json();
        setSrc({
          platform: 'youtube',
          label: 'YouTube',
          pageUrl: canonical,
          title: meta.title ?? 'YouTube video',
          author: meta.author_name ?? 'YouTube',
          thumbnail: meta.thumbnail_url ?? null,
          embedUrl: `https://www.youtube.com/embed/${parsed.id}`,
        });
      } else if (parsed.platform === 'vimeo' && parsed.id) {
        const canonical = `https://vimeo.com/${parsed.id}`;
        const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(canonical)}`);
        if (!res.ok) throw new Error('oembed');
        const meta = await res.json();
        setSrc({
          platform: 'vimeo',
          label: 'Vimeo',
          pageUrl: canonical,
          title: meta.title ?? 'Vimeo video',
          author: meta.author_name ?? 'Vimeo',
          thumbnail: meta.thumbnail_url ?? null,
          embedUrl: `https://player.vimeo.com/video/${parsed.id}`,
        });
      }
    } catch {
      setError('Couldn’t fetch that video’s details. Check the link is public and try again — or use a direct MP4 link.');
    } finally {
      setFetching(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={fetchLink}
        aria-label="Import video from link"
        className={`rounded-[1.75rem] border-2 border-dashed p-6 transition-all duration-300 sm:p-8 ${
          src
            ? 'border-teal bg-teal/[0.06]'
            : 'border-slate-300 bg-slate-50 focus-within:border-teal dark:border-white/15 dark:bg-white/[0.03]'
        } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      >
        <label htmlFor="video-url" className="flex items-center gap-2 text-base font-extrabold sm:text-lg">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo to-teal text-white shadow-soft">
            <Link2 className="h-5 w-5" aria-hidden />
          </span>
          Paste a video link from the web
        </label>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <input
            id="video-url"
            type="url"
            inputMode="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…  or  https://…/talk.mp4"
            autoComplete="off"
            spellCheck={false}
            aria-describedby="url-help"
            className="h-14 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 font-mono text-[14px] text-slate-900 dark:text-slate-100 placeholder:font-sans placeholder:text-slate-400 focus:border-teal dark:border-white/10 dark:bg-navy-900"
          />
          <button
            type="submit"
            disabled={fetching}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-indigo px-7 text-[15px] font-bold text-white shadow-soft transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {fetching ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Play className="h-5 w-5" aria-hidden />}
            {fetching ? 'Fetching…' : 'Fetch video'}
          </button>
        </div>
        <p id="url-help" className="mt-3 text-[13px] text-slate-500 dark:text-slate-400">
          Works with <strong>YouTube</strong>, <strong>Vimeo</strong> and direct <strong>MP4 / WebM / MOV</strong> links.
          Links are previewed via official embeds — full YouTube ingestion respects YouTube’s Terms of Service.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
          {['YouTube incl. Shorts', 'Vimeo', 'Direct MP4 links'].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal" aria-hidden /> {t}
            </span>
          ))}
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.p
            key="url-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-3 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="h-5 w-5 shrink-0" /> {error}
          </motion.p>
        )}

        {fetching && (
          <motion.div key="url-skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 flex gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-navy-800" aria-hidden>
            <div className="skeleton h-24 w-40 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2 py-1">
              <div className="skeleton h-5 w-3/4 rounded-lg" />
              <div className="skeleton h-4 w-1/3 rounded-lg" />
              <div className="skeleton h-10 w-44 rounded-xl" />
            </div>
          </motion.div>
        )}

        {src && !fetching && (
          <motion.div
            key="url-src"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 overflow-hidden rounded-[1.5rem] border border-teal/30 bg-white shadow-card dark:border-teal/30 dark:bg-navy-800"
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row">
              <div className="relative w-full shrink-0 overflow-hidden rounded-2xl bg-navy-900 sm:w-52">
                {src.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src.thumbnail} alt="" className="aspect-video h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="grid aspect-video place-items-center text-4xl" role="img" aria-label="Linked video">
                    <Clapperboard className="h-10 w-10 text-white/70" aria-hidden />
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
                  {src.label}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[16px] font-extrabold" title={src.title}>{src.title}</h3>
                <p className="mt-0.5 truncate text-[13px] text-slate-500 dark:text-slate-400">by {src.author}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-teal" aria-hidden />
                  We’ll read this video’s audio and sign it with our ASL avatar.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => onImport(src)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-teal px-5 py-3.5 text-sm font-bold text-white shadow-soft transition hover:scale-[1.02] hover:shadow-glow active:scale-95 sm:flex-none sm:px-7"
                  >
                    <Play className="h-4 w-4" aria-hidden /> Convert to sign language
                  </button>
                  <a
                    href={src.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-bold transition hover:border-teal dark:border-white/15"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden /> Original
                  </a>
                  <button
                    onClick={() => { setSrc(null); setValue(''); }}
                    aria-label="Use a different link"
                    className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-transparent px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden /> New link
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
