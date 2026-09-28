import Link from 'next/link';
import { ArrowRight, PlayCircle, ShieldCheck, Captions, Hand } from 'lucide-react';
import { HeroVisual } from '@/components/hero-visual';
import { FeatureCards } from '@/components/feature-cards';
import { TrustSection } from '@/components/trust-section';
import { HomeDetails } from '@/components/home-details';

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-br from-indigo via-[#9F1239] to-teal-deep text-white">
        {/* particles / light rays */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-teal-bright/25 blur-[100px]" />
          <div className="absolute right-[-80px] top-1/3 h-[28rem] w-[28rem] rounded-full bg-lavender-300/30 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.14] [background:repeating-linear-gradient(115deg,transparent_0_40px,white_40px_41px)]" />
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 67) % 100}%`,
                top: `${(i * 37) % 100}%`,
                animationDelay: `${(i % 5) * 0.9}s`,
                width: i % 3 === 0 ? 8 : 5,
                height: i % 3 === 0 ? 8 : 5,
              }}
              className="absolute animate-float rounded-full bg-white/50"
            />
          ))}
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[13px] font-bold backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-teal-bright" aria-hidden />
              WCAG 2.1 AA • Deaf-led design • ASL-first
            </p>
            <h1 id="hero-title" className="mt-6 text-[2.75rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Turn Any Video <br />
              <span className="text-gradient">into Sign Language</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
              AI-powered avatar signing that respects grammar, facial expressions, and the visual
              nature of ASL. Make content truly accessible.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal px-8 py-4 text-base font-extrabold text-white shadow-glow transition-all duration-300 hover:scale-[1.03] hover:bg-teal-bright hover:text-navy-900 active:scale-95"
              >
                Upload Video & Convert <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-[14px] text-base font-bold backdrop-blur transition hover:bg-white/20 active:scale-95"
              >
                <PlayCircle className="h-5 w-5" aria-hidden /> See How It Works
              </Link>
            </div>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Captions className="h-4 w-4 text-teal-bright" aria-hidden />
                <span><strong>MP4 · MOV · WebM</strong> <span className="text-white/70">up to 4K · or paste a link</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Hand className="h-4 w-4 text-teal-bright" aria-hidden />
                <span><strong>ASL-first</strong> <span className="text-white/70">linguist reviewed</span></span>
              </div>
            </dl>
          </div>

          <HeroVisual />
        </div>

        {/* wave divider */}
        <svg aria-hidden viewBox="0 0 1440 70" preserveAspectRatio="none" className="relative block h-[54px] w-full text-white dark:text-navy-900">
          <path d="M0,40 C240,70 480,0 720,30 C960,60 1200,10 1440,40 L1440,70 L0,70 Z" fill="currentColor" />
        </svg>
      </section>

      <div className="bg-white dark:bg-navy-900">
        <FeatureCards />
      </div>

      <TrustSection />
      <HomeDetails />
    </>
  );
}
