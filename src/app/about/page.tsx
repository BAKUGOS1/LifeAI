import { Mountain, Target, Users, Zap, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About | LifeAI',
  description: 'Learn more about LifeAI and our mission to evolve daily life through artificial intelligence.',
};

export default function AboutPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-20 animate-fadein">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-bg-card/50 text-xs font-medium text-accent-purple mb-6">
          <Sparkles size={14} /> Our Story
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6">
          We are Building the<br />
          <span className="gradient-text">Future of Living</span>
        </h1>
        <p className="text-text-secondary text-base md:text-xl max-w-[700px] mx-auto leading-relaxed">
          LifeAI was founded on a simple principle: Artificial Intelligence shouldn't just be for coders and data scientists. It should be a daily companion that empowers everyone to do more, live better, and think clearer.
        </p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="relative rounded-[2rem] overflow-hidden aspect-square border border-border bg-bg-card">
          <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" alt="Our Mission" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-tr from-bg-main to-transparent opacity-60"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-2xl font-bold font-display text-white mb-2">Simplicity First</h3>
            <p className="text-white/80 text-sm">Complex algorithms distilled into beautiful, intuitive interfaces.</p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold font-display mb-6">Our Mission is to <span className="text-accent-cyan">Automate the Mundane</span>.</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Every day, we spend hours on trivial tasks: organizing schedules, tracking expenses, figuring out what to eat, or attempting to stay focused. LifeAI exists to handle the complexity of the mundane so you can focus on what truly matters.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Zap className="text-accent-yellow mt-0.5 shrink-0" size={20} />
              <div className="text-sm text-text-primary">Boost productivity through smart prioritization and minimal friction.</div>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="text-accent-green mt-0.5 shrink-0" size={20} />
              <div className="text-sm text-text-primary">Ensure privacy and security while providing hyper-personalized insights.</div>
            </li>
            <li className="flex items-start gap-3">
              <Mountain className="text-accent-purple mt-0.5 shrink-0" size={20} />
              <div className="text-sm text-text-primary">Continuously evolve and adapt alongside our growing community of users.</div>
            </li>
          </ul>
        </div>
      </div>

      {/* Values */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold">Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-bg-card border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple mb-6">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-lg mb-3">Intentional Design</h3>
            <p className="text-text-secondary text-sm leading-relaxed">Every pixel and interaction is designed to reduce cognitive load.</p>
          </div>
          <div className="bg-bg-card border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-6">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-lg mb-3">Human-Centric</h3>
            <p className="text-text-secondary text-sm leading-relaxed">Technology that bends to human needs, not the other way around.</p>
          </div>
          <div className="bg-bg-card border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center text-accent-green mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="font-bold text-lg mb-3">Constant Evolution</h3>
            <p className="text-text-secondary text-sm leading-relaxed">We iterate relentlessly to bring the bleeding edge of AI to daily life.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-accent-purple/5 to-accent-cyan/5 border border-border p-12 rounded-[2rem]">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to upgrade your daily life?</h2>
        <p className="text-text-secondary mb-8 max-w-[500px] mx-auto">Join thousands of others who have already augmented their workflow, finances, and wellness with LifeAI.</p>
        <Link href="/tasks" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-text-primary text-bg-main font-semibold text-sm hover:scale-105 transition-transform">
          Get Started
        </Link>
      </div>
    </div>
  );
}
