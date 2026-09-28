import Link from 'next/link';
import { LayoutDashboard, History, CreditCard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppSidebar({ active }: { active: 'dashboard' | 'history' | 'plans' | 'settings' }) {
  const items = [
    { id: 'dashboard' as const, href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Convert new videos' },
    { id: 'history' as const, href: '/history', label: 'My Conversions', icon: History, desc: 'Past signed videos' },
    { id: 'plans' as const, href: '/pricing', label: 'Plans', icon: CreditCard, desc: 'Free & Pro tiers' },
    { id: 'settings' as const, href: '/settings', label: 'Settings', icon: Settings, desc: 'Avatar & access' },
  ];
  return (
    <nav aria-label="App sections" className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 space-y-2 rounded-[1.75rem] border border-slate-200/70 bg-white p-3 shadow-soft dark:border-white/10 dark:bg-navy-800">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <Link
              key={it.id}
              href={it.href}
              aria-current={on ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300',
                on ? 'bg-gradient-to-r from-indigo to-[#9F1239] text-white shadow-soft' : 'hover:bg-slate-100 dark:hover:bg-white/5'
              )}
            >
              <span className={cn('grid h-10 w-10 place-items-center rounded-xl', on ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10')}>
                <it.icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] font-bold leading-tight">{it.label}</span>
                <span className={cn('block text-xs', on ? 'text-white/75' : 'text-slate-500 dark:text-slate-400')}>{it.desc}</span>
              </span>
            </Link>
          );
        })}
        <div className="rounded-2xl bg-gradient-to-br from-teal/15 to-lavender-100 p-4 text-sm dark:from-teal/20 dark:to-white/5">
          <p className="font-extrabold">Free tier: 2 of 3 left</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white dark:bg-white/10">
            <div className="h-full w-1/3 rounded-full bg-teal" />
          </div>
          <Link href="/pricing" className="mt-2 inline-block font-bold text-teal-deep underline underline-offset-4 dark:text-teal-bright">
            Upgrade for unlimited →
          </Link>
        </div>
      </div>
    </nav>
  );
}
