import { createSlice } from '@reduxjs/toolkit';

const initialSalesUser = (() => {
  try {
    const saved = localStorage.getItem('salesUser');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
})();

const salesAuthSlice = createSlice({
  name: 'salesAuth',
  initialState: {
    salesUser: initialSalesUser,
    isAuthenticated: !!initialSalesUser,
    loading: false,
    error: null,
  },
  reducers: {
    setSalesCredentials: (state, action) => {
      state.salesUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('salesUser', JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem('salesToken', action.payload.token);
      }
    },
    logoutSales: (state) => {
      state.salesUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('salesUser');
      localStorage.removeItem('salesToken');
    },
    setSalesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSalesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setSalesCredentials, logoutSales, setSalesLoading, setSalesError } = salesAuthSlice.actions;
export default salesAuthSlice.reducer;
