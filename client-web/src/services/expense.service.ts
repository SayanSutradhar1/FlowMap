import type { ApiResponse } from "@/utils/api";
import type { ExpenseType } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const expenseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      `${import.meta.env.VITE_API_URL}/expense` ||
      `http://localhost:4000/api/expense`,
  }),
  reducerPath: "expenseApi",
  tagTypes: ["Expense"],
  endpoints: (builder) => ({
    getAllExpenses: builder.query<ApiResponse<ExpenseType[]>, void>({
      query: () => ({
        url: "/all",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Expense"],
    }),
    getExpensesByDays: builder.query<
      ApiResponse<ExpenseType[]>,
      { id: string; d: number }
    >({
      query: ({ id, d }) => `/get/${id}?d=${d}`,
      providesTags: ["Expense"],
    }),
    addNewExpense: builder.mutation<
      ApiResponse<ExpenseType>,
      {
        name: string;
        userId: string;
        amount: number;
        category: string;
        description: string;
        recoverable: boolean;
      }
    >({
      query: (expense) => ({
        url: "/add",
        method: "POST",
        body: expense,
        credentials: "include",
      }),
      invalidatesTags: ["Expense"],
    }),
  }),
});

export const {
  useGetAllExpensesQuery,
  useGetExpensesByDaysQuery,
  useAddNewExpenseMutation,
} = expenseApi;

export default expenseApi;
