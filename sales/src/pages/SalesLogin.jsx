import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Lock, ArrowRight, ShieldCheck, KeyRound, Target, Award, Sparkles } from 'lucide-react';
import { useSalesAuth } from '../context/SalesAuthContext';

const SalesLogin = () => {
  const [email, setEmail] = useState('sales@easymart.com');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginSales } = useSalesAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await loginSales(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.error || 'Invalid sales executive credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4">
      <div className="sales-card max-w-md w-full p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/25">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-outfit text-white mt-2">
            Easy<span className="text-orange-500">Mart</span> Sales Force
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Field Representative & Revenue Attribution Hub
          </p>
        </div>

        {/* Executive Fast-Access Credentials */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-left text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-orange-400 font-bold">
            <KeyRound className="w-3.5 h-3.5" /> Fast-Access Executive Login:
          </div>
          <p className="text-slate-300 text-[11px]">
            Email: <code className="text-orange-300 font-mono">sales@easymart.com</code> or Admin-created account
          </p>
          <p className="text-slate-300 text-[11px]">
            Password: <code className="text-orange-300 font-mono">password123</code>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Representative Corporate Email
            </label>
            <div className="relative flex items-center h-12">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none z-10" />
              <input
                type="email"
                required
                placeholder="sales@easymart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px', paddingRight: '16px' }}
                className="w-full h-full text-xs sm:text-sm rounded-2xl bg-slate-950 border-2 border-slate-800 text-white focus:border-orange-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Secure Passcode
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

          {errorMsg && (
            <p className="text-xs font-bold text-rose-400 bg-rose-500/10 p-3.5 rounded-2xl border border-rose-500/20">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            {loading ? 'Authenticating Sales Rep...' : <>Launch Sales Dashboard <ArrowRight className="w-4.5 h-4.5" /></>}
          </button>
        </form>

        <div className="pt-2 flex items-center justify-center gap-4 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-amber-400" /> Live Quota Metrics
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" /> Instant Commissions
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalesLogin;
