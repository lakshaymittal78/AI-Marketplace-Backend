import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, Brain, Code, Search, Image, Presentation, Copy, Download, Loader2, CheckCircle, Mail } from 'lucide-react';
import { api, removeToken, ChatMessage } from '../utils/api';
import ReactMarkdown from 'react-markdown';

interface ExecutionStep {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  status: 'pending' | 'active' | 'complete';
}

export default function Chat() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [detectedAgent, setDetectedAgent] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  const detectAgent = (message: string): { name: string; icon: React.ComponentType<{ className?: string }> } => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('code') || lowerMessage.includes('program') || lowerMessage.includes('debug')) {
      return { name: 'Code Agent', icon: Code };
    }
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('research')) {
      return { name: 'Search Agent', icon: Search };
    }
    if (lowerMessage.includes('image') || lowerMessage.includes('picture') || lowerMessage.includes('photo')) {
      return { name: 'Image Agent', icon: Image };
    }
    if (lowerMessage.includes('presentation') || lowerMessage.includes('ppt') || lowerMessage.includes('slides')) {
      return { name: 'PPT Agent', icon: Presentation };
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('e-mail') || lowerMessage.includes('send mail')) {
      return { name: 'Email Agent', icon: Mail };
    }

    return { name: 'Chat Agent', icon: Brain };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setError('');
    setLoading(true);
    setCurrentResponse('');
    setCopied(false);

    const agent = detectAgent(input);
    setDetectedAgent(agent.name);

    setExecutionSteps([
      { icon: Brain, text: 'Analyzing your request...', status: 'active' },
      { icon: agent.icon, text: `Using ${agent.name}...`, status: 'pending' },
      { icon: CheckCircle, text: 'Task Complete!', status: 'pending' },
    ]);

    try {
      setTimeout(() => {
        setExecutionSteps([
          { icon: Brain, text: 'Analyzing your request...', status: 'complete' },
          { icon: agent.icon, text: `Using ${agent.name}...`, status: 'active' },
          { icon: CheckCircle, text: 'Task Complete!', status: 'pending' },
        ]);
      }, 800);

      const response = await api.chat(input, history);

      setExecutionSteps([
        { icon: Brain, text: 'Analyzing your request...', status: 'complete' },
        { icon: agent.icon, text: `Using ${agent.name}...`, status: 'complete' },
        { icon: CheckCircle, text: 'Task Complete!', status: 'complete' },
      ]);

      setCurrentResponse(response.response);
      setHistory(response.history);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
      setExecutionSteps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple typewriter-style streaming effect for responses
  useEffect(() => {
    if (!currentResponse) {
      setDisplayedResponse('');
      return;
    }

    let index = 0;
    setDisplayedResponse('');

    const interval = window.setInterval(() => {
      index += 4; // reveal a few characters at a time
      if (index >= currentResponse.length) {
        setDisplayedResponse(currentResponse);
        window.clearInterval(interval);
      } else {
        setDisplayedResponse(currentResponse.slice(0, index));
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, [currentResponse]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      <nav className="nav-surface relative z-10">
        <div className="container mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              className="text-sm font-medium tracking-tight text-white"
              onClick={() => navigate('/dashboard')}
            >
              OneAgent
            </button>
            <div className="hidden md:flex gap-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs tracking-wide text-zinc-400 hover:text-zinc-100 uppercase transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="text-xs tracking-wide text-white uppercase"
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

      <div className="flex-1 container mx-auto px-6 py-12 relative z-10 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="label mb-1">Workspace</div>
          <h1 className="text-3xl font-medium text-white mb-1">Agent console</h1>
          <p className="text-sm text-zinc-500">
            Describe what you need. OneAgent will route it to the right capability.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mb-6"
        >
          <div className="relative card-surface flex items-center px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a command or ask a question"
              disabled={loading}
              className="w-full bg-transparent border-none focus:outline-none text-sm text-zinc-100 placeholder:text-zinc-500 pr-10 py-2"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#27272a] text-zinc-200 hover:bg-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {executionSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 mb-6"
              >
                {executionSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-4 px-3 py-2 rounded-md border border-[#1f1f1f] bg-[#111111]"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center bg-[#18181b]"
                    >
                      <step.icon
                        className="w-4 h-4 text-zinc-400"
                      />
                    </div>
                    <span
                      className="text-xs text-zinc-400"
                    >
                      {step.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {currentResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="card-surface p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-[#1f1f1f] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-zinc-400">
                      {detectedAgent === 'Code Agent' && <Code className="w-3 h-3 mr-1 mono-icon" />}
                      {detectedAgent === 'Search Agent' && (
                        <Search className="w-3 h-3 mr-1 mono-icon" />
                      )}
                      {detectedAgent === 'Image Agent' && (
                        <Image className="w-3 h-3 mr-1 mono-icon" />
                      )}
                      {detectedAgent === 'PPT Agent' && (
                        <Presentation className="w-3 h-3 mr-1 mono-icon" />
                      )}
                      {detectedAgent === 'Email Agent' && (
                        <Mail className="w-3 h-3 mr-1 mono-icon" />
                      )}
                      {detectedAgent === 'Chat Agent' && (
                        <Brain className="w-3 h-3 mr-1 mono-icon" />
                      )}
                      {detectedAgent}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 border border-[#1f1f1f] rounded-md hover:bg-[#18181b] transition-colors"
                      title="Copy response"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      className="p-2 border border-[#1f1f1f] rounded-md hover:bg-[#18181b] transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="border border-[#1f1f1f] rounded-lg overflow-hidden bg-[#020617]">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f1f]">
                    <span className="text-[11px] tracking-[0.08em] uppercase text-zinc-500">
                      Markdown
                    </span>
                    {loading && (
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <span className="inline-flex h-1.5 w-6 overflow-hidden rounded-full bg-[#020617]">
                          <span className="inline-block h-full w-3 bg-[#6366f1] animate-[pulse_1s_ease-in-out_infinite]" />
                        </span>
                        streaming
                      </span>
                    )}
                  </div>
                  <div className="p-4 max-h-[60vh] overflow-y-auto text-sm text-zinc-100 prose prose-invert prose-sm prose-headings:text-zinc-50 prose-a:text-indigo-400 prose-a:underline-offset-2 prose-a:hover:text-indigo-300 prose-strong:text-zinc-50 prose-code:bg-zinc-900/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-black/60">
                    <ReactMarkdown>{displayedResponse}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && !currentResponse && executionSteps.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <h3 className="text-sm font-medium text-zinc-300 mb-1">
                No active session
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm">
                Start by describing a task, or paste a block of text or code you want
                OneAgent to work with.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
