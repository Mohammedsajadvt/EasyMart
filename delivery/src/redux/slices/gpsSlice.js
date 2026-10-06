import { createSlice } from '@reduxjs/toolkit';

const gpsSlice = createSlice({
  name: 'gps',
  initialState: {
    lat: 12.9716,
    lng: 77.5946,
    address: 'Central Logistics Hub, Bangalore',
    speedKmH: 24,
    batteryPercent: 88,
    lastPing: new Date().toISOString(),
  },
  reducers: {
    updateGpsLocation: (state, action) => {
      const { lat, lng, address } = action.payload;
      if (lat) state.lat = lat;
      if (lng) state.lng = lng;
      if (address) state.address = address;
      state.lastPing = new Date().toISOString();
    },
    updateTelemetry: (state, action) => {
      const { speedKmH, batteryPercent } = action.payload;
      if (speedKmH !== undefined) state.speedKmH = speedKmH;
      if (batteryPercent !== undefined) state.batteryPercent = batteryPercent;
    },
  },
});

export const { updateGpsLocation, updateTelemetry } = gpsSlice.actions;
export default gpsSlice.reducer;
