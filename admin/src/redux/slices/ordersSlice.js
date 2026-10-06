import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    ordersList: [],
    selectedOrder: null,
    filter: 'all',
    loading: false,
    error: null,
  },
  reducers: {
    setOrdersList: (state, action) => {
      state.ordersList = action.payload;
      state.loading = false;
    },
    updateOrderInList: (state, action) => {
      const updated = action.payload;
      state.ordersList = state.ordersList.map((o) =>
        o._id === updated._id ? updated : o
      );
    },
    setSelectedAdminOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setOrderFilter: (state, action) => {
      state.filter = action.payload;
    },
    setOrdersLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setOrdersList, updateOrderInList, setSelectedAdminOrder, setOrderFilter, setOrdersLoading } = ordersSlice.actions;
export default ordersSlice.reducer;
