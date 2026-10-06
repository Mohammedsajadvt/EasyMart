import { createSlice } from '@reduxjs/toolkit';

const festivalSlice = createSlice({
  name: 'festival',
  initialState: {
    activeFestival: null,
    offers: [],
    loading: false,
  },
  reducers: {
    setActiveFestival: (state, action) => {
      state.activeFestival = action.payload;
    },
    setOffers: (state, action) => {
      state.offers = action.payload;
    },
    setFestivalLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setActiveFestival, setOffers, setFestivalLoading } = festivalSlice.actions;
export default festivalSlice.reducer;
