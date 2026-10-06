import { createSlice } from '@reduxjs/toolkit';

const dealsSlice = createSlice({
  name: 'deals',
  initialState: {
    ordersList: [],
    catalogProducts: [],
    loading: false,
  },
  reducers: {
    setOrdersList: (state, action) => {
      state.ordersList = action.payload;
    },
    setCatalogProducts: (state, action) => {
      state.catalogProducts = action.payload;
    },
    addDealOrder: (state, action) => {
      state.ordersList.unshift(action.payload);
    },
    setDealsLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setOrdersList, setCatalogProducts, addDealOrder, setDealsLoading } = dealsSlice.actions;
export default dealsSlice.reducer;
