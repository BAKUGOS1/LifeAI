// ==========================================
//  LifeAI — Main Application Logic
// ==========================================

// ---- STATE ----
const state = {
  tasks: JSON.parse(localStorage.getItem('lifeai_tasks') || '[]'),
  transactions: JSON.parse(localStorage.getItem('lifeai_transactions') || '[]'),
  budget: parseFloat(localStorage.getItem('lifeai_budget') || '0'),
  habits: JSON.parse(localStorage.getItem('lifeai_habits') || '[]'),
  health: JSON.parse(localStorage.getItem('lifeai_health') || JSON.stringify({ water: 0, sleep: 0, steps: 0, mood: '' })),
  focusSessions: parseInt(localStorage.getItem('lifeai_sessions') || '0'),
  focusTime: parseInt(localStorage.getItem('lifeai_focusTime') || '0'),
  selectedCategory: 'general',
};

function save(key, val) { localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : String(val)); }

// ---- NAVIGATION ----
function switchSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('section-' + id)?.classList.add('active');
  document.getElementById('tab-' + id)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => switchSection(tab.dataset.section));
});

// ---- LIVE CLOCK ----
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const el = document.getElementById('liveTime');
  if (el) el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ---- THEME TOGGLE ----
let isDark = true;
document.getElementById('themeToggle')?.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
});

// ---- PARTICLE CANVAS ----
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '#818cf8' : '#22d3ee'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---- TOAST ----
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ---- COUNTER ANIMATION ----
function animateCounter(el, target) {
  let start = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) clearInterval(timer);
  }, 30);
}
setTimeout(() => {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.count));
  });
}, 500);

// ---- DAILY TIPS ----
const dailyTips = [
  "Start your day by writing down 3 things you're grateful for — it rewires your brain for positivity.",
  "The 2-minute rule: if a task takes less than 2 minutes, do it now. It reduces mental clutter by 40%.",
  "Batch similar tasks together. Context-switching costs up to 23 minutes of lost focus per interruption.",
  "Drink a glass of water before every meal. It aids digestion and often reduces unnecessary snacking.",
  "Your phone's blue light at night delays melatonin production by 90 minutes. Try blue-light filters after 8PM.",
  "The 50-10 rule: work for 50 minutes, then rest 10 minutes. More sustainable than Pomodoro for deep work.",
  "Financial tip: automate your savings on payday. What you don't see, you don't spend.",
  "Exercise for just 20 minutes releases BDNF — the brain's 'miracle grow' that sharpens focus and memory.",
  "Write your top 3 priorities the night before. Morning decisions are often rushed and less strategic.",
  "Social connection is as important for health as diet and exercise. Schedule time with people who energize you.",
  "Compound interest of learning: 1% improvement daily makes you 37x better in a year.",
  "Your environment shapes your behavior. Design your workspace to make good habits easy and bad habits hard.",
];
let tipIndex = Math.floor(Math.random() * dailyTips.length);

function refreshTip() {
  tipIndex = (tipIndex + 1) % dailyTips.length;
  const el = document.getElementById('dailyTip');
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = dailyTips[tipIndex]; el.style.opacity = '1'; }, 200);
  el.style.transition = 'opacity 0.2s';
}
document.getElementById('dailyTip').textContent = dailyTips[tipIndex];

// ==========================================
//  AI PROBLEM SOLVER
// ==========================================

const aiResponses = {
  general: [
    { problem: /time|schedule|manage|busy|overwhelm/i, steps: ["Identify your top 3 priorities for the day using the Eisenhower Matrix", "Time-block your calendar — assign specific tasks to specific times", "Use the 2-minute rule for small tasks", "Schedule breaks every 90 minutes to maintain peak performance", "Review and adjust your schedule each evening"] },
    { problem: /stress|anxious|anxiety|nervous|worry/i, steps: ["Practice box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s", "Write down your worries and separate 'controllable' from 'uncontrollable'", "Take a 10-minute walk — physical movement reduces cortisol by 26%", "Use progressive muscle relaxation before bed", "Talk to someone you trust about what's bothering you"] },
    { problem: /focus|distract|concentrate|attention/i, steps: ["Create a distraction-free environment — phone in another room", "Use the Pomodoro Technique: 25 min work + 5 min break", "Put on white noise or lo-fi music to mask distracting sounds", "Eat a light meal — heavy meals reduce cognitive performance by 30%", "Set a clear, specific goal before starting any task"] },
    { problem: /motivat|lazy|procrastinat/i, steps: ["Break your task into the smallest possible action step", "Use 'implementation intentions': I will do X at Y time in Z place", "Track progress visually — your brain loves seeing momentum", "Remove friction by preparing materials the night before", "Use accountability: tell someone your goal and deadline"] },
  ],
  health: [
    { problem: /sleep|insomnia|tired|fatigue/i, steps: ["Set a consistent sleep and wake time, even on weekends", "No screens 1 hour before bed — use blue light filters if needed", "Keep your bedroom at 65–68°F (18–20°C) for optimal sleep", "Avoid caffeine after 2PM as it has a 6-hour half-life", "Try a 10-minute relaxation body scan before sleeping"] },
    { problem: /weight|diet|eat|food|nutrition/i, steps: ["Eat slowly and without screens — takes 20 min for fullness signals", "Fill half your plate with vegetables at every meal", "Drink water before meals to naturally reduce portion sizes", "Meal prep on Sundays to avoid impulsive unhealthy choices", "Track your food for just 3 days to reveal hidden calorie sources"] },
    { problem: /exercise|workout|gym|fit|active/i, steps: ["Start with just 10 minutes daily — consistency beats intensity", "Schedule your workout like a meeting — block it in your calendar", "Find an accountability partner or join a group fitness class", "Vary your routine to prevent plateaus and maintain interest", "Celebrate small wins — reward yourself for showing up"] },
    { problem: /headache|pain|back|posture/i, steps: ["Check your monitor height — top of screen should be at eye level", "Apply the 20-20-20 rule: every 20 min, look 20 feet away for 20 sec", "Stretch your neck and shoulders every hour", "Stay hydrated — many headaches are early dehydration signs", "Consider an ergonomic chair or standing desk setup"] },
  ],
  finance: [
    { problem: /budget|money|spend|sav/i, steps: ["Track every expense for 30 days using a simple app or notebook", "Apply the 50-30-20 rule: 50% needs, 30% wants, 20% savings", "Set up automatic transfers to savings on payday", "Identify your top 3 'leaking' expenses and cut them by 50%", "Create a visual spending dashboard — visibility creates accountability"] },
    { problem: /debt|loan|credit|borrow/i, steps: ["List all debts with interest rates — attack the highest rate first (Debt Avalanche)", "Call your lender to negotiate a lower interest rate", "Set up autopay to never miss a payment and protect your credit", "Look for side income opportunities to accelerate debt payoff", "Avoid new debt while paying existing — freeze discretionary spending"] },
    { problem: /invest|stock|market|wealth|rich/i, steps: ["Start with index funds — they outperform 90% of active managers over 10 years", "Maximize your tax-advantaged accounts first (PPF, NPS, ELSS in India)", "Invest automatically on a fixed schedule (SIP) to remove emotional decisions", "Diversify across equity, debt, and gold based on your risk tolerance", "The best time to invest was yesterday. The second best time is today."] },
  ],
  work: [
    { problem: /meeting|call|presentation|present/i, steps: ["Prepare a 1-page agenda and share it 24 hours in advance", "State the objective in the first 2 minutes of any meeting", "Use the STAR format for presentations: Situation, Task, Action, Result", "Anticipate the top 3 questions and prepare answers in advance", "End with a clear next step assigned to a specific person with a deadline"] },
    { problem: /colleague|boss|manager|conflict|team/i, steps: ["Request a private 1:1 conversation rather than addressing issues in groups", "Use 'I' statements: 'I feel X when Y happens' instead of blame", "Listen to understand, not just to respond — ask clarifying questions", "Find common ground first before presenting your perspective", "Follow up difficult conversations with a written summary"] },
  ],
  productivity: [
    { problem: /.*/i, steps: ["Identify your peak energy hours and protect them for deep work", "Use the 80/20 rule — 20% of tasks produce 80% of results", "Batch email and messages to 2-3 times per day instead of constantly checking", "End each day with a 'shutdown ritual' — a brief review and tomorrow's plan", "Learn to say no strategically — every yes is a no to something else"] },
  ],
  mental: [
    { problem: /.*/i, steps: ["Practice 5 minutes of mindful breathing each morning to set a calm tone", "Keep a daily gratitude journal — 3 specific things you appreciate", "Limit news consumption to 15 minutes once daily", "Spend time in nature — even 20 minutes in a park reduces cortisol", "Connect with others — loneliness is as harmful as smoking 15 cigarettes daily"] },
  ],
  relationship: [
    { problem: /.*/i, steps: ["Schedule quality time intentionally — relationships need nourishment", "Practice active listening: put away devices and give full attention", "Express appreciation regularly — notice and name what you value in others", "Address conflicts quickly and privately, not publicly", "Set healthy boundaries clearly and kindly — it builds mutual respect"] },
  ],
};

const genericResponse = {
  steps: [
    "Break the problem into smaller, manageable components",
    "Identify the root cause — ask 'why' 5 times to get deeper",
    "Research 3 possible solutions and evaluate their trade-offs",
    "Choose the most actionable solution and set a specific deadline",
    "Take the first small action today and build momentum from there"
  ]
};

function findSolution(text, category) {
  const catResponses = aiResponses[category] || aiResponses.general;
  for (const r of catResponses) {
    if (r.problem.test(text)) return r.steps;
  }
  // Try general
  for (const r of aiResponses.general) {
    if (r.problem.test(text)) return r.steps;
  }
  return genericResponse.steps;
}

function appendMessage(role, content, isHTML = false) {
  const container = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = `chat-msg ${role === 'ai' ? 'ai-msg' : 'user-msg'}`;
  const avatar = role === 'ai' ? '🤖' : '🧑';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  msg.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div class="msg-bubble">
      ${isHTML ? content : `<p>${content}</p>`}
      <div class="msg-time">${now}</div>
    </div>`;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function appendTyping() {
  const container = document.getElementById('chatMessages');
  const el = document.createElement('div');
  el.className = 'chat-msg ai-msg'; el.id = 'typingIndicator';
  el.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() { document.getElementById('typingIndicator')?.remove(); }

function buildSolutionHTML(steps) {
  const stepsHTML = steps.map((s, i) => `
    <div class="solution-step">
      <div class="step-num">${i + 1}</div>
      <div class="step-text">${s}</div>
    </div>`).join('');
  return `<p style="margin-bottom:14px;font-weight:600">Here's your personalized action plan: 🎯</p>
    <div class="solution-card">${stepsHTML}</div>`;
}

function sendProblem() {
  const input = document.getElementById('problemInput');
  const text = input.value.trim();
  if (!text) return;
  appendMessage('user', text);
  input.value = '';
  document.getElementById('quickPrompts').style.display = 'none';
  appendTyping();
  const delay = 1200 + Math.random() * 800;
  setTimeout(() => {
    removeTyping();
    const steps = findSolution(text, state.selectedCategory);
    appendMessage('ai', buildSolutionHTML(steps), true);
    const n = parseInt(localStorage.getItem('lifeai_solved') || '0') + 1;
    localStorage.setItem('lifeai_solved', n);
  }, delay);
}

function sendQuickPrompt(text) {
  document.getElementById('problemInput').value = text;
  sendProblem();
}

document.getElementById('problemInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendProblem(); }
});

// Category pills
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedCategory = pill.dataset.cat;
  });
});

// ==========================================
//  TASK MANAGER
// ==========================================

function addTask() {
  const input = document.getElementById('taskInput');
  const priorityEl = document.getElementById('taskPriority');
  const text = input.value.trim();
  if (!text) { showToast('⚠️ Please enter a task!'); return; }
  const task = {
    id: Date.now(), text, priority: priorityEl.value,
    done: false, createdAt: new Date().toLocaleString()
  };
  state.tasks.push(task);
  save('lifeai_tasks', state.tasks);
  input.value = '';
  renderTasks();
  showToast('✅ Task added!');
  updateAISuggestion();
}

document.getElementById('taskInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

function renderTasks() {
  const cols = { high: [], medium: [], low: [], done: [] };
  state.tasks.forEach(t => { if (t.done) cols.done.push(t); else cols[t.priority].push(t); });
  ['high', 'medium', 'low', 'done'].forEach(col => {
    const list = document.getElementById(`taskList-${col}`);
    if (!list) return;
    list.innerHTML = '';
    cols[col].forEach(task => {
      const el = document.createElement('div');
      el.className = 'task-item';
      el.innerHTML = `
        <div class="task-item-header">
          <div class="task-check ${task.done ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
          <span class="task-name ${task.done ? 'done' : ''}">${escHtml(task.text)}</span>
          <button class="task-delete" onclick="deleteTask(${task.id})">🗑</button>
        </div>
        <div class="task-time">${task.createdAt}</div>`;
      list.appendChild(el);
    });
  });
  document.getElementById('highCount').textContent = cols.high.length;
  document.getElementById('medCount').textContent = cols.medium.length;
  document.getElementById('lowCount').textContent = cols.low.length;
  document.getElementById('doneCount').textContent = cols.done.length;
}

function toggleTask(id) {
  const t = state.tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; save('lifeai_tasks', state.tasks); renderTasks(); updateAISuggestion(); }
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  save('lifeai_tasks', state.tasks); renderTasks(); updateAISuggestion();
  showToast('🗑 Task removed!');
}

const aiTaskSuggestions = [
  "You have high-priority tasks pending — tackle them during your peak energy hours in the morning! ⚡",
  "Great progress! Complete remaining tasks using the Pomodoro technique for maximum focus.",
  "Tip: Batch all similar tasks together to reduce context-switching overhead.",
  "Your today's tasks are clear — start with the hardest one to get momentum rolling!",
  "All tasks done? Use this time to plan tomorrow's priorities in advance. 🌟",
  "Breaking large tasks into subtasks can reduce procrastination by 60%.",
];

function updateAISuggestion() {
  const total = state.tasks.length;
  const done = state.tasks.filter(t => t.done).length;
  const el = document.getElementById('aiSuggestionText');
  if (!el) return;
  if (total === 0) { el.textContent = 'Add your first task and I\'ll help you prioritize your day!'; return; }
  if (done === total) { el.textContent = '🎉 All tasks complete! You crushed it today — time to plan tomorrow!'; return; }
  el.textContent = aiTaskSuggestions[Math.floor(Math.random() * aiTaskSuggestions.length)];
}

renderTasks(); updateAISuggestion();

// ==========================================
//  FINANCE TRACKER
// ==========================================

function updateFinanceUI() {
  let income = 0, expense = 0;
  state.transactions.forEach(t => { if (t.type === 'income') income += t.amount; else expense += t.amount; });
  const balance = income - expense;
  document.getElementById('totalBalance').textContent = `₹${balance.toLocaleString()}`;
  document.getElementById('totalIncome').textContent = `₹${income.toLocaleString()}`;
  document.getElementById('totalExpense').textContent = `₹${expense.toLocaleString()}`;
  const change = income - expense;
  const changeEl = document.getElementById('balanceChange');
  changeEl.textContent = `${change >= 0 ? '+' : ''}₹${change.toLocaleString()} this month`;
  changeEl.style.color = change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

  // Budget bar
  const budget = state.budget;
  const percent = budget > 0 ? Math.min((expense / budget) * 100, 100) : 0;
  document.getElementById('budgetBarFill').style.width = percent + '%';
  document.getElementById('budgetBarFill').style.background = percent > 80 ? 'linear-gradient(90deg,#f87171,#fbbf24)' : 'linear-gradient(135deg,#818cf8,#22d3ee)';
  document.getElementById('budgetStatus').textContent = `₹${expense.toLocaleString()} / ₹${(budget || 0).toLocaleString()}`;

  renderTransactions(income, expense);
}

const catIcons = { food: '🍔', transport: '🚗', shopping: '🛍️', health: '❤️', entertainment: '🎬', education: '📚', salary: '💼', other: '📦' };

function renderTransactions(income, expense) {
  const list = document.getElementById('transList');
  if (!list) return;
  if (state.transactions.length === 0) {
    list.innerHTML = '<div class="trans-empty">No transactions yet. Start tracking your money! 💸</div>';
    return;
  }
  list.innerHTML = '';
  [...state.transactions].reverse().forEach(t => {
    const el = document.createElement('div');
    el.className = 'trans-item';
    el.innerHTML = `
      <div class="trans-cat-icon">${catIcons[t.category] || '📦'}</div>
      <div class="trans-details">
        <div class="trans-desc">${escHtml(t.desc)}</div>
        <div class="trans-meta">${t.category} · ${t.date}</div>
      </div>
      <div class="trans-amount ${t.type}">${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString()}</div>
      <button class="trans-del" onclick="deleteTransaction(${t.id})">🗑</button>`;
    list.appendChild(el);
  });

  // AI Finance Tip
  const tipEl = document.getElementById('aiFinanceTip');
  if (tipEl) {
    const ratio = income > 0 ? expense / income : 0;
    if (ratio > 0.8) tipEl.textContent = '🤖 Tip: You\'re spending over 80% of income. Try the 50-30-20 rule!';
    else if (ratio > 0.5) tipEl.textContent = '🤖 Good job! Invest your remaining 30-40% instead of leaving it idle.';
    else if (ratio < 0.3) tipEl.textContent = '🤖 Excellent! You\'re saving well. Consider long-term SIP investments!';
    else tipEl.textContent = '🤖 Tip: Automate savings on payday to remove the temptation to spend.';
  }
}

function addTransaction() {
  const desc = document.getElementById('transDesc').value.trim();
  const amount = parseFloat(document.getElementById('transAmount').value);
  const type = document.getElementById('transType').value;
  const category = document.getElementById('transCategory').value;
  if (!desc || !amount || isNaN(amount)) { showToast('⚠️ Please fill all fields!'); return; }
  const t = {
    id: Date.now(), desc, amount, type, category,
    date: new Date().toLocaleDateString()
  };
  state.transactions.push(t);
  save('lifeai_transactions', state.transactions);
  document.getElementById('transDesc').value = '';
  document.getElementById('transAmount').value = '';
  updateFinanceUI();
  showToast(`${type === 'income' ? '📈' : '📉'} Transaction added!`);
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter(t => t.id !== id);
  save('lifeai_transactions', state.transactions);
  updateFinanceUI();
  showToast('🗑 Transaction removed!');
}

function setBudget() {
  const val = parseFloat(document.getElementById('budgetInput').value);
  if (isNaN(val) || val <= 0) { showToast('⚠️ Enter a valid budget!'); return; }
  state.budget = val;
  save('lifeai_budget', val);
  document.getElementById('budgetInput').value = '';
  updateFinanceUI();
  showToast(`💰 Budget set to ₹${val.toLocaleString()}!`);
}

updateFinanceUI();

// ==========================================
//  WELLNESS / HEALTH
// ==========================================

const wellnessTips = [
  "Your gut is your second brain. Eat fermented foods like yogurt and kimchi to boost mood and immunity.",
  "Cold showers for just 30 seconds boost alertness and activate brown fat to increase metabolism.",
  "Walking in nature for 20 minutes reduces activity in the brain's anxiety center (subgenual prefrontal cortex).",
  "Sleeping 7–9 hours removes 60% more brain waste (via the glymphatic system) compared to 6 hours.",
  "Deep nasal breathing activates the parasympathetic nervous system within 60 seconds — instant calm.",
  "Strength training twice weekly increases bone density, metabolism, and insulin sensitivity significantly.",
  "Sunlight in the morning sets your circadian rhythm and improves sleep quality at night.",
  "The 'longevity diet' prioritizes plants, legumes, and omega-3s — shown to add 10+ healthy years.",
  "Laughter releases endorphins, reduces stress hormones, and even temporarily boosts immune function.",
  "Just 10 minutes of mindfulness daily reduces amygdala reactivity — less emotional reactivity over time.",
];
let wellnessTipIndex = 0;

function refreshWellnessTip() {
  wellnessTipIndex = (wellnessTipIndex + 1) % wellnessTips.length;
  const el = document.getElementById('wellnessTip');
  if (el) { el.style.opacity = '0'; setTimeout(() => { el.textContent = wellnessTips[wellnessTipIndex]; el.style.opacity = '1'; el.style.transition = 'opacity 0.3s'; }, 200); }
}
const wellnessTipEl = document.getElementById('wellnessTip');
if (wellnessTipEl) wellnessTipEl.textContent = wellnessTips[0];

function adjustMetric(metric, delta) {
  const maxes = { water: 8, sleep: 8, steps: 10000 };
  state.health[metric] = Math.max(0, Math.min((state.health[metric] || 0) + delta, maxes[metric]));
  save('lifeai_health', state.health);
  renderHealth();
}

function setMood(emoji, label) {
  state.health.mood = label;
  save('lifeai_health', state.health);
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('moodLabel').textContent = `${emoji} ${label}`;
  showToast(`Mood logged: ${emoji} ${label}`);
}

function renderHealth() {
  const { water, sleep, steps } = state.health;
  document.getElementById('waterCount').textContent = water;
  document.getElementById('sleepCount').textContent = sleep;
  document.getElementById('stepsCount').textContent = steps.toLocaleString();
  document.getElementById('waterFill').style.width = (water / 8 * 100) + '%';
  document.getElementById('sleepFill').style.width = (sleep / 8 * 100) + '%';
  document.getElementById('stepsFill').style.width = (steps / 10000 * 100) + '%';
  if (state.health.mood) document.getElementById('moodLabel').textContent = state.health.mood;
}
renderHealth();

// HABITS
function addHabit() {
  const name = document.getElementById('habitInput').value.trim();
  const icon = document.getElementById('habitIcon').value;
  if (!name) { showToast('⚠️ Enter a habit name!'); return; }
  state.habits.push({ id: Date.now(), name, icon, done: false });
  save('lifeai_habits', state.habits);
  document.getElementById('habitInput').value = '';
  document.getElementById('addHabitForm').style.display = 'none';
  renderHabits();
  showToast(`${icon} Habit added!`);
}

function showAddHabit() {
  const form = document.getElementById('addHabitForm');
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
}

function toggleHabit(id) {
  const h = state.habits.find(h => h.id === id);
  if (h) { h.done = !h.done; save('lifeai_habits', state.habits); renderHabits(); }
}

function renderHabits() {
  const grid = document.getElementById('habitsGrid');
  if (!grid) return;
  if (state.habits.length === 0) {
    grid.innerHTML = '<div style="color:var(--text-muted);font-size:0.875rem;grid-column:1/-1">No habits yet. Click "+ Add Habit" to start building healthy routines! 🌱</div>';
    return;
  }
  grid.innerHTML = '';
  state.habits.forEach(h => {
    const el = document.createElement('div');
    el.className = `habit-card ${h.done ? 'done' : ''}`;
    el.onclick = () => toggleHabit(h.id);
    el.innerHTML = `<div class="habit-emoji">${h.icon}</div><div class="habit-name">${escHtml(h.name)}</div><div class="habit-check"></div>`;
    grid.appendChild(el);
  });
}
renderHabits();

// Seed default habits if none
if (state.habits.length === 0) {
  const defaults = [
    { id: 1, name: 'Morning Meditation', icon: '🧘', done: false },
    { id: 2, name: 'Daily Exercise', icon: '🏃', done: false },
    { id: 3, name: 'Read 20 Minutes', icon: '📖', done: false },
  ];
  state.habits = defaults;
  save('lifeai_habits', state.habits);
  renderHabits();
}

// ==========================================
//  FOCUS TIMER (POMODORO)
// ==========================================

const focusTips = [
  "Keep your phone in another room during focus sessions — proximity alone increases distraction.",
  "Write your goal at the top of your page before starting. It dramatically improves task completion rates.",
  "Use noise-canceling headphones with ambient sound (rain, coffee shop, lo-fi) to create a focus bubble.",
  "The brain focuses most sharply for 90-minute cycles. Align your work with your ultradian rhythm.",
  "Eat a low-glycemic snack (nuts, fruit) before deep work sessions to maintain steady energy.",
  "Hydration improves cognitive performance by up to 30%. Keep water on your desk always.",
  "The single best predictor of task completion is starting. Commit to just 2 minutes — momentum follows.",
  "Visualization: spend 60 seconds imagining yourself successfully completing the task before you begin.",
  "Eliminate decision fatigue — plan your sessions the night before so you start work, not planning.",
  "After 4 Pomodoros, take a 30-minute break. Deep rest reinforces the learning and insights from the session.",
];
let focusTipIndex = 0;

function refreshFocusTip() {
  focusTipIndex = (focusTipIndex + 1) % focusTips.length;
  const el = document.getElementById('focusTip');
  if (el) { el.style.opacity = '0'; setTimeout(() => { el.textContent = focusTips[focusTipIndex]; el.style.opacity = '1'; el.style.transition = 'opacity 0.3s'; }, 200); }
}
const focusTipEl = document.getElementById('focusTip');
if (focusTipEl) focusTipEl.textContent = focusTips[0];

let timerDuration = 25 * 60;
let timerRemaining = timerDuration;
let timerMode = 'Focus Session';
let timerRunning = false;
let timerInterval = null;
let timerSessions = 0;
const CIRCUMFERENCE = 2 * Math.PI * 96; // ~603

function setTimerMode(minutes, label, btn) {
  if (timerRunning) return;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  timerDuration = minutes * 60;
  timerRemaining = timerDuration;
  timerMode = label;
  document.getElementById('timerModeLabel').textContent = label;
  updateTimerDisplay();
  updateTimerRing(1);
}

function updateTimerDisplay() {
  const m = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
  const s = String(timerRemaining % 60).padStart(2, '0');
  document.getElementById('timerDisplay').textContent = `${m}:${s}`;
  document.title = timerRunning ? `${m}:${s} — LifeAI` : 'LifeAI';
}

function updateTimerRing(progress) {
  const el = document.getElementById('timerProgress');
  if (el) el.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
}

// Add gradient def to SVG
const svg = document.getElementById('timerSvg');
if (svg) {
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `<linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#22d3ee"/></linearGradient>`;
  svg.prepend(defs);
}

function toggleTimer() {
  timerRunning = !timerRunning;
  document.getElementById('playBtnIcon').textContent = timerRunning ? '⏸' : '▶';
  if (timerRunning) {
    timerInterval = setInterval(() => {
      timerRemaining--;
      updateTimerDisplay();
      updateTimerRing(timerRemaining / timerDuration);
      if (timerRemaining <= 0) {
        clearInterval(timerInterval); timerRunning = false;
        document.getElementById('playBtnIcon').textContent = '▶';
        onTimerComplete();
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
  }
}

function onTimerComplete() {
  timerSessions++;
  document.getElementById('timerDisplay').textContent = '00:00';
  showToast(timerMode === 'Focus Session' ? '🎉 Session complete! Take a well-deserved break!' : '⚡ Break over! Back to focus!', 4000);
  if (timerMode === 'Focus Session') {
    state.focusSessions++;
    state.focusTime += timerDuration / 60;
    save('lifeai_sessions', state.focusSessions);
    save('lifeai_focusTime', state.focusTime);
    document.getElementById('totalFocusTime').textContent = state.focusTime;
    document.getElementById('sessionsToday').textContent = state.focusSessions;
    renderSessionDots();
  }
  timerRemaining = timerDuration;
  updateTimerDisplay(); updateTimerRing(1);
}

function resetTimer() {
  clearInterval(timerInterval); timerRunning = false;
  timerRemaining = timerDuration;
  document.getElementById('playBtnIcon').textContent = '▶';
  updateTimerDisplay(); updateTimerRing(1);
}

function skipSession() {
  clearInterval(timerInterval); timerRunning = false;
  onTimerComplete();
}

function renderSessionDots() {
  const container = document.getElementById('sessionDots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.className = `session-dot ${i < state.focusSessions ? 'filled' : ''}`;
    container.appendChild(dot);
  }
}

document.getElementById('totalFocusTime').textContent = state.focusTime;
document.getElementById('sessionsToday').textContent = state.focusSessions;
updateTimerDisplay(); updateTimerRing(1); renderSessionDots();

// ==========================================
//  UTILITY
// ==========================================

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Keyboard shortcut: Enter in task input
document.addEventListener('keydown', e => {
  if (document.activeElement.id === 'habitInput' && e.key === 'Enter') addHabit();
});

// Keyboard feature card navigation
document.querySelectorAll('.feature-card[tabindex]').forEach(card => {
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
});

// Show greeting on load
setTimeout(() => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  showToast(`${greeting}! Welcome to LifeAI 🌟`);
}, 800);

console.log('%c🚀 LifeAI loaded!', 'color: #818cf8; font-size: 18px; font-weight: bold;');
