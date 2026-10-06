import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Timer, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

const FlashDealsSection = ({ products, onQuickView }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals = products.slice(0, 4);

  return (
    <section style={{ paddingTop: '1.25rem', paddingBottom: '2.5rem' }} className="bg-gradient-to-b from-orange-50/50 via-white to-white rounded-3xl border border-orange-100/60 shadow-xs">
      <div className="container">
        {/* Flash Deals Header Bar */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-orange-200/80 shadow-md"
          style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 flex-shrink-0">
              <Flame className="w-6 h-6 animate-pulse fill-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-600 block mb-0.5">
                Limited Time Offers
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-outfit text-slate-900 leading-tight">
                Flash Deals & Mega Discounts
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2.5 self-start md:self-auto bg-slate-50 p-2 sm:px-4 sm:py-2.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-1.5">
              <Timer className="w-3.5 h-3.5 text-orange-500" /> Ends In:
            </div>
            <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black">
              <div className="bg-slate-900 text-white px-2.5 py-1 rounded-xl shadow-sm">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-slate-400 font-bold">:</span>
              <div className="bg-slate-900 text-white px-2.5 py-1 rounded-xl shadow-sm">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-slate-400 font-bold">:</span>
              <div className="bg-orange-500 text-white px-2.5 py-1 rounded-xl shadow-sm">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {deals.map((product) => (
            <div key={product._id} className="flex flex-col gap-3">
              <ProductCard product={product} onQuickView={onQuickView} />
              {/* Claimed Inventory Indicator */}
              <div className="px-2.5 sm:px-3.5 pt-1">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span>In Stock: {product.stock} left</span>
                  <span className="text-orange-600 font-extrabold">85% Claimed</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashDealsSection;
