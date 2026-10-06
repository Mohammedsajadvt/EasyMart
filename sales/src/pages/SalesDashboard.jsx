import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  DollarSign,
  Award,
  ShoppingBag,
  Users,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Share2,
  ExternalLink,
  LogOut,
  Package,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  X,
  ArrowUpRight,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDispatch } from 'react-redux';
import { useSalesAuth } from '../context/SalesAuthContext';
import { setSalesMetrics } from '../redux/slices/metricsSlice';
import { setOrdersList, setCatalogProducts, addDealOrder } from '../redux/slices/dealsSlice';
import { salesAPI } from '../services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

const getProductImage = (item) => {
  if (!item) return FALLBACK_IMAGE;
  if (typeof item === 'string') return item;
  if (item.coverImage) return item.coverImage;
  if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
  if (item.image) return item.image;
  return FALLBACK_IMAGE;
};

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const { salesUser, logoutSales } = useSalesAuth();

  const [repInfo, setRepInfo] = useState(salesUser);
  const [metrics, setMetrics] = useState({
    totalRevenue: salesUser?.totalSalesGenerated || 0,
    commissionEarned: salesUser?.totalCommissionEarned || 0,
    monthlyTarget: salesUser?.monthlyTarget || 15000,
    targetProgressPercent: salesUser?.monthlyTarget
      ? Math.round(((salesUser?.totalSalesGenerated || 0) / salesUser.monthlyTarget) * 100)
      : 0,
    closedDealsCount: 0,
    averageOrderValue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchTerm, setSearchTerm] = useState('');

  // Lead Order Modal
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState('');
  const [leadForm, setLeadForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientCity: 'Bangalore',
    selectedProductId: '',
    quantity: 1,
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, prodRes] = await Promise.all([
        salesAPI.getMyDashboard().catch(() => null),
        salesAPI.getProductsCatalog().catch(() => null),
      ]);

      if (dashRes && dashRes.data) {
        const { rep, metrics: dashMetrics, orders: dashOrders } = dashRes.data;
        if (rep) setRepInfo(rep);
        if (dashMetrics) {
          setMetrics(dashMetrics);
          dispatch(setSalesMetrics(dashMetrics));
        }
        if (Array.isArray(dashOrders)) {
          setOrders(dashOrders);
          dispatch(setOrdersList(dashOrders));
        }
      }

      if (prodRes && prodRes.data) {
        const productList = Array.isArray(prodRes.data)
          ? prodRes.data
          : Array.isArray(prodRes.data?.products)
          ? prodRes.data.products
          : [];

        if (productList.length > 0) {
          setProducts(productList);
          dispatch(setCatalogProducts(productList));
          if (!leadForm.selectedProductId && productList[0]?._id) {
            setLeadForm((prev) => ({ ...prev, selectedProductId: productList[0]._id }));
          }
        }
      }
    } catch (err) {
      console.error('Error loading sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const rep = repInfo || salesUser;
  const salesCode = rep?.salesCode || 'EM-SALES-REP';
  const storeOrigin =
    typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? 'https://easy-mart-phi.vercel.app'
      : 'http://localhost:5173';
  const referralStoreLink = `${storeOrigin}/?ref=${encodeURIComponent(salesCode)}`;

  const copySalesCode = () => {
    navigator.clipboard.writeText(salesCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralStoreLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!leadForm.clientName) {
      alert('Please enter client full name');
      return;
    }

    setLeadLoading(true);
    setLeadSuccessMsg('');

    try {
      const prod =
        products.find((p) => String(p._id || p.id) === String(leadForm.selectedProductId)) ||
        products[0] ||
        { _id: 'prod_lead', name: 'Direct Lead Product', price: 499.0 };

      const itemPrice = Number(prod.price || 499.0);
      const qty = Number(leadForm.quantity || 1);
      const itemTotal = Number((itemPrice * qty).toFixed(2));
      const imageSrc = getProductImage(prod);

      const res = await salesAPI.createLeadOrder({
        clientName: leadForm.clientName,
        clientEmail:
          leadForm.clientEmail ||
          `${leadForm.clientName.toLowerCase().replace(/\s+/g, '')}@client.com`,
        clientPhone: leadForm.clientPhone || '+91 98765 43210',
        clientAddress: leadForm.clientAddress || 'Commercial Business Park, Block C',
        clientCity: leadForm.clientCity || 'Bangalore',
        totalPrice: itemTotal,
        orderItems: [
          {
            name: prod.name,
            qty: qty,
            price: itemPrice,
            image: imageSrc,
            product: prod._id,
          },
        ],
      });

      const newOrder = res.data?.order || {
        _id: 'EM-LEAD-' + Math.floor(100000 + Math.random() * 900000),
        trackingNumber: 'EM-LEAD-' + Math.floor(100000 + Math.random() * 900000),
        totalPrice: itemTotal,
        createdAt: new Date().toISOString(),
        shippingAddress: {
          fullName: leadForm.clientName,
          city: leadForm.clientCity,
          country: 'India',
        },
        orderItems: [{ name: prod.name, qty, price: itemPrice, image: imageSrc }],
        status: 'Processing',
        commissionAmount: Number((itemTotal * ((rep?.commissionRate || 5) / 100)).toFixed(2)),
      };

      dispatch(addDealOrder(newOrder));
      setOrders((prev) => [newOrder, ...prev]);

      setMetrics((prev) => {
        const newRev = Number((prev.totalRevenue + itemTotal).toFixed(2));
        const newComm = Number(
          (prev.commissionEarned + (itemTotal * ((rep?.commissionRate || 5) / 100))).toFixed(2)
        );
        const newDeals = prev.closedDealsCount + 1;
        const updated = {
          ...prev,
          totalRevenue: newRev,
          commissionEarned: newComm,
          closedDealsCount: newDeals,
          targetProgressPercent: Math.min(
            100,
            Math.round((newRev / (prev.monthlyTarget || 15000)) * 100)
          ),
        };
        dispatch(setSalesMetrics(updated));
        return updated;
      });

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setLeadSuccessMsg(
        `🎉 Deal logged in MongoDB! $${itemTotal.toFixed(2)} credited with +$${(
          itemTotal * ((rep?.commissionRate || 5) / 100)
        ).toFixed(2)} commission.`
      );

      setTimeout(() => {
        setShowLeadModal(false);
        setLeadSuccessMsg('');
        setLeadForm({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          clientAddress: '',
          clientCity: 'Bangalore',
          selectedProductId: products[0]?._id || '',
          quantity: 1,
        });
        fetchDashboardData();
      }, 1600);
    } catch (err) {
      console.error(err);
      setLeadSuccessMsg('Error logging deal to server');
    } finally {
      setLeadLoading(false);
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter((o) => {
    const q = (searchTerm || '').toLowerCase();
    return (
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(q)) ||
      (o.status && o.status.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      {/* Executive Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black font-outfit text-white leading-none">
              Easy<span className="text-orange-500">Mart</span>{' '}
              <span className="text-xs text-amber-400 font-bold ml-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Sales Force
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              {rep?.region || 'South Metro Territory'} Executive Portal
            </span>
          </div>
        </div>

        {/* Rep Actions & Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-medium">Rep Code:</span>
            <span className="font-mono font-black text-orange-400">{salesCode}</span>
            <button
              onClick={copySalesCode}
              className="ml-1 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={() => {
              setShowLeadModal(true);
              setLeadSuccessMsg('');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book Deal / Lead</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          <button
            onClick={logoutSales}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Executive Banner & Referral Attribution Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Representative: {rep?.name || 'Enterprise Sales Rep'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-outfit text-white tracking-tight">
                Live Sales Quota & Commission Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Every customer order placed using your referral code or direct booking automatically credits your monthly target and computes your 5% performance commission in real time.
              </p>
            </div>

            {/* Referral Link Fast Copy */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 min-w-[280px] sm:min-w-[340px] text-left">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Share2 className="w-3.5 h-3.5 text-orange-400" /> Your Storefront Referral Link:
                </span>
                <span className="text-emerald-400 font-mono text-[11px] font-black">5% Comm.</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralStoreLink}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 truncate focus:outline-none"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-md cursor-pointer flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Generated Revenue */}
          <div className="sales-card p-5 sm:p-6 flex items-center justify-between text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Revenue Closed
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-white">
                ${Number(metrics.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold block flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live from MongoDB Atlas
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* 2. Commission Earned */}
          <div className="sales-card p-5 sm:p-6 flex items-center justify-between text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Commissions Accrued
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-emerald-400">
                ${Number(metrics.commissionEarned || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <span className="text-[10px] text-slate-400 font-bold block">
                Rate: {rep?.commissionRate || 5}% Per Closed Deal
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* 3. Monthly Target Quota */}
          <div className="sales-card p-5 sm:p-6 flex flex-col justify-between text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Monthly Quota Progress
              </span>
              <span className="text-xs font-mono font-black text-amber-400">
                {metrics.targetProgressPercent || 0}%
              </span>
            </div>
            <div className="my-2 space-y-1.5">
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, metrics.targetProgressPercent || 0)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Current: ${Number(metrics.totalRevenue || 0).toFixed(0)}</span>
                <span>Target: ${Number(metrics.monthlyTarget || 15000).toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* 4. Closed Deals Count */}
          <div className="sales-card p-5 sm:p-6 flex items-center justify-between text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Closed Deals & Orders
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-indigo-400">
                {metrics.closedDealsCount || orders.length}
              </h3>
              <span className="text-[10px] text-slate-400 font-bold block">
                Avg. Deal Size: ${Number(metrics.averageOrderValue || 0).toFixed(2)}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Switcher: Product Catalog vs Attributed Deals */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Product Catalog & Pitch Items ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'deals'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Attributed Deals & Orders ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT CATALOG FOR PITCHING & LEADS */}
        {activeTab === 'catalog' && (
          <div className="space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black font-outfit text-white">
                  Corporate Sales Catalog
                </h3>
                <p className="text-xs text-slate-400">
                  Select products to create direct enterprise proposals or book immediate client deals.
                </p>
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs animate-pulse">
                Loading live catalog from MongoDB Atlas...
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs">
                No catalog products available. Seed or create products from the Admin Portal.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {products.map((prod) => {
                  const imageSrc = getProductImage(prod);
                  return (
                    <div
                      key={prod._id}
                      className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 hover:border-orange-500/50 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800/80 p-3 flex items-center justify-center overflow-hidden">
                          <img
                            src={imageSrc}
                            alt={prod.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                            className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                            {prod.category || 'General'}
                          </span>
                          <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                            {prod.description || 'Enterprise grade catalog item with official warranty.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Unit Price</span>
                          <span className="text-sm font-black font-mono text-white">
                            ${Number(prod.price || 0).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setLeadForm((prev) => ({
                              ...prev,
                              selectedProductId: prod._id,
                            }));
                            setShowLeadModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Book Deal
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ATTRIBUTED DEALS TABLE */}
        {activeTab === 'deals' && (
          <div className="sales-card overflow-hidden text-left space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black font-outfit text-white">
                  Attributed Customer & Client Orders
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time list of all sales matched to referral code: <code className="text-orange-400 font-mono font-bold">{salesCode}</code>
                </p>
              </div>

              {/* Search filter */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders or clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Order Code & Date</th>
                    <th className="py-3.5 px-4">Client / Destination</th>
                    <th className="py-3.5 px-4">Order Items</th>
                    <th className="py-3.5 px-4">Deal Total</th>
                    <th className="py-3.5 px-4">Your 5% Commission</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-16 text-center text-slate-500 text-xs">
                        No attributed deals found. Share your referral link or click "Book Deal / Lead" to log your first order!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, idx) => (
                      <tr key={order._id || idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-orange-400 block">
                            {order.trackingNumber || `#${String(order._id).slice(-8)}`}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">
                            {order.shippingAddress?.fullName || order.user?.name || 'Enterprise Client'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {order.shippingAddress?.city || 'Bangalore'}, India
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {order.orderItems?.length || 1} Item(s)
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          ${Number(order.totalPrice || 0).toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-emerald-400">
                          +${Number(order.commissionAmount || (Number(order.totalPrice || 0) * 0.05)).toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                            {order.status || 'Processing'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: DIRECT LEAD / DEAL ENTRY */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
          <div className="sales-card max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto text-left relative bg-[#0D1526] border border-slate-800 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black font-outfit text-white">
                  Log Direct Client Deal / Order
                </h3>
              </div>
              <button
                onClick={() => setShowLeadModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {leadSuccessMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold">{leadSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateLead} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Client Full Name / Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Tech Solutions"
                    value={leadForm.clientName}
                    onChange={(e) => setLeadForm({ ...leadForm, clientName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      placeholder="procurement@apex.com"
                      value={leadForm.clientEmail}
                      onChange={(e) => setLeadForm({ ...leadForm, clientEmail: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={leadForm.clientPhone}
                      onChange={(e) => setLeadForm({ ...leadForm, clientPhone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Selected Product Item
                  </label>
                  <select
                    value={leadForm.selectedProductId}
                    onChange={(e) => setLeadForm({ ...leadForm, selectedProductId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    {products.map((p) => (
                      <option key={p._id} value={p._id} className="bg-slate-900">
                        {p.name} — ${Number(p.price || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={leadForm.quantity}
                      onChange={(e) => setLeadForm({ ...leadForm, quantity: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
                    <input
                      type="text"
                      value={leadForm.clientCity}
                      onChange={(e) => setLeadForm({ ...leadForm, clientCity: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-102"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{leadLoading ? 'Booking Deal in MongoDB...' : 'Confirm Deal & Attribute Quota'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
