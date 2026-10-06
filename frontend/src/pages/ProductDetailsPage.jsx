import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Send,
  Sparkles,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ text: '', isError: false });

  const inWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getById(id);
        setProduct(res.data);
        setSelectedImage(res.data.coverImage || res.data.images?.[0]);

        // Fetch related products in the same category
        const relRes = await productAPI.getAll({ category: res.data.category });
        setRelatedProducts(
          (relRes.data.products || []).filter((p) => String(p._id) !== String(id)).slice(0, 4)
        );
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewMsg({ text: 'Please sign in to write a product review', isError: true });
      return;
    }
    if (!reviewComment.trim()) {
      setReviewMsg({ text: 'Please enter review feedback', isError: true });
      return;
    }

    try {
      setSubmittingReview(true);
      await productAPI.createReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewMsg({ text: '🎉 Review submitted successfully!', isError: false });
      setReviewComment('');
      // Refresh product details to show the new review
      const res = await productAPI.getById(id);
      setProduct(res.data);
    } catch (err) {
      setReviewMsg({
        text: err.response?.data?.message || 'Failed to submit review',
        isError: true,
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-24 flex justify-center">
        <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-24 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary px-8 py-3 rounded-xl font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.coverImage];

  return (
    <div className="py-8 sm:py-12">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8">
          <Link to="/" className="hover:text-slate-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-700">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/90 shadow-sm">
          {/* Left Gallery (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="w-full aspect-square bg-slate-50 rounded-3xl p-8 flex items-center justify-center border border-slate-100 overflow-hidden relative group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-5 left-5 badge badge-discount text-xs font-black shadow-sm">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3.5 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-2.5 bg-slate-50 border-2 transition-all flex-shrink-0 cursor-pointer ${
                      selectedImage === img
                        ? 'border-orange-500 shadow-md scale-105'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Buy Box (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              {/* Category & Brand badges */}
              <div className="flex items-center justify-between">
                <span className="badge bg-orange-100 text-orange-700 font-bold px-3 py-1">
                  {product.category}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Brand: <strong className="text-slate-800">{product.brand}</strong>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-outfit text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4.5 h-4.5 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">
                  {product.rating || 4.8}
                </span>
                <span className="text-xs text-slate-400">
                  ({product.numReviews || product.reviews?.length || 18} Customer Reviews)
                </span>
              </div>

              {/* Pricing Box */}
              <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-baseline gap-4 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="badge badge-discount text-xs font-black px-2.5 py-1">
                      Save ${(product.originalPrice - product.price).toFixed(2)} ({product.discountPercentage}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                {product.description}
              </p>

              {/* Attributes / Specs if available */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                  {product.attributes.map((attr, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">{attr.name}</span>
                      <span className="text-xs font-bold text-slate-800">{attr.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions & Guarantees */}
            <div className="flex flex-col gap-5 pt-6 border-t border-slate-100 mt-4">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-3.5 px-4 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock || 10, qty + 1))}
                    className="p-3.5 px-4 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 btn py-3.5 sm:py-4 rounded-xl font-black flex items-center justify-center gap-2.5 text-sm md:text-base transition-all cursor-pointer shadow-md ${
                    added ? 'bg-emerald-600 text-white' : 'btn-primary'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" /> Add to Cart • ${(product.price * qty).toFixed(2)}
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 sm:p-4 rounded-xl border border-slate-200 transition-colors cursor-pointer ${
                    inWishlist
                      ? 'bg-rose-50 text-rose-500 border-rose-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4.5 h-4.5 text-orange-500" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                  <span>2 Years Official Warranty</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4.5 h-4.5 text-cyan-500" />
                  <span>30 Days Free Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-14 bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-outfit text-slate-900">
                Customer Ratings & Reviews
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real feedback from verified purchasers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Write a Review Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex flex-col gap-4">
              <h4 className="text-base font-bold text-slate-900">Write a Review</h4>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Overall Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Your Review Feedback
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell other shoppers what you liked about this item..."
                    className="w-full text-xs p-3.5 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                {reviewMsg.text && (
                  <p className={`text-xs font-bold ${reviewMsg.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {reviewMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full btn btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <Send className="w-4 h-4" /> Submit Review
                </button>
              </form>
            </div>

            {/* Existing Reviews List (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {!product.reviews || product.reviews.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs sm:text-sm bg-slate-50 rounded-3xl border border-slate-100">
                  No written reviews yet. Be the first to review this product!
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {product.reviews.map((rev, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-xs">
                            {rev.name?.[0] || 'U'}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{rev.name}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < rev.rating ? 'fill-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 mb-8">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
