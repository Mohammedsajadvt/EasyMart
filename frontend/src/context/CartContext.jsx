import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState({
    code: '',
    discountPercent: 0,
    applied: false,
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => String(item._id) === String(product._id));
      if (existing) {
        return prevItems.map((item) =>
          String(item._id) === String(product._id)
            ? { ...item, qty: Math.min(item.qty + quantity, item.stock || 99) }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            coverImage: product.coverImage || product.images?.[0],
            stock: product.stock,
            category: product.category,
            qty: quantity,
          },
        ];
      }
    });
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        String(item._id) === String(productId) ? { ...item, qty: newQty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => String(item._id) !== String(productId)));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon({ code: '', discountPercent: 0, applied: false });
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'EASYMART20') {
      setCoupon({ code: 'EASYMART20', discountPercent: 20, applied: true });
      return { success: true, message: '🎉 20% discount coupon applied!' };
    } else if (cleanCode === 'WELCOME10') {
      setCoupon({ code: 'WELCOME10', discountPercent: 10, applied: true });
      return { success: true, message: '🎉 10% welcome discount applied!' };
    } else if (cleanCode === 'FLASH50') {
      setCoupon({ code: 'FLASH50', discountPercent: 50, applied: true });
      return { success: true, message: '🔥 Mega 50% discount coupon applied!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try EASYMART20 or WELCOME10' };
    }
  };

  const removeCoupon = () => {
    setCoupon({ code: '', discountPercent: 0, applied: false });
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountPrice = coupon.applied ? (itemsPrice * coupon.discountPercent) / 100 : 0;
  const shippingPrice = itemsPrice > 150 || itemsPrice === 0 ? 0 : 9.99;
  const taxPrice = itemsPrice * 0.05;
  const totalPrice = Math.max(0, itemsPrice - discountPrice + shippingPrice + taxPrice);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        coupon,
        itemsCount,
        itemsPrice,
        discountPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
