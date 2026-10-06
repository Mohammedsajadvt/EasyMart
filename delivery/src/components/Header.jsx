import React from 'react';
import {
  Truck,
  Power,
  LogOut,
  MapPin,
  ShieldCheck,
  Bell,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useDeliveryAuth } from '../context/DeliveryAuthContext';

const Header = () => {
  const { driver, isOnline, toggleOnline, logoutDriver } = useDeliveryAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Driver Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black font-outfit text-white tracking-tight">
                Easy<span className="text-orange-500">Mart</span> Express
              </span>
              <span className="bg-orange-500/15 text-orange-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-orange-500/30 uppercase">
                Driver Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Live Logistics & Dispatch Network
            </p>
          </div>
        </div>

        {/* Online Status Toggle & Profile Actions */}
        <div className="flex items-center gap-3">
          {/* Duty Status Switch */}
          <button
            onClick={toggleOnline}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>{isOnline ? 'ON DUTY (ONLINE)' : 'OFF DUTY'}</span>
          </button>

          {/* Driver Mini Card */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-900/80 px-3.5 py-1.5 rounded-2xl border border-slate-800">
            <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-black">
              {driver?.name ? driver.name.charAt(0) : 'D'}
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-white block leading-tight truncate max-w-[120px]">
                {driver?.name || 'Partner Driver'}
              </span>
              <span className="text-[10px] text-slate-400">Rating: ⭐ 4.95</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logoutDriver}
            title="Log Out"
            className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
