'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Users, Landmark, GraduationCap, HeartPulse, Clapperboard } from 'lucide-react';

const ORGS = [
  { icon: Users, name: 'Deaf Access Collective' },
  { icon: GraduationCap, name: 'Gallaudet Partners' },
  { icon: Landmark, name: 'AccessForAll Foundation' },
  { icon: HeartPulse, name: 'Hearing Loss Alliance' },
  { icon: Clapperboard, name: 'Inclusive Media Lab' },
];

export function TrustSection() {
  return (
    <section aria-labelledby="trust-title" className="border-y border-slate-200/70 bg-slate-50/80 py-14 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex animate-pulse-soft items-center gap-2 rounded-full border border-teal/30 bg-white px-5 py-2.5 text-sm font-bold text-teal-deep shadow-soft dark:bg-navy-800 dark:text-teal-bright"
        >
          <BadgeCheck className="h-5 w-5" aria-hidden />
          Built with Deaf community feedback
        </motion.div>
        <h2 id="trust-title" className="mt-5 text-xl font-bold text-slate-600 dark:text-slate-300">
          Trusted by accessibility teams, universities & creators
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {ORGS.map((o, i) => (
            <motion.span
              key={o.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[15px] font-bold text-slate-600 shadow-sm dark:border-white/10 dark:bg-navy-800 dark:text-slate-200"
            >
              <o.icon className="h-5 w-5 text-indigo dark:text-teal-bright" aria-hidden />
              {o.name}
            </motion.span>
          ))}
        </div>
        <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4">
          {[
            ['98.2%', 'Gloss accuracy*'],
            ['4.9/5', 'Deaf reviewer rating'],
            ['12k+', 'Videos made accessible'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-white p-4 shadow-soft dark:bg-navy-800">
              <dt className="order-2 mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{l}</dt>
              <dd className="text-2xl font-extrabold text-indigo dark:text-white sm:text-3xl">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-400">*On internal benchmark of clear, single-speaker English → ASL gloss. We publish limits openly.</p>
      </div>
    </section>
  );
}
