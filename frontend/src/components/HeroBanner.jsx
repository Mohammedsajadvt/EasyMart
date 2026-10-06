import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Zap, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { festivalAPI, productAPI } from '../services/api';

const defaultGradients = [
  'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4338CA 100%)',
  'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #334155 100%)',
  'linear-gradient(135deg, #451A03 0%, #78350F 60%, #9A3412 100%)',
];

const HeroBanner = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const [festRes, featRes] = await Promise.all([
          festivalAPI.getActive(),
          productAPI.getFeatured(),
        ]);

        const festival = festRes.data;
        const featuredList = featRes.data || [];
        const dynamicSlides = [];

        // 1. If active festival exists in MongoDB, add dynamic festival hero slide
        if (festival && festival.name) {
          dynamicSlides.push({
            id: festival._id || 'festival-slide',
            tag: `${festival.badgeText || 'SPECIAL FESTIVAL EVENT'} • UP TO ${festival.discountPercentage || 50}% OFF`,
            title: festival.title || festival.name,
            subtitle: festival.description || `Celebrate ${festival.name} with exclusive mega discounts, flash voucher coupons, and free express doorstep delivery!`,
            cta: `Shop ${festival.name} Sale`,
            link: `/shop?category=${encodeURIComponent(festival.categories?.[0] || 'All')}`,
            bgGradient: festival.bannerGradient || 'linear-gradient(135deg, #4C0519 0%, #881337 50%, #BE123C 100%)',
            accentColor: festival.accentColor || '#F43F5E',
            image: festival.bannerImage || (featuredList[0]?.coverImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80'),
            badge: `Promo Code: ${festival.couponCode || 'FESTIVAL2026'}`,
            priceTag: `Save ${festival.discountPercentage || 40}% Today`,
          });
        }

        // 2. Add top featured products dynamically from MongoDB Atlas
        featuredList.slice(0, 3).forEach((prod, index) => {
          dynamicSlides.push({
            id: prod._id || `featured-${index}`,
            tag: `${(prod.brand || 'PREMIUM').toUpperCase()} • ${prod.category || 'BEST SELLER'}`,
            title: prod.name,
            subtitle: prod.description ? prod.description.slice(0, 120) + '...' : 'Explore flagship features, authentic manufacturer warranty, and free express delivery.',
            cta: 'View Product Details',
            link: `/product/${prod._id}`,
            bgGradient: defaultGradients[index % defaultGradients.length],
            accentColor: index === 0 ? '#38BDF8' : index === 1 ? '#FF5A1F' : '#F59E0B',
            image: prod.coverImage || prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            badge: prod.isFlashDeal ? '⚡ Flash Deal' : '⭐ Verified Top Pick',
            priceTag: `$${Number(prod.price || 0).toFixed(2)}`,
          });
        });

        if (dynamicSlides.length > 0) {
          setSlides(dynamicSlides);
        }
      } catch (err) {
        console.error('Failed to load dynamic hero banners:', err);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section style={{ paddingTop: '1rem', paddingBottom: '1rem' }} className="container">
        <div className="h-[380px] bg-slate-900 rounded-3xl animate-pulse" />
      </section>
    );
  }

  const slide = slides[currentSlide] || slides[0];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section style={{ paddingTop: '1rem', paddingBottom: '1rem' }} className="relative overflow-hidden">
      <div className="container">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center p-6 sm:p-10 lg:py-10 lg:px-12"
          style={{ background: slide.bgGradient }}
        >
          {/* Ambient Glows */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: slide.accentColor }}
          />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-orange-600/20 blur-2xl pointer-events-none" />

          {/* Slide Arrow Controls */}
          {slides.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all opacity-90 hover:opacity-100 hidden sm:flex cursor-pointer shadow-xl hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all opacity-90 hover:opacity-100 hidden sm:flex cursor-pointer shadow-xl hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full relative z-10">
            {/* Left Copy Section */}
            <div
              className="lg:col-span-7 space-y-4 sm:space-y-5 text-left"
              style={{ paddingLeft: 'clamp(1rem, 4vw, 3.5rem)' }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-wider text-orange-300 uppercase shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.tag}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit text-white leading-tight sm:leading-none tracking-tight">
                {slide.title}
              </h1>

              <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-medium">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={slide.link}
                  className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold">
                  <span className="text-orange-400 font-mono font-black text-sm">{slide.priceTag}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{slide.badge}</span>
                </div>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex items-center justify-center relative shadow-2xl">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
