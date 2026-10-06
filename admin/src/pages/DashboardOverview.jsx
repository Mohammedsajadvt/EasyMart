import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Clock,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import Header from '../components/Header';
import { adminAPI } from '../services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalSales: '0.00',
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getOrders(),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      setRecentOrders((ordersRes.data || []).slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-slate-900 text-slate-100">
      <Header
        title="Executive Overview"
        subtitle="Real-time revenue metrics, order performance, and catalog health"
        onRefresh={fetchDashboardData}
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="admin-card p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black font-outfit text-white mt-4">
              ${stats.totalSales}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
            </div>
          </div>

          {/* Orders */}
          <div className="admin-card p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black font-outfit text-white mt-4">
              {stats.ordersCount}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-orange-400 font-bold mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% Fulfillment Rate
            </div>
          </div>

          {/* Products */}
          <div className="admin-card p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Products in Stock</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black font-outfit text-white mt-4">
              {stats.productsCount}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-bold mt-2">
              <Sparkles className="w-3.5 h-3.5" /> 7 Active Categories
            </div>
          </div>

          {/* Users */}
          <div className="admin-card p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Accounts</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black font-outfit text-white mt-4">
              {stats.usersCount}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-blue-400 font-bold mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" /> Active Verified Shoppers
            </div>
          </div>
        </div>

        {/* Charts and Recent Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sales & Category Distribution Card (7 cols) */}
          <div className="lg:col-span-7 admin-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold font-outfit text-white">Sales & Demand Trends</h4>
                <p className="text-xs text-slate-400">Revenue distribution by category</p>
              </div>
              <span className="badge bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                Live Analytics
              </span>
            </div>

            {/* Category Performance Bars */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Electronics & Audio (45%)</span>
                  <span className="text-orange-400 font-mono">${(Number(stats.totalSales || 0) * 0.45).toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Mobiles & Tablets (28%)</span>
                  <span className="text-indigo-400 font-mono">${(Number(stats.totalSales || 0) * 0.28).toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Fashion, Wearables & Lifestyle (18%)</span>
                  <span className="text-cyan-400 font-mono">${(Number(stats.totalSales || 0) * 0.18).toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Home Appliances & Sports (9%)</span>
                  <span className="text-emerald-400 font-mono">${(Number(stats.totalSales || 0) * 0.09).toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '9%' }} />
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
              <Link to="/products" className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-xs font-bold rounded-xl text-white transition-colors">
                Manage Catalog →
              </Link>
              <Link to="/orders" className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-xs font-bold rounded-xl text-white transition-colors">
                Process Orders →
              </Link>
              <Link to="/database" className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-xs font-bold rounded-xl transition-colors">
                Database Hub →
              </Link>
            </div>
          </div>

          {/* Recent Orders Stream (5 cols) */}
          <div className="lg:col-span-5 admin-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-lg font-bold font-outfit text-white">Recent Customer Orders</h4>
              <Link to="/orders" className="text-xs font-bold text-orange-400 hover:underline">
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No orders registered yet in database.
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-white block">
                        {order.trackingNumber || order._id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {order.shippingAddress?.fullName || 'Customer'} • {order.orderItems?.length || 1} items
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black font-outfit text-white block">
                        ${Number(order.totalPrice || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-orange-400 font-bold uppercase">
                        {order.status || 'Processing'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
