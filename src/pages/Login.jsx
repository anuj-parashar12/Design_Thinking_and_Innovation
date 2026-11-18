import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Key, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click quick fill demo accounts for demonstration
  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center mx-auto shadow-sm">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-earth-900">
            Welcome to KalaSetu
          </h1>
          <p className="text-xs text-earth-800/70">
            Sign in to access your artisan dashboard and manage your crafts
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/80 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="artisan@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/80 block">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-70 text-white font-semibold text-sm shadow-sm transition-all"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Mode Quick Fill Buttons */}
        <div className="pt-2 border-t border-cream-200 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-earth-800/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Demo Accounts (For Professor Review)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('sita.devi@kalasetu.demo', 'password123')}
              className="p-2 rounded-lg bg-cream-100 hover:bg-cream-200 border border-cream-300 text-earth-900 font-medium text-left"
            >
              👩‍🎨 <strong>Sita Devi</strong>
              <span className="block text-[10px] text-earth-800/60">Madhubani Master</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('artisan@kalasetu.demo', 'password123')}
              className="p-2 rounded-lg bg-cream-100 hover:bg-cream-200 border border-cream-300 text-earth-900 font-medium text-left"
            >
              🏺 <strong>Arjun Das</strong>
              <span className="block text-[10px] text-earth-800/60">Demo Potter</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-earth-800/70 pt-2">
          Don't have an artisan account?{' '}
          <Link to="/register" className="font-semibold text-terracotta-600 hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
