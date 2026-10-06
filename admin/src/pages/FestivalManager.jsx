import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Flame,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  Tag,
  Percent,
  Layers,
  Zap,
  Gift,
  X,
} from 'lucide-react';
import { adminAPI } from '../services/api';

const FestivalManager = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFestival, setActiveFestival] = useState(null);
  const [isMoveOfferModalOpen, setIsMoveOfferModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [discountInput, setDiscountInput] = useState(25);
  const [targetCategory, setTargetCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [applying, setApplying] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    festival: '',
    emoji: '🪔',
    dateDisplay: 'November 2026',
    discountPercentage: 25,
    couponCode: 'FESTIVE25',
    headline: '',
    subtext: '',
    appliedCategory: 'All',
  });

  const [todayInfo, setTodayInfo] = useState({ date: new Date().toISOString(), festival: null });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [festRes, activeRes, catRes, todayRes] = await Promise.all([
        adminAPI.getFestivals(),
        adminAPI.getActiveFestival(),
        adminAPI.getCategories(),
        adminAPI.getByCurrentDate(),
      ]);
      const list = Array.isArray(festRes.data) ? festRes.data : festRes.data?.festivals || [];
      setFestivals(list);
      setActiveFestival(activeRes.data || null);
      setCategories(catRes.data || []);
      if (todayRes.data) {
        setTodayInfo({
          date: todayRes.data.formattedDate || new Date().toDateString(),
          festival: todayRes.data.festival,
        });
      }
    } catch (err) {
      console.error('Failed to load festivals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAutoDetectToday = async () => {
    try {
      setSyncing(true);
      const res = await adminAPI.autoDetectTodayFestival();
      setStatusMsg({ text: res.data.message || 'Auto-detected & activated festival for today!', isError: false });
      fetchData();
    } catch (err) {
      setStatusMsg({ text: 'Failed to auto-detect festival for today', isError: true });
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleActive = async (id, name) => {
    try {
      const res = await adminAPI.toggleFestival(id);
      setStatusMsg({ text: res.data.message || `Festival campaign "${name}" updated!`, isError: false });
      fetchData();
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.message || 'Failed to toggle festival', isError: true });
    }
  };

  const handleSyncCalendar = async () => {
    try {
      setSyncing(true);
      const res = await adminAPI.syncIndianCalendar();
      setStatusMsg({ text: '🇮🇳 Indian Festival Calendar synced successfully!', isError: false });
      fetchData();
    } catch (err) {
      setStatusMsg({ text: 'Failed to sync calendar', isError: true });
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenMoveOffer = (fest) => {
    setSelectedFestival(fest);
    setDiscountInput(fest.discountPercentage || 25);
    setTargetCategory(fest.appliedCategory || 'All');
    setIsMoveOfferModalOpen(true);
  };

  const handleApplyOffers = async (e) => {
    e.preventDefault();
    if (!selectedFestival) return;

    try {
      setApplying(true);
      const res = await adminAPI.applyFestivalOffers(selectedFestival._id, {
        discountPercentage: Number(discountInput),
        category: targetCategory,
      });
      setStatusMsg({ text: res.data.message, isError: false });
      setIsMoveOfferModalOpen(false);
      fetchData();
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.message || 'Failed to apply festival offers', isError: true });
    } finally {
      setApplying(false);
    }
  };

  const handleCreateCustomCampaign = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createFestival(newCampaign);
      setStatusMsg({ text: `Festival Campaign "${newCampaign.name}" created successfully!`, isError: false });
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.message || 'Failed to create festival campaign', isError: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-widest mb-1">
            <Calendar className="w-4 h-4 text-orange-400" /> Indian Calendar & Seasonal Campaigns
          </div>
          <h1 className="text-2xl font-black font-outfit text-white">
            Festival Offers & Promotions Manager
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-fetch Indian festivals, activate seasonal storefront banners, and move products to festival discounts
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleAutoDetectToday}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-950/40"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Auto-Detect Today ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
          </button>
          <button
            onClick={handleSyncCalendar}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Sync Indian Calendar
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" /> Custom Campaign
          </button>
        </div>
      </div>

      {/* Real-time Calendar Auto-Detector Box */}
      {todayInfo.festival && (
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl flex-shrink-0">
              {todayInfo.festival.emoji || '🌸'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  📅 CALENDAR LIVE NOW
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {todayInfo.date}
                </span>
              </div>
              <h4 className="text-sm font-black text-white mt-1">
                {todayInfo.festival.name} ({todayInfo.festival.dateDisplay})
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleAutoDetectToday}
              disabled={syncing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Activate This Festival
            </button>
          </div>
        </div>
      )}

      {statusMsg.text && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
            statusMsg.isError
              ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
              : 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg({ text: '', isError: false })}>
            <X className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      )}

      {/* Live Active Festival Banner Showcase */}
      {activeFestival && (
        <div
          className="relative rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-white/10"
          style={{ background: activeFestival.themeGradient || 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #EA580C 100%)' }}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  🔥 CURRENT LIVE STORE CAMPAIGN
                </span>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black">
                  {activeFestival.dateDisplay}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-outfit">
                {activeFestival.emoji} {activeFestival.headline}
              </h2>
              <p className="text-xs text-white/90 leading-relaxed">
                {activeFestival.subtext}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <div>
                <span className="text-[10px] font-bold text-white/70 block uppercase">Active Promo Code</span>
                <span className="text-base font-black font-mono tracking-widest text-amber-300">
                  {activeFestival.couponCode}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-white/20 hidden sm:block" />
              <div>
                <span className="text-[10px] font-bold text-white/70 block uppercase">Flat Discount</span>
                <span className="text-base font-black text-white">
                  {activeFestival.discountPercentage}% OFF
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Festivals Grid List */}
      <div className="space-y-4">
        <h3 className="text-base font-black font-outfit text-white flex items-center gap-2">
          <Gift className="w-4.5 h-4.5 text-orange-400" />
          Major Indian Festival Calendar & Offer Events ({festivals.length})
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {festivals.map((fest) => (
              <div
                key={fest._id}
                className={`bg-[#111827] rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 ${
                  fest.isActive
                    ? 'border-orange-500 shadow-lg shadow-orange-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{fest.emoji}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{fest.name}</h4>
                        <span className="text-[11px] font-bold text-orange-400">
                          {fest.festival} • {fest.dateDisplay}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleActive(fest._id, fest.name)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-colors cursor-pointer ${
                        fest.isActive
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fest.isActive ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Live Active
                        </>
                      ) : (
                        'Activate Sale'
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
                    {fest.headline}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                      {fest.couponCode}
                    </span>
                    <span className="text-slate-400 font-bold">
                      {fest.discountPercentage}% Discount
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenMoveOffer(fest)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 hover:border-orange-500/30 transition-all cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" /> Move Products to Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Move Products to Offer Modal */}
      {isMoveOfferModalOpen && selectedFestival && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider block">
                  Campaign Promotion
                </span>
                <h3 className="text-lg font-black font-outfit text-white">
                  Move Products to {selectedFestival.emoji} {selectedFestival.name}
                </h3>
              </div>
              <button
                onClick={() => setIsMoveOfferModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyOffers} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Festival Discount Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="80"
                    required
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Target Product Category
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="All">All Categories (Entire Store)</option>
                  {categories.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                  Auto-Update Effect:
                </p>
                <p className="text-[11px] text-slate-300">
                  Selected products will automatically receive a <strong>{discountInput}% Flash Deal</strong> badge and recalculate their original vs. offer price instantly.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMoveOfferModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  {applying ? 'Applying...' : 'Apply Festival Discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Custom Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-lg font-black font-outfit text-white">
                Create Custom Festival / Sale Campaign
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomCampaign} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Festival Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diwali Dhamaka"
                    value={newCampaign.festival}
                    onChange={(e) => setNewCampaign({ ...newCampaign, festival: e.target.value, name: `${e.target.value} Mega Sale` })}
                    className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Festival Emoji Icon
                  </label>
                  <input
                    type="text"
                    placeholder="🪔 or 🎨 or 🌙"
                    value={newCampaign.emoji}
                    onChange={(e) => setNewCampaign({ ...newCampaign, emoji: e.target.value })}
                    className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Promo Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UTSAV30"
                    value={newCampaign.couponCode}
                    onChange={(e) => setNewCampaign({ ...newCampaign, couponCode: e.target.value.toUpperCase() })}
                    className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Discount Rate (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="80"
                    value={newCampaign.discountPercentage}
                    onChange={(e) => setNewCampaign({ ...newCampaign, discountPercentage: e.target.value })}
                    className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Banner Headline Text *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🪔 Grand Diwali Utsav: Flat 30% OFF Everything!"
                  value={newCampaign.headline}
                  onChange={(e) => setNewCampaign({ ...newCampaign, headline: e.target.value })}
                  className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Banner Subtitle / Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Details of festival discounts and benefits..."
                  value={newCampaign.subtext}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subtext: e.target.value })}
                  className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalManager;
