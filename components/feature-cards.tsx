'use client';

import { motion } from 'framer-motion';
import { UploadCloud, AudioWaveform, PersonStanding, Download, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: UploadCloud,
    step: '01',
    title: 'Upload',
    desc: 'Drop any MP4, MOV or WebM — or paste a YouTube / Vimeo link. We handle noisy audio, accents & multiple speakers with care.',
    tint: 'from-rose-600 to-rose-600',
    anim: 'hand waving',
  },
  {
    icon: AudioWaveform,
    step: '02',
    title: 'AI Processing',
    desc: 'Speech-to-text → ASL gloss. Our model respects ASL grammar, space, and non-manual markers.',
    tint: 'from-rose-600 to-rose-600',
    anim: 'waveform',
  },
  {
    icon: PersonStanding,
    step: '03',
    title: 'Avatar Signs',
    desc: 'A friendly 3D avatar signs with clear handshapes, facial expression & natural body language.',
    tint: 'from-rose-600 to-rose-600',
    anim: 'avatar moving',
  },
  {
    icon: Download,
    step: '04',
    title: 'Download & Share',
    desc: 'Export 1080p MP4, shareable link, or side-by-side. Rate quality to help us improve.',
    tint: 'from-rose-600 to-rose-600',
    anim: 'download arrow',
  },
];

export function FeatureCards() {
  return (
    <section aria-labelledby="features-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-deep dark:text-teal-bright">How SignBridge works</p>
        <h2 id="features-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Upload → AI Processing → <span className="text-gradient-dark dark:text-gradient">Avatar Signs</span> → Download
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Purpose-built for the visual nature of ASL — not just captions overlaid on video.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift dark:border-white/10 dark:bg-navy-800"
          >
            <div aria-hidden className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${f.tint}`} />
            <div className="flex items-start justify-between">
              <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${f.tint}`}>
                <f.icon className="h-7 w-7" aria-hidden />
              </span>
              <span className="text-sm font-extrabold text-slate-300 dark:text-white/20">{f.step}</span>
            </div>
            <h3 className="mt-5 text-xl font-extrabold">{f.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{f.desc}</p>
            <p className="sr-only">Icon animation: {f.anim}</p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-teal-deep dark:text-teal-bright">
              <Check className="h-4 w-4" /> Deaf-reviewed
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo px-7 py-4 text-base font-bold text-white shadow-soft transition hover:scale-[1.03] active:scale-95"
        >
          Try the live demo <ArrowRight className="h-5 w-5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
