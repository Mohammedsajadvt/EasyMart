import { createSlice } from '@reduxjs/toolkit';

const initialUserInfo = (() => {
  try {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: initialUserInfo,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('userInfo');
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCredentials, logout, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
