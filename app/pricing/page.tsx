'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Building2, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    name: 'Community',
    price: '$0',
    per: 'free forever',
    desc: 'For individuals making personal content accessible.',
    cta: 'Start for free',
    featured: false,
    features: ['3 videos / month (up to 10 min)', '720p avatar rendering', 'ASL gloss preview', 'Captions included', 'Community support'],
  },
  {
    name: 'Creator Pro',
    price: '$19',
    per: 'per month',
    desc: 'For YouTubers, educators & teams publishing weekly.',
    cta: 'Start 14-day trial',
    featured: true,
    features: [
      'Unlimited videos (up to 2 hrs each)',
      '1080p + 4K avatar rendering',
      'Adjustable speed & expressive faces',
      'Side-by-side + PiP exports',
      'Priority rendering queue',
      'Share links + embeds',
    ],
  },
  {
    name: 'Organization',
    price: 'Custom',
    per: 'annual',
    desc: 'For universities, enterprises & government access teams.',
    cta: 'Talk to us',
    featured: false,
    features: ['SSO & audit logs', 'API + bulk conversion', 'Custom avatar styling', 'Deaf review panel', 'WCAG conformance report', 'Dedicated success manager'],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-slate-50 dark:bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-bold text-teal-deep dark:text-teal-bright">
            <Sparkles className="h-4 w-4" /> Simple, honest pricing
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Access shouldn’t be <span className="text-gradient-dark dark:text-gradient">a luxury</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Free for the community, fair for creators. Every plan includes linguist-reviewed ASL grammar.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className={cn(
                'relative rounded-[2rem] border p-8',
                p.featured
                  ? 'border-transparent bg-gradient-to-b from-indigo to-[#9F1239] text-white shadow-lift lg:-my-3 lg:py-11'
                  : 'border-slate-200 bg-white shadow-soft dark:border-white/10 dark:bg-navy-800'
              )}
            >
              {p.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-teal px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow">
                  Most popular
                </span>
              )}
              <h2 className="text-xl font-extrabold">{p.name}</h2>
              <p className={cn('mt-1 text-sm', p.featured ? 'text-white/75' : 'text-slate-500 dark:text-slate-400')}>{p.desc}</p>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">{p.price}</span>
                <span className={cn('text-sm font-semibold', p.featured ? 'text-white/70' : 'text-slate-500')}>{p.per}</span>
              </p>
              <Link
                href="/dashboard"
                className={cn(
                  'mt-6 block rounded-2xl py-4 text-center text-base font-bold transition hover:scale-[1.02] active:scale-95',
                  p.featured ? 'bg-white text-indigo shadow-lg' : 'bg-indigo text-white dark:bg-teal'
                )}
              >
                {p.cta}
              </Link>
              <ul className="mt-7 space-y-3">
                {p.features.map((f, fi) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + fi * 0.07 }}
                    className="flex items-start gap-2.5 text-[15px] font-medium"
                  >
                    <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full', p.featured ? 'bg-white/20' : 'bg-teal/15')}>
                      <Check className={cn('h-3.5 w-3.5', p.featured ? 'text-white' : 'text-teal-deep dark:text-teal-bright')} strokeWidth={3} />
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-navy-800">
            <GraduationCap className="h-10 w-10 shrink-0 text-indigo dark:text-teal-bright" aria-hidden />
            <div>
              <h3 className="font-extrabold">Education & nonprofits: 50% off</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Schools, Deaf orgs and registered nonprofits get Creator Pro at half price. Because access is a right.</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-navy-800">
            <Building2 className="h-10 w-10 shrink-0 text-indigo dark:text-teal-bright" aria-hidden />
            <div>
              <h3 className="font-extrabold">Need on-prem or BSL / LSQ too?</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Organization plans add more sign languages, private hosting and conformance reporting.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
