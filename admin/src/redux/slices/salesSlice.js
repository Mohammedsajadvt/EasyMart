import { createSlice } from '@reduxjs/toolkit';

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    reps: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSalesReps: (state, action) => {
      state.reps = action.payload;
      state.loading = false;
    },
    addSalesRep: (state, action) => {
      state.reps.unshift(action.payload);
    },
    removeSalesRep: (state, action) => {
      state.reps = state.reps.filter((r) => r._id !== action.payload);
    },
    setSalesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSalesReps, addSalesRep, removeSalesRep, setSalesLoading } = salesSlice.actions;
export default salesSlice.reducer;
