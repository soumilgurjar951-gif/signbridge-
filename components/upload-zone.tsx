'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, FileVideo, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

type Props = {
  onFile: (f: File) => void;
  disabled?: boolean;
};

const ACCEPT = '.mp4,.mov,.webm,video/mp4,video/quicktime,video/webm';

export function UploadZone({ onFile, disabled }: Props) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (f: File): string | null => {
    const okTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'];
    const okExt = /\.(mp4|mov|webm)$/i.test(f.name);
    if (!okTypes.includes(f.type) && !okExt) return 'Please upload an MP4, MOV or WebM video.';
    if (f.size > 1024 * 1024 * 1024) return 'File is over 1 GB. Please use a shorter clip for the demo.';
    return null;
  };

  const handle = useCallback(
    (f: File | undefined) => {
      if (!f || disabled) return;
      const err = validate(f);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setPicked(f);
      onFile(f);
    },
    [disabled, onFile]
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload video. Drag and drop or press Enter to browse. Accepts MP4, MOV, WebM."
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files?.[0]);
        }}
        className={`group relative cursor-pointer overflow-hidden rounded-[1.75rem] border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-12 ${
          drag
            ? 'scale-[1.01] border-teal bg-teal/10 shadow-glow'
            : 'border-slate-300 bg-slate-50 hover:border-teal hover:bg-teal/[0.06] dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-teal-bright'
        } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      >
        {/* animated dashed shimmer on hover */}
        <div aria-hidden className={`dashed-pulse absolute inset-3 rounded-[1.4rem] opacity-0 transition-opacity duration-300 ${drag ? 'opacity-100' : 'group-hover:opacity-60'}`} />

        <input
          ref={inputRef}
          type="file"
          onClick={(e) => e.stopPropagation()}
          accept={ACCEPT}
          className="sr-only"
          aria-hidden={false}
          tabIndex={-1}
          onChange={(e) => handle(e.target.files?.[0])}
        />

        <motion.div animate={drag ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }} className="relative">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-[1.5rem] bg-gradient-to-br from-indigo to-teal text-white shadow-soft">
            <CloudUpload className="h-10 w-10" aria-hidden />
          </span>
          <h3 className="mt-5 text-xl font-extrabold sm:text-2xl">
            {drag ? 'Drop it — we’ve got you' : 'Drag & drop your video here'}
          </h3>
          <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
            or <span className="font-bold text-teal-deep underline underline-offset-4 dark:text-teal-bright">browse files</span> · MP4, MOV, WebM up to 1 GB
          </p>
          <div className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-2 text-xs font-bold">
            {['No credit card', 'Free preview', 'Captions included'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal" aria-hidden /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-3 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="h-5 w-5 shrink-0" /> {error}
          </motion.p>
        )}
        {picked && !error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-3 rounded-2xl border border-teal/30 bg-teal/10 px-4 py-3"
          >
            <FileVideo className="h-8 w-8 shrink-0 text-teal-deep dark:text-teal-bright" aria-hidden />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-bold">{picked.name}</p>
              <p className="text-xs text-slate-500">{formatBytes(picked.size)} · ready to convert</p>
            </div>
            <button
              onClick={() => setPicked(null)}
              aria-label="Remove selected file"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 hover:bg-white dark:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
