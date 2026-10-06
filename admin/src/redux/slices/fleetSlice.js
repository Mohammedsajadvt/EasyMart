import { createSlice } from '@reduxjs/toolkit';

const fleetSlice = createSlice({
  name: 'fleet',
  initialState: {
    drivers: [],
    selectedDriver: null,
    loading: false,
    error: null,
  },
  reducers: {
    setFleet: (state, action) => {
      state.drivers = action.payload;
      state.loading = false;
    },
    addDriver: (state, action) => {
      state.drivers.unshift(action.payload);
    },
    updateDriverLocation: (state, action) => {
      const { id, location, dutyStatus } = action.payload;
      const idx = state.drivers.findIndex((d) => d._id === id);
      if (idx !== -1) {
        if (location) state.drivers[idx].currentLocation = location;
        if (dutyStatus) state.drivers[idx].dutyStatus = dutyStatus;
      }
    },
    setSelectedDriver: (state, action) => {
      state.selectedDriver = action.payload;
    },
    setFleetLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setFleet, addDriver, updateDriverLocation, setSelectedDriver, setFleetLoading } = fleetSlice.actions;
export default fleetSlice.reducer;
