import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlist, count } = useWishlist();

  return (
    <div className="py-8">
      <div className="container">
        <div className="pb-6 mb-8 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
              My Wishlist ({count})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your curated list of saved favorite items
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500">
              Explore our store and tap the heart icon on any product to save it here for later.
            </p>
            <Link to="/shop" className="btn btn-primary text-xs px-6 py-2.5 rounded-xl font-bold">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
