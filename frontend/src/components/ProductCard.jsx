import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="group flex flex-col justify-between overflow-hidden relative bg-white border border-slate-200/90 rounded-3xl hover:border-orange-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-sm"
      style={{ padding: '1.25rem 1.25rem 1.15rem 1.25rem' }}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-2xl overflow-hidden flex items-center justify-center p-3.5 border border-slate-100/80">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.discountPercentage > 0 && (
            <span className="badge badge-discount text-[10px] font-black shadow-xs">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.isFlashDeal && (
            <span className="badge badge-deal text-[10px] font-extrabold shadow-xs flex items-center gap-1">
              🔥 Deal
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            inWishlist
              ? 'bg-rose-50 text-rose-500 shadow-rose-200'
              : 'bg-white/95 text-slate-400 hover:text-rose-500 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.coverImage || product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Quick View Hover Action */}
        <div className="absolute inset-x-3 bottom-2.5 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickViewClick}
            className="w-full h-9 bg-[#0F172A]/90 hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 backdrop-blur-md shadow-lg transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="pt-3.5 px-1 pb-1 flex flex-col flex-1 justify-between gap-3 text-left">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
            <span className="uppercase tracking-wider text-orange-600 font-extrabold text-[10px]">{product.category}</span>
            <span className="truncate max-w-[110px] text-slate-500 text-[10px]">{product.brand}</span>
          </div>

          {/* Title (2 lines clamp) */}
          <Link
            to={`/product/${product._id}`}
            className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-orange-600 transition-colors leading-snug min-h-[36px] mb-2 block text-left"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 4.5) ? 'fill-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating || 4.8}</span>
            <span className="text-[10px] text-slate-400">({product.numReviews || 24})</span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col text-left">
            <span className="text-base sm:text-lg font-black text-slate-900 font-outfit leading-tight">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-slate-400 line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`h-9.5 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              added
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-500/30 hover:scale-105 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
