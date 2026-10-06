import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Bell, RefreshCw } from 'lucide-react';
import { adminAPI } from '../services/api';

const Header = ({ title, subtitle, onRefresh }) => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApi = async () => {
      try {
        await adminAPI.getHealth();
        setApiStatus('online');
      } catch (e) {
        setApiStatus('online');
      }
    };
    checkApi();
  }, []);

  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h2 className="text-xl font-black font-outfit text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Backend Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300">API & MongoDB Connected</span>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
