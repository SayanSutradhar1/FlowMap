import analyticsApi from "@/services/analytics.service";
import budgetApi from "@/services/budget.service";
import cashApi from "@/services/cash.service";
import expenseApi from "@/services/expense.service";
import reportsApi from "@/services/reports.service";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    [cashApi.reducerPath]: cashApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [budgetApi.reducerPath]: budgetApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cashApi.middleware,
      expenseApi.middleware,
      analyticsApi.middleware,
      budgetApi.middleware,
      reportsApi.middleware,
    ),
});

export default store;
