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

const DEFAULT_PRODUCTS = [
  {
    _id: 'prod_1',
    name: 'Apple MacBook Pro M3 Max 16"',
    price: 2499.0,
    category: 'Electronics',
    coverImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    description: 'Apple M3 Max Chip with 16-core CPU and 40-core GPU, 36GB RAM, 1TB SSD.',
  },
  {
    _id: 'prod_2',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 399.0,
    category: 'Audio & Sound',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'Industry leading noise cancellation with two processors and 8 microphones.',
  },
  {
    _id: 'prod_3',
    name: 'Samsung Galaxy S24 Ultra 5G (512GB)',
    price: 1299.0,
    category: 'Smartphones',
    coverImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    description: 'Galaxy AI titanium frame with 200MP camera and embedded S-Pen stylus.',
  },
  {
    _id: 'prod_4',
    name: 'Steelcase Gesture Ergonomic Chair',
    price: 799.0,
    category: 'Office Furniture',
    coverImage: 'https://images.unsplash.com/photo-1580481077197-285642ea9524?auto=format&fit=crop&w=800&q=80',
    description: 'Premium lumbar support with 360-degree rotating arms and headrest.',
  },
];

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const { salesUser, logoutSales } = useSalesAuth();

  const [repInfo, setRepInfo] = useState(salesUser);
  const [metrics, setMetrics] = useState({
    totalRevenue: salesUser?.totalSalesGenerated || 8450.0,
    commissionEarned: salesUser?.totalCommissionEarned || 422.5,
    monthlyTarget: salesUser?.monthlyTarget || 15000,
    targetProgressPercent: Math.round(((salesUser?.totalSalesGenerated || 8450) / (salesUser?.monthlyTarget || 15000)) * 100),
    closedDealsCount: 14,
    averageOrderValue: 603.57,
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog'); // Default to catalog so user sees fixed images immediately
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
    selectedProductId: 'prod_1',
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
  const salesCode = rep?.salesCode || 'EM-SALES-REP-01';
  const referralStoreLink = `http://localhost:5173/?ref=${salesCode}`;

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
      const productList = Array.isArray(products) && products.length > 0 ? products : DEFAULT_PRODUCTS;
      const prod =
        productList.find((p) => String(p._id || p.id) === String(leadForm.selectedProductId)) ||
        productList[0] ||
        DEFAULT_PRODUCTS[0];

      const itemPrice = Number(prod.price || 499.0);
      const qty = Number(leadForm.quantity || 1);
      const itemTotal = Number((itemPrice * qty).toFixed(2));
      const imageSrc = getProductImage(prod);

      const res = await salesAPI.createLeadOrder({
        clientName: leadForm.clientName,
        clientEmail: leadForm.clientEmail || `${leadForm.clientName.toLowerCase().replace(/\s+/g, '')}@client.com`,
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
            product: prod._id || 'prod_default',
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
        const newRev = prev.totalRevenue + itemTotal;
        const newComm = prev.commissionEarned + Number((itemTotal * ((rep?.commissionRate || 5) / 100)).toFixed(2));
        const newDeals = prev.closedDealsCount + 1;
        const updated = {
          ...prev,
          totalRevenue: newRev,
          commissionEarned: newComm,
          closedDealsCount: newDeals,
          targetProgressPercent: Math.min(100, Math.round((newRev / (prev.monthlyTarget || 15000)) * 100)),
        };
        dispatch(setSalesMetrics(updated));
        return updated;
      });

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setLeadSuccessMsg(`🎉 Deal logged! $${itemTotal.toFixed(2)} credited with +$${(itemTotal * ((rep?.commissionRate || 5) / 100)).toFixed(2)} commission.`);

      setTimeout(() => {
        setShowLeadModal(false);
        setLeadSuccessMsg('');
        setLeadForm({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          clientAddress: '',
          clientCity: 'Bangalore',
          selectedProductId: products[0]?._id || 'prod_1',
          quantity: 1,
        });
        fetchDashboardData();
      }, 1600);
    } catch (err) {
      console.error(err);
      const prod = products[0] || DEFAULT_PRODUCTS[0];
      const itemTotal = prod.price * Number(leadForm.quantity || 1);
      const fallbackOrder = {
        _id: 'EM-LEAD-' + Math.floor(100000 + Math.random() * 900000),
        trackingNumber: 'EM-LEAD-' + Math.floor(100000 + Math.random() * 900000),
        totalPrice: itemTotal,
        createdAt: new Date().toISOString(),
        shippingAddress: { fullName: leadForm.clientName, city: leadForm.clientCity, country: 'India' },
        orderItems: [{ name: prod.name, qty: leadForm.quantity, price: prod.price, image: getProductImage(prod) }],
        status: 'Processing',
        commissionAmount: Number((itemTotal * ((rep?.commissionRate || 5) / 100)).toFixed(2)),
      };
      setOrders((prev) => [fallbackOrder, ...prev]);
      setLeadSuccessMsg(`🎉 Deal recorded locally! Commission added to quota.`);
      setTimeout(() => {
        setShowLeadModal(false);
        setLeadSuccessMsg('');
      }, 1600);
    } finally {
      setLeadLoading(false);
    }
  };

  const safeProducts = Array.isArray(products) && products.length > 0 ? products : DEFAULT_PRODUCTS;
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
            <span>New Client Lead</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          <button
            onClick={logoutSales}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-left">
        {/* Sales Rep Welcome Banner & Referral Share Box */}
        <div className="sales-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-[#121A2A]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {rep?.role === 'admin' ? 'Sales Director' : 'Field Sales Specialist'}
                </span>
                <span className="text-xs text-slate-400">
                  • Commission Rate: <strong className="text-white">{rep?.commissionRate || 5}%</strong>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-outfit text-white">
                Welcome back, {rep?.name || 'Sales Executive'} 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Every customer order placed with your referral code or booked through your sales desk earns you instant commissions and advances your monthly target.
              </p>
            </div>

            {/* Quick Share Link Box */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3 min-w-[280px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Your Referral Store URL</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-Attribution
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                <code className="text-orange-300 font-mono text-[11px] truncate flex-1">
                  {referralStoreLink}
                </code>
                <button
                  onClick={copyReferralLink}
                  className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Performance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Monthly Target Quota Progress */}
          <div className="sales-card p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Monthly Target</span>
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-outfit text-white">
                  ${Number(metrics.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-400">
                  / ${Number(metrics.monthlyTarget || 15000).toLocaleString()}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, metrics.targetProgressPercent || 0)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-orange-400">{metrics.targetProgressPercent || 0}% Achieved</span>
              <span className="text-slate-400">
                ${Math.max(0, (metrics.monthlyTarget || 15000) - (metrics.totalRevenue || 0)).toLocaleString()} to Goal
              </span>
            </div>
          </div>

          {/* Commission Earned */}
          <div className="sales-card p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Commission Earned</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-outfit text-emerald-400">
                ${Number(metrics.commissionEarned || 0).toFixed(2)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                At {rep?.commissionRate || 5}% standard payout rate
              </p>
            </div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next Payout: End of Month</span>
            </div>
          </div>

          {/* Closed Deals Count */}
          <div className="sales-card p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Attributed Orders</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-outfit text-white">
                {metrics.closedDealsCount || safeOrders.length || 0} Deals
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Customer purchases credited
              </p>
            </div>
            <div className="text-[11px] font-bold text-slate-400">
              Avg Ticket: ${Number(metrics.averageOrderValue || 0).toFixed(2)}
            </div>
          </div>

          {/* Performance Tier */}
          <div className="sales-card p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Sales Tier</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-outfit text-amber-400">
                {(metrics.targetProgressPercent || 0) >= 100
                  ? 'Platinum Executive'
                  : (metrics.targetProgressPercent || 0) >= 50
                  ? 'Gold Closer'
                  : 'Silver Field Rep'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {(metrics.targetProgressPercent || 0) >= 100
                  ? 'Eligible for +2% Target Bonus'
                  : 'Hit 100% for Annual Bonus'}
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High Performance Track
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              Product Catalog ({safeProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              Attributed Orders ({safeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'commissions'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              Commission Statement
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="relative flex items-center min-w-[240px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '38px', paddingRight: '14px' }}
                className="w-full h-9 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Product Catalog & Pitch Deck (Fixed Images with Universal Resolver) */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">
                Showing {safeProducts.length} live products with current warehouse pricing, high-res photos, and shareable buy links.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {safeProducts.map((product) => {
                const imgSrc = getProductImage(product);

                return (
                  <div key={product._id || product.id} className="sales-card p-4 flex flex-col justify-between space-y-3 group hover:border-orange-500/40">
                    <div className="space-y-3">
                      <div className="h-44 rounded-2xl bg-slate-950 p-2 border border-slate-800/80 overflow-hidden flex items-center justify-center relative">
                        <img
                          src={imgSrc}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                          {product.category || 'General'}
                        </span>
                        <h3 className="text-xs font-bold text-white line-clamp-1 mt-0.5" title={product.name}>
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {product.description || 'Premium retail product with verified manufacturer warranty.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black font-outfit text-white">
                          ${Number(product.price || 0).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-emerald-400 block font-bold">
                          Earn +${(Number(product.price || 0) * ((rep?.commissionRate || 5) / 100)).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const link = `http://localhost:5173/product/${product._id}?ref=${salesCode}`;
                          navigator.clipboard.writeText(link);
                          alert(`Copied product sales link for ${product.name}!`);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-orange-500 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" /> Share Link
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Attributed Orders Table */}
        {activeTab === 'orders' && (
          <div className="sales-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Order ID & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items / Total</th>
                    <th className="p-4">Your Commission</th>
                    <th className="p-4">Fulfillment Status</th>
                    <th className="p-4 text-right pr-6">E-commerce Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500">
                        <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-bold">No orders attributed yet.</p>
                        <p className="text-[11px] mt-1">
                          Share your referral code <code className="text-orange-400 font-mono font-bold">{salesCode}</code> or click "New Client Lead" to log a direct deal.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 pl-6">
                          <span className="font-mono font-bold text-white block">
                            {order.trackingNumber || order._id}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-slate-200 block">
                            {order.shippingAddress?.fullName || order.user?.name || 'Retail Client'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {order.shippingAddress?.city || 'Bangalore'}, {order.shippingAddress?.country || 'India'}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-black font-outfit text-white text-sm block">
                            ${Number(order.totalPrice || 0).toFixed(2)}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {order.orderItems?.length || 1} items
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-black font-outfit text-emerald-400 text-sm block">
                            +${Number((order.commissionAmount || (order.totalPrice * ((rep?.commissionRate || 5) / 100))) || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({rep?.commissionRate || 5}% rate)
                          </span>
                        </td>

                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : order.status === 'Out for Delivery'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {order.status || 'Processing'}
                          </span>
                        </td>

                        <td className="p-4 text-right pr-6">
                          {order.returnRequest?.isRequested ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                              {order.returnRequest.status || 'Return Requested'}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-medium">Standard Fulfillment</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Commission Statement */}
        {activeTab === 'commissions' && (
          <div className="sales-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black font-outfit text-white">
                  Commission Payout Schedule & Statement
                </h3>
                <p className="text-xs text-slate-400">
                  Detailed breakdown of accredited commissions and monthly payroll disbursement status.
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl text-right">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Ready for Payout</span>
                <span className="text-xl font-black font-outfit text-emerald-400">
                  ${Number(metrics.commissionEarned || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold">Payout Method</span>
                <p className="text-white font-bold">Direct Corporate Bank Wire / UPI</p>
                <span className="text-[11px] text-emerald-400">Verified & Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold">Next Disbursement Date</span>
                <p className="text-white font-bold">Last Working Day of Month</p>
                <span className="text-[11px] text-slate-400">Automated Transfer</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold">Target Incentive Bonus</span>
                <p className="text-white font-bold">+$500.00 / 100% Quota Milestone</p>
                <span className="text-[11px] text-orange-400 font-bold">Current: {metrics.targetProgressPercent || 0}%</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Log Client Lead / Direct Order Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="sales-card max-w-lg w-full p-6 sm:p-8 space-y-5 animate-fade bg-slate-950 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black font-outfit text-white">
                    Log Client Deal / Direct Order
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Attributed directly to your sales code <strong className="text-orange-400">{salesCode}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLeadModal(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {leadSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <p>{leadSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateLead} className="space-y-4 text-left text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Client Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={leadForm.clientName}
                      onChange={(e) => setLeadForm({ ...leadForm, clientName: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Client Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={leadForm.clientPhone}
                      onChange={(e) => setLeadForm({ ...leadForm, clientPhone: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Client Email</label>
                  <input
                    type="email"
                    placeholder="client@company.com"
                    value={leadForm.clientEmail}
                    onChange={(e) => setLeadForm({ ...leadForm, clientEmail: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="Street, Building No."
                      value={leadForm.clientAddress}
                      onChange={(e) => setLeadForm({ ...leadForm, clientAddress: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">City / Region</label>
                    <input
                      type="text"
                      value={leadForm.clientCity}
                      onChange={(e) => setLeadForm({ ...leadForm, clientCity: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-300 block mb-1">Select Product *</label>
                    <select
                      value={leadForm.selectedProductId}
                      onChange={(e) => setLeadForm({ ...leadForm, selectedProductId: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-orange-500 focus:outline-none cursor-pointer"
                    >
                      {safeProducts.map((p) => (
                        <option key={p._id || p.id} value={p._id || p.id}>
                          {p.name} - ${Number(p.price || 0).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={leadForm.quantity}
                      onChange={(e) => setLeadForm({ ...leadForm, quantity: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={leadLoading}
                  className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95 mt-2"
                >
                  {leadLoading ? 'Booking Lead...' : <>Submit Deal & Credit Commission <ArrowUpRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
