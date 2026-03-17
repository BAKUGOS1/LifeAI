'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

const tabs = [
  { path: '/', label: 'Home', id: 'home' },
  { path: '/solver', label: 'AI Solver', id: 'solver' },
  { path: '/tasks', label: 'Tasks', id: 'tasks' },
  { path: '/finance', label: 'Finance', id: 'finance' },
  { path: '/wellness', label: 'Wellness', id: 'wellness' },
  { path: '/focus', label: 'Focus', id: 'focus' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [time, setTime] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] border-b border-border backdrop-blur-[20px]"
      style={{ background: theme === 'dark' ? 'rgba(5,7,26,0.85)' : 'rgba(240,244,255,0.92)' }}>
      <div className="max-w-[1400px] mx-auto px-6 h-[68px] flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <Image src="/logo.svg" alt="LifeAI" width={36} height={36} className="rounded-full" />
          <span className="font-display text-xl font-bold gradient-text">LifeAI</span>
        </Link>

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-1 flex-1 overflow-x-auto">
          {tabs.map((t) => (
            <Link key={t.id} href={t.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium no-underline whitespace-nowrap transition-all duration-200
                ${pathname === t.path
                  ? 'text-accent-purple bg-accent-purple/12'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'}`}>
              {t.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="text-xs text-text-secondary bg-bg-card border border-border px-3 py-1.5 rounded-full tabular-nums hidden sm:block">
            {time}
          </div>
          <button onClick={toggle} title="Toggle theme"
            className="bg-bg-card border border-border text-text-secondary w-[38px] h-[38px] rounded-[10px] flex items-center justify-center transition-all duration-200 hover:border-accent-purple hover:text-accent-purple cursor-pointer">
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
          {/* Mobile Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden bg-bg-card border border-border text-text-secondary w-[38px] h-[38px] rounded-[10px] flex items-center justify-center cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-1" style={{ background: theme === 'dark' ? 'rgba(5,7,26,0.95)' : 'rgba(240,244,255,0.95)' }}>
          {tabs.map((t) => (
            <Link key={t.id} href={t.path} onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium no-underline transition-all
                ${pathname === t.path ? 'text-accent-purple bg-accent-purple/12' : 'text-text-secondary hover:text-text-primary'}`}>
              {t.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
