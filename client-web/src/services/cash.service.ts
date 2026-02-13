import type { ApiResponse } from "@/utils/api";
import type {
  CashDetailsType,
  InflowType,
  PaginatedInflowType,
  PaginatedTransactionType,
} from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cashApi = createApi({
  reducerPath: "cashApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      `${import.meta.env.VITE_API_URL}/cash` ||
      `http://localhost:4000/api/cash`,
  }),
  tagTypes: ["Cash","Inflow","Expense","Transaction"],
  endpoints: (builder) => ({
    getCashDetails: builder.query<ApiResponse<CashDetailsType>, string>({
      query: (id) => `/getCashDetails/${id}`,
      providesTags: ["Cash"],
    }),
    getTransactions: builder.query<
      ApiResponse<PaginatedTransactionType>,
      {
        id: string;
        f?: string;
        t?: string;
        recent?: boolean;
        take?: number;
        skip?: number;
      }
    >({
      query: ({ id, f, t, recent, take, skip }) => ({
        url: `/transactions/${id}`,
        params: {
          f,
          t,
          recent,
          take,
          skip,
        },
      }),
      providesTags: ["Cash"],
    }),
    getMonthlyInflow: builder.query<ApiResponse<number>, string>({
      query: (id) => `/getMonthlyInflow/${id}`,
      providesTags: ["Cash"],
    }),
    getAllInflows: builder.query<
      ApiResponse<PaginatedInflowType>,
      {
        id: string;
        take?: number;
        skip?: number;
      }
    >({
      query: ({ id, take, skip }) => ({
        url: `/getInflows/${id}`,
        params: {
          take,
          skip,
        },
      }),
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
    recoverCash: builder.mutation<
      ApiResponse,
      { id: string; expenseId: string; description?: string }
    >({
      query: ({ id, expenseId, description }) => ({
        url: `/recoverCash/${id}`,
        method: "POST",
        credentials: "include",
        body: {
          expenseId,
          description,
        },
      }),
      invalidatesTags: ["Cash","Expense","Transaction","Inflow"],
    }),
  }),
});

export const {
  useGetCashDetailsQuery,
  useGetTransactionsQuery,
  useGetMonthlyInflowQuery,
  useAddNewInflowMutation,
  useGetAllInflowsQuery,
  useRecoverCashMutation,
} = cashApi;

export default cashApi;
