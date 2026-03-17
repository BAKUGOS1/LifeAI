'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  html?: boolean;
  time: string;
}

const categories = [
  { id: 'general', label: '🌐 General' },
  { id: 'health', label: '❤️ Health' },
  { id: 'finance', label: '💰 Finance' },
  { id: 'work', label: '💼 Work' },
  { id: 'relationship', label: '🤝 Social' },
  { id: 'productivity', label: '⚡ Productivity' },
  { id: 'mental', label: '🧠 Mental Wellness' },
];

const quickPrompts = [
  { icon: '⏰', text: "I can't manage my time effectively" },
  { icon: '😰', text: 'I feel stressed at work every day' },
  { icon: '💸', text: 'I keep overspending my monthly budget' },
  { icon: '😴', text: 'I struggle to sleep at night' },
];

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function SolverPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hello! I'm your AI Life Assistant powered by Llama 3.3. Tell me about any daily problem you're facing — whether it's about health, work, finances, relationships, or productivity. I'll help you find a smart solution! 🌟",
      time: nowTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowQuick(false);
    const userMsg: Message = { role: 'user', content: text.trim(), time: nowTime() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: text.trim(), category }),
      });
      const data = await res.json();

      let html = '';
      if (data.safety_note) {
        html += `<p style="margin-bottom:10px;color:#fbbf24;font-weight:600">${data.safety_note}</p>`;
      }
      if (data.steps && Array.isArray(data.steps)) {
        html += `<p style="margin-bottom:14px;font-weight:600">Here's your personalized action plan: 🎯</p>`;
        html += '<div style="background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.2);border-radius:12px;padding:16px;margin-top:10px">';
        data.steps.forEach((step: string, i: number) => {
          const cleanStep = step.replace(/^\d+[\.\)]\s*/, '');
          html += `<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start"><div style="width:24px;height:24px;border-radius:50%;background:rgba(52,211,153,0.2);color:#34d399;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0">${i + 1}</div><div style="font-size:0.875rem;line-height:1.6">${cleanStep}</div></div>`;
        });
        html += '</div>';
      } else if (data.error) {
        html = `<p style="color:#f87171">Sorry, something went wrong: ${data.error}. Please try again.</p>`;
      }

      setMessages((m) => [...m, { role: 'ai', content: html, html: true, time: nowTime() }]);
    } catch {
      setMessages((m) => [...m, { role: 'ai', content: '<p style="color:#f87171">Network error. Please check your connection and try again.</p>', html: true, time: nowTime() }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-fadein">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block bg-accent-purple/12 border border-accent-purple/30 text-accent-purple px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4">🤖 AI Powered</span>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">Problem Solver</h2>
        <p className="text-text-secondary max-w-[560px] mx-auto leading-relaxed">Describe your daily problem and our AI will provide a practical, step-by-step solution tailored just for you.</p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2.5 flex-wrap mb-7 justify-center">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border
              ${category === c.id ? 'bg-accent-purple/15 border-accent-purple text-accent-purple' : 'bg-bg-card border-border text-text-secondary hover:border-accent-purple hover:text-accent-purple'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-bg-card border border-border rounded-3xl overflow-hidden backdrop-blur-xl">
        {/* Messages */}
        <div ref={chatRef} className="h-[420px] overflow-y-auto p-6 flex flex-col gap-4" style={{scrollbarWidth:'thin'}}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ animation: 'msgIn 0.3s ease' }}>
              <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center text-lg shrink-0 ${m.role === 'ai' ? 'bg-accent-purple/15 border border-accent-purple/20' : 'bg-accent-cyan/15 border border-accent-cyan/20'}`}>
                {m.role === 'ai' ? '🤖' : '🧑'}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3.5 border ${m.role === 'ai' ? 'bg-bg-secondary border-border rounded-tl-[4px]' : 'bg-accent-purple/12 border-accent-purple/20 rounded-tr-[4px]'}`}>
                {m.html ? (
                  <div className="text-sm leading-relaxed text-text-primary" dangerouslySetInnerHTML={{ __html: m.content }} />
                ) : (
                  <p className="text-sm leading-relaxed text-text-primary">{m.content}</p>
                )}
                <div className="text-[0.72rem] text-text-muted mt-1.5">{m.time}</div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-lg shrink-0 bg-accent-purple/15 border border-accent-purple/20">🤖</div>
              <div className="bg-bg-secondary border border-border rounded-2xl rounded-tl-[4px] px-4 py-3.5">
                <div className="flex items-center gap-1 py-1">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-accent-purple opacity-70" style={{ animation: `typingBounce 1.2s ease-in-out infinite`, animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          {showQuick && (
            <div className="flex gap-2 flex-wrap mb-3">
              {quickPrompts.map((q) => (
                <button key={q.text} onClick={() => sendMessage(q.text)}
                  className="bg-accent-purple/8 border border-accent-purple/20 text-text-secondary px-3.5 py-1.5 rounded-full text-xs cursor-pointer transition-all hover:bg-accent-purple/15 hover:text-accent-purple hover:border-accent-purple">
                  {q.icon} {q.text}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2.5 items-end">
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Describe your daily problem here..."
              className="flex-1 bg-bg-secondary border border-border text-text-primary rounded-xl px-4 py-3 resize-none text-sm outline-none transition-all focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(129,140,248,0.1)] leading-relaxed placeholder:text-text-muted" rows={2} />
            <button onClick={() => sendMessage(input)} disabled={loading}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan border-none cursor-pointer flex items-center justify-center shrink-0 text-white transition-all hover:scale-105 hover:shadow-[0_6px_20px_rgba(129,140,248,0.4)] disabled:opacity-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
