'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/Toast';
import { focusTips } from '@/lib/ai-data';

const CIRCUMFERENCE = 2 * Math.PI * 96;

export default function FocusPage() {
  const { show } = useToast();
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('Focus Session');
  const [sessions, setSessions] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [focusTask, setFocusTask] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('lifeai_sessions');
    const f = localStorage.getItem('lifeai_focusTime');
    setTimeout(() => {
      if (s) setSessions(parseInt(s));
      if (f) setFocusTime(parseInt(f));
    }, 0);
  }, []);

  const onComplete = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    const isFocus = mode === 'Focus Session';
    show(isFocus ? '🎉 Session complete! Take a well-deserved break!' : '⚡ Break over! Back to focus!');
    if (isFocus) {
      const newS = sessions + 1;
      const newF = focusTime + duration / 60;
      setSessions(newS); setFocusTime(newF);
      localStorage.setItem('lifeai_sessions', String(newS));
      localStorage.setItem('lifeai_focusTime', String(newF));
    }
    setRemaining(duration);
  }, [mode, sessions, focusTime, duration, show]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { onComplete(); return duration; }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, duration, onComplete]);

  const toggle = () => setRunning(!running);
  const reset = () => { if (intervalRef.current) clearInterval(intervalRef.current); setRunning(false); setRemaining(duration); };
  const skip = () => { onComplete(); };

  const selectMode = (min: number, label: string) => {
    if (running) return;
    setDuration(min * 60);
    setRemaining(min * 60);
    setMode(label);
  };

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const progress = remaining / duration;
  const offset = CIRCUMFERENCE * (1 - progress);

  const modes = [
    { min: 25, label: 'Focus Session', short: 'Focus' },
    { min: 5, label: 'Short Break', short: 'Short Break' },
    { min: 15, label: 'Long Break', short: 'Long Break' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-fadein">
      <div className="text-center mb-10">
        <span className="inline-block bg-accent-purple/12 border border-accent-purple/30 text-accent-purple px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4">🎯 Deep Focus</span>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">Focus Mode</h2>
        <p className="text-text-secondary max-w-[560px] mx-auto leading-relaxed">Boost concentration with AI-assisted Pomodoro sessions and smart break suggestions.</p>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative w-[220px] h-[220px] mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <circle cx="110" cy="110" r="96" fill="none" stroke="var(--border-color)" strokeWidth="8" />
            <circle cx="110" cy="110" r="96" fill="none" stroke="url(#timerGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-5xl font-bold gradient-text tracking-tight">{mins}:{secs}</div>
            <div className="text-xs text-text-secondary mt-1">{mode}</div>
          </div>
        </div>

        {/* Mode Selectors */}
        <div className="flex gap-3 mb-7">
          {modes.map((m) => (
            <button key={m.label} onClick={() => selectMode(m.min, m.label)}
              className={`px-5 py-3 rounded-xl text-xs text-center leading-snug cursor-pointer transition-all border
                ${mode === m.label ? 'bg-accent-purple/15 border-accent-purple text-accent-purple' : 'bg-bg-card border-border text-text-secondary hover:border-accent-purple hover:text-accent-purple'}`}>
              {m.short}<br /><small className="text-text-muted text-[0.72rem]">{m.min} min</small>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5 mb-7">
          <button onClick={reset} title="Reset" className="w-12 h-12 rounded-full bg-bg-card border border-border text-text-secondary flex items-center justify-center text-lg cursor-pointer transition-all hover:border-accent-purple hover:text-accent-purple">↺</button>
          <button onClick={toggle} className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan border-none text-white flex items-center justify-center text-xl cursor-pointer shadow-[0_8px_24px_rgba(129,140,248,0.4)] transition-all hover:scale-105">
            {running ? '⏸' : '▶'}
          </button>
          <button onClick={skip} title="Skip" className="w-12 h-12 rounded-full bg-bg-card border border-border text-text-secondary flex items-center justify-center text-lg cursor-pointer transition-all hover:border-accent-purple hover:text-accent-purple">⏭</button>
        </div>

        {/* Session Dots */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">Sessions today:</span>
          <div className="flex gap-1.5">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < sessions ? 'bg-gradient-to-r from-accent-purple to-accent-cyan shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'bg-accent-purple/15 border border-border'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Focus Task */}
      <div className="max-w-[540px] mx-auto mb-8 text-center">
        <h3 className="text-base font-semibold mb-3">What are you focusing on?</h3>
        <input value={focusTask} onChange={(e) => setFocusTask(e.target.value)}
          placeholder="e.g. Complete project report..." className="w-full bg-bg-card border border-border text-text-primary px-4 py-3.5 rounded-xl text-sm outline-none text-center transition-all focus:border-accent-purple placeholder:text-text-muted" />
      </div>

      {/* AI Tip */}
      <div className="max-w-[600px] mx-auto mb-10 bg-bg-card border border-border rounded-3xl p-6 text-center backdrop-blur-xl">
        <div className="font-bold mb-3">🤖 AI Productivity Boost</div>
        <p className="text-text-secondary leading-relaxed text-sm mb-4">{focusTips[tipIdx]}</p>
        <button onClick={() => setTipIdx((i) => (i + 1) % focusTips.length)} className="bg-accent-purple/12 border border-accent-purple/30 text-accent-purple px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-accent-purple/20">↻ New Tip</button>
      </div>

      {/* Stats */}
      <div className="flex gap-6 justify-center flex-wrap">
        {[
          { val: focusTime, label: 'Minutes focused today' },
          { val: sessions, label: 'Sessions today' },
          { val: 1, label: 'Day streak 🔥' },
        ].map((s) => (
          <div key={s.label} className="text-center bg-bg-card border border-border rounded-2xl px-8 py-5 backdrop-blur-xl min-w-[140px]">
            <div className="font-display text-3xl font-extrabold gradient-text mb-1.5">{s.val}</div>
            <div className="text-xs text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
