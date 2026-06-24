// src/pages/admin/AdminLoginPage.jsx
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const { currentUser, login, logout, isAdmin, loading, adminAccessError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  if (!loading && currentUser && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const signedInWithoutAdminAccess = !loading && currentUser && !isAdmin;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    setLoggingIn(true);
    setLoginError('');

    try {
      await login(email.trim(), password);
      toast.success('Signed in. Checking admin access...');
    } catch (err) {
      console.error(err);
      setLoginError('Invalid administrator credentials.');
      toast.error('Invalid administrator credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error('Unable to sign out. Please refresh and try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6 bg-[#0F1629]">
      <div className="w-full max-w-md bg-white/5 border border-gold/15 p-8 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-md animate-scaleIn">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.04)_0%,transparent_60%)] pointer-events-none" />

        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.webp" 
            alt="Adithya Events Logo" 
            className="h-20 w-20 rounded-full border border-gold/30 object-cover mb-4 shadow-lg shadow-gold/10"
          />
          <h2 className="font-display text-xl font-bold text-champagne">Adithya Console</h2>
          <span className="font-body text-[9px] text-gold uppercase tracking-[3px] mt-1">Management login</span>
        </div>

        {signedInWithoutAdminAccess ? (
          <div className="space-y-5 text-left">
            <div className="rounded-lg border border-danger/25 bg-danger/10 p-4">
              <p className="font-body text-xs font-semibold text-danger">
                Admin access is not active for {currentUser.email}.
              </p>
              <p className="font-body text-[11px] text-champagne/70 mt-2 leading-relaxed">
                {adminAccessError || 'Create an active Firestore admin profile for this user, then sign in again.'}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              className="w-full py-3 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@adithyaevents.com"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            {loginError && (
              <p className="font-body text-[11px] text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                {loginError}
              </p>
            )}

            <Button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 text-xs uppercase font-bold tracking-widest mt-6"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        )}

        <p className="font-body text-[10px] text-champagne/40 mt-8 text-center leading-relaxed">
          Authorized personnel only. Activities logged for security audits.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
