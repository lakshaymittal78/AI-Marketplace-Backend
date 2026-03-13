import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Code, Search, Image, Presentation, LogOut, Mail } from 'lucide-react';
import { removeToken } from '../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  const tools = [
    { icon: Brain, name: 'Chat Agent', desc: 'Ask anything', route: '/chat', runsToday: 18 },
    { icon: Code, name: 'Code Agent', desc: 'Write and review code', route: '/chat', runsToday: 9 },
    { icon: Search, name: 'Search Agent', desc: 'Search and synthesize research', route: '/chat', runsToday: 6 },
    { icon: Image, name: 'Image Agent', desc: 'Generate visual assets', route: '/chat', runsToday: 4 },
    { icon: Presentation, name: 'PPT Agent', desc: 'Create presentations', route: '/chat', runsToday: 3 },
    { icon: Mail, name: 'Email Agent', desc: 'Draft and send emails', route: '/chat', runsToday: 2 },
  ];

  const recentTasks = [
    { task: 'Created investor presentation for Q2 board review', agent: 'PPT Agent', time: 'Today · 09:24' },
    { task: 'Code review for billing service rollout', agent: 'Code Agent', time: 'Yesterday · 18:03' },
    { task: 'Competitive research: AI workspace tools', agent: 'Search Agent', time: 'Yesterday · 11:47' },
    { task: 'Generated hero image for marketing site', agent: 'Image Agent', time: 'Mar 10 · 16:12' },
  ];

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="relative z-10">
        <nav className="nav-surface">
          <div className="container mx-auto px-6 h-12 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-medium tracking-tight text-white"
              >
                OneAgent
              </button>
              <div className="hidden md:flex gap-8">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-xs tracking-wide text-white uppercase"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="text-xs tracking-wide text-zinc-400 hover:text-zinc-100 uppercase transition-colors"
                >
                  Workspace
                </button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#1f1f1f] rounded-full text-xs text-zinc-400 hover:bg-[#111111] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-12">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col gap-2"
          >
            <div className="label">{greeting}</div>
            <h1 className="text-3xl md:text-4xl font-medium text-white">
              {username || 'Operator'}
            </h1>
            <p className="text-sm text-zinc-500 max-w-xl">
              Overview of the agents your team relies on day to day.
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm label">Agents</h2>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {tools.map((tool, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  onClick={() => navigate(tool.route)}
                  whileHover={{ y: -4 }}
                  className="card-surface card-surface-hover group text-left px-4 py-4 flex flex-col items-start gap-3 border-l-2 border-l-transparent hover:border-l-[#6366f1] cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <tool.icon className="w-4 h-4 mono-icon" />
                    <span className="text-sm font-medium text-white">
                      {tool.name}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{tool.desc}</p>
                  <div className="flex items-center justify-between w-full mt-1">
                    <span className="text-[11px] text-zinc-500">
                      {tool.runsToday} runs today
                    </span>
                    <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      Open agent ↗
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm label">Recent Tasks</h2>
            </div>
            <div className="card-surface overflow-hidden">
              {recentTasks.map((task, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="px-5 py-4 border-b border-[#1f1f1f] last:border-b-0 hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-zinc-100 mb-1">
                        {task.task}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>{task.time}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-[#1f1f1f] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-zinc-400">
                      {task.agent}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
