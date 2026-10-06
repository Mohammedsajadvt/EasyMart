import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  DollarSign,
  Award,
  Users,
  Target,
  Trash2,
  X,
  RefreshCw,
  Tag,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Header from '../components/Header';
import { adminAPI } from '../services/api';

const SalesTeamManager = () => {
  const [salesTeam, setSalesTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New Sales Rep Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    region: 'South Metro Territory',
    monthlyTarget: 15000,
    commissionRate: 5.0,
    salesCode: '',
  });

  const fetchSalesTeam = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSalesTeam();
      setSalesTeam(res.data || []);
    } catch (err) {
      console.error('Failed to load sales team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesTeam();
  }, []);

  const handleCreateSalesRep = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setNotice('Please fill all required fields');
      return;
    }

    try {
      setActionLoading(true);
      await adminAPI.createSalesRepresentative(formData);
      setNotice(`✅ Sales Executive "${formData.name}" onboarded successfully!`);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        phone: '',
        region: 'South Metro Territory',
        monthlyTarget: 15000,
        commissionRate: 5.0,
        salesCode: '',
      });
      fetchSalesTeam();
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Failed to create sales representative');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate sales rep "${name}"?`)) return;
    try {
      await adminAPI.deleteStaff(id);
      setSalesTeam(salesTeam.filter((s) => s._id !== id));
      setNotice(`✅ Sales rep "${name}" removed from sales force`);
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice('Failed to remove sales representative');
    }
  };

  const filteredTeam = salesTeam.filter(
    (rep) =>
      rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.salesCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.region || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Metrics
  const totalReps = salesTeam.length;
  const totalRevenueGenerated = salesTeam.reduce((acc, r) => acc + (r.totalSalesGenerated || 0), 0);
  const totalCommissionsEarned = salesTeam.reduce((acc, r) => acc + (r.totalCommissionEarned || 0), 0);
  const totalOrdersClosed = salesTeam.reduce((acc, r) => acc + (r.ordersClosedCount || 0), 0);

  return (
    <div className="space-y-6 text-left">
      <Header
        title="Sales Force & Field Team Tracking"
        subtitle="Manage field sales executives, commission payouts, referral discount codes, and revenue quota achievements"
      />

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold animate-fade">
          {notice}
        </div>
      )}

      {/* 1. Sales Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="admin-card p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Sales Reps
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-white mt-1">
              {totalReps}
            </h3>
            <span className="text-[10px] text-orange-400 font-bold mt-0.5 block">
              Field Executives
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Team Revenue Closed
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-emerald-400 mt-1">
              ${totalRevenueGenerated.toFixed(2)}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
              {totalOrdersClosed} Orders Attributed
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Commissions
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-amber-400 mt-1">
              ${totalCommissionsEarned.toFixed(2)}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
              Earned by Reps
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Top Team Quota
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-indigo-400 mt-1">
              {salesTeam.length > 0 ? `${salesTeam[0].targetProgressPercent || 0}%` : '0%'}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
              Target Achievement
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Sales Team Table & Management */}
      <div className="admin-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by sales rep name, referral code, or territory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', paddingRight: '16px' }}
              className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSalesTeam}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              title="Refresh Team"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Sales Executive
            </button>
          </div>
        </div>

        {/* 3. Sales Reps Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
            Loading sales team records from MongoDB Atlas...
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No sales representatives found. Click "Add Sales Executive" to create your sales team!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeam.map((rep) => (
              <div
                key={rep._id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-orange-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header: Rep Name & Sales Code */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm">
                        {rep.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{rep.name}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">{rep.email}</span>
                      </div>
                    </div>

                    <span className="bg-orange-500/15 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full text-[10px] font-black font-mono">
                      {rep.salesCode}
                    </span>
                  </div>

                  {/* Territory & Quota */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">Territory</span>
                      <span className="font-bold text-slate-200 line-clamp-1">{rep.region}</span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">Commission Rate</span>
                      <span className="font-bold text-emerald-400">{rep.commissionRate || 5}% per Order</span>
                    </div>
                  </div>

                  {/* Monthly Target Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Monthly Target: ${rep.monthlyTarget || 15000}</span>
                      <span className="text-orange-400">{rep.targetProgressPercent || 0}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, rep.targetProgressPercent || 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Stats */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Revenue Closed</span>
                      <span className="font-black text-white">${rep.totalSalesGenerated?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Commission Earned</span>
                      <span className="font-black text-emerald-400">${rep.totalCommissionEarned?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Contact */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Phone: <strong className="text-slate-300">{rep.phone || '+91 9876543210'}</strong>
                  </span>
                  <button
                    onClick={() => handleDeleteStaff(rep._id, rep.name)}
                    className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Remove Sales Rep"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Add Sales Executive Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
          <div className="admin-card max-w-lg w-full p-6 sm:p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-outfit text-white">
                    Onboard Sales Representative
                  </h3>
                  <p className="text-xs text-slate-400">
                    Assign sales quota, commission rate, territory, and custom referral tag
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSalesRep} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram.sales@easymart.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Access Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="password123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Assigned Region / Territory
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore North Metro"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Monthly Sales Target ($)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyTarget}
                    onChange={(e) => setFormData({ ...formData, monthlyTarget: Number(e.target.value) })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Custom Referral / Sales Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIKRAM10 (Leave blank for auto-generation)"
                  value={formData.salesCode}
                  onChange={(e) => setFormData({ ...formData, salesCode: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500 font-mono uppercase"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-xl text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  {actionLoading ? 'Creating Sales Rep...' : 'Onboard Sales Executive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTeamManager;
