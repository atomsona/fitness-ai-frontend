import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Crown, Dumbbell, Shield, Sparkles, Target, Timer, Zap } from 'lucide-react';

const Home = () => {
  const steps = [
    {
      title: 'Set your baseline',
      description: 'Tell us your goals, schedule, and equipment so quests match your life.',
      icon: <Target className="w-5 h-5" />,
    },
    {
      title: 'Get daily quests',
      description: 'Short, focused challenges with clear rewards and time estimates.',
      icon: <Timer className="w-5 h-5" />,
    },
    {
      title: 'Level up weekly',
      description: 'Earn XP, track progress, and see your consistency compound.',
      icon: <Zap className="w-5 h-5" />,
    },
  ];

  const demoQuests = [
    {
      title: 'Mobility Reset (10 min)',
      tag: 'Easy',
      reward: '40 XP',
      description: 'A short flow to loosen hips and shoulders before work.',
    },
    {
      title: 'Strength Ladder (20 min)',
      tag: 'Medium',
      reward: '90 XP',
      description: 'Push-ups + squats in a simple ladder with rest built in.',
    },
    {
      title: 'Cardio Spark (15 min)',
      tag: 'Medium',
      reward: '70 XP',
      description: 'Intervals you can do at home, no equipment required.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white" style={{ fontFamily: 'var(--font-body)' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Work+Sans:wght@400;500;600&display=swap');
          :root { --font-display: 'Space Grotesk', ui-sans-serif; --font-body: 'Work Sans', ui-sans-serif; }
          .font-display { font-family: var(--font-display); }
        `}
      </style>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#4c1d95,_transparent_55%),radial-gradient(circle_at_right,_#1e3a8a,_transparent_45%)]" />
        <div className="absolute -top-40 right-10 h-72 w-72 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-cyan-500/10 blur-3xl" />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            <Sparkles className="w-4 h-4 text-pink-300" />
            Built for real schedules, not perfect ones.
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-6 leading-tight">
            Your fitness plan, gamified into quests you actually finish.
          </h1>
          <p className="text-white/70 text-lg md:text-xl mt-4 max-w-2xl">
            Fitness AI Coach turns your goals into short daily challenges with clear rewards.
            No fluff, no fake stats, just a system you can stick with.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold">
              Start free <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#demo" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90">
              See demo quests
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/60 mt-8">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-300" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-300" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-white/90">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  {step.icon}
                </span>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="text-white/65 mt-3">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="demo" className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">A realistic demo week</h2>
            <p className="text-white/70 mt-3 max-w-xl">
              Quests are short, specific, and designed to fit a normal workday. Here are three
              examples you would get on day one.
            </p>
          </div>
          <Link to="/register" className="inline-flex items-center gap-2 text-sm text-white/80">
            Create your first quest board <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          {demoQuests.map((quest, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="rounded-full border border-white/15 px-2 py-1">{quest.tag}</span>
                <span className="text-green-300">{quest.reward}</span>
              </div>
              <h3 className="font-display text-xl font-semibold mt-4">{quest.title}</h3>
              <p className="text-white/65 mt-2">{quest.description}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-white/50">
                <Dumbbell className="w-4 h-4" />
                No equipment required
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">What you get on day one</h2>
              <p className="text-white/70 mt-4">
                A personal plan, a quest list, and a dashboard that makes progress obvious.
              </p>
              <ul className="mt-6 space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-300" />
                  A short daily quest board built for your schedule
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-300" />
                  XP and rewards you can feel in week one
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-300" />
                  A clean dashboard that keeps you consistent
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="text-white/60 text-sm">Preview</div>
              <div className="font-display text-2xl font-semibold mt-2">Level 2 Coach</div>
              <div className="text-white/60 text-sm mt-1">2/7 quests complete this week</div>
              <div className="mt-6 space-y-3">
                {['Core Stability (15 min)', 'Posture Reset (8 min)', 'Hydration Habit'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    <span>{item}</span>
                    <span className="text-green-300">+35 XP</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="mt-6 inline-flex items-center gap-2 text-sm text-white/80">
                Build your real plan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="font-display text-2xl font-semibold">Free plan</h3>
            <p className="text-white/60 mt-2">Perfect to get consistent.</p>
            <ul className="mt-4 space-y-2 text-white/70 text-sm">
              <li>Daily quest board</li>
              <li>Core stats tracking</li>
              <li>Community access</li>
            </ul>
            <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm">
              Start free
            </Link>
          </div>
          <div className="rounded-2xl border border-purple-400/40 bg-gradient-to-br from-purple-500/20 to-pink-500/10 p-6">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Crown className="w-4 h-4 text-yellow-300" />
              Premium
            </div>
            <h3 className="font-display text-2xl font-semibold mt-2">Pro coaching + priority quests</h3>
            <p className="text-white/60 mt-2">Unlock advanced training plans and weekly AI reviews.</p>
            <ul className="mt-4 space-y-2 text-white/70 text-sm">
              <li>AI coaching plans</li>
              <li>Unlimited quests</li>
              <li>Advanced insights</li>
            </ul>
            <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[#1b1636] px-5 py-2 text-sm font-semibold">
              Try premium
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl font-bold">Built for privacy and safety</h2>
              <p className="text-white/70 mt-3 max-w-xl">
                We keep plans practical, avoid unsafe advice, and let you control your data anytime.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <Shield className="w-5 h-5 text-green-300" />
              Privacy-first data controls
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-white/50 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Fitness AI Coach
          </div>
          <div className="flex flex-wrap gap-6">
            <Link to="/register" className="hover:text-white/80">Get started</Link>
            <Link to="/login" className="hover:text-white/80">Sign in</Link>
            <a href="#demo" className="hover:text-white/80">Demo quests</a>
          </div>
          <div>© 2024 Fitness AI Coach</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
