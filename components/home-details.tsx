'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Gauge, Languages, Smile, ArrowRight, Quote } from 'lucide-react';

export function HomeDetails() {
  return (
    <>
      {/* How it works strip */}
      <section id="how-it-works" aria-labelledby="hiw-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-deep dark:text-teal-bright">Why avatars, done right</p>
            <h2 id="hiw-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sign is grammar, face & space — not just hands
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              ASL uses eyebrow raises for questions, head tilts for conditionals, and space for
              pronouns. SignBridge models all of it — reviewed sentence-by-sentence with Deaf linguists.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: Languages, t: 'Grammar-aware gloss', d: 'English reordered into ASL syntax with rhetorical structure preserved.' },
                { icon: Smile, t: 'Non-manual markers', d: 'Eyebrows, mouth morphemes, head & torso carry meaning — never flat.' },
                { icon: Gauge, t: 'Adjustable signing speed', d: '0.75× – 1.25× with fingerspelling clarity mode for names & terms.' },
              ].map((r) => (
                <li key={r.t} className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-navy-800">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal-deep dark:text-teal-bright">
                    <r.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-bold">{r.t}</span>
                    <span className="block text-[15px] text-slate-600 dark:text-slate-300">{r.d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 font-bold text-indigo hover:underline dark:text-teal-bright">
              See it on your own video <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[2rem] border border-slate-200 bg-gradient-to-br from-indigo via-indigo-deep to-navy-800 p-8 text-white shadow-lift"
          >
            <Quote className="h-8 w-8 text-teal-bright" aria-hidden />
            <blockquote className="mt-4 text-xl font-medium leading-relaxed">
              “Finally, an avatar that doesn’t look robotic. My students watched a 40-minute lecture
              in ASL and stayed engaged the whole time. The facial grammar is what sells it.”
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-teal text-lg font-extrabold">M</span>
              <div>
                <p className="font-bold">Dr. Maya Chen</p>
                <p className="text-sm text-white/70">Deaf educator & ASL linguist, beta partner</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1" aria-label="Rated 5 out of 5 stars">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} className="text-xl text-amber-300" aria-hidden>{s}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA banner */}
      <section aria-labelledby="cta-title" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo via-[#9F1239] to-teal-deep px-6 py-14 text-center text-white shadow-lift sm:px-12"
        >
          <div aria-hidden className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,#FB7185,transparent_40%)]" />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Every video you publish can welcome Deaf viewers
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">
              Free for your first 3 videos. No credit card. Just upload and watch it sign.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-indigo shadow-lg transition hover:scale-[1.03] active:scale-95"
              >
                <Play className="h-5 w-5" aria-hidden /> Start converting — it’s free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 px-8 py-[14px] text-base font-bold text-white transition hover:bg-white/10"
              >
                View plans
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
