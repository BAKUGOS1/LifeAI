import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-bg-main relative z-10 mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          <div className="col-span-1 md:col-span-1 border-b border-border md:border-none pb-8 md:pb-0">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 no-underline">
              <span className="font-display font-bold text-2xl tracking-tight text-text-primary">LifeAI<span className="text-accent-purple">.</span></span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-[250px] mb-6">
              Your intelligent daily life companion. Solve problems, track habits, and evolve with AI.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 rounded-full text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/solver" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">AI Problem Solver</Link></li>
              <li><Link href="/tasks" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Task Manager</Link></li>
              <li><Link href="/finance" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Finance Tracker</Link></li>
              <li><Link href="/wellness" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Wellness Coach</Link></li>
              <li><Link href="/focus" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Focus Mode</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-accent-purple transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted text-center md:text-left">
            &copy; {new Date().getFullYear()} LifeAI. All rights reserved. Built for the future.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Powered by</span>
            <span className="font-medium text-text-secondary">Next.js & Groq</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
