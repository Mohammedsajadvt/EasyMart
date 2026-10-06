import { createSlice } from '@reduxjs/toolkit';

const initialCartItems = (() => {
  try {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
})();

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: initialCartItems,
    shippingAddress: {},
    couponCode: '',
    discountPercent: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + (item.qty || 1) } : x
        );
      } else {
        state.cartItems.push({ ...item, qty: item.qty || 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      if (qty <= 0) {
        state.cartItems = state.cartItems.filter((x) => x._id !== id);
      } else {
        state.cartItems = state.cartItems.map((x) =>
          x._id === id ? { ...x, qty } : x
        );
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.couponCode = '';
      state.discountPercent = 0;
      localStorage.removeItem('cartItems');
    },
    applyCoupon: (state, action) => {
      const { code, discount } = action.payload;
      state.couponCode = code;
      state.discountPercent = discount;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, applyCoupon } = cartSlice.actions;
export default cartSlice.reducer;
