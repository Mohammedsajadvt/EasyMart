import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Database,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Flame,
  ChevronRight,
  FolderTree,
  Gift,
  Calendar,
  Truck,
  TrendingUp,
  MapPin,
  Navigation,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const Sidebar = () => {
  const { logoutAdmin, adminUser } = useAdminAuth();

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/products', label: 'Products Catalog', icon: Package },
    { to: '/categories', label: 'Categories (Dynamic)', icon: FolderTree },
    { to: '/festivals', label: 'Indian Festivals & Offers', icon: Gift, badge: 'Festivals' },
    { to: '/orders', label: 'Orders & Shipping', icon: ShoppingBag },
    { to: '/delivery-fleet', label: 'Delivery Fleet & GPS', icon: Truck, badge: 'Logistics' },
    { to: '/sales-team', label: 'Sales Team & Quota', icon: TrendingUp, badge: 'Sales' },
    { to: '/users', label: 'Accounts', icon: Users },
    { to: '/database', label: 'Database & Seeder', icon: Database },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 min-h-screen text-slate-300 flex-shrink-0">
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black font-outfit text-white leading-none">
              Easy<span className="text-orange-500">Mart</span>
            </h1>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="text-[9px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-2 pt-4 border-t border-slate-800/80">
        {/* Shortcut to Customer Storefront */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 transition-all group"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Open Live Store</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
            :5173
          </span>
        </a>

        {/* Shortcut to Delivery Partner App */}
        <a
          href="http://localhost:5175"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Delivery Agent Web</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">
            :5175
          </span>
        </a>

        {/* Shortcut to Sales Force Web App */}
        <a
          href="http://localhost:5176"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 transition-all group"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Sales Force Web</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">
            :5176
          </span>
        </a>

        {/* Admin Profile Box & Sign Out */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500 text-orange-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {adminUser?.name || 'Mohammed Sajad'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {adminUser?.email || 'mohammedsajadvt@gmail.com'}
              </p>
            </div>
          </div>
          <button
            onClick={logoutAdmin}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
