'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/Toast';
import { aiTaskSuggestions } from '@/lib/ai-data';

interface Task { id: number; text: string; priority: string; done: boolean; createdAt: string; }

export default function TasksPage() {
  const { show } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    const saved = localStorage.getItem('lifeai_tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const save = useCallback((t: Task[]) => { setTasks(t); localStorage.setItem('lifeai_tasks', JSON.stringify(t)); }, []);

  const addTask = () => {
    if (!input.trim()) { show('⚠️ Please enter a task!'); return; }
    const task: Task = { id: Date.now(), text: input.trim(), priority, done: false, createdAt: new Date().toLocaleString() };
    save([...tasks, task]);
    setInput('');
    show('✅ Task added!');
  };

  const toggleTask = (id: number) => save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id: number) => { save(tasks.filter(t => t.id !== id)); show('🗑 Task removed!'); };

  const cols = { high: tasks.filter(t => !t.done && t.priority === 'high'), medium: tasks.filter(t => !t.done && t.priority === 'medium'), low: tasks.filter(t => !t.done && t.priority === 'low'), done: tasks.filter(t => t.done) };

  const suggestion = tasks.length === 0 ? 'Add your first task and I\'ll help you prioritize!' :
    cols.done.length === tasks.length ? '🎉 All tasks complete! You crushed it today!' :
    aiTaskSuggestions[Math.floor(Math.random() * aiTaskSuggestions.length)];

  const colConfig = [
    { key: 'high' as const, label: 'High Priority', dot: 'bg-accent-red shadow-[0_0_8px_var(--color-accent-red)]', items: cols.high },
    { key: 'medium' as const, label: 'Medium Priority', dot: 'bg-accent-yellow shadow-[0_0_8px_var(--color-accent-yellow)]', items: cols.medium },
    { key: 'low' as const, label: 'Low Priority', dot: 'bg-accent-green shadow-[0_0_8px_var(--color-accent-green)]', items: cols.low },
    { key: 'done' as const, label: 'Completed', dot: 'bg-text-muted', items: cols.done },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-fadein">
      <div className="text-center mb-10">
        <span className="inline-block bg-accent-purple/12 border border-accent-purple/30 text-accent-purple px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4">✅ Smart Planner</span>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">Task Manager</h2>
        <p className="text-text-secondary max-w-[560px] mx-auto leading-relaxed">Let AI help you prioritize what matters most.</p>
      </div>

      {/* Add Task */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..." className="flex-1 min-w-[200px] bg-bg-card border border-border text-text-primary px-4 py-3 rounded-xl text-sm outline-none transition-all focus:border-accent-purple placeholder:text-text-muted" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="bg-bg-card border border-border text-text-primary px-3.5 py-3 rounded-xl text-sm outline-none cursor-pointer">
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <button onClick={addTask} className="bg-gradient-to-r from-accent-purple to-accent-cyan text-white px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(129,140,248,0.35)] whitespace-nowrap">+ Add Task</button>
      </div>

      {/* AI Suggestion */}
      <div className="bg-accent-purple/6 border border-accent-purple/20 rounded-xl px-4 py-3 flex items-center gap-2.5 mb-7 text-sm text-text-secondary">
        <span className="text-base">🤖</span> {suggestion}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {colConfig.map((col) => (
          <div key={col.key} className="bg-bg-card border border-border rounded-3xl p-5 backdrop-blur-xl min-h-[300px]">
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
              <h3 className="text-sm font-semibold flex-1">{col.label}</h3>
              <span className="bg-bg-secondary text-text-secondary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{col.items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {col.items.map((task) => (
                <div key={task.id} className="bg-bg-secondary border border-border rounded-[10px] p-3 transition-all hover:border-border-hover" style={{animation:'fadeIn 0.3s ease'}}>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleTask(task.id)}
                      className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all
                        ${task.done ? 'bg-accent-green border-accent-green' : 'border-border bg-transparent'}`}>
                      {task.done && <span className="text-white text-[0.6rem] font-bold">✓</span>}
                    </button>
                    <span className={`text-sm flex-1 ${task.done ? 'line-through text-text-muted' : ''}`}>{task.text}</span>
                    <button onClick={() => deleteTask(task.id)} className="bg-transparent border-none cursor-pointer text-text-muted text-base transition-all hover:text-accent-red p-0.5">🗑</button>
                  </div>
                  <div className="text-[0.72rem] text-text-muted mt-1.5 ml-[26px]">{task.createdAt}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
