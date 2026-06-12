'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : 'http://localhost:8000');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister
        ? { username, email, password }
        : { username, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'Something went wrong');
        return;
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
      {/* AI Circuit Chip Background */}
      <div className="circuit-bg">
        <div className="circuit-grid" />
        <div className="circuit-lines" />

        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-400/8 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-teal-500/8 rounded-full blur-[80px]" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-[80px]" />

        <div className="chip-square" style={{ top: '10%', left: '8%', width: '90px', height: '90px' }}>
          <div className="chip-pin chip-pin-h" style={{ top: '20%', left: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '50%', left: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '80%', left: '-8px' }} />
        </div>
        <div className="chip-square" style={{ bottom: '15%', right: '10%', width: '80px', height: '80px' }}>
          <div className="chip-pin chip-pin-v" style={{ left: '30%', top: '-8px' }} />
          <div className="chip-pin chip-pin-v" style={{ left: '70%', top: '-8px' }} />
        </div>

        <div className="hex-shape" style={{ top: '20%', right: '15%' }}>
          <div className="hex-shape-inner" />
        </div>
        <div className="hex-shape" style={{ bottom: '20%', left: '12%' }}>
          <div className="hex-shape-inner" />
        </div>

        <div className="circuit-trace-h" style={{ top: '20%', left: '0', width: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '0s' }} />
        </div>
        <div className="circuit-trace-h" style={{ top: '80%', left: '0', width: '100%' }}>
          <div className="data-pulse-reverse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="circuit-trace-v" style={{ left: '20%', top: '0', height: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="circuit-trace-v" style={{ left: '80%', top: '0', height: '100%' }}>
          <div className="data-pulse-reverse" style={{ animationDelay: '3s' }} />
        </div>

        <div className="circuit-node-lg node-breathe" style={{ top: '15%', left: '25%' }} />
        <div className="circuit-node-lg node-breathe" style={{ bottom: '15%', right: '25%', animationDelay: '1.5s' }} />

        <div className="circuit-node node-blink" style={{ top: '20%', left: '20%' }} />
        <div className="circuit-node node-blink" style={{ top: '20%', left: '80%', animationDelay: '1s' }} />
        <div className="circuit-node node-blink" style={{ top: '80%', left: '20%', animationDelay: '0.5s' }} />
        <div className="circuit-node node-blink" style={{ top: '80%', left: '80%', animationDelay: '2s' }} />

        <div className="ai-label-bright" style={{ top: '12%', right: '30%' }}>neural net</div>
        <div className="ai-label" style={{ bottom: '10%', left: '20%' }}>transformer</div>
        <div className="ai-label" style={{ top: '50%', right: '8%' }}>inference</div>

        <div className="binary-stream" style={{ top: '5%', left: '50%' }}>01001010 11010010</div>
        <div className="binary-stream" style={{ bottom: '5%', right: '20%' }}>10110100 01101001</div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#0c0c14]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-8 shadow-2xl shadow-cyan-500/5">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4">
              <svg className="w-8 h-8 text-[#0a0a0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Todo AI</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isRegister ? 'Create your account' : 'Sign in to your account'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                placeholder="Enter your username"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-gray-900/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#0a0a0f] font-semibold rounded-xl hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isRegister ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {/* Powered by */}
          <div className="mt-6 pt-4 border-t border-gray-800/60 text-center">
            <span className="text-xs text-gray-500">Powered by AI</span>
            <span className="text-xs text-cyan-500/60 ml-1">Gemini</span>
          </div>
        </div>
      </div>
    </div>
  );
}
