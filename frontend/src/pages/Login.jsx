import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message;
  const fromPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password);

      // Redirect based on previous location or role
      if (fromPath) {
        navigate(fromPath, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (user.role === 'shelter') {
        navigate('/dashboard/shelter', { replace: true });
      } else {
        navigate('/dashboard/adopter', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-slate-900 text-white rounded-xl mb-1">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to PetAdopt
          </h2>
          <p className="text-sm text-slate-500">
            Access your applications, listings, or administrative panel.
          </p>
        </div>

        {/* Redirect notice if sent from protected action */}
        {redirectMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
            {redirectMessage}
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        
             
         

        {/* Register link */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-slate-900 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
