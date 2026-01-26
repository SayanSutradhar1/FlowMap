import type { ApiResponse } from "@/utils/api";
import type {
  CashDetailsType,
  TransactionType,
  InflowType,
} from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cashApi = createApi({
  reducerPath: "cashApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      `${import.meta.env.VITE_API_URL}/cash` ||
      `http://localhost:4000/api/cash`,
  }),
  tagTypes: ["Cash"],
  endpoints: (builder) => ({
    getCashDetails: builder.query<ApiResponse<CashDetailsType>, string>({
      query: (id) => `/getCashDetails/${id}`,
      providesTags: ["Cash"],
    }),
    getTransactions: builder.query<
      ApiResponse<TransactionType[]>,
      {
        id: string;
        f?: string;
        t?: string;
        recent?: boolean;
      }
    >({
      query: ({ id, f, t, recent }) =>
        `/transactions/${id}?${t && f ? `t=${t}&f=${f}` : t ? `t=${t}` : f ? `f=${f}` : recent ? `recent=${recent}` : ""}`,
      providesTags: ["Cash"],
    }),
    getMonthlyInflow: builder.query<ApiResponse<number>, string>({
      query: (id) => `/getMonthlyInflow/${id}`,
      providesTags: ["Cash"],
    }),
    getAllInflows: builder.query<ApiResponse<InflowType[]>, string>({
      query: (id) => `/getInflows/${id}`,
      providesTags: ["Cash"],
    }),
    addNewInflow: builder.mutation<
      ApiResponse<InflowType>,
      {
        userId: string;
        amount: number;
        description: string;
      }
    >({
      query: (inflow) => ({
        url: "/addInflow",
        method: "POST",
        body: inflow,
      }),
      invalidatesTags: ["Cash"],
    }),
  }),
});

export const {
  useGetCashDetailsQuery,
  useGetTransactionsQuery,
  useGetMonthlyInflowQuery,
  useAddNewInflowMutation,
  useGetAllInflowsQuery,
} = cashApi;

export default cashApi;
