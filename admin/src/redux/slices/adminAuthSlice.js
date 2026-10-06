import { createSlice } from '@reduxjs/toolkit';

const initialAdmin = (() => {
  try {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
})();

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    adminUser: initialAdmin,
    isAuthenticated: !!initialAdmin,
    loading: false,
    error: null,
  },
  reducers: {
    setAdminCredentials: (state, action) => {
      state.adminUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('adminUser', JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem('adminToken', action.payload.token);
      }
    },
    logoutAdmin: (state) => {
      state.adminUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
    },
    setAdminLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdminError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAdminCredentials, logoutAdmin, setAdminLoading, setAdminError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
