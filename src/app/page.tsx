'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { dailyTips } from '@/lib/ai-data';
import { BrainCircuit, CheckSquare, LineChart, Activity, Target, BarChart2, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';

const features = [
  { icon: <BrainCircuit size={32} strokeWidth={1.5} />, title: 'AI Problem Solver', desc: 'Describe any daily challenge and get intelligent, step-by-step solutions powered by real AI.', href: '/solver', cls: 'from-accent-purple/8 to-accent-violet/5' },
  { icon: <CheckSquare size={32} strokeWidth={1.5} />, title: 'Smart Task Manager', desc: 'AI-powered prioritization that learns your habits and optimizes your schedule automatically.', href: '/tasks', cls: 'from-accent-green/8 to-accent-cyan/5' },
  { icon: <LineChart size={32} strokeWidth={1.5} />, title: 'Finance Tracker', desc: 'Track expenses, set budgets, and get saving suggestions — all with AI-driven insight.', href: '/finance', cls: 'from-accent-yellow/8 to-accent-red/5' },
  { icon: <Activity size={32} strokeWidth={1.5} />, title: 'Wellness Coach', desc: 'Personalized health tips, habit tracking, and daily wellness routines powered by AI.', href: '/wellness', cls: 'from-accent-green/8 to-accent-green/5' },
  { icon: <Target size={32} strokeWidth={1.5} />, title: 'Focus Mode', desc: 'Smart Pomodoro sessions with AI productivity tips and distraction analysis.', href: '/focus', cls: 'from-accent-pink/8 to-accent-violet/5' },
  { icon: <BarChart2 size={32} strokeWidth={1.5} />, title: 'Daily Insights', desc: 'AI-generated daily reports on your productivity, spending, and wellness trends.', href: '#', cls: '', soon: true },
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
    const t = setTimeout(() => {
      setTipIndex(Math.floor(Math.random() * dailyTips.length));
    }, 0);
    return () => clearTimeout(t);
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
      <div className="flex gap-4 flex-wrap justify-center mb-16 px-4">
        <Link href="/solver" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-semibold text-base no-underline shadow-[0_8px_24px_rgba(129,140,248,0.35)] hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(129,140,248,0.5)] transition-all min-w-[200px] justify-center">
          <BrainCircuit size={20} />
          Solve a Problem
        </Link>
        <Link href="/tasks" className="px-8 py-3.5 rounded-xl border border-border bg-bg-card text-text-primary font-medium text-base no-underline backdrop-blur-[10px] hover:border-accent-purple hover:bg-bg-card-hover hover:translate-y-[-2px] transition-all min-w-[200px]">
          Explore Features
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[800px] mb-16">
        {[{ n: 12, l: 'Problems Solved' }, { n: 5, l: 'Tools Available' }, { n: 100, l: 'AI Accuracy %' }, { n: 24, l: 'Hours / Day Coverage' }].map((s) => (
          <div key={s.l} className="bg-bg-card border border-border rounded-2xl p-6 text-center backdrop-blur-xl transition-all hover:border-border-hover hover:bg-bg-card-hover hover:translate-y-[-3px]">
            <AnimCounter target={s.n} />
            <div className="text-xs text-text-muted font-medium">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mb-10">
        {features.map((f) => (
          <Link key={f.title} href={f.href}
            className={`bg-gradient-to-br ${f.cls || 'bg-bg-card'} border border-border rounded-3xl p-7 text-left no-underline backdrop-blur-xl transition-all relative overflow-hidden group hover:border-border-hover hover:bg-bg-card-hover hover:translate-y-[-4px] hover:shadow-[0_0_40px_rgba(129,140,248,0.15)] flex flex-col h-full`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-purple to-accent-cyan opacity-0 group-hover:opacity-100 transition-all" />
            <div className="text-accent-purple mb-5 p-3 bg-white/5 inline-flex rounded-2xl w-fit self-start">{f.icon}</div>
            <h3 className="font-display text-lg font-bold mb-2.5 text-text-primary">{f.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">{f.desc}</p>
            <div className="mt-auto">
              {f.soon ? (
                <span className="bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 px-3 py-1.5 rounded-full text-xs font-medium">Coming Soon</span>
              ) : (
                <span className="text-sm font-semibold text-accent-cyan flex items-center gap-1 group-hover:gap-2 transition-all">Explore <ArrowRight size={16} /></span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Daily Tip */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-6 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/5 border border-accent-purple/20 rounded-3xl p-6 md:p-8 w-full backdrop-blur-xl text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-30 bg-accent-purple/10 rounded-full blur-[80px] -z-10" />
        <div className="bg-accent-purple/20 p-4 rounded-2xl text-accent-purple shrink-0">
          <Lightbulb size={28} />
        </div>
        <div className="flex-1">
          <p className="text-base md:text-lg leading-relaxed text-text-primary mb-2 transition-opacity duration-200 font-medium">{dailyTips[tipIndex]}</p>
          <span className="text-xs md:text-sm text-accent-purple font-semibold tracking-wide uppercase">Daily AI Insight</span>
        </div>
        <button onClick={refreshTip} title="New tip"
          className="bg-bg-card/50 border border-border hover:border-accent-purple/50 text-text-secondary hover:text-accent-purple w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all hover:bg-accent-purple/10 active:scale-95 group">
          <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* AI Evolution Photography Section */}
      <div className="w-full mt-32 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-bg-card/50 text-xs font-medium text-text-secondary mb-6">
          <span className="w-2 h-2 rounded-full bg-accent-cyan"></span> Virtual Gallery
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-6">The Evolution of <span className="gradient-text">AI</span></h2>
        <p className="text-text-secondary text-base md:text-lg max-w-[700px] mx-auto mb-16">
          Witness the journey of artificial intelligence from conceptual algorithms to a daily life companion that empowers human potential.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Item 1 */}
          <div className="group relative rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[4/5] bg-bg-card border border-border transition-all hover:border-accent-purple/50">
            <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" alt="Neural Networks" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-70 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent flex flex-col justify-end p-8 text-left transition-opacity duration-300">
              <span className="text-accent-cyan text-xs font-bold tracking-widest uppercase mb-2">Phase 01</span>
              <h3 className="text-white font-display font-bold text-2xl mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Neural Connectomics</h3>
              <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed max-w-[90%]">The intricate patterns mimicking human brain architecture, forming the foundation of deep learning.</p>
            </div>
          </div>
          {/* Item 2 */}
          <div className="group relative rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[4/5] bg-bg-card border border-border lg:translate-y-12 transition-all hover:border-accent-cyan/50">
            <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" alt="Generative AI" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-70 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent flex flex-col justify-end p-8 text-left transition-opacity duration-300">
              <span className="text-accent-purple text-xs font-bold tracking-widest uppercase mb-2">Phase 02</span>
              <h3 className="text-white font-display font-bold text-2xl mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Generative Mastery</h3>
              <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed max-w-[90%]">Machines learning to dream, create, and understand complex human semantics in real-time.</p>
            </div>
          </div>
          {/* Item 3 */}
          <div className="group relative rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[4/5] bg-bg-card border border-border md:col-span-2 lg:col-span-1 lg:mt-0 transition-all hover:border-accent-green/50">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" alt="Symbiosis" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-70 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent flex flex-col justify-end p-8 text-left transition-opacity duration-300">
              <span className="text-accent-green text-xs font-bold tracking-widest uppercase mb-2">Phase 03</span>
              <h3 className="text-white font-display font-bold text-2xl mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Human By Design</h3>
              <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed max-w-[90%]">The seamless integration into modern life, augmenting our reasoning and enhancing daily productivity.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
