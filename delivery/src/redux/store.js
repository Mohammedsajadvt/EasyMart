import { configureStore } from '@reduxjs/toolkit';
import driverAuthReducer from './slices/driverAuthSlice';
import tripsReducer from './slices/tripsSlice';
import gpsReducer from './slices/gpsSlice';

export const store = configureStore({
  reducer: {
    driverAuth: driverAuthReducer,
    trips: tripsReducer,
    gps: gpsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
