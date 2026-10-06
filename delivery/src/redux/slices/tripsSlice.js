import { createSlice } from '@reduxjs/toolkit';

const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    tripsList: [],
    selectedTrip: null,
    loading: false,
    error: null,
  },
  reducers: {
    setTripsList: (state, action) => {
      state.tripsList = action.payload;
      state.loading = false;
    },
    updateTripStatus: (state, action) => {
      const { tripId, status } = action.payload;
      state.tripsList = state.tripsList.map((t) =>
        t._id === tripId ? { ...t, status } : t
      );
      if (state.selectedTrip && state.selectedTrip._id === tripId) {
        state.selectedTrip.status = status;
      }
    },
    setSelectedTrip: (state, action) => {
      state.selectedTrip = action.payload;
    },
    setTripsLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTripsList, updateTripStatus, setSelectedTrip, setTripsLoading } = tripsSlice.actions;
export default tripsSlice.reducer;
