import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, SlidersHorizontal, Heart, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const MobileNav = () => {
  const { itemsCount, setIsDrawerOpen } = useCart();
  const { count: wishlistCount } = useWishlist();

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 md:hidden shadow-lg py-2 px-4">
      <div className="flex items-center justify-around text-[10px] font-bold">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        {/* Shop */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Shop</span>
        </NavLink>

        {/* Wishlist */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 relative transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </NavLink>

        {/* Cart */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center gap-1 relative text-slate-500 hover:text-orange-600 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-500'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNav;
