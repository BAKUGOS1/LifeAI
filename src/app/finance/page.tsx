'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/Toast';
import { categoryEmojis } from '@/lib/ai-data';

interface Transaction { id: number; desc: string; amount: number; type: string; category: string; date: string; }

export default function FinancePage() {
  const { show } = useToast();
  const [transactions, setTx] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState(0);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food');
  const [budgetInput, setBudgetInput] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('lifeai_transactions');
    const b = localStorage.getItem('lifeai_budget');
    setTimeout(() => {
      if (t) setTx(JSON.parse(t));
      if (b) setBudget(parseFloat(b));
    }, 0);
  }, []);

  const saveTx = useCallback((t: Transaction[]) => { setTx(t); localStorage.setItem('lifeai_transactions', JSON.stringify(t)); }, []);

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const budgetPct = budget > 0 ? Math.min((expense / budget) * 100, 100) : 0;

  const addTx = () => {
    const amt = parseFloat(amount);
    if (!desc.trim() || !amt || isNaN(amt)) { show('⚠️ Please fill all fields!'); return; }
    const t: Transaction = { id: Date.now(), desc: desc.trim(), amount: amt, type, category, date: new Date().toLocaleDateString() };
    saveTx([...transactions, t]);
    setDesc(''); setAmount('');
    show(`${type === 'income' ? '📈' : '📉'} Transaction added!`);
  };

  const deleteTx = (id: number) => { saveTx(transactions.filter(t => t.id !== id)); show('🗑 Transaction removed!'); };

  const setBudgetFn = () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) { show('⚠️ Enter a valid budget!'); return; }
    setBudget(val); localStorage.setItem('lifeai_budget', String(val)); setBudgetInput('');
    show(`💰 Budget set to ₹${val.toLocaleString()}!`);
  };

  const ratio = income > 0 ? expense / income : 0;
  const finTip = ratio > 0.8 ? '🤖 Tip: You\'re spending over 80% of income. Try the 50-30-20 rule!' :
    ratio > 0.5 ? '🤖 Good job! Invest your remaining savings instead of leaving them idle.' :
    ratio < 0.3 && income > 0 ? '🤖 Excellent saving rate! Consider long-term SIP investments!' :
    '💡 Add transactions to get AI savings tips!';

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-fadein">
      <div className="text-center mb-10">
        <span className="inline-block bg-accent-purple/12 border border-accent-purple/30 text-accent-purple px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4">💰 Smart Finance</span>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">Finance Tracker</h2>
        <p className="text-text-secondary max-w-[560px] mx-auto leading-relaxed">Track your income and expenses, set goals, and get AI-powered saving tips.</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-accent-purple/10 to-accent-cyan/5 border border-accent-purple/20 rounded-3xl p-7 backdrop-blur-xl">
          <div className="text-sm text-text-secondary mb-2">Total Balance</div>
          <div className="font-display text-4xl font-extrabold gradient-text mb-1.5">₹{balance.toLocaleString()}</div>
          <div className={`text-sm ${balance >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>{balance >= 0 ? '+' : ''}₹{balance.toLocaleString()} this month</div>
        </div>
        <div className="bg-bg-card border border-border rounded-3xl p-6 flex items-center gap-4 backdrop-blur-xl">
          <div className="text-3xl">📈</div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Income</div>
            <div className="text-xl font-bold font-display text-accent-green">₹{income.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-3xl p-6 flex items-center gap-4 backdrop-blur-xl">
          <div className="text-3xl">📉</div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Expenses</div>
            <div className="text-xl font-bold font-display text-accent-red">₹{expense.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-bg-card border border-border rounded-3xl p-6 mb-6 backdrop-blur-xl">
        <div className="flex justify-between text-sm text-text-secondary mb-3">
          <span>Monthly Budget</span>
          <span>₹{expense.toLocaleString()} / ₹{(budget || 0).toLocaleString()}</span>
        </div>
        <div className="bg-bg-secondary rounded-lg h-2.5 overflow-hidden mb-4">
          <div className="h-full rounded-lg transition-all duration-500" style={{ width: `${budgetPct}%`, background: budgetPct > 80 ? 'linear-gradient(90deg,#f87171,#fbbf24)' : 'linear-gradient(135deg,#818cf8,#22d3ee)' }} />
        </div>
        <div className="flex gap-3">
          <input value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} type="number" placeholder="Set monthly budget (₹)"
            className="flex-1 bg-bg-secondary border border-border text-text-primary px-3.5 py-2.5 rounded-[10px] text-sm outline-none" />
          <button onClick={setBudgetFn} className="bg-accent-purple/15 border border-accent-purple/30 text-accent-purple px-5 py-2.5 rounded-[10px] cursor-pointer text-sm font-semibold transition-all hover:bg-accent-purple/25">Set Budget</button>
        </div>
      </div>

      {/* Add Tx */}
      <div className="bg-bg-card border border-border rounded-3xl p-6 mb-6 backdrop-blur-xl">
        <h3 className="font-bold mb-4">Add Transaction</h3>
        <div className="flex gap-2.5 flex-wrap">
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="flex-1 min-w-[140px] bg-bg-secondary border border-border text-text-primary px-3.5 py-2.5 rounded-[10px] text-sm outline-none focus:border-accent-purple placeholder:text-text-muted" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount (₹)" className="flex-1 min-w-[100px] bg-bg-secondary border border-border text-text-primary px-3.5 py-2.5 rounded-[10px] text-sm outline-none focus:border-accent-purple placeholder:text-text-muted" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="bg-bg-secondary border border-border text-text-primary px-3.5 py-2.5 rounded-[10px] text-sm cursor-pointer">
            <option value="income">💚 Income</option>
            <option value="expense">🔴 Expense</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-bg-secondary border border-border text-text-primary px-3.5 py-2.5 rounded-[10px] text-sm cursor-pointer">
            {Object.entries(categoryEmojis).map(([k, v]) => <option key={k} value={k}>{v} {k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
          </select>
          <button onClick={addTx} className="bg-gradient-to-r from-accent-purple to-accent-cyan text-white px-5 py-2.5 rounded-[10px] font-semibold text-sm cursor-pointer transition-all hover:translate-y-[-1px] whitespace-nowrap">+ Add</button>
        </div>
      </div>

      {/* Tx List */}
      <div className="bg-bg-card border border-border rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
          <h3 className="font-bold">Recent Transactions</h3>
          <div className="text-xs text-accent-purple bg-accent-purple/8 border border-accent-purple/20 px-3.5 py-2 rounded-full max-w-[500px]">{finTip}</div>
        </div>
        {transactions.length === 0 ? (
          <div className="text-center text-text-muted py-10">No transactions yet. Start tracking your money! 💸</div>
        ) : (
          <div className="flex flex-col gap-2">
            {[...transactions].reverse().map((t) => (
              <div key={t.id} className="flex items-center gap-3.5 bg-bg-secondary border border-border rounded-xl px-4 py-3.5 transition-all hover:border-border-hover" style={{animation:'fadeIn 0.3s ease'}}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg bg-bg-card shrink-0">{categoryEmojis[t.category] || '📦'}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t.desc}</div>
                  <div className="text-xs text-text-muted mt-0.5">{t.category} · {t.date}</div>
                </div>
                <div className={`text-base font-bold font-display ${t.type === 'income' ? 'text-accent-green' : 'text-accent-red'}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}</div>
                <button onClick={() => deleteTx(t.id)} className="bg-transparent border-none text-text-muted cursor-pointer text-base transition-all hover:text-accent-red">🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
