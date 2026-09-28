'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, HeartHandshake, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Ctx = { open: (context?: string) => void };
const FeedbackCtx = React.createContext<Ctx>({ open: () => {} });
export const useFeedback = () => React.useContext(FeedbackCtx);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [context, setContext] = React.useState('General feedback');
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [text, setText] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const open = React.useCallback((c?: string) => {
    setContext(c ?? 'General feedback');
    setIsOpen(true);
    setSent(false);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setIsOpen(false);
      setRating(0);
      setText('');
      setTimeout(() => setSent(false), 400);
    }, 1600);
  };

  return (
    <FeedbackCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-navy-900/60 p-4 backdrop-blur-sm"
            role="presentation"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-lift sm:p-8 dark:bg-navy-800"
            >
              {!sent ? (
                <form onSubmit={submit}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal-deep dark:text-teal-bright">
                        <HeartHandshake className="h-3.5 w-3.5" /> Help us improve for the Deaf community
                      </p>
                      <h2 id="feedback-title" className="mt-3 text-2xl font-extrabold tracking-tight">
                        Rate this conversion
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{context}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close feedback"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-6" role="radiogroup" aria-label="Star rating">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={rating === s}
                          aria-label={`${s} star${s > 1 ? 's' : ''}`}
                          onMouseEnter={() => setHover(s)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(s)}
                          className="rounded-xl p-1 transition hover:scale-110 active:scale-95"
                        >
                          <motion.span whileTap={{ scale: 0.8, rotate: -12 }} className="block">
                            <Star
                              className={cn(
                                'h-9 w-9 transition-colors',
                                (hover || rating) >= s
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-200 text-slate-200 dark:fill-white/10 dark:text-white/20'
                              )}
                            />
                          </motion.span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 min-h-[20px] text-sm font-medium text-slate-500" aria-live="polite">
                      {rating === 5 && 'Excellent — natural signing!'}
                      {rating === 4 && 'Great — minor tweaks needed.'}
                      {rating === 3 && 'Good — tell us what felt off.'}
                      {rating === 2 && 'Needs work — we hear you.'}
                      {rating === 1 && 'Not right — help us fix it.'}
                    </p>
                  </div>

                  <label htmlFor="feedback-text" className="mt-4 block text-sm font-bold">
                    What should we improve? <span className="font-normal text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    id="feedback-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder="e.g. Handshapes were clear, but facial expression felt flat on questions…"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-teal dark:border-white/10 dark:bg-white/5"
                  />

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={rating === 0}
                    className="mt-5 w-full rounded-2xl bg-teal py-4 text-base font-bold text-white shadow-soft transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {rating === 0 ? 'Select a rating to continue' : 'Submit feedback'}
                  </motion.button>
                </form>
              ) : (
                <div className="py-8 text-center" role="status">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-teal text-white"
                  >
                    <Check className="h-10 w-10" strokeWidth={3} />
                  </motion.div>
                  <h2 className="mt-5 text-2xl font-extrabold">Thank you!</h2>
                  <p className="mx-auto mt-2 max-w-xs text-slate-500 dark:text-slate-400">
                    Your feedback directly shapes avatar quality for the Deaf community.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FeedbackCtx.Provider>
  );
}
