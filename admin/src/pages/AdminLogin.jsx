import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAdmin, registerAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long');
        return;
      }

      setLoading(true);
      const res = await registerAdmin({ name, email, password });
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Admin account created successfully! Redirecting...');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    } else {
      setLoading(true);
      const res = await loginAdmin(email, password);
      setLoading(false);

      if (res.success) {
        navigate('/');
      } else {
        setErrorMsg(res.error || 'Invalid administrator credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="admin-card max-w-md w-full p-8 sm:p-10 space-y-6 animate-fade">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/25">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-outfit text-white mt-2">
            Easy<span className="text-orange-500">Mart</span> Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Executive Control & Store Management
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isSignUp
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isSignUp
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center h-12">
                <User className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none z-10" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Administrator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '48px', paddingRight: '16px' }}
                  className="w-full h-full text-xs sm:text-sm rounded-2xl bg-slate-950 border-2 border-slate-800 text-white focus:border-orange-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Admin Email
            </label>
            <div className="relative flex items-center h-12">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none z-10" />
              <input
                type="email"
                required
                placeholder="admin@easymart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px', paddingRight: '16px' }}
                className="w-full h-full text-xs sm:text-sm rounded-2xl bg-slate-950 border-2 border-slate-800 text-white focus:border-orange-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative flex items-center h-12">
              <Lock className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none z-10" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '48px', paddingRight: '16px' }}
                className="w-full h-full text-xs sm:text-sm rounded-2xl bg-slate-950 border-2 border-slate-800 text-white focus:border-orange-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Confirm Password
              </label>
              <div className="relative flex items-center h-12">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none z-10" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '48px', paddingRight: '16px' }}
                  className="w-full h-full text-xs sm:text-sm rounded-2xl bg-slate-950 border-2 border-slate-800 text-white focus:border-orange-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs font-bold text-rose-400 bg-rose-500/10 p-3.5 rounded-2xl border border-rose-500/20">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95 mt-2"
          >
            {loading ? (
              isSignUp ? 'Creating Admin Account...' : 'Authenticating...'
            ) : isSignUp ? (
              <>Create Admin Account <UserPlus className="w-4.5 h-4.5" /></>
            ) : (
              <>Sign In to Dashboard <ArrowRight className="w-4.5 h-4.5" /></>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs font-semibold text-slate-400 hover:text-orange-400 transition-colors cursor-pointer"
          >
            {isSignUp
              ? 'Already have an admin account? Sign In'
              : "Don't have an admin account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
