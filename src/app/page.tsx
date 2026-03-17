'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { dailyTips } from '@/lib/ai-data';

const features = [
  { icon: '🤖', title: 'AI Problem Solver', desc: 'Describe any daily challenge and get intelligent, step-by-step solutions powered by real AI.', href: '/solver', cls: 'from-accent-purple/8 to-accent-violet/5' },
  { icon: '✅', title: 'Smart Task Manager', desc: 'AI-powered prioritization that learns your habits and optimizes your schedule automatically.', href: '/tasks', cls: 'from-accent-green/8 to-accent-cyan/5' },
  { icon: '💰', title: 'Finance Tracker', desc: 'Track expenses, set budgets, and get saving suggestions — all with AI-driven insight.', href: '/finance', cls: 'from-accent-yellow/8 to-accent-red/5' },
  { icon: '🏃', title: 'Wellness Coach', desc: 'Personalized health tips, habit tracking, and daily wellness routines powered by AI.', href: '/wellness', cls: 'from-accent-green/8 to-accent-green/5' },
  { icon: '🎯', title: 'Focus Mode', desc: 'Smart Pomodoro sessions with AI productivity tips and distraction analysis.', href: '/focus', cls: 'from-accent-pink/8 to-accent-violet/5' },
  { icon: '📊', title: 'Daily Insights', desc: 'AI-generated daily reports on your productivity, spending, and wellness trends.', href: '#', cls: '', soon: true },
];

function AnimCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(Math.floor(start));
          if (start >= target) clearInterval(timer);
        }, 30);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="font-display text-4xl font-extrabold gradient-text mb-1">{count}</div>;
}

export default function HomePage() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * dailyTips.length));
  }, []);

  const refreshTip = () => setTipIndex((i) => (i + 1) % dailyTips.length);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 flex flex-col items-center text-center animate-fadein">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-accent-purple/10 border border-accent-purple/30 px-5 py-2 rounded-full text-sm text-accent-purple font-medium mb-8"
        style={{ animation: 'badgePulse 3s ease-in-out infinite' }}>
        <span className="w-[7px] h-[7px] rounded-full bg-accent-green" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        Powered by AI · Built for Real Life
      </div>

      {/* Hero */}
      <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.1] mb-6 tracking-tight">
        Solve Any<br />
        <span className="gradient-text">Daily Problem</span><br />
        With AI
      </h1>
      <p className="text-text-secondary text-[clamp(1rem,2vw,1.2rem)] max-w-[600px] leading-relaxed mb-10">
        LifeAI is your intelligent companion for the modern age. From managing tasks and finances to boosting health and focus — let AI handle the complexity so you can live better.
      </p>

      {/* CTAs */}
      <div className="flex gap-4 flex-wrap justify-center mb-16">
        <Link href="/solver" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-semibold text-base no-underline shadow-[0_8px_24px_rgba(129,140,248,0.35)] hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(129,140,248,0.5)] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Solve a Problem
        </Link>
        <Link href="/tasks" className="px-8 py-3.5 rounded-xl border border-border bg-bg-card text-text-primary font-medium text-base no-underline backdrop-blur-[10px] hover:border-accent-purple hover:bg-bg-card-hover hover:translate-y-[-2px] transition-all">
          Explore Features
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-[800px] mb-16">
        {[{ n: 12, l: 'Problems Solved' }, { n: 5, l: 'Tools Available' }, { n: 100, l: 'AI Accuracy %' }, { n: 24, l: 'Hours / Day Coverage' }].map((s) => (
          <div key={s.l} className="bg-bg-card border border-border rounded-2xl p-6 text-center backdrop-blur-xl transition-all hover:border-border-hover hover:bg-bg-card-hover hover:translate-y-[-3px]">
            <AnimCounter target={s.n} />
            <div className="text-xs text-text-muted font-medium">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mb-10">
        {features.map((f) => (
          <Link key={f.title} href={f.href}
            className={`bg-gradient-to-br ${f.cls || 'bg-bg-card'} border border-border rounded-3xl p-7 text-left no-underline backdrop-blur-xl transition-all relative overflow-hidden group hover:border-border-hover hover:bg-bg-card-hover hover:translate-y-[-4px] hover:shadow-[0_0_40px_rgba(129,140,248,0.15)]`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-purple to-accent-cyan opacity-0 group-hover:opacity-100 transition-all" />
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-display text-base font-bold mb-2.5 text-text-primary">{f.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{f.desc}</p>
            {f.soon ? (
              <span className="bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 px-2.5 py-1 rounded-full text-xs font-medium">Soon</span>
            ) : (
              <span className="text-sm font-semibold text-accent-purple group-hover:translate-x-1 transition-transform inline-block">→</span>
            )}
          </Link>
        ))}
      </div>

      {/* Daily Tip */}
      <div className="flex items-center gap-4 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/5 border border-accent-purple/20 rounded-3xl p-6 w-full backdrop-blur-xl">
        <div className="text-3xl shrink-0">💡</div>
        <div className="flex-1 text-left">
          <p className="text-base leading-relaxed text-text-primary mb-1.5 transition-opacity duration-200">{dailyTips[tipIndex]}</p>
          <span className="text-xs text-accent-purple font-semibold">Daily AI Insight</span>
        </div>
        <button onClick={refreshTip} title="New tip"
          className="bg-accent-purple/10 border border-accent-purple/30 text-accent-purple w-10 h-10 rounded-[10px] flex items-center justify-center text-lg cursor-pointer shrink-0 transition-all hover:bg-accent-purple/20 hover:rotate-180">
          ↻
        </button>
      </div>
    </div>
  );
}
