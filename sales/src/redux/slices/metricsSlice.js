import { createSlice } from '@reduxjs/toolkit';

const metricsSlice = createSlice({
  name: 'metrics',
  initialState: {
    totalRevenue: 0,
    commissionEarned: 0,
    monthlyTarget: 15000,
    targetProgressPercent: 0,
    closedDealsCount: 0,
    averageOrderValue: 0,
    loading: false,
  },
  reducers: {
    setSalesMetrics: (state, action) => {
      const {
        totalRevenue,
        commissionEarned,
        monthlyTarget,
        targetProgressPercent,
        closedDealsCount,
        averageOrderValue,
      } = action.payload;
      if (totalRevenue !== undefined) state.totalRevenue = totalRevenue;
      if (commissionEarned !== undefined) state.commissionEarned = commissionEarned;
      if (monthlyTarget !== undefined) state.monthlyTarget = monthlyTarget;
      if (targetProgressPercent !== undefined) state.targetProgressPercent = targetProgressPercent;
      if (closedDealsCount !== undefined) state.closedDealsCount = closedDealsCount;
      if (averageOrderValue !== undefined) state.averageOrderValue = averageOrderValue;
      state.loading = false;
    },
    setMetricsLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSalesMetrics, setMetricsLoading } = metricsSlice.actions;
export default metricsSlice.reducer;
