'use client';

import * as React from 'react';

type MotionPrefs = {
  reduceMotion: boolean;
  toggle: () => void;
};

const Ctx = React.createContext<MotionPrefs>({ reduceMotion: false, toggle: () => {} });

export function MotionPrefsProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    document.documentElement.classList.toggle('reduce-motion', mq.matches);
    const fn = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
      document.documentElement.classList.toggle('reduce-motion', e.matches);
    };
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const toggle = React.useCallback(() => {
    setReduceMotion((v) => {
      const nv = !v;
      document.documentElement.classList.toggle('reduce-motion', nv);
      return nv;
    });
  }, []);

  return <Ctx.Provider value={{ reduceMotion, toggle }}>{children}</Ctx.Provider>;
}

export function useMotionPrefs() {
  return React.useContext(Ctx);
}
