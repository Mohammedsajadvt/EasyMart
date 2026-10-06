import { configureStore } from '@reduxjs/toolkit';
import salesAuthReducer from './slices/salesAuthSlice';
import metricsReducer from './slices/metricsSlice';
import dealsReducer from './slices/dealsSlice';

export const store = configureStore({
  reducer: {
    salesAuth: salesAuthReducer,
    metrics: metricsReducer,
    deals: dealsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
