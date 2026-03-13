import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Code, Search, Image, Presentation, Check, Target, Users, Mail, Zap } from 'lucide-react';

const FloatingCard = ({ delay, children }: { delay: number; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 1,
      y: [0, -10, 0],
    }}
    transition={{
      opacity: { delay, duration: 0.5 },
      y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: "easeInOut" }
    }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-shadow"
  >
    {children}
  </motion.div>
);

export default function Landing() {
  const navigate = useNavigate();
  const tools = [
    { icon: Brain, name: 'Chat Agent', desc: 'Answers anything intelligently' },
    { icon: Code, name: 'Code Agent', desc: 'Plans, writes and reviews code' },
    { icon: Search, name: 'Search Agent', desc: 'Searches the web and summarizes' },
    { icon: Image, name: 'Image Agent', desc: 'Generates images and diagrams' },
    { icon: Presentation, name: 'PPT Agent', desc: 'Creates presentations automatically' },
    { icon: Mail, name: 'Email Agent', desc: 'Drafts and sends structured email' },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      features: ['5 tasks per day', 'Basic agents', 'Email support', 'Community access'],
      popular: false,
    },
    {
      name: 'Pro',
      price: 9,
      features: ['Unlimited tasks', 'All agents', 'Priority support', 'Advanced features', 'API access'],
      popular: true,
    },
    {
      name: 'Business',
      price: 29,
      features: ['Everything in Pro', 'Team collaboration', 'Custom agents', 'Dedicated support', 'SLA guarantee'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden relative">
      <div className="relative z-10">
        <nav className="nav-surface">
          <div className="container mx-auto px-6 h-12 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm font-medium tracking-tight"
          >
            OneAgent
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/login')}
            className="px-4 py-1.5 border border-[#1f1f1f] rounded-full text-xs text-zinc-300 hover:bg-[#111111] transition-colors"
          >
            Sign In
          </motion.button>
          </div>
        </nav>

        <section className="container mx-auto px-6 py-20 text-center min-h-screen flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-medium mb-6 text-white leading-tight"
          >
            A calm workspace
            <br />
            for busy teams
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            OneAgent is a focused layer on top of your workflows—routing every request to the
            right agent and keeping a clean record of what happened.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-3 justify-center mb-4"
          >
            <motion.button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-[#6366f1] rounded-lg text-sm font-medium text-white hover:bg-[#4f46e5] transition-colors shadow-[0_0_0_1px_rgba(99,102,241,0.5)]"
            >
              Start Free
            </motion.button>
            <motion.button
              className="px-6 py-3 border border-[#1f1f1f] rounded-lg text-sm font-medium text-zinc-300 hover:bg-[#111111] transition-colors"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-xs text-zinc-500"
          >
            <Users className="w-4 h-4" />
            <span>Trusted by 10,000+ users worldwide</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-14"
          >
            <div className="card-surface p-4">
              <div className="label mb-2">Execution</div>
              <p className="text-sm text-zinc-300">
                From prompts to structured tasks routed to the right agent.
              </p>
            </div>
            <div className="card-surface p-4">
              <div className="label mb-2">Visibility</div>
              <p className="text-sm text-zinc-300">
                Clear history of what ran, when, and which agent handled it.
              </p>
            </div>
            <div className="card-surface p-4">
              <div className="label mb-2">Control</div>
              <p className="text-sm text-zinc-300">
                Opinionated defaults with room to adapt to your stack.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-medium text-center mb-12"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Target, title: 'Describe your task', desc: 'Tell us what you need in plain English' },
              { icon: Zap, title: 'AI picks the right tool', desc: 'Smart routing to the perfect agent' },
              { icon: Check, title: 'Task completed', desc: 'Get your results instantly' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-left"
              >
                <div className="w-10 h-10 mb-4 rounded-lg border border-[#1f1f1f] flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-base font-medium mb-2 text-zinc-100">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 relative">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-medium text-center mb-12 relative z-10"
          >
            Powerful AI Agents
          </motion.h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto relative z-10">
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-surface p-5 group cursor-pointer card-surface-hover"
              >
                <div className="w-8 h-8 mb-3 rounded-md border border-[#1f1f1f] flex items-center justify-center">
                  <tool.icon className="w-4 h-4 mono-icon" />
                </div>
                <h3 className="text-sm font-medium mb-1 text-zinc-100">{tool.name}</h3>
                <p className="text-xs text-zinc-400">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-surface p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-medium mb-1 text-zinc-100">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-medium text-white">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-zinc-500">/month</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-4 w-full py-2.5 rounded-lg text-sm font-medium bg-[#1a1a1a] text-zinc-200 hover:bg-[#18181b] border border-[#1f1f1f] transition-colors"
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="border-t border-[#1f1f1f] py-10 mt-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                OneAgent
              </div>
              <div className="flex gap-8 text-xs text-zinc-500">
                <a href="#" className="hover:text-zinc-200 transition-colors">About</a>
                <a href="#" className="hover:text-zinc-200 transition-colors">Documentation</a>
                <a href="#" className="hover:text-zinc-200 transition-colors">Support</a>
                <a href="#" className="hover:text-zinc-200 transition-colors">Privacy</a>
              </div>
            </div>
            <div className="text-center text-xs text-zinc-600 mt-6">
              © 2024 OneAgent. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
