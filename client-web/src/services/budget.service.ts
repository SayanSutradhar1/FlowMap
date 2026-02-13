import type { ApiResponse } from "@/utils/api";
import type { BudgetDetailsType, ExpenseCategory } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Budget"],
  endpoints: (builder) => ({
    getBudgetDetails: builder.query<ApiResponse<BudgetDetailsType[]>, string>({
      query: (id) => `/budget/${id}`,
      providesTags: ["Budget"],
    }),
    updateBudget: builder.mutation<
      ApiResponse<BudgetDetailsType>,
      { id: string; category: ExpenseCategory; amount: number }
    >({
      query: ({ id, category, amount }) => ({
        url: `/budget/${id}`,
        method: "PUT",
        body: { category, amount },
      }),
      invalidatesTags: ["Budget"],
    }),
  }),
});

export const { useGetBudgetDetailsQuery, useUpdateBudgetMutation } = budgetApi;
export default budgetApi;
