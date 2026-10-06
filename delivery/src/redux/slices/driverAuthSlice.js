import { createSlice } from '@reduxjs/toolkit';

const initialDriver = (() => {
  try {
    const saved = localStorage.getItem('driverUser');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
})();

const driverAuthSlice = createSlice({
  name: 'driverAuth',
  initialState: {
    driver: initialDriver,
    isAuthenticated: !!initialDriver,
    isOnline: true,
    loading: false,
    error: null,
  },
  reducers: {
    setDriverCredentials: (state, action) => {
      state.driver = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('driverUser', JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem('driverToken', action.payload.token);
      }
    },
    logoutDriver: (state) => {
      state.driver = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('driverUser');
      localStorage.removeItem('driverToken');
    },
    toggleDriverOnline: (state) => {
      state.isOnline = !state.isOnline;
      localStorage.setItem('driverOnline', JSON.stringify(state.isOnline));
    },
    setDriverLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDriverError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setDriverCredentials, logoutDriver, toggleDriverOnline, setDriverLoading, setDriverError } = driverAuthSlice.actions;
export default driverAuthSlice.reducer;
