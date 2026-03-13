import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { api, setToken } from '../utils/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      if (isLogin) {
        const response = await api.login(username, password);
        setToken(response.access_token);
        localStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        await api.register(username, password);
        const response = await api.login(username, password);
        setToken(response.access_token);
        localStorage.setItem('username', username);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          className="card-surface p-8"
        >
          <div className="text-center mb-8">
            <div className="text-sm label mb-2">Access</div>
            <div className="text-2xl font-medium tracking-tight text-white mb-1">
              OneAgent
            </div>
            <p className="text-sm text-zinc-400">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          <div className="flex gap-2 mb-8 bg-[#111111] border border-[#1f1f1f] rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${
                isLogin
                  ? 'bg-[#18181b] text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${
                !isLogin
                  ? 'bg-[#18181b] text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block label mb-2">
                Username
              </label>
              <motion.input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#111111] border border-[#1f1f1f] rounded-lg focus:outline-none focus:border-[#6366f1] transition-colors text-sm text-zinc-100 placeholder:text-zinc-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block label mb-2">
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#1f1f1f] rounded-lg focus:outline-none focus:border-[#6366f1] transition-colors pr-12 text-sm text-zinc-100 placeholder:text-zinc-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6366f1] rounded-lg text-sm font-medium text-white hover:bg-[#4f46e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(99,102,241,0.5)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'}</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Back to home
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
