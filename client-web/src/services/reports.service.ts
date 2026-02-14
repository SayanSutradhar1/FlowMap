import type { ApiResponse } from "@/utils/api";
import type { TransactionsReportType } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reportsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/reports`
      : "http://localhost:4000/api/reports",
  }),
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getTransactionsReport: builder.query<
      ApiResponse<TransactionsReportType[]>,
      { id: string; m?: string; y?: string }
    >({
      query: ({ id, m, y }) => ({
        url: `/transactions/${id}`,
        method: "GET",
        params: {
          m,
          y,
        },
      }),
      providesTags: ["Reports"],
    }),
  }),
});

export const { useLazyGetTransactionsReportQuery } = reportsApi;

export default reportsApi;
