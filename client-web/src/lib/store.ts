import analyticsApi from "@/services/analytics.service";
import cashApi from "@/services/cash.service";
import expenseApi from "@/services/expense.service";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    [cashApi.reducerPath]: cashApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cashApi.middleware,
      expenseApi.middleware,
      analyticsApi.middleware
    ),
});

export default store;
