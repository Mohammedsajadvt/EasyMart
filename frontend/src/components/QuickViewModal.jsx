import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(
    product.coverImage || product.images?.[0]
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [product.coverImage];

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-fade z-10 border border-slate-100">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="w-full aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 rounded-xl p-1 bg-slate-50 border-2 transition-all ${
                        selectedImage === img
                          ? 'border-orange-500 scale-105'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-outfit text-slate-900 mt-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 4.5)
                            ? 'fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {product.rating || 4.8} ({product.numReviews || 24} customer reviews)
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 py-2 border-y border-slate-100">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="badge badge-discount text-xs font-bold">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-700">In Stock & Ready to Ship</span>
              </div>

              {/* Quantity + Actions */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2.5 px-3 hover:bg-slate-200 text-slate-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock || 10, qty + 1))}
                    className="p-2.5 px-3 hover:bg-slate-200 text-slate-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 btn py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    added ? 'bg-emerald-600 text-white' : 'btn-primary'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border border-slate-200 transition-colors ${
                    inWishlist
                      ? 'bg-rose-50 text-rose-500 border-rose-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* View Full Product Details Link */}
              <div className="pt-2 text-center">
                <Link
                  to={`/product/${product._id}`}
                  onClick={onClose}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                >
                  View Full Specs & Customer Reviews →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
