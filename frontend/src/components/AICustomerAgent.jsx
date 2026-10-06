import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Package,
  RotateCcw,
  Tag,
  ShieldCheck,
  User,
  Truck,
  Flame,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Clock,
  ChevronRight,
  Maximize2,
  Minimize2,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { orderAPI, productAPI, festivalAPI } from '../services/api';

const QUICK_PROMPTS = [
  { icon: Package, text: 'Track my recent orders', action: 'track_order' },
  { icon: Flame, text: "Today's Festival Offers", action: 'festival_deals' },
  { icon: Headphones, text: 'Recommend ANC Headphones', action: 'recommend_headphones' },
  { icon: RotateCcw, text: 'How do returns work?', action: 'return_policy' },
  { icon: Truck, text: 'Delivery & Shipping times', action: 'shipping_info' },
];

const AICustomerAgent = () => {
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [activeFestival, setActiveFestival] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 I'm **EasyMart AI Care**, your personal shopping & support assistant.\n\nHow can I help you today? I can track your orders, recommend products, check active festival discounts, or assist with returns!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  // Load User Data & Store Context for AI
  useEffect(() => {
    const loadContextData = async () => {
      try {
        const [prodRes, festRes] = await Promise.all([
          productAPI.getAll({ limit: 30 }),
          festivalAPI.getByCurrentDate(),
        ]);
        setCatalogProducts(prodRes.data?.products || []);
        if (festRes.data?.activeCampaign) {
          setActiveFestival(festRes.data.activeCampaign);
        }

        if (user) {
          const ordersRes = await orderAPI.getMyOrders();
          setUserOrders(ordersRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load AI context:', err);
      }
    };
    loadContextData();
  }, [user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // AI Logic Engine
  const generateAIResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Order Tracking
    if (q.includes('order') || q.includes('track') || q.includes('where is my package') || q.includes('status')) {
      if (!user) {
        return {
          text: `You are currently browsing as a guest. Please **[Sign In](/login)** to let me instantly look up your active order statuses and delivery live tracking!`,
          link: '/login',
          linkText: 'Sign In to View Orders',
        };
      }

      if (userOrders.length === 0) {
        return {
          text: `I checked your account records (**${user.email}**), but you don't have any placed orders yet.\n\nWould you like to explore today's top discounts or browse categories?`,
          actionType: 'browse_catalog',
        };
      }

      const latest = userOrders[0];
      const itemsList = (latest.orderItems || []).map((i) => `• **${i.name}** (Qty: ${i.qty}) - $${i.price}`).join('\n');

      return {
        text: `Here is the live status for your most recent order **#${latest._id.slice(-8)}**:\n\n**Status**: 🚚 **${latest.status || 'Processing'}**\n**Total Amount**: $${latest.totalPrice.toFixed(2)}\n**Delivery Address**: ${latest.shippingAddress?.city || 'Selected Location'}, ${latest.shippingAddress?.country || 'India'}\n\n**Items in this order:**\n${itemsList}\n\nExpected delivery within **2-3 business days** with Free Express Courier.`,
        orderCard: latest,
      };
    }

    // 2. Festival Deals & Coupons
    if (q.includes('festival') || q.includes('coupon') || q.includes('offer') || q.includes('discount') || q.includes('deal') || q.includes('code')) {
      if (activeFestival) {
        return {
          text: `🎉 **${activeFestival.title}** is currently LIVE!\n\n• **Discount**: Up to **${activeFestival.discountPercentage || 25}% OFF** across ${activeFestival.applicableCategory || 'All Catalog'}\n• **Special Promo Code**: Use \`${activeFestival.badge || 'FESTIVAL2026'}\` at checkout for instant price deduction!\n• **Tagline**: *${activeFestival.subtitle || 'Celebrate with exclusive savings'}*`,
          link: '/shop?flashDeals=true',
          linkText: 'Browse Festival Specials',
        };
      }
      return {
        text: `🔥 We currently have our **Daily Flash Deals** active with up to **40% OFF** on select electronics, smart wearables, and designer fashion!\n\nAll orders over **$150** qualify for **100% Free Express Delivery**.`,
        link: '/shop?flashDeals=true',
        linkText: 'View Flash Deals (Up to 40% Off)',
      };
    }

    // 3. Product Recommendations - Headphones / Audio
    if (q.includes('headphone') || q.includes('audio') || q.includes('anc') || q.includes('earphone') || q.includes('sound')) {
      const audioProds = catalogProducts.filter((p) =>
        p.category === 'Electronics' && (p.name.toLowerCase().includes('headphone') || p.name.toLowerCase().includes('anc') || p.name.toLowerCase().includes('sound'))
      ).slice(0, 2);

      const prodsToRender = audioProds.length > 0 ? audioProds : catalogProducts.filter((p) => p.category === 'Electronics').slice(0, 2);

      return {
        text: `Here are our top-rated **Active Noise Cancelling (ANC)** audio devices with spatial 3D audio and long-lasting battery life:`,
        productCards: prodsToRender,
      };
    }

    // 4. Product Recommendations - Mobile / Smartphones
    if (q.includes('mobile') || q.includes('phone') || q.includes('tablet') || q.includes('samsung') || q.includes('apple') || q.includes('galaxy')) {
      const mobProds = catalogProducts.filter((p) => p.category === 'Mobiles & Tablets').slice(0, 2);
      return {
        text: `Here are the latest flagship 5G smartphones and tablets available with official brand warranty:`,
        productCards: mobProds,
      };
    }

    // 5. Returns & Refunds
    if (q.includes('return') || q.includes('refund') || q.includes('exchange') || q.includes('cancel')) {
      return {
        text: `🛡️ **EasyMart Return & Refund Policy**:\n\n• **30-Day Hassle-Free Returns**: You can return or exchange any undamaged item within 30 days of delivery.\n• **Instant Refund**: Refunds are processed back to your original payment method within 3-5 business days after inspection.\n• **Prepaid Pickup**: Our courier partner will pick up the package from your doorstep with zero return fee.\n\nTo initiate a return on an existing order, visit your **[Orders Page](/orders)** and select "Request Return" next to the delivered item.`,
        link: '/orders',
        linkText: 'Go to My Orders',
      };
    }

    // 6. Shipping & Delivery
    if (q.includes('ship') || q.includes('delivery') || q.includes('courier') || q.includes('time') || q.includes('fast')) {
      return {
        text: `🚚 **Shipping & Logistics Info**:\n\n• **Standard Shipping**: 3-5 business days.\n• **Express 2-Day Air**: 2 business days for metro cities.\n• **Free Delivery**: On all orders over **$150**.\n• Real-time GPS tracking is provided as soon as your order leaves our fulfillment center.`,
      };
    }

    // 7. Cart & Checkout Help
    if (q.includes('cart') || q.includes('buy') || q.includes('checkout') || q.includes('pay') || q.includes('upi')) {
      const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
      return {
        text: `🛒 You currently have **${cartCount} item(s)** in your shopping cart.\n\nWe support **Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery (COD)** with 256-bit SSL encrypted checkout.`,
        link: '/cart',
        linkText: 'Proceed to Cart / Checkout',
      };
    }

    // 8. Default AI response
    return {
      text: `I understand you're inquiring about **"${query}"**.\n\nI can assist you with:\n1. 📦 **Tracking your active orders & shipments**\n2. 💡 **Personalized product recommendations**\n3. 🎟️ **Festival discounts & promotional coupons**\n4. 🔄 **Returns, refunds, & warranty support**\n\nWould you like me to connect you with a specialist or search a specific product?`,
      link: '/shop',
      linkText: 'Explore Catalog',
    };
  };

  const handleSend = (textToSend = inputMessage) => {
    if (!textToSend || !textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResult = generateAIResponse(userMsg.text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: aiResult.text,
        link: aiResult.link,
        linkText: aiResult.linkText,
        orderCard: aiResult.orderCard,
        productCards: aiResult.productCards,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3.5 rounded-full shadow-xl flex items-center gap-1.5 border border-slate-700 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Care Online • Need Help?</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Customer Assistant"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-2xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </button>
      </div>

      {/* Floating AI Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-22 right-5 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'w-[95vw] sm:w-[540px] h-[85vh] max-h-[720px]'
              : 'w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Top Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black font-outfit text-white">EasyMart AI Agent</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {user ? `Connected to ${user.name}` : 'Customer Care Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-50 border-b border-slate-100 p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => {
              const IconComp = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.text)}
                  className="flex items-center gap-1.5 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-slate-200 text-[11px] font-bold text-slate-700 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all shadow-xs cursor-pointer flex-shrink-0"
                >
                  <IconComp className="w-3.5 h-3.5 text-orange-500" />
                  <span>{prompt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAFC]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs text-left leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                  }`}
                >
                  {/* Message Text with Simple Markdown Line Handling */}
                  <div className="space-y-1.5 whitespace-pre-line">
                    {msg.text.split('\n').map((line, i) => {
                      if (line.startsWith('• ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                        return <p key={i} className="pl-1 font-medium">{line}</p>;
                      }
                      return <p key={i}>{line}</p>;
                    })}
                  </div>

                  {/* Optional Interactive Order Card */}
                  {msg.orderCard && (
                    <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-900">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[11px] font-bold">
                        <span className="text-orange-600 font-black">Order #{msg.orderCard._id.slice(-6)}</span>
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase text-[9px] font-black">
                          {msg.orderCard.status || 'Processing'}
                        </span>
                      </div>
                      <div className="py-2 text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-600">
                          <span>Items:</span>
                          <span className="font-bold text-slate-900">{msg.orderCard.orderItems?.length || 1} item(s)</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Total:</span>
                          <span className="font-black text-slate-900">${msg.orderCard.totalPrice?.toFixed(2)}</span>
                        </div>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setIsOpen(false)}
                        className="w-full mt-1.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1"
                      >
                        View Full Order Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Optional Interactive Product Recommendation Cards */}
                  {msg.productCards && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.productCards.map((p) => (
                        <div
                          key={p._id}
                          className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between text-slate-900"
                        >
                          <img
                            src={p.coverImage || p.images?.[0]}
                            alt={p.name}
                            className="w-full h-20 object-contain mb-1.5"
                          />
                          <div>
                            <span className="text-[9px] font-bold text-orange-600 uppercase">{p.category}</span>
                            <h4 className="text-[11px] font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                            <span className="text-xs font-black text-slate-900 block mt-0.5">${p.price.toFixed(2)}</span>
                          </div>
                          <div className="mt-2 flex gap-1">
                            <Link
                              to={`/product/${p._id}`}
                              onClick={() => setIsOpen(false)}
                              className="flex-1 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-[10px] font-bold text-center"
                            >
                              Details
                            </Link>
                            <button
                              onClick={() => addToCart(p, 1)}
                              className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Optional Action CTA Link */}
                  {msg.link && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                      <Link
                        to={msg.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 font-bold text-[11px] text-orange-600 hover:text-orange-700 underline"
                      >
                        {msg.linkText || 'Learn More'} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span className="font-semibold text-[11px]">EasyMart AI is searching store database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about orders, products, festival deals, returns..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AICustomerAgent;
