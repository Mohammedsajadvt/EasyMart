import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/adminAuthSlice';
import fleetReducer from './slices/fleetSlice';
import salesReducer from './slices/salesSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    fleet: fleetReducer,
    sales: salesReducer,
    orders: ordersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
