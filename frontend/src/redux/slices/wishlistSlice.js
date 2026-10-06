import { createSlice } from '@reduxjs/toolkit';

const initialWishlist = (() => {
  try {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
})();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: initialWishlist,
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((x) => x._id === product._id);
      if (exists) {
        state.items = state.items.filter((x) => x._id !== product._id);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
