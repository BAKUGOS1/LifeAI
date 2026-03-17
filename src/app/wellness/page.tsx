'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/Toast';
import { wellnessTips } from '@/lib/ai-data';

interface Habit { id: number; name: string; icon: string; done: boolean; }
interface Health { water: number; sleep: number; steps: number; mood: string; }

const defaultHabits: Habit[] = [
  { id: 1, name: 'Morning Meditation', icon: '🧘', done: false },
  { id: 2, name: 'Daily Exercise', icon: '🏃', done: false },
  { id: 3, name: 'Read 20 Minutes', icon: '📖', done: false },
];

export default function WellnessPage() {
  const { show } = useToast();
  const [health, setHealth] = useState<Health>({ water: 0, sleep: 0, steps: 0, mood: '' });
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [tipIdx, setTipIdx] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('🧘');

  useEffect(() => {
    const h = localStorage.getItem('lifeai_health');
    const hb = localStorage.getItem('lifeai_habits');
    setTimeout(() => {
      if (h) setHealth(JSON.parse(h));
      if (hb) setHabits(JSON.parse(hb));
    }, 0);
  }, []);

  const saveHealth = useCallback((h: Health) => { setHealth(h); localStorage.setItem('lifeai_health', JSON.stringify(h)); }, []);
  const saveHabits = useCallback((h: Habit[]) => { setHabits(h); localStorage.setItem('lifeai_habits', JSON.stringify(h)); }, []);

  const adjust = (metric: keyof Health, delta: number) => {
    if (metric === 'mood') return;
    const maxes = { water: 8, sleep: 8, steps: 10000, mood: 0 };
    const val = Math.max(0, Math.min((health[metric] as number) + delta, maxes[metric]));
    saveHealth({ ...health, [metric]: val });
  };

  const setMood = (emoji: string, label: string) => {
    saveHealth({ ...health, mood: `${emoji} ${label}` });
    show(`Mood logged: ${emoji} ${label}`);
  };

  const addHabit = () => {
    if (!habitName.trim()) { show('⚠️ Enter a habit name!'); return; }
    saveHabits([...habits, { id: Date.now(), name: habitName.trim(), icon: habitIcon, done: false }]);
    setHabitName(''); setShowAddForm(false);
    show(`${habitIcon} Habit added!`);
  };

  const toggleHabit = (id: number) => saveHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));

  const metrics = [
    { key: 'water', icon: '💧', label: 'Water Intake', value: health.water, max: 8, unit: 'glasses', color: 'from-[#38bdf8] to-accent-cyan', d: 1 },
    { key: 'sleep', icon: '😴', label: 'Sleep Hours', value: health.sleep, max: 8, unit: 'hrs', color: 'from-accent-violet to-accent-purple', d: 1 },
    { key: 'steps', icon: '👟', label: 'Steps Today', value: health.steps, max: 10000, unit: '', color: 'from-accent-green to-[#10b981]', d: 500 },
  ];

  const moods = [
    { emoji: '😢', label: 'Sad' }, { emoji: '😐', label: 'Neutral' }, { emoji: '🙂', label: 'Good' },
    { emoji: '😄', label: 'Happy' }, { emoji: '🤩', label: 'Amazing' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-fadein">
      <div className="text-center mb-10">
        <span className="inline-block bg-accent-purple/12 border border-accent-purple/30 text-accent-purple px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4">🌿 Wellness AI</span>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">Wellness Coach</h2>
        <p className="text-text-secondary max-w-[560px] mx-auto leading-relaxed">Build healthy habits with AI guidance. Track water, sleep, steps and mood every day.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.key} className="bg-bg-card border border-border rounded-3xl p-6 backdrop-blur-xl transition-all hover:border-border-hover hover:translate-y-[-2px]">
            <div className="text-3xl mb-3">{m.icon}</div>
            <div className="text-xs text-text-secondary mb-1">{m.label}</div>
            <div className="text-lg font-bold font-display mb-3.5"><span>{m.key === 'steps' ? m.value.toLocaleString() : m.value}</span> / {m.key === 'steps' ? '10,000' : m.max} {m.unit}</div>
            <div className="flex gap-2 mb-3.5">
              <button onClick={() => adjust(m.key as keyof Health, -m.d)} className="bg-bg-secondary border border-border text-text-primary px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-all hover:border-accent-purple hover:text-accent-purple">−{m.d > 1 ? m.d : ''}</button>
              <button onClick={() => adjust(m.key as keyof Health, m.d)} className="bg-bg-secondary border border-border text-text-primary px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-all hover:border-accent-purple hover:text-accent-purple">+{m.d > 1 ? m.d : ''}</button>
            </div>
            <div className="bg-bg-secondary rounded-md h-2 overflow-hidden">
              <div className={`h-full rounded-md transition-all duration-400 bg-gradient-to-r ${m.color}`} style={{ width: `${(m.value / m.max) * 100}%` }} />
            </div>
          </div>
        ))}

        {/* Mood */}
        <div className="bg-bg-card border border-border rounded-3xl p-6 backdrop-blur-xl transition-all hover:border-border-hover hover:translate-y-[-2px]">
          <div className="text-3xl mb-3">😊</div>
          <div className="text-xs text-text-secondary mb-1">Today&apos;s Mood</div>
          <div className="text-lg font-bold font-display mb-3.5">{health.mood || 'Not set'}</div>
          <div className="flex gap-2">
            {moods.map((m) => (
              <button key={m.label} onClick={() => setMood(m.emoji, m.label)} title={m.label}
                className={`bg-bg-secondary border text-2xl px-2.5 py-1.5 rounded-lg cursor-pointer transition-all hover:scale-110 hover:border-accent-purple
                  ${health.mood?.includes(m.emoji) ? 'bg-accent-purple/15 border-accent-purple' : 'border-border'}`}>
                {m.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Habits */}
      <div className="bg-bg-card border border-border rounded-3xl p-6 mb-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Daily Habits</h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-accent-purple/12 border border-accent-purple/30 text-accent-purple px-4 py-2 rounded-[10px] text-xs font-semibold cursor-pointer transition-all hover:bg-accent-purple/20">+ Add Habit</button>
        </div>
        {showAddForm && (
          <div className="flex gap-2.5 flex-wrap mb-4 p-4 bg-bg-secondary rounded-xl">
            <input value={habitName} onChange={(e) => setHabitName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              placeholder="Habit name..." className="flex-1 bg-bg-card border border-border text-text-primary px-3.5 py-2 rounded-[9px] text-sm outline-none" />
            <select value={habitIcon} onChange={(e) => setHabitIcon(e.target.value)} className="bg-bg-card border border-border text-text-primary px-3 py-2 rounded-[9px] text-sm cursor-pointer">
              {['🧘','📖','🏃','🥗','🌙','☕','📝','🎵'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button onClick={addHabit} className="bg-gradient-to-r from-accent-purple to-accent-cyan text-white px-5 py-2 rounded-[9px] font-semibold text-sm cursor-pointer">Save</button>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {habits.map((h) => (
            <button key={h.id} onClick={() => toggleHabit(h.id)}
              className={`flex items-center gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-all text-left
                ${h.done ? 'border-accent-green/40 bg-accent-green/6' : 'bg-bg-secondary border-border hover:border-border-hover'}`}>
              <span className="text-2xl">{h.icon}</span>
              <span className="text-sm font-medium flex-1">{h.name}</span>
              <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                ${h.done ? 'bg-accent-green border-accent-green' : 'border-border'}`}>
                {h.done && <span className="text-white text-[0.55rem] font-bold">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-gradient-to-br from-accent-purple/10 to-accent-cyan/5 border border-accent-purple/20 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-3 text-sm font-semibold">
          <span>🤖 AI Wellness Advice</span>
          <button onClick={() => setTipIdx((i) => (i + 1) % wellnessTips.length)} className="bg-accent-purple/12 border border-accent-purple/30 text-accent-purple px-3.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all hover:bg-accent-purple/20">↻ New Tip</button>
        </div>
        <p className="text-text-secondary leading-relaxed text-sm">{wellnessTips[tipIdx]}</p>
      </div>
    </div>
  );
}
