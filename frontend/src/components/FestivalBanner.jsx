import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Copy, Check, ChevronRight, X, Calendar } from 'lucide-react';
import { festivalAPI } from '../services/api';

// Client-side calendar fallback resolver matching current date
const fallbackFestivals = [
  {
    name: 'Navratri & Durga Puja Utsav Bonanza',
    festival: 'Navratri & Durga Puja',
    emoji: '🌸',
    startMonth: 10,
    startDay: 1,
    endMonth: 10,
    endDay: 19,
    dateDisplay: 'Oct 01 - Oct 19, 2026',
    discountPercentage: 25,
    couponCode: 'NAVRATRI25',
    headline: '🌸 Navratri & Durga Puja Grand Utsav: Flat 25% OFF Festive Deals!',
    themeGradient: 'linear-gradient(135deg, #831843 0%, #C026D3 50%, #9333EA 100%)',
    badgeText: 'NAVRATRI UTSAV LIVE',
    appliedCategory: 'All',
  },
  {
    name: 'Dussehra Mega Victory Sale',
    festival: 'Dussehra (Vijayadashami)',
    emoji: '🏹',
    startMonth: 10,
    startDay: 20,
    endMonth: 10,
    endDay: 25,
    dateDisplay: 'Oct 20 - Oct 25, 2026',
    discountPercentage: 25,
    couponCode: 'VIJAY25',
    headline: '🏹 Victory Season Mega Offers: Extra 25% OFF On Top Brands!',
    themeGradient: 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 60%, #6366F1 100%)',
    badgeText: 'DUSSEHRA SPECIAL',
    appliedCategory: 'All',
  },
  {
    name: 'Diwali Grand Dhamaka Festival Sale',
    festival: 'Diwali (Deepavali)',
    emoji: '🪔',
    startMonth: 10,
    startDay: 26,
    endMonth: 11,
    endDay: 5,
    dateDisplay: 'Oct 26 - Nov 05, 2026',
    discountPercentage: 30,
    couponCode: 'DIWALI30',
    headline: '🪔 Diwali Mahotsav Mega Sale: Up to 30% OFF Everything!',
    themeGradient: 'linear-gradient(135deg, #78350F 0%, #B45309 40%, #EA580C 100%)',
    badgeText: 'DIWALI DHAMAKA LIVE',
    appliedCategory: 'All',
  },
];

const resolveFallback = (date = new Date()) => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const score = m * 100 + d;
  for (const f of fallbackFestivals) {
    const s = f.startMonth * 100 + f.startDay;
    const e = f.endMonth * 100 + f.endDay;
    if (score >= s && score <= e) return f;
  }
  return fallbackFestivals[0];
};

const FestivalBanner = () => {
  const [activeFestival, setActiveFestival] = useState(() => resolveFallback(new Date()));
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [todayFormatted, setTodayFormatted] = useState('');

  useEffect(() => {
    const today = new Date();
    setTodayFormatted(
      today.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    );

    const fetchFestivalForToday = async () => {
      try {
        // Fetch festival based on real-time current date
        const res = await festivalAPI.getByCurrentDate(today.toISOString());
        if (res.data && res.data.festival) {
          setActiveFestival(res.data.festival);
        } else {
          const activeRes = await festivalAPI.getActive();
          if (activeRes.data) {
            setActiveFestival(activeRes.data);
          }
        }
      } catch (err) {
        console.warn('Using calendar date fallback for festival banner:', err);
        setActiveFestival(resolveFallback(today));
      }
    };

    fetchFestivalForToday();
  }, []);

  if (!activeFestival || dismissed) return null;

  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(activeFestival.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative text-white py-2.5 px-4 shadow-md transition-all animate-fade"
      style={{
        background:
          activeFestival.themeGradient ||
          'linear-gradient(135deg, #831843 0%, #C026D3 50%, #9333EA 100%)',
      }}
    >
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Headline & Today's Calendar Date */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="text-xl flex-shrink-0 animate-bounce">
            {activeFestival.emoji || '🌸'}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                {activeFestival.badgeText || 'LIVE FESTIVAL SALE'}
              </span>
              {todayFormatted && (
                <span className="bg-black/20 text-white/90 px-2 py-0.5 rounded-md text-[10px] font-bold hidden md:inline-flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-amber-300" /> Today: {todayFormatted}
                </span>
              )}
              <strong className="font-extrabold font-outfit text-sm">
                {activeFestival.headline}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Promo Box & CTA */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/25 shadow-xs">
            <span className="text-[10px] text-white/80 font-bold uppercase">Code:</span>
            <span className="font-mono font-black text-amber-300 tracking-wider text-xs">
              {activeFestival.couponCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="ml-1 p-1 hover:bg-white/20 rounded-md transition-colors cursor-pointer text-white"
              title="Copy Coupon Code"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <Link
            to={`/shop?category=${encodeURIComponent(activeFestival.appliedCategory || 'All')}`}
            className="px-4 py-1.5 bg-white text-slate-900 hover:bg-amber-50 rounded-xl font-black flex items-center gap-1 shadow transition-all hover:scale-105 active:scale-95"
          >
            Shop Offers <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white"
            title="Dismiss Announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FestivalBanner;
