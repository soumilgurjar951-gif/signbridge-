import { Accessibility, ShieldCheck, Mail, Hand } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <div className="bg-slate-50 dark:bg-navy-900">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-bold text-teal-deep dark:text-teal-bright">
          <Accessibility className="h-4 w-4" /> Our commitment
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Accessibility Statement & Trust</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          SignBridge exists to celebrate sign language as a rich visual language. Access is designed
          in from the first pixel — not bolted on.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Accessibility, t: 'WCAG 2.1 AA', d: 'Contrast ≥ 4.5:1, visible focus, keyboard-first, 44px targets.' },
            { icon: Hand, t: 'Deaf-led reviews', d: 'Every avatar release is rated by Deaf linguists before launch.' },
            { icon: ShieldCheck, t: 'Privacy-first', d: 'Your videos stay yours. Delete anytime; never sold or used for ads.' },
          ].map((c) => (
            <div key={c.t} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-navy-800">
              <c.icon className="h-7 w-7 text-teal" aria-hidden />
              <h2 className="mt-3 font-extrabold">{c.t}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.d}</p>
            </div>
          ))}
        </div>

        <section id="wcag" aria-labelledby="wcag-h" className="mt-8 scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-8 dark:border-white/10 dark:bg-navy-800">
          <h2 id="wcag-h" className="text-2xl font-extrabold">What WCAG 2.1 AA means here</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            <li>Full keyboard operability with a clear skip link and visible teal focus rings.</li>
            <li>Honors <code>prefers-reduced-motion</code> plus an in-app “Reduce animations” switch.</li>
            <li>Live regions announce conversion progress; sliders and steppers use ARIA roles.</li>
            <li>Dark mode uses deep navy (not pure black) to reduce eye strain while keeping contrast.</li>
            <li>Captions and transcripts ship with every signed video — never sign <em>or</em> captions, always both.</li>
          </ul>
        </section>

        <section id="privacy" aria-labelledby="priv-h" className="mt-5 scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-8 dark:border-white/10 dark:bg-navy-800">
          <h2 id="priv-h" className="text-2xl font-extrabold">Privacy in plain language</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            Uploads are encrypted in transit and at rest, processed only to create your signed video,
            and deletable in one click from My Conversions. We never sell personal data or use your
            videos for advertising. Organization plans can add SSO, audit logs and regional hosting.
          </p>
        </section>

        <section id="contact" aria-labelledby="contact-h" className="mt-5 scroll-mt-24 rounded-[1.75rem] bg-gradient-to-br from-indigo to-teal-deep p-6 text-white shadow-lift sm:p-8">
          <h2 id="contact-h" className="flex items-center gap-2 text-2xl font-extrabold"><Mail className="h-6 w-6" /> Contact & partnerships</h2>
          <p className="mt-2 text-white/85">Questions, access needs, or partnering with your Deaf community org? We reply within 2 business days.</p>
          <p className="mt-4 font-bold">hello@signbridge.app · access@signbridge.app</p>
        </section>
      </div>
    </div>
  );
}
